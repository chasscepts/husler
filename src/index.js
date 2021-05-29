import './assets/css/style.scss';
import Phaser from 'phaser';
import BootScene from './scenes/boot';
import PreloaderScene from './scenes/preloader';
import TitleScene from './scenes/title';
import GameScene from './scenes/game';
import LeaderboardScene from './scenes/leaderboard';
import assets from './lib/assets';
import Api from './lib/api';
import eventEmitter from './lib/event-emitter';
import LoadingScene from './scenes/loading';

const ID_KEY = 'ogba_mbo_id';
let api;
let currentPlayer;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: document.querySelector('#canvas-container'),
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  dom: {
    createContainer: true,
  },
  pack: {
    files: [
      {
        type: 'image',
        key: 'loader-bg',
        url: assets.bg,
      },
    ],
  },
});

const completed = 'completed';

/**
 * We want to call startTitleScene from a callback in startLeaderboardScene.
 * But since startTitleScene is not yet defined, eslint is complaining.
 * We can't just move startLeaderboardScene definition after startGameScene,
 * because startLeaderboardScene is also invoked inside startGameScene.
 * To circumvet that, we use an event emitter to invoke startTitleScene.
 * This is a round about way of doing this and the code works without it.
 * I can disable eslint for the line, but I am not sure if that is the right thing.
 */
const startTitleSceneRelay = eventEmitter();
const START_TITLE_SCENE_KEY = 'start-title-scene';

const startLoadingScene = () => {
  const loader = new LoadingScene();
  game.scene.add(LoadingScene.key, loader);
  game.scene.start(LoadingScene.key);
  return loader;
};

const startLeaderboardScene = () => {
  startLoadingScene();
  api.records()
    .then((records) => {
      const scene = new LeaderboardScene(records);
      game.scene.remove(LoadingScene.key);
      game.scene.add(LeaderboardScene.key, scene);
      scene.eventRelay.subscribe('exit', () => {
        game.scene.remove(LeaderboardScene.key);
        startTitleSceneRelay.emit(START_TITLE_SCENE_KEY);
      });
      game.scene.start(LeaderboardScene.key);
    });
};

const startGameScene = () => {
  const gameScene = new GameScene();
  game.scene.add(GameScene.key, gameScene);
  gameScene.eventRelay.subscribe('game over', (payload) => {
    game.scene.remove(GameScene.key);
    if (payload.score === 0) {
      // We don't want to save
      startLeaderboardScene();
      return;
    }
    startLoadingScene();
    api.save({ user: currentPlayer, score: payload.score })
      .then(() => {
        game.scene.remove(LoadingScene.key);
        startLeaderboardScene();
      });
  });
  game.scene.start(GameScene.key);
};

const startTitleScene = () => {
  const title = new TitleScene(currentPlayer);
  game.scene.add(TitleScene.key, title);
  title.eventRelay.subscribe('start game', (payload) => {
    currentPlayer = payload.name;
    game.scene.remove(TitleScene.key);
    if (currentPlayer) {
      startGameScene();
    } else {
      startTitleScene();
    }
  });
  title.eventRelay.subscribe('show leaderboard', () => {
    game.scene.remove(TitleScene.key);
    startLeaderboardScene();
  });
  game.scene.start(TitleScene.key);
};
startTitleSceneRelay.subscribe(START_TITLE_SCENE_KEY, startTitleScene);

const preloaderCompleted = () => {
  game.scene.remove(PreloaderScene.key);
  startTitleScene();
};

const startPreloaderScene = () => {
  game.scene.remove(BootScene.key);
  const preloader = new PreloaderScene();
  game.scene.add(PreloaderScene.key, preloader);
  preloader.eventRelay.subscribe(completed, preloaderCompleted);
  game.scene.start(PreloaderScene.key);
};

const startBootScene = () => {
  const boot = new BootScene();
  game.scene.add(BootScene.key, boot);
  boot.eventRelay.subscribe(completed, () => {
    game.scene.remove(BootScene.key);
    startPreloaderScene();
  });
  game.scene.start(BootScene.key);
  return boot;
};

const boot = startBootScene();

Api.init({
  name: 'Ogba Mbo',
  gameId: localStorage.getItem(ID_KEY),
  setId: (id) => localStorage.setItem(ID_KEY, id),
  fetch: (url, options) => fetch(url, options),
}).then((rApi) => {
  api = rApi;
  boot.setApiReady();
});

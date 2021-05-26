import './assets/css/style.scss';
import Phaser from 'phaser';
// eslint-disable-next-line import/extensions
import BootScene from './scenes/boot';
import PreloaderScene from './scenes/preloader';
import TitleScene from './scenes/title';
import GameScene from './scenes/game';
import assets from './lib/assets';

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

const startLeaderboardScene = () => {

};

const startGameScene = () => {
  const gameScene = new GameScene();
  game.scene.add(GameScene.key, gameScene);
  gameScene.eventRelay.subscribe('game over', () => {
    game.scene.remove(GameScene.key);
    startLeaderboardScene();
  });
  game.scene.start(GameScene.key);
};

const startTitleScene = () => {
  const title = new TitleScene();
  game.scene.add(TitleScene.key, title);
  title.eventRelay.subscribe('start game', () => {
    game.scene.remove(TitleScene.key);
    startGameScene();
  });
  title.eventRelay.subscribe('show leaderboard', () => {
    game.scene.remove(TitleScene.key);
    startLeaderboardScene();
  });
  game.scene.start(TitleScene.key);
};

const preloaderCompleted = () => {
  game.scene.remove(PreloaderScene.key);
  startTitleScene();
};

const bootCompleted = () => {
  game.scene.remove(BootScene.key);
  const preloader = new PreloaderScene();
  game.scene.add(PreloaderScene.key, preloader);
  preloader.eventRelay.subscribe(completed, preloaderCompleted);
  game.scene.start(PreloaderScene.key);
};

const boot = new BootScene();
game.scene.add(BootScene.key, boot);
boot.eventRelay.subscribe(completed, bootCompleted);
game.scene.start(BootScene.key);

import './assets/css/style.scss';
import Phaser from 'phaser';
// eslint-disable-next-line import/extensions
import BootScene from './scenes/boot';
import PreloaderScene from './scenes/preloader';
import GameScene from './scenes/game';
import assets from './lib/assets';

const boot = new BootScene();
const preloader = new PreloaderScene();
const scene = new GameScene();

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

[boot, preloader, scene].forEach((scene) => game.scene.add(scene.key, scene));
game.scene.start(boot.key);

// scene.eventRelay.subscribe('game over', (payload) => {
//   // console.log(payload);
// });

preloader.eventRelay.subscribe('completed', () => {
  game.scene.remove(preloader.key);
  game.scene.start(scene.key);
});

boot.eventRelay.subscribe('completed', () => {
  game.scene.remove(boot.key);
  game.scene.start(preloader.key);
});

import './assets/css/style.scss';
import Phaser from 'phaser';
// eslint-disable-next-line import/extensions
import GameScene from './scenes/game.js';
import BootScene from './scenes/boot';

const scene = new GameScene();
const boot = new BootScene();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 608,
  parent: document.querySelector('#canvas-container'),
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
});

game.scene.add(boot.key, boot);
game.scene.add(scene.key, scene);
game.scene.start(boot.key);

scene.eventRelay.subscribe('game over', (payload) => {
  // console.log(payload);
});

boot.eventRelay.subscribe('completed', () => {
  game.scene.start(scene.key);
});

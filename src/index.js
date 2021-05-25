import './assets/css/style.scss';
import Phaser from 'phaser';
// eslint-disable-next-line import/extensions
import GameScene from './game-scene.js';

const scene = new GameScene();

// eslint-disable-next-line no-new
new Phaser.Game({
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
  scene,
});

import './assets/css/style.scss';
import Phaser from 'phaser';
import GameScene from './game-scene';

const scene = new GameScene();

let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: document.querySelector('#canvas-container'),
  scene,
});

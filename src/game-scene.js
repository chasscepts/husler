import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  preload = () => {
    this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
  }

  create = () => {}

  update = () => {}
}

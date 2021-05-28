import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import mixin from '../lib/mixin';
import assets, { htmls, sprites } from '../lib/assets';

const progressY = 0;
const progressH = 20;
const progressFill = 0x008ecc;

const setupProgress = (progress, load, eventRelay) => {
  load.on('progress', (value) => {
    progress.clear();
    progress.fillStyle(progressFill, 1);
    progress.fillRect(0, progressY, 800 * value, progressH);
  });

  load.on('complete', () => {
    setTimeout(() => {
      progress.destroy();
      eventRelay.emit('completed');
    }, 2000);
  });
};

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: PreloaderScene.key });
    this.eventRelay = mixin({}, eventEmitter());
  }

  preload = () => {
    this.load.image(assets.pinball.key, assets.pinball.file);
    const progress = this.add.graphics();
    progress.setDepth(10);
    // this.progress = simulateProgress(progress, this.eventRelay);
    setupProgress(progress, this.load, this.eventRelay);

    Object.keys(assets).forEach((key) => {
      const asset = assets[key];
      this.load.image(asset.key, asset.file);
    });

    Object.keys(sprites).forEach((key) => {
      const sprite = sprites[key];
      this.load.spritesheet(
        sprite.key, sprite.file, { frameWidth: sprite.width, frameHeight: sprite.width },
      );
    });

    Object.keys(htmls).forEach((key) => {
      const asset = htmls[key];
      this.load.html(asset.key, asset.file);
    });
  }

  create = () => {
    this.add.image(400, 300, assets.pinball.key).setScale(2);
  }

  update = () => {

  }
}

PreloaderScene.key = 'preloader';

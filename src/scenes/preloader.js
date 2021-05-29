import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import assets, { htmls, sprites, preloads } from '../lib/assets';

const progressY = 0;
const progressH = 20;
const progressFill = 0x008ecc;

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: PreloaderScene.key });
    this.eventRelay = eventEmitter();
  }

  create = () => {
    this.add.image(400, 300, preloads.images.pinball.key).setScale(2);
    this.loadAssets();
  }

  loadAssets = () => {
    const loader = new Phaser.Loader.LoaderPlugin(this);
    const progress = this.add.graphics();
    progress.setDepth(10);

    loader.on('progress', (value) => {
      progress.clear();
      progress.fillStyle(progressFill, 1);
      progress.fillRect(0, progressY, 800 * value, progressH);
    });

    loader.on('complete', () => this.eventRelay.emit('completed'));

    Object.keys(assets).forEach((key) => {
      const asset = assets[key];
      loader.image(asset.key, asset.file);
    });

    Object.keys(sprites).forEach((key) => {
      const sprite = sprites[key];
      loader.spritesheet(
        sprite.key, sprite.file, { frameWidth: sprite.width, frameHeight: sprite.width },
      );
    });

    Object.keys(htmls).forEach((key) => {
      const asset = htmls[key];
      loader.html(asset.key, asset.file);
    });

    loader.start();
  }

  exit = () => {
    this.eventRelay.emit('completed');
  }
}

PreloaderScene.key = 'preloader';

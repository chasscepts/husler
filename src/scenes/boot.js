import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import { preloads } from '../lib/assets';

const html = `
  <div class="scene boot-scene">
    <div class="title">OGBA MBO</div>
    <div class="loading">Booting</div>
  </div>
`;

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: BootScene.key });
    this.eventRelay = eventEmitter();
    this.loadCompleted = false;
    this.apiReady = false;
  }

  exit = () => {
    if (this.loadCompleted && this.apiReady) {
      setTimeout(() => {
        this.eventRelay.emit('completed');
      }, 1000);
    }
  };

  create = () => {
    this.add.dom(300, 400).createFromHTML(html);
    this.loadAssets();
  }

  setApiReady = () => {
    this.apiReady = true;
    this.exit();
  }

  // We don't want to load assets in preload
  // because we want to show a screen while assets is loading.
  loadAssets = () => {
    const loader = new Phaser.Loader.LoaderPlugin(this);
    loader.on('complete', () => {
      this.loadCompleted = true;
      this.exit();
    });
    Object.keys(preloads.images).forEach((key) => {
      const asset = preloads.images[key];
      loader.image(asset.key, asset.file);
    });
    loader.start();
  }
}

BootScene.key = 'boot';

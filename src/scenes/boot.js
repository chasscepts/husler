import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';

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
  }

  create = () => {
    this.add.dom(300, 400).createFromHTML(html);
  }
}

BootScene.key = 'boot';

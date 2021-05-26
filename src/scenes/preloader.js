import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import mixin from '../lib/mixin';
import assets from '../lib/assets';

const filenameWithoutExtension = (name) => {
  const idx = name.lastIndexOf('.');
  if (idx > 0) {
    name = name.substring(0, idx);
  }

  return name;
};

const progressY = 190;
const progressH = 20;
const progressFill = 0x008ecc;

const simulateProgress = (progress, eventRelay) => {
  let elapsed = 0;
  let count = 0;
  const duration = 5000;
  let stopped = false;

  const handler = {
    update: (delta) => {
      if (stopped) {
        return;
      }
      elapsed += delta;
      count += 1;
      if (count % 5 === 0) {
        count = 0;
        if (elapsed >= duration) {
          elapsed = duration;
          stopped = true;
        }
        progress.clear();
        progress.fillStyle(progressFill, 1);
        progress.fillRect(0, progressY, (800 * elapsed) / duration, progressH);
        if (stopped) {
          setTimeout(() => {
            eventRelay.emit('completed');
          }, 2000);
        }
      }
    },
  };

  let memo = performance.now();

  const loop = () => {
    requestAnimationFrame((timestamp) => {
      handler.update(timestamp - memo);
      memo = timestamp;

      if (!stopped) {
        requestAnimationFrame(loop);
      }
    });
  };

  loop();

  return handler;
};

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
    const key = 'preloader';
    super({ key });
    this.key = key;
    this.eventRelay = mixin({}, eventEmitter());
  }

  preload = () => {
    this.load.image('loader-bg', assets.bg);
    const progress = this.add.graphics();
    progress.setDepth(10);
    this.progress = simulateProgress(progress, this.eventRelay);
    // setupProgress(progress, this.load, this.eventRelay);

    Object.keys(assets).forEach((key) => {
      const file = filenameWithoutExtension(assets[key]);
      this.load.image(file);
    });
  }

  create = () => {
    this.add.image(400, 300, 'loader-bg').setScale(2);
  }

  update = () => {

  }
}

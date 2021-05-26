import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import mixin from '../lib/mixin';
import { bootAssets, bootSprites } from '../lib/assets';

const mid = (a, b) => 32 * (a + (b - a) / 2);
const s = (a, b) => 2 * (b - a);

const createStatic = (staticGroup, name, x1, x2, y1, y2) => {
  const staticObject = staticGroup.create(mid(x1, x2), mid(y1, y2), name);
  staticObject.body.immovable = true;
  staticObject.setScale(s(x1, x2), s(y1, y2)).refreshBody();
  return staticObject;
};

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: BootScene.key });
    this.eventRelay = mixin({}, eventEmitter());
  }

  init = () => {
    this.playerAnimationStarted = false;
  }

  preload = () => {
    Object.keys(bootSprites).forEach((key) => {
      const sprite = bootSprites[key];
      this.load.spritesheet(
        sprite.key, sprite.file, { frameWidth: sprite.width, frameHeight: sprite.width },
      );
    });

    Object.keys(bootAssets).forEach((key) => {
      const asset = bootAssets[key];
      this.load.image(asset.key, asset.file);
    });
  }

  create = () => {
    this.cameras.main.fadeFrom(
      2000, Phaser.Math.Between(50, 255),
      Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255),
    );
    this.add.image(400, 300, bootAssets.olympic.key).setScale(50, 38);

    const platforms = this.physics.add.staticGroup();
    const floors = this.physics.add.staticGroup();
    createStatic(platforms, bootAssets.transparent.key, 13, 14, 0, 19);
    createStatic(floors, bootAssets.transparent.key, 0, 25, 9, 10);
    const player = this.physics.add.sprite(30, 170, bootSprites.hero.key);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'hero', frame: 1 }],
      frameRate: 0,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(player, floors);
    this.physics.add.collider(player, platforms, () => {
      player.setVelocityX(0);
      player.anims.play('turn', true);
      setTimeout(() => {
        this.eventRelay.emit('completed');
      }, 2000);
    });
    this.player = player;

    this.player.setVelocityX(150);
    this.player.anims.play('right', true);
  }

  update = () => {

  }
}

BootScene.key = 'boot';

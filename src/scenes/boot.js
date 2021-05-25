import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import mixin from '../lib/mixin';
import bg from '../assets/images/space.jpg';
import corner from '../assets/images/corners.png';
import dude from '../assets/images/hero-sm.png';

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
    const key = 'boot';
    super({ key });
    this.key = key;
    this.eventRelay = mixin({}, eventEmitter);
  }

  init = () => {
    this.playerAnimationStarted = false;
  }

  preload = () => {
    this.load.image('bg', bg);
    this.load.image('transparent', corner);
    this.load.spritesheet('dude', dude, { frameWidth: 40, frameHeight: 40 });
  }

  create = () => {
    this.add.image(400, 300, 'bg').setScale(2);
    const platforms = this.physics.add.staticGroup();
    const floors = this.physics.add.staticGroup();
    createStatic(platforms, 'transparent', 21, 22, 0, 19);
    createStatic(floors, 'transparent', 0, 14, 7, 8);
    createStatic(floors, 'transparent', 15, 25, 9.5, 10.5);
    const player = this.physics.add.sprite(30, 170, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 1 }],
      frameRate: 0,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(player, floors);
    this.physics.add.collider(player, platforms, () => {
      player.setVelocityX(0);
      player.anims.play('turn', true);
      setTimeout(() => {
        this.scene.remove(this.key);
        this.eventRelay.emit('completed');
      }, 2000);
    });
    this.player = player;

    this.player.setVelocityX(60);
    this.player.anims.play('right', true);
  }

  update = () => {

  }
}

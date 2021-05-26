import Phaser from 'phaser';
import eventEmitter from '../lib/event-emitter';
import mixin from '../lib/mixin';
import assets from '../lib/assets';

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
    this.eventRelay = mixin({}, eventEmitter());
  }

  init = () => {
    this.playerAnimationStarted = false;
  }

  preload = () => {
    this.load.image('bg', assets.bg);
    this.load.image('olympic', assets.olympic);
    this.load.image('wood', assets.wood);
    this.load.image('transparent', assets.transparent);
    this.load.spritesheet('hero', assets.hero, { frameWidth: 40, frameHeight: 40 });
  }

  create = () => {
    this.cameras.main.fadeFrom(
      2000, Phaser.Math.Between(50, 255),
      Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255),
    );
    this.add.image(400, 300, 'olympic').setScale(50, 38);

    const platforms = this.physics.add.staticGroup();
    const floors = this.physics.add.staticGroup();
    createStatic(platforms, 'transparent', 13, 14, 0, 19);
    createStatic(floors, 'transparent', 0, 25, 9, 10);
    const player = this.physics.add.sprite(30, 170, 'hero');
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

    this.player.setVelocityX(80);
    this.player.anims.play('right', true);
  }

  update = () => {

  }
}

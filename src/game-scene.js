import Phaser from 'phaser';
import point from './lib/point';
import grid from './assets/images/grid.png';
import wood from './assets/images/wood.png';
import hero from './assets/images/hero-sm.png';
import ladder from './assets/images/ladder.png';
import gem1 from './assets/images/gem5.png';
import gem2 from './assets/images/gem2.png';
import gold from './assets/images/gold-coin.png';
import door from './assets/images/door.png';

const pointsRange = (y, x1, x2) => {
  const rslt = [];
  for (let x = x1; x <= x2; x += 1) {
    rslt.push(point.create(x, y));
  }
  return rslt;
};

const freeCell = [
  ...pointsRange(16, 2, 5),
  ...pointsRange(16, 8, 11),
  ...pointsRange(16, 14, 17),
  ...pointsRange(16, 20, 23),
  ...pointsRange(14, 3, 22),
  ...pointsRange(12, 2, 11),
  ...pointsRange(12, 14, 23),
  ...pointsRange(10, 2, 5),
  ...pointsRange(10, 8, 17),
  ...pointsRange(10, 20, 23),
  ...pointsRange(8, 2, 8),
  ...pointsRange(8, 11, 20),
  ...pointsRange(8, 23, 23),
  ...pointsRange(6, 2, 6),
  ...pointsRange(6, 14, 23),
  ...pointsRange(4, 2, 6),
  ...pointsRange(4, 9, 20),
  ...pointsRange(4, 23, 23),
  ...pointsRange(2, 7, 23),
];

const silvers = (() => {

})();

const mid = (a, b) => 32 * (a + (b - a) / 2);
const s = (a, b) => 2 * (b - a);

const ladderLevels = [
  { x: [6, 12, 18], y: [14.9, 17] },
  { x: [1, 23], y: [12.9, 15] },
  { x: [12], y: [10.9, 13] },
  { x: [6, 18], y: [8.9, 11] },
  { x: [9, 21], y: [6.9, 9] },
  { x: [12], y: [4.9, 7] },
  { x: [7, 21], y: [2.9, 5] },
];

const sealsLevels = [
  { x: [1, 23], y: 15 },
  { x: [12], y: 13 },
  { x: [6, 18], y: 11 },
  { x: [9, 21], y: 9 },
  { x: [12], y: 7 },
  { x: [7, 21], y: 5 },
];

const createStatic = (staticGroup, name, x1, x2, y1, y2) => {
  const staticObject = staticGroup.create(mid(x1, x2), mid(y1, y2), name);
  staticObject.body.immovable = true;
  staticObject.setScale(s(x1, x2), s(y1, y2)).refreshBody();
  return staticObject;
};

const createGem = (group, name, x, y) => {
  group.create(32 * x, 32 * y, name);
};

/**
 *
 * @param {Phaser.Physics.Arcade.StaticGroup} platforms to setup
 */
const setupCornerWalls = (platforms) => {
  createStatic(platforms, 'wood', 0, 25, 17, 19);
  createStatic(platforms, 'wood', 24, 25, 0, 19);
  // createStatic(platforms, 'wood', 0, 25, 0, 1);
  // createStatic(platforms, 'wood', 0, 1, 0, 19);
};

const setupFloors = (platforms) => {
  [1, 7, 13, 19].forEach((x) => {
    createStatic(platforms, 'wood', x, x + 5, 15, 15.5);
  });

  createStatic(platforms, 'wood', 2, 23, 13, 13.5);
  [1, 13].forEach((x) => {
    createStatic(platforms, 'wood', x, x + 11, 11, 11.5);
  });

  [1, 19].forEach((x) => {
    createStatic(platforms, 'wood', x, x + 5, 9, 9.5);
  });
  createStatic(platforms, 'wood', 7, 18, 9, 9.5);

  createStatic(platforms, 'wood', 1, 9, 7, 7.5);
  createStatic(platforms, 'wood', 10, 21, 7, 7.5);
  createStatic(platforms, 'wood', 22, 24, 7, 7.5);

  createStatic(platforms, 'wood', 1, 12, 5, 5.5);
  createStatic(platforms, 'wood', 13, 24, 5, 5.5);

  createStatic(platforms, 'wood', 1, 7, 3, 3.5);
  createStatic(platforms, 'wood', 8, 21, 3, 3.5);
  createStatic(platforms, 'wood', 22, 24, 3, 3.5);
};

/**
 *
 * @param {Phaser.Physics.Arcade.Group} group to setup
 * @param {Phaser.Physics.Arcade.StaticGroup} platforms to setup
 * @param {Phaser.Physics} physics config
 */
const setupLadders = (ladders) => {
  ladderLevels.forEach(({ x, y }) => x.forEach((x) => createStatic(ladders, 'ladder', x, x + 1, y[0], y[1])));
};

const setupLadderSeals = (seals) => {
  sealsLevels.forEach(({ x, y }) => x.forEach((x) => createStatic(seals, 'wood', x, x + 1, y, y + 0.5)));
};

export default class GameScene extends Phaser.Scene {
  preload = () => {
    this.load.image('grid', grid);
    this.load.image('wood', wood);
    this.load.image('ladder', ladder);
    this.load.spritesheet('hero', hero, { frameWidth: 40, frameHeight: 40 });
    this.load.image('gold', gold);
    this.load.image('silver', gem1);
    this.load.image('bronze', gem2);
    this.load.image('door', door);
  }

  create = () => {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.image(400, 300, 'grid');
    const walls = this.physics.add.staticGroup();
    const platforms = this.physics.add.staticGroup();
    setupCornerWalls(walls);

    const ladders = this.physics.add.staticGroup();
    ladders.enableBody = true;
    const ladderSeals = this.physics.add.staticGroup();
    ladderSeals.enableBody = true;
    const doors = this.physics.add.staticGroup();
    const golds = this.physics.add.staticGroup();
    const silvers = this.physics.add.staticGroup();
    const bronzes = this.physics.add.staticGroup();

    this.door = createStatic(doors, 'door', 5, 5.5, 1, 2.5);

    setupLadders(ladders);
    setupLadderSeals(ladderSeals);
    setupFloors(platforms);

    createGem(silvers, 'silver', 2, 8);
    createGem(bronzes, 'bronze', 20, 12);

    const gold = golds.create(2 * 32, 2 * 32, 'gold');

    const player = this.physics.add.sprite(32 * 8, 32 * 2, 'hero');
    // const player = this.physics.add.sprite(100, 520, 'hero');
    player.setBounce(0.2);
    player.setDepth(1000);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }), // 8, 11
      frameRate: 10,
      repeat: -1,
    });

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

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.overlap(player, golds,
      (player, gold) => {
        console.log(player.body.left - gold.body.left);
      },
      () => player.body.left - gold.body.left < 32
        && gold.body.top - player.body.top < 32);
    this.physics.add.collider(player, doors);
    this.physics.add.collider(player, walls);
    this.physics.add.collider(player, ladderSeals);
    this.physics.add.collider(player, platforms, null, () => {
      if (this.isPlayerClimbingLadder) {
        return false;
      }
      return true;
    }, null);

    this.physics.add.overlap(player, ladders, () => {
      this.playerCanClimb = true;
    }, (player, ladder) => {
      if (Math.round(player.body.left - ladder.body.left) > -13
        && Math.round(player.body.right - ladder.body.right) < 11) {
        return true;
      }
      return false;
    });

    this.player = player;
    this.door.disableBody(true);
  }

  update = () => {
    this.isPlayerClimbingLadder = false;
    let playerStanding = true;
    if (this.playerCanClimb) {
      this.player.setVelocityY(0);
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-80);
      this.player.anims.play('left', true);
      playerStanding = false;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(80);
      this.player.anims.play('right', true);
      playerStanding = false;
    }

    if (this.cursors.up.isDown && this.playerCanClimb) {
      this.isPlayerClimbingLadder = true;
      this.player.setVelocityY(-80);
      this.player.anims.play('up', true);
      playerStanding = false;
    } else if (this.cursors.down.isDown && this.playerCanClimb) {
      this.isPlayerClimbingLadder = true;
      this.player.setVelocityY(80);
      this.player.anims.play('down', true);
      playerStanding = false;
    }

    if (playerStanding) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.play('turn');
    }
    this.player.body.setAllowGravity(!this.playerCanClimb);
    this.playerCanClimb = false;
  }

  onGetToLadder = () => {

  }
}

import Phaser from 'phaser';
import point from '../lib/point';
import eventEmitter from '../lib/event-emitter';
import coinGeneratorFactory from '../lib/coin-generator';
import assets, { sprites } from '../lib/assets';
import timeKeeperFactory from '../lib/time-keeper';
import grid from '../lib/grid';

const pointsRange = (y, x1, x2) => {
  const rslt = [];
  for (let x = x1; x <= x2; x += 1) {
    rslt.push(point.create(x, y));
  }
  return rslt;
};

const freeCells = [
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

/**
 *
 * @param {Phaser.Physics.Arcade.StaticGroup} platforms to setup
 */
const setupCornerWalls = (platforms) => {
  createStatic(platforms, assets.wood.key, 0, 1, 0, 19);
  createStatic(platforms, assets.wood.key, 24, 25, 0, 19);
};

const setupFloor = (group) => {
  createStatic(group, assets.grass.key, 0, 25, 17, 19);
};

const setupPlatforms = (platforms) => {
  createStatic(platforms, assets.wood.key, 0, 25, 0, 1);

  [1, 7, 13, 19].forEach((x) => {
    createStatic(platforms, assets.wood.key, x, x + 5, 15, 15.5);
  });

  createStatic(platforms, assets.wood.key, 2, 23, 13, 13.5);
  [1, 13].forEach((x) => {
    createStatic(platforms, assets.wood.key, x, x + 11, 11, 11.5);
  });

  [1, 19].forEach((x) => {
    createStatic(platforms, assets.wood.key, x, x + 5, 9, 9.5);
  });
  createStatic(platforms, assets.wood.key, 7, 18, 9, 9.5);

  createStatic(platforms, assets.wood.key, 1, 9, 7, 7.5);
  createStatic(platforms, assets.wood.key, 10, 21, 7, 7.5);
  createStatic(platforms, assets.wood.key, 22, 24, 7, 7.5);

  createStatic(platforms, assets.wood.key, 1, 12, 5, 5.5);
  createStatic(platforms, assets.wood.key, 13, 24, 5, 5.5);

  createStatic(platforms, assets.wood.key, 1, 7, 3, 3.5);
  createStatic(platforms, assets.wood.key, 8, 21, 3, 3.5);
  createStatic(platforms, assets.wood.key, 22, 24, 3, 3.5);
};

/**
 *
 * @param {Phaser.Physics.Arcade.Group} group to setup
 * @param {Phaser.Physics.Arcade.StaticGroup} platforms to setup
 * @param {Phaser.Physics} physics config
 */
const setupLadders = (ladders) => {
  ladderLevels.forEach(({ x, y }) => x.forEach(
    (x) => createStatic(ladders, assets.ladder.key, x, x + 1, y[0], y[1]),
  ));
};

const setupLadderSeals = (seals) => {
  sealsLevels.forEach(({ x, y }) => x.forEach(
    (x) => createStatic(seals, assets.wood.key, x, x + 1, y, y + 0.5),
  ));
};

const checkContact = (a, b, x, y) => a.body.left - b.body.left < x && b.body.top - b.body.top < y;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: GameScene.key });
    this.eventRelay = eventEmitter();
  }

  init = () => {
    this.score = 0;
    this.silverRemaining = true;
    this.bronzeRemainig = true;
    this.isVillainClimbingLadder = false;
    this.isGameOver = false;
  }

  create = () => {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.image(400, 300, assets.rock.key).setScale(2).setDepth(-1000);
    this.floor = this.physics.add.staticGroup();
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
    this.ladderUps = this.physics.add.staticGroup();
    this.ladderDowns = this.physics.add.staticGroup();
    this.ladderTopSeals = this.physics.add.staticGroup();
    this.ladderBottomSeals = this.physics.add.staticGroup();
    const villainAssistances = this.physics.add.staticGroup();

    this.door = createStatic(doors, assets.door.key, 5, 5.5, 1, 2.5);

    setupFloor(this.floor);
    setupLadders(ladders);
    setupLadderSeals(ladderSeals);
    setupPlatforms(platforms);

    [
      [7, 5], [21, 5], [12, 7], [9, 9], [21, 9], [6, 11], [18, 11], [12, 13],
      [1, 15], [23, 15], [1, 15], [23, 15], [6, 17], [12, 17], [18, 17],
    ].forEach(([a, b]) => {
      const x = grid.valueOf(a + 0.5);
      const yd = grid.valueOf(b + 0.24);
      const yu = grid.valueOf(b - 2 + 0.24);
      this.ladderUps.create(x, yd, assets.transparent.key).setScale(2, 1);
      this.ladderBottomSeals.create(x, yd + 8, assets.transparent.key).setScale(2, 0.5);
      this.ladderDowns.create(x, yu, assets.transparent.key).setScale(2, 1);
    });

    const coinGenerator = coinGeneratorFactory.create(freeCells);
    coinGenerator.on('coin', (coin) => {
      let group = villainAssistances;
      if (coin.type === assets.silver.key) {
        group = silvers;
      } else if (coin.type === assets.bronze.key) {
        group = bronzes;
      }
      const gameObject = group.create(32 * coin.x, 32 * coin.y, coin.asset);
      coin.on('lifeup', () => {
        gameObject.destroy();
      });
      gameObject.on('collected', () => {
        coin.destroy();
      });
    });
    coinGenerator.on('open door', () => {
      if (this.door) {
        this.door.destroy();
        this.door = null;
      }
    });
    coinGenerator.on('close door', () => {
      if (!this.door) {
        this.door = createStatic(doors, assets.door.key, 5, 5.5, 1, 2.5);
        this.door.setDepth(-1);
      }
    });

    golds.create(2 * 32, 2 * 32, assets.gold.key);

    const player = this.physics.add.sprite(100, 520, sprites.hero.key);
    player.setBounce(0.2);
    player.setDepth(1000);
    player.setCollideWorldBounds(true);

    this.player = player;
    this.silvers = silvers;
    this.bronzes = bronzes;
    this.platforms = platforms;
    this.walls = walls;
    this.doors = doors;
    this.ladders = ladders;
    this.ladderSeals = ladderSeals;

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(sprites.hero.key, { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: sprites.hero.key, frame: 1 }],
      frameRate: 0,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(sprites.hero.key, { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers(sprites.hero.key, { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers(sprites.hero.key, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.villain = this.physics.add.sprite(grid.valueOf(16), grid.valueOf(8), sprites.villain.key);

    this.physics.add.collider(player, this.floor);
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

    this.physics.add.overlap(
      player, golds, this.collectGold,
      (player, gold) => checkContact(player, gold, 32, 32),
    );

    this.physics.add.overlap(player, silvers, this.collectSilver, null, this);
    this.physics.add.overlap(player, bronzes, this.collectBronze, null, this);
    this.physics.add.overlap(player, villainAssistances, this.collectVillain, null, this);

    this.coinGenerator = coinGenerator;

    const timeKeeper = timeKeeperFactory.create();
    timeKeeper.on('game over', () => this.gameOver(true));
    timeKeeper.on('tick', () => {
      this.timeRemaining -= 1;
      this.timeText.setText(this.timeRemaining);
    });
    this.timeKeeper = timeKeeper;

    this.board = this.add.text(grid.valueOf(22), grid.valueOf(0.3), 'Score: 0', {
      fontSize: '14px', fill: '#fff',
    });

    this.timeRemaining = timeKeeper.duration();
    this.timeText = this.add.text(grid.valueOf(20), grid.valueOf(0.3), this.timeRemaining, {
      fontSize: '14px', fill: '#fff',
    });
    this.setupVillain();
  }

  update = (time, delta) => {
    if (this.isGameOver) {
      return;
    }

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

    this.coinGenerator.tick(delta);
    this.timeKeeper.tick(delta);

    if (this.villainClimbingUp) {
      this.villain.body.setVelocityY(-120);
    }
  }

  gameOver = (keepAlive = false) => {
    this.isGameOver = true;
    this.physics.pause();
    if (!keepAlive) {
      this.player.setTint(0xff0000);
    }
    this.player.anims.play('turn');
    setTimeout(() => {
      this.eventRelay.emit('game over', { score: this.score });
    }, 5000);
  };

  updateScore = (score) => {
    this.score += score;
    this.board.setText(`Score: ${this.score}`);
  }

  collectSilver = (player, silver) => {
    this.updateScore(30);
    silver.destroy();
    silver.emit('collected');
  }

  collectBronze = (player, bronze) => {
    this.updateScore(10);
    bronze.destroy();
    bronze.emit('collected');
  }

  collectVillain = (player, villain) => {
    villain.destroy();
    villain.emit('collected');
    this.gameOver();
  }

  collectGold = () => {
    this.updateScore(this.score * 50);
    this.gameOver(true);
  };

  setupVillain = () => {
    const directions = {
      LEFT: 'left',
      RIGHT: 'right',
      UP: 'up',
      DOWN: 'down',
    };
    let direction = directions.RIGHT;

    const velocity = 120;
    const {
      player, villain, platforms, walls, doors, ladderBottomSeals,
    } = this;
    const decide3 = () => Math.random() > 0.67;
    const decide2 = () => Math.random() > 0.5;

    this.anims.create({
      key: 'villain-left',
      frames: this.anims.generateFrameNumbers(sprites.villain.key, { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'villain-right',
      frames: this.anims.generateFrameNumbers(sprites.villain.key, { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'villain-up',
      frames: this.anims.generateFrameNumbers(sprites.villain.key, { start: 18, end: 23 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'villain-down',
      frames: this.anims.generateFrameNumbers(sprites.villain.key, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    const goRight = () => {
      villain.setVelocityY(0);
      villain.setVelocityX(velocity);
      direction = directions.RIGHT;
      this.player.anims.play('villain-right', true);
    };

    const goLeft = () => {
      villain.setVelocityY(0);
      villain.setVelocityX(-1 * velocity);
      direction = directions.LEFT;
      this.player.anims.play('villain-left', true);
    };

    const goUp = (ladder) => {
      villain.setVelocityX(0);
      villain.body.position.set(ladder.body.x - 8, villain.body.y);
      villain.body.setVelocityY(-1 * velocity);
      this.villainClimbingUp = true;
      direction = directions.UP;
      this.player.anims.play('villain-up', true);
    };

    const goDown = (ladder) => {
      villain.setVelocityX(0);
      villain.body.position.set(ladder.body.x - 8, villain.body.y);
      villain.setVelocityY(velocity);
      direction = directions.DOWN;
      this.player.anims.play('villain-down', true);
    };

    villain.setBounce(0.2);
    villain.setDepth(1000);
    villain.setCollideWorldBounds(true);
    goRight();

    this.physics.add.collider(villain, this.floor);
    this.physics.add.collider(villain, platforms, null,
      () => !(direction === directions.UP || direction === directions.DOWN));
    this.physics.add.collider(villain, doors, () => {
      goRight();
    });
    this.physics.add.collider(villain, walls, () => {
      if (direction === directions.RIGHT) {
        goLeft();
      } else {
        goRight();
      }
    });
    this.physics.add.collider(villain, ladderBottomSeals, (villain, ladder) => {
      goUp(ladder);
    }, () => direction === directions.DOWN);
    this.physics.add.overlap(villain, this.ladderUps, (villain, ladder) => {
      if (direction === directions.DOWN) {
        if (decide3()) {
          goLeft();
        } else if (decide3()) {
          goRight();
        } else {
          goUp(ladder);
        }
        return;
      }
      if (decide3()) {
        goUp(ladder);
        return;
      }
      if (direction === directions.RIGHT) {
        goLeft();
      } else if (decide3()) {
        goRight();
      } else {
        goUp(ladder);
      }
    }, (villain, ladder) => {
      if (direction === directions.UP) {
        return false;
      }
      const vDist = villain.body.bottom - ladder.body.top;
      const hDist = villain.body.x + 8 - ladder.body.x;
      return vDist > 0 && vDist < 2 && hDist >= 0 && hDist < 1;
    });

    this.physics.add.overlap(villain, this.ladderDowns, (villain, ladder) => {
      if (this.villainClimbingUp) {
        this.villainClimbingUp = false;
        if (decide2()) {
          goRight();
        } else if (decide2()) {
          goLeft();
        } else {
          goDown(ladder);
        }
        return;
      }
      if (decide3()) {
        goDown(ladder);
        return;
      }
      if (direction === directions.LEFT && decide3()) {
        goRight();
      } else if (decide3()) {
        goLeft();
      } else {
        goDown(ladder);
      }
    }, (villain, ladder) => {
      const vDist = villain.body.bottom - ladder.body.top;
      const hDist = villain.body.x + 8 - ladder.body.x;
      return vDist > 0 && vDist < 2 && hDist >= 0 && hDist < 1;
    });

    this.physics.add.overlap(player, villain, () => {
      this.gameOver();
    }, null, this);
  }
}

GameScene.key = 'game';

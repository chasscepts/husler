/**
 * A Utility for generating coins at random intervals
 */

import assets from './assets';
import random from './random-item';
import eventEmitter from './event-emitter';

const create = (collection, randomNumberGenerator = { get: () => Math.random() }) => {
  let pointGenerator = random.create(collection);
  let hasActiveVillain = false;

  const VILLAIN_TYPE = 'villain';

  const generateSilver = () => randomNumberGenerator.get() > 0.65;

  const generateBronze = () => randomNumberGenerator.get() > 0.55;

  const generateVillain = () => !hasActiveVillain && randomNumberGenerator.get() > 0.8;

  const randomInteger = (min, max) => Math.floor(randomNumberGenerator.get() * (max - min) + min);

  const coinRelay = eventEmitter();

  let activeCoins = [];

  const reclaim = (x, y) => {
    activeCoins = activeCoins.filter((coin) => !(coin.x === x && coin.y === y));
    pointGenerator.add({ x, y });
  };

  const generateCoin = (type) => {
    const point = pointGenerator.next();
    if (!point) {
      return;
    }

    const maxLife = randomInteger(10, 31);
    let lived = 0;

    const relay = eventEmitter();

    const destroy = () => {
      reclaim(point.x, point.y);
      if (type === VILLAIN_TYPE) {
        hasActiveVillain = false;
      }
    };

    const checkLife = () => {
      lived += 1;
      if (lived >= maxLife) {
        relay.emit('lifeup');
        destroy();
      }
    };

    const coin = {
      x: point.x,
      y: point.y,
      type,
      asset: type,
      checkLife,
      destroy,
      on: (event, callback) => relay.subscribe(event, callback),
    };

    if (type === VILLAIN_TYPE) {
      hasActiveVillain = true;
      coin.asset = randomNumberGenerator.get() > 0.5 ? assets.silver.key : assets.bronze.key;
    }

    activeCoins.push(coin);

    coinRelay.emit('coin', coin);
  };

  const tryGenerateCoin = () => {
    let generated = false;
    if (generateBronze()) {
      generated = true;
      generateCoin(assets.bronze.key);
    }
    if (generateSilver()) {
      generated = true;
      generateCoin(assets.silver.key);
    }
    return generated;
  };

  const SECONDS_BETWEEN_COINS = 12;
  const VILLAIN_RANGE = { min: 30, max: 40 };
  let paused = false;
  let accummulator = 0;
  let coinTicks = 0;
  let villainTicks = 0;

  const tick = (delta) => {
    if (paused) {
      return;
    }
    accummulator += delta;
    if (accummulator > 1000) {
      accummulator %= 1000;
      activeCoins.forEach((coin) => coin.checkLife());
      coinTicks += 1;
      villainTicks += 1;

      if (coinTicks >= SECONDS_BETWEEN_COINS) {
        if (tryGenerateCoin()) {
          coinTicks = 0;
        }
      }

      if (villainTicks >= VILLAIN_RANGE.min) {
        if (generateVillain()) {
          generateCoin(VILLAIN_TYPE);
          villainTicks = 0;
        } else if (villainTicks >= VILLAIN_RANGE.max) {
          villainTicks = 0;
        }
      }
    }
  };

  const resume = () => {
    tryGenerateCoin();
    accummulator = 0;
    coinTicks = 0;
    paused = false;
  };

  return {
    tick,
    reclaim,
    pause: () => {
      paused = true;
    },
    resume,
    restart: () => {
      pointGenerator = random.create(collection);
      resume();
    },
    on: (eventName, callback) => {
      coinRelay.subscribe(eventName, callback);
      const type = randomNumberGenerator.get() > 0.5 ? assets.silver.key : assets.bronze.key;
      generateCoin(type);
      tryGenerateCoin();
    },
  };
};

export default {
  create,
};

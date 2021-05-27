import eventEmitter from './event-emitter';

const GAME_DURATION = 300;

const relay = eventEmitter();

const create = () => {
  let gameOver = false;
  let paused = false;
  let deltaTime = 0;
  let elapsedSeconds = 0;

  return {
    tick: (delta) => {
      if (paused || gameOver) {
        return;
      }

      deltaTime += delta;
      if (deltaTime > 1000) {
        deltaTime %= 1000;
        elapsedSeconds += 1;
        relay.emit('seconds tick');

        if (elapsedSeconds >= GAME_DURATION) {
          gameOver = true;
          relay.emit('game over');
        }
      }
    },
    pause: () => { paused = true; },
    resume: () => { paused = false; },
    reset: () => {
      deltaTime = 0;
      elapsedSeconds = 0;
      gameOver = false;
    },
    on: (event, callback) => relay.subscribe(event, callback),
  };
};

export default {
  create,
};

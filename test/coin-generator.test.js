import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import coinGenerator from '../src/lib/coin-generator';

const collection = [{ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }];

const randomGenerator = { get: () => 0.9 };

describe('CoinGenerator', () => {
  it('generates and emits coins events', () => {
    const mock = jest.fn();
    const generator = coinGenerator.create(collection, randomGenerator);
    generator.on('coin', mock);
    for (let i = 0; i < 15; i += 1) {
      generator.tick(800);
    }
    expect(mock).toHaveBeenCalled();
  });

  it('emits open door events', () => {
    const mock = jest.fn();
    const generator = coinGenerator.create(collection, randomGenerator);
    generator.on('open door', mock);
    for (let i = 0; i < 65; i += 1) {
      generator.tick(800);
    }
    expect(mock).toHaveBeenCalled();
  });

  it('emits close door event', () => {
    const mock = jest.fn();
    const generator = coinGenerator.create(collection, randomGenerator);
    generator.on('close door', mock);
    for (let i = 0; i < 100; i += 1) {
      generator.tick(800);
    }
    expect(mock).toHaveBeenCalled();
  });
});

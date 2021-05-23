import { jest } from '@jest/globals';
import eventEmitter from '../src/lib/event-emitter';

describe('EventEmitter', () => {
  it('calls back when subscribed to', () => {
    const callback = jest.fn();
    eventEmitter.subscribe('event 1', callback);

    eventEmitter.emit('event 1');

    expect(callback).toHaveBeenCalled();
  });

  it('calls back all subscribed objects', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventEmitter.subscribe('event 1', callback1);
    eventEmitter.subscribe('event 1', callback2);

    eventEmitter.emit('event 1');

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('calls back WITH PAYLOAD when subscribed to', () => {
    const callback = jest.fn();
    const payload = 'Payload';

    eventEmitter.subscribe('event 2', callback);

    eventEmitter.emit('event 2', payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it('can be unsubscribed from', () => {
    const callback = jest.fn();
    eventEmitter.subscribe('event 3', callback);
    eventEmitter.emit('event 3');
    eventEmitter.unsubscribe('event 3', callback);
    eventEmitter.emit('event 3');

    expect(callback.mock.calls.length).toBe(1);
  });
});

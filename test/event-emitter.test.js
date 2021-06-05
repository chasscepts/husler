import { jest } from '@jest/globals';
import eventEmitter from '../src/lib/event-emitter';

describe('EventEmitter', () => {
  it('calls back when subscribed to', () => {
    const callback = jest.fn();
    const emitter = eventEmitter();
    emitter.subscribe('event 1', callback);

    emitter.emit('event 1');

    expect(callback).toHaveBeenCalled();
  });

  it('calls back all subscribed objects', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const emitter = eventEmitter();
    emitter.subscribe('event 1', callback1);
    emitter.subscribe('event 1', callback2);

    emitter.emit('event 1');

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('calls back WITH PAYLOAD when subscribed to', () => {
    const callback = jest.fn();
    const payload = 'Payload';

    const emitter = eventEmitter();
    emitter.subscribe('event 2', callback);

    emitter.emit('event 2', payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it('can be unsubscribed from', () => {
    const callback = jest.fn();
    const emitter = eventEmitter();
    emitter.subscribe('event 3', callback);
    emitter.emit('event 3');
    emitter.unsubscribe('event 3', callback);
    emitter.emit('event 3');

    expect(callback.mock.calls.length).toBe(1);
  });
});

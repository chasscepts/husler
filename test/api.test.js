import {
  jest,
  expect,
  it,
  describe,
} from '@jest/globals';
import Api from '../src/lib/api';

describe('Api', () => {
  describe('create', () => {
    it('correctly setup create request options', () => {
      const name = 'Phaser 3';
      return Api.init({
        name,
        setId: () => {},
        fetch: (ur, options) => {
          expect(options.mode).toBe('cors');
          expect(options.method).toBe('POST');
          expect(options.headers['Content-Type']).toBe('application/json');
          expect(options.body).toBe(JSON.stringify({ name }));

          return Promise.resolve({
            json: () => Promise.resolve({ result: 'Game with ID: game-id added.' }),
            ok: true,
          });
        },
      });
    });

    it('correctly sends api request to create new game and returns the id', () => {
      const name = 'Phaser 3';
      const id = 'another random id';
      const mockSetId = jest.fn();
      return Api.init({
        name,
        setId: mockSetId,
        fetch: () => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ result: `Game with ID: ${id} added.` }),
        }),
      }).then(() => {
        expect(mockSetId).toBeCalledWith(id);
      });
    });

    it('rejects when response is not ok', () => {
      const name = 'Phaser 3';
      return Api.init({
        name,
        setId: () => {},
        fetch: () => Promise.resolve({
          ok: false,
          statusText: 'Invalid request',
        }),
      }).catch((e) => expect(e).toBeInstanceOf(Error));
    });
  });

  describe('records', () => {
    it('correctly sets cors option in request', () => {
      const name = 'Phaser 3';
      return Api.init({
        name,
        gameId: 'a-random-game',
        fetch: (ur, options) => {
          expect(options.mode).toBe('cors');

          return Promise.resolve({
            json: () => Promise.resolve({ result: [] }),
            ok: true,
          });
        },
      }).then((api) => api.records());
    });

    it('retrieves all scores from api', () => {
      const scores = [
        { name: 'Francis', score: 300 },
        { name: 'Charles', score: 400 },
      ];
      const toReturn = [...scores];
      toReturn.sort((a, b) => b.score - a.score);

      return Api.init({
        name: 'Game',
        gameId: 'a-random-game',
        fetch: () => Promise.resolve({
          ok: true,
          json: () => ({ result: scores }),
        }),
      })
        .then((api) => api.records())
        .then((data) => expect(data).toEqual(toReturn));
    });

    it('rejects when response is not ok', () => {
      const name = 'Phaser 3';
      return Api.init({
        name,
        gameId: 'a-random-game',
        fetch: () => Promise.resolve({
          ok: false,
          statusText: 'Invalid request',
        }),
      })
        .then((api) => api.records())
        .catch((e) => expect(e).toBeInstanceOf(Error));
    });
  });

  describe('save', () => {
    it('calls external api with required options', () => {
      const record = { user: 'Francis', score: 100 };
      return Api.init({
        name: 'Phaser 3',
        gameId: 'a-random-game',
        fetch: (ur, options) => {
          expect(options.mode).toBe('cors');
          expect(options.method).toBe('POST');
          expect(options.headers['Content-Type']).toBe('application/json');
          expect(options.body).toBe(JSON.stringify(record));

          return Promise.resolve({
            json: () => Promise.resolve({ result: 'Score successfully save.' }),
            ok: true,
          });
        },
      }).then((api) => api.save(record));
    });

    it('rejects when response is not ok', () => {
      const name = 'Phaser 3';
      return Api.init({
        name,
        gameId: 'a-random-game',
        fetch: () => Promise.resolve({
          ok: false,
          statusText: 'Invalid request',
        }),
      })
        .then((api) => api.save({ user: 'name', score: 10 }))
        .catch((e) => expect(e).toBeInstanceOf(Error));
    });
  });
});

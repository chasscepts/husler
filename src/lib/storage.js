/**
 * Interface to localStorage
 */

const value = (raw) => Promise.resolve({
  text: () => Promise.resolve(raw),
  json: () => {
    try {
      return Promise.resolve(JSON.parse(raw));
    } catch (err) {
      return Promise.reject(err);
    }
  },
});

export default {
  get: (key) => {
    value(key).then((response) => response.json()).then((val) => console.log(val));
  },
};

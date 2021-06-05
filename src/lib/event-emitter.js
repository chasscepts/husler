const eventEmitter = () => {
  const subscribers = Object.create(null);

  return {
    subscribe: (event, callback) => {
      let array = subscribers[event];
      if (!array) {
        array = [];
        subscribers[event] = array;
      }
      array.push(callback);
    },
    unsubscribe: (event, callback) => {
      const array = subscribers[event];
      if (array) {
        subscribers[event] = array.filter((item) => item !== callback);
      }
    },
    emit: (event, payload) => {
      const callbacks = subscribers[event];
      if (callbacks) {
        callbacks.forEach((callback) => {
          callback(payload);
        });
      }
    },
  };
};

export default eventEmitter;

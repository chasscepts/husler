const generator = (array) => {
  const store = [...array];

  return {
    next: () => {
      const idx = Math.floor(Math.random() * store.length);
      const temp = store[idx];
      store.splice(idx, 1);
      return temp;
    },
    add: (item) => store.push(item),
    length: () => store.length,
    hasNext: () => store.length > 0,
    collections: () => [...store],
  };
};

const randomItemGenerator = {
  create: (collection) => generator(collection),
};

export default randomItemGenerator;

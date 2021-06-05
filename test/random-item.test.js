import randomItemGenerator from '../src/lib/random-item';

describe('randomItemGenerator', () => {
  it('returns random item from passed in array', () => {
    const items = [1, 2, 3, 4, 5];
    const generator = randomItemGenerator.create(items);
    const item = generator.next();
    expect(items).toContain(item);
  });

  it('removes item from collection after returning it', () => {
    let items = [1, 2, 3, 4, 5];
    const generator = randomItemGenerator.create(items);
    const item = generator.next();
    items = generator.collections();
    expect(items).not.toContain(item);
  });

  it('adds new items to collection', () => {
    let items = [1, 2, 3, 4, 5];
    const generator = randomItemGenerator.create(items);
    const item = 9;
    generator.add(item);
    items = generator.collections();
    expect(items).toContain(item);
  });
});

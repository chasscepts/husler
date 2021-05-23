import mixin from '../src/lib/mixin';

describe('mixin', () => {
  it('mixes one object into a new object', () => {
    const toMix = {
      add: (a, b) => a + b,
    };

    const mixed = mixin(toMix, {
      func: () => true,
    });

    expect(mixed.add(1, 2)).toBe(3);
  });

  it('mixes more than one object into a new object', () => {
    const toMix1 = { add: (a, b) => a + b };
    const toMix2 = { multiply: (a, b) => a * b };
    const mixed = mixin(toMix1, toMix2, {
      func: () => true,
    });

    expect(mixed.add(1, 2)).toBe(3);
    expect(mixed.multiply(2, 3)).toBe(6);
  });
});

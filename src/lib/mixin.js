const mixin = (...objs) => (objs.reduce((memo, obj) => ({ ...memo, ...obj }), {}));

export default mixin;

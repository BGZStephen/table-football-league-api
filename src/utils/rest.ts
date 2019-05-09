export function asyncwrap(fn) {
  const ctx = this;

  return function (req, res, next) {
    return fn.call(ctx, req, res, next).catch(next);
  };
}
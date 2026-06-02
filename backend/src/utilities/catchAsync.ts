import { Request, Response, NextFunction } from 'express'

export default function catchAsync(fn: any) {
    return function (req: Request, res: Response, next: NextFunction) {
      // Promise.resolve ensures that if 'fn' returns a non-promise, it's still wrapped.
      // .catch(next) ensures any error from 'fn' is passed to the next middleware (our error handler).
      Promise.resolve(fn(req, res, next)).catch(next);
    };
}
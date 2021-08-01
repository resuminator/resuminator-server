import { NextFunction, Request, Response } from 'express';

type Fn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response<any, Record<string, any>> | undefined>;

/**
 * Custom function to exclude paths from middleware.
 * @params middleware - function (req, res, next) => any
 * @params ...paths - List of paths separated with comma
 * @example unless(auth, "/", "/user") - This will exclude "/" and "/user" path from auth middleware
 */
const unless = (middleware: Fn, ...paths: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const hasExcludedPaths = paths.some((path) => path === req.path);
    return hasExcludedPaths ? next() : middleware(req, res, next);
  };
};

export default unless

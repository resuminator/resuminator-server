/*
    Resuminator Backend, It act as backend service for Resuminator
    Copyright (C) 2021  Resuminator Authors

    This file is part of Resuminator Backend.

    Resuminator Backend is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Resuminator Backend is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Resuminator Backend.  If not, see <https://www.gnu.org/licenses/>.
*/

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

export default unless;

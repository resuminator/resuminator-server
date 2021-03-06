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

import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../../common/main.validator';
import { ResumeConfig } from '../../config/resume.config';

const educationValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const base = Joi.object().keys({
    _id: Joi.string().required(),
    isHidden: Joi.boolean().required(),
    institute: Joi.string().allow('').required(),
    location: Joi.string().allow('').required(),
    degree: Joi.string().allow('').required(),
    stream: Joi.string().allow('').required(),
    gradeObtained: Joi.number().required(),
    gradeMax: Joi.number().required(),
    start: Joi.date().required(),
    end: [Joi.date().optional(), Joi.allow(null)],
    description: Joi.string().allow('').required(),
  });

  const schema = Joi.array().max(ResumeConfig.educationCount).items(base);

  validateRequest(req, res, next, schema);
};

export { educationValidation };

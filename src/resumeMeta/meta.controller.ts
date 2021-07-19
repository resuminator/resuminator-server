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

import { Request, Response } from 'express';
import { model } from 'mongoose';
import { Resume } from '../resume/resume.controller';
import { ResumeMeta } from './meta.interface';
import { ResumeMetaSchema } from './meta.model';

export const Meta = model('Meta', ResumeMetaSchema);

const getMeta = async (req: Request, res: Response) => {
  try {
    const meta = await findMetaAndCreate(req.username);
    res.status(200).json(meta);
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

const deleteMeta = async (req: Request, res: Response) => {
  try {
    const meta = await findMeta(req.username);
    const index = meta.active.findIndex(function (element: any) {
      return element.id === req.params.id;
    });
    if (index === -1) {
      res.status(409).json({
        message: "Resume Doesn't Exist On Profile",
      });
    } else {
      const result = await deleteResume(req.params.id);
      if (result) {
        meta.active.splice(index, 1);
        meta.save((err: any, metaResume: ResumeMeta) => {
          if (metaResume) {
            return res.status(200).json(metaResume);
          }
          if (err) {
            return res.status(400).json(err);
          }
        });
      }
    }
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

async function deleteResume(id: string) {
  try {
    const result = await Resume.findByIdAndDelete(id);
    if (result === null) {
      throw 404;
    } else {
      return 200;
    }
  } catch (error) {
    if (error === 404) {
      throw {
        code: 404,
        message: 'Not Found',
      };
    } else
      throw {
        code: 400,
        message: 'Bad Request',
      };
  }
}

export async function findMeta(username: string): Promise<ResumeMeta> {
  try {
    const meta = await Meta.findOne({ uid: username });
    if (meta) {
      return meta;
    } else {
      throw 404;
    }
  } catch (error) {
    if (error === 404) {
      throw {
        code: 404,
        message: 'Not Found',
      };
    } else
      throw {
        code: 400,
        message: 'Bad Request',
      };
  }
}

async function findMetaAndCreate(id: string) {
  try {
    let meta = await Meta.findOne({ uid: id });
    if (meta) {
      return meta;
    } else {
      meta = await createMeta(id);
      return meta;
    }
  } catch (error) {
    if (error.code === 11000) {
      throw {
        code: 409,
        message: 'Already Exist',
      };
    } else {
      throw {
        code: 400,
        message: 'Bad Request',
      };
    }
  }
}

async function createMeta(id: string) {
  const meta = new Meta({
    uid: id,
  });
  const result = await meta.save();
  return result;
}

export { getMeta, deleteMeta };

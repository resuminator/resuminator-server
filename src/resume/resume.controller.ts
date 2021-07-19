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
import { ResumeConfig } from '../config/resume.config';
import { findMeta } from '../resumeMeta/meta.controller';
import { ResumeSchema } from './resume.model';

export const Resume = model('Resume', ResumeSchema);

const newResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const meta = await findMeta(req.username);
    if (meta.active.length < ResumeConfig.resumeCount) {
      const createResume = new Resume({
        username: req.username,
      });
      createResume.save((err: any, resume: any) => {
        if (resume) {
          const newActive = {
            _id: resume.id,
            profileName: '',
            webid: '',
            icon: '',
            isPublic: false,
            isTemplate: false,
            color: '',
          };

          meta.active.push(newActive);
          meta.save((err: any, metaResume: any) => {
            if (metaResume) {
              return res.status(200).json(metaResume);
            }
            if (err) {
              return res.status(400).json(err);
            }
          });
        }
        if (err) {
          return res.status(400).json(err);
        }
      });
    } else {
      res.status(409).json({
        message: 'Limit Exceeded',
      });
    }
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

const getResume = async (req: Request, res: Response) => {
  try {
    const resume = await findResume(req.params.id, req.username);
    res.status(200).json(resume);
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

const updateEEPCP =
  (section: string) => async (req: Request, res: Response) => {
    try {
      const resume = await findResume(req.params.id, req.username);
      const change = req.body;

      resume[section] = change;
      resume.markModified(section);
      try {
        const result = await resume.save();
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(418).json({
          message: 'Something Went Wrong',
        });
      }
    } catch (error) {
      res.status(error.code).json({
        message: error.message,
      });
    }
  };

const updateTemplate =
  (section: string, subsection: string) =>
  async (req: Request, res: Response) => {
    try {
      const resume = await findResume(req.params.id, req.username);
      const change = req.body;

      resume[section][subsection] = change[subsection];
      resume.markModified(section);
      try {
        const result = await resume.save();
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(418).json({
          message: 'Something Went Wrong',
        });
      }
    } catch (error) {
      res.status(error.code).json({
        message: error.message,
      });
    }
  };

async function findResume(id: string, username: string) {
  try {
    const userResume = await Resume.findOne({
      _id: id,
      username: username,
    });
    if (userResume) {
      return userResume;
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

export { newResume, getResume, updateEEPCP, updateTemplate };

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
import { client } from '..';
import { MainConfig } from '../config/main.config';
import { Resume } from '../resume/resume.controller';
import { createSettings } from '../userSettings/settings.controller';
import { ResumeMeta } from './meta.interface';
import { ResumeMetaSchema } from './meta.model';
import axios, { AxiosRequestConfig } from 'axios';
import { SGConfig } from '../config/sendgrid.config';

export const Meta = model('Meta', ResumeMetaSchema);

const getMeta = async (req: Request, res: Response) => {
  try {
    const meta = await findMetaAndCreate(req.username, req.email, req.name);
    client.capture({
      distinctId: req.username,
      event: 'Retrieve ResumeMeta',
      properties: {
        environment: MainConfig.env,
      },
    });
    res.status(200).json(meta);
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

const deleteResume = async (req: Request, res: Response) => {
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
      const result = await deleteResumebyId(req.params.id);
      if (result) {
        meta.active.splice(index, 1);
        meta.save((err: any, metaResume: ResumeMeta) => {
          if (metaResume) {
            client.capture({
              distinctId: req.username,
              event: 'Resume Deleted',
              properties: {
                environment: MainConfig.env,
              },
            });
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

const updateMeta = async (req: Request, res: Response) => {
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
      Object.assign(meta.active[index], req.body);
      try {
        const result = await meta.save();
        client.capture({
          distinctId: req.username,
          event: 'Update ResumeMeta',
          properties: {
            environment: MainConfig.env,
          },
        });
        res.status(200).json(result);
      } catch (error) {
        res.status(418).json({
          message: 'Something Went Wrong',
        });
      }
    }
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

async function deleteResumebyId(id: string) {
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

async function newAccountMail(name: string, email: string) {
  const data = JSON.stringify({
    from: {
      email: SGConfig.email,
    },
    personalizations: [
      {
        to: [
          {
            email: email,
          },
        ],
        dynamic_template_data: {
          name: name,
        },
      },
    ],
    template_id: SGConfig.new,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      Authorization: `Bearer ${SGConfig.api}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log('[INFO] Email Sent');
    })
    .catch(function (error) {
      console.log('[INFO] Email Failed');
    });

  return;
}

async function findMetaAndCreate(id: string, email: string, name: string) {
  try {
    let meta = await Meta.findOne({ uid: id });
    if (meta) {
      return meta;
    } else {
      meta = await createMeta(id);
      const settings = await createSettings(id);
      if (settings && meta) {
        await newAccountMail(name, email);
        client.identify({
          distinctId: id,
          properties: {
            email: email,
          },
        });
        return meta;
      }
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

export { getMeta, deleteResume, updateMeta };

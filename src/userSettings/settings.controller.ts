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
import * as admin from 'firebase-admin';
import { model } from 'mongoose';
import { client } from '..';
import { MainConfig } from '../config/main.config';
import { Resume } from '../resume/resume.controller';
import { Meta } from '../resumeMeta/meta.controller';
import { RequestAccountData } from './settings.model';
import axios, { AxiosRequestConfig } from 'axios';
import { SGConfig } from '../config/sendgrid.config';

export const AccountData = model('AccountData', RequestAccountData);

const deleteAccount = async (req: Request, res: Response) => {
  try {
    await admin.auth().deleteUser(req.username);
    await Resume.deleteMany({
      username: req.username,
    });
    await Meta.deleteOne({
      uid: req.username,
    });
    await AccountData.deleteOne({
      uid: req.username,
    });
    client.capture({
      distinctId: req.username,
      event: 'Account Deleted',
      properties: {
        environment: MainConfig.env,
      },
    });
    await deleteAccountMail(req.name, req.email);
    res.status(200).json({
      message: 'Deleted',
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const accountData = async (req: Request, res: Response) => {
  try {
    const settings = await getSettings(req.username);
    res.status(200).json(settings);
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

const accountDataRequest = async (req: Request, res: Response) => {
  try {
    const settings = await getSettings(req.username);
    if (settings.completedBy < Date.now()) {
      settings.requestedOn = Date.now();
      settings.completedBy = Date.now() + 18 * 24 * 60 * 60 * 1000;
      settings.isCompleted = false;
      try {
        const result = await settings.save();
        client.capture({
          distinctId: req.username,
          event: 'Account Data Request',
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
    } else {
      res.status(409).json({
        message:
          'Either one of your request still in process or Its not been 14 working days to your last request',
      });
    }
  } catch (error) {
    res.status(error.code).json({
      message: error.message,
    });
  }
};

async function deleteAccountMail(name: string, email: string) {
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
          email: email,
        },
      },
    ],
    template_id: SGConfig.del,
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

async function getSettings(uid: string) {
  try {
    const settings = await AccountData.findOne({
      uid: uid,
    });
    if (settings) {
      return settings;
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

export async function createSettings(uid: string) {
  const settings = new AccountData({
    uid: uid,
  });
  const result = await settings.save();
  return result;
}

export { deleteAccount, accountData, accountDataRequest };

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
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { BroadmapConfig } from '../config/broadmap.config';

const subBroadmap = (req: Request, res: Response) => {
  const data = new FormData();
  data.append('email', req.body.email);
  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://www.getrevue.co/api/v2/subscribers',
    headers: {
      Authorization: `Token ${BroadmapConfig.api}`,
      ...data.getHeaders(),
    },
    data: data,
  };
  axios(config)
    .then(() => {
      res.status(200).json({
        message: 'Check Your Email for more details.',
      });
    })
    .catch(() => {
      res.status(400).json({
        message: 'Confirm Email from last email we sent you',
      });
    });
};

export { subBroadmap };

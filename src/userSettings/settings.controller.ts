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
import { Resume } from '../resume/resume.controller';
import { Meta } from '../resumeMeta/meta.controller';

const deleteAccount = async (req: Request, res: Response) => {
  try {
    await admin.auth().deleteUser(req.username);
    await Resume.deleteMany({
      username: req.username,
    });
    await Meta.deleteOne({
      uid: req.username,
    });
    res.status(200).json({
      message: 'Deleted',
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export { deleteAccount };

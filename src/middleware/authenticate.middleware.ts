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

import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

import { firebaseConfig } from '../config/firebase.config';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseConfig.project_id,
    privateKey: firebaseConfig.private_key,
    clientEmail: firebaseConfig.client_email,
  }),
});

async function decodeIDToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers?.authorization;
  if (
    header !== 'Bearer null' &&
    req.headers?.authorization?.startsWith('Bearer ')
  ) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.email_verified) {
        req.username = decodedToken.uid;
        req.email = decodedToken.email || '';
        req.name = decodedToken.name || '';
      } else {
        return res.status(403).json({
          message: 'User Not Verified',
        });
      }
    } catch (err) {
      return res.status(401).json({
        message: err.message,
      });
    }
  } else if (header == undefined || header === 'Bearer null') {
    return res.status(400).json({
      message: 'Token Missing',
    });
  } else {
    return res.status(400).json({
      message: 'Invalid Header Format',
    });
  }
  next();
}

export { decodeIDToken };

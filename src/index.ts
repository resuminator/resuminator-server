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

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import PostHog from 'posthog-node';
import serverless from 'serverless-http';
import broadmap from './broadmap/broadmap.routes';
import unless from './common/unless';
import { MongoConfig } from './config/mongodb.config';
import { PostHogConfig } from './config/posthog.config';
import { decodeIDToken } from './middleware/authenticate.middleware';
import resume from './resume/resume.routes';
import resumeMeta from './resumeMeta/meta.routes';
import userSettings from './userSettings/settings.routes';
import utils from './utils/utils.routes';

const app = express();

mongoose.connect(
  MongoConfig.uri,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(err.message);
      console.log(err);
    } else {
      console.log('[INFO] MongoDB Connected');
    }
  },
);

export const client = new PostHog(PostHogConfig.apiKey, {
  host: PostHogConfig.host,
});

app.use(cors());
app.use(express.json());
app.use(unless(decodeIDToken, '/v0.2.0', '/broadmap/subscribe'));
app.use('/v0.2.0', utils);
app.use('/broadmap', broadmap);
app.use('/v0.2.0/resume', resume);
app.use('/v0.2.0/meta', resumeMeta);
app.use('/v0.2.0/settings', userSettings);

module.exports.handler = serverless(app);
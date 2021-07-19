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

import { Schema } from 'mongoose';

export const RequestAccountData = new Schema(
  {
    requestedOn: {
      type: Date,
      trim: true,
      default: null,
    },
    completedBy: {
      type: Date,
      trim: true,
      default: null,
    },
    uid: {
      type: String,
      requied: true,
      trim: true,
      unique: true,
    },
    isCompleted: {
      type: Boolean,
      trim: true,
      default: null,
    },
    completedOn: {
      type: Date,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

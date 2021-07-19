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

const activeResume = {
  _id: {
    type: String,
    required: true,
    trim: true,
  },
  profileName: {
    type: String,
    trim: true,
  },
  webid: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  isPublic: {
    type: Boolean,
    requied: true,
  },
  isTemplate: {
    type: Boolean,
    requied: true,
  },
  color: {
    type: String,
    trim: true,
  },
};

export const ResumeMetaSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isBanned: {
      type: Number,
      required: true,
      trim: true,
      default: 0,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    active: {
      type: [activeResume],
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

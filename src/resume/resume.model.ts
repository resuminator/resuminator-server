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

const Layout = {
  header: {
    type: [[String]],
  },
  body: {
    type: [[String]],
  },
  footer: {
    type: [String],
  },
};

const Resume = {
  inputs: {
    type: [String],
  },
  layout: {
    type: Layout,
  },
  fontProfile: {
    type: String,
  },
  spacing: {
    type: Number,
  },
  color: {
    type: String,
  },
};

const userContact = {
  label: {
    type: String,
  },
  link: {
    type: String,
  },
  isHidden: {
    type: Boolean,
  },
};

const Contact = {
  fullName: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  userImage: {
    type: String,
  },
  contact: {
    type: [userContact],
  },
};

const Education = {
  _id: {
    type: String,
  },
  isHidden: {
    type: Boolean,
    requied: true,
  },
  institute: {
    type: String,
  },
  location: {
    type: String,
  },
  degree: {
    type: String,
  },
  stream: {
    type: String,
  },
  gradeObtained: {
    type: Number,
  },
  gradeMax: {
    type: Number,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
    nullable: true,
  },
  description: {
    type: String,
  },
};

const Experience = {
  _id: {
    type: String,
  },
  isHidden: {
    type: Boolean,
  },
  jobTitle: {
    type: String,
  },
  company: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  tags: {
    type: [String],
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
    nullable: true,
  },
};

const Projects = {
  _id: {
    type: String,
  },
  isHidden: {
    type: Boolean,
  },
  projectName: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
    nullable: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  tags: {
    type: [String],
  },
};

const Certifications = {
  _id: {
    type: String,
  },
  isHidden: {
    type: Boolean,
  },
  certificateName: {
    type: String,
  },
  authority: {
    type: String,
  },
  credentialNumber: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
    nullable: true,
  },
  link: {
    type: String,
  },
};

const Publications = {
  _id: {
    type: String,
  },
  isHidden: false,
  authorNames: {
    type: String,
  },
  journalName: {
    type: String,
  },
  articleTitle: {
    type: String,
  },
  volumeNumber: {
    type: Number,
  },
  issueNumber: {
    type: Number,
  },
  pages: {
    type: Number,
  },
  year: {
    type: Number,
  },
  format: {
    type: String,
  },
  doi: {
    type: String,
  },
};

const skillData = {
  _id: {
    type: String,
  },
  isHidden: {
    type: Boolean,
  },
  category: {
    type: String,
  },
  skillsList: {
    type: [String],
  },
};

const Skills = {
  hasCategories: {
    type: Boolean,
  },
  data: {
    type: [skillData],
  },
};

const customSectionInput = {
  _id: {
    type: String,
  },
  type: {
    type: String,
  },
  name: {
    type: String,
  },
};

const customSectionData = {
  _id: {
    type: String,
  },
  isHidden: {
    type: Boolean,
  },
  values: {
    type: Object,
  },
};

const customSection = {
  _id: {
    type: String,
  },
  header: {
    type: String,
  },
  hasTitleRow: {
    type: Boolean,
  },
  inputs: {
    type: [customSectionInput],
  },
  data: {
    type: [customSectionData],
  },
  layout: {
    type: [[String]],
  },
};

export const ResumeSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    template: {
      type: Resume,
      required: true,
      trim: true,
      default: {
        inputs: [
          'EDUCATION',
          'EXPERIENCE',
          'PROJECTS',
          'CERTIFICATIONS',
          'PUBLICATIONS',
          'SKILLS',
        ],
        layout: {
          header: [['USER_IMAGE', 'NAME_AND_JT'], ['SOCIAL_HANDLES']],
          body: [
            ['EXPERIENCE', 'PROJECTS', 'EDUCATION'],
            ['SKILLS', 'PUBLICATIONS'],
          ],
          footer: ['WATERMARK'],
        },
        fontProfile: 'CLASSIC',
        spacing: 1,
        color: 'blue',
      },
    },
    contact: {
      type: Contact,
      require: true,
      trim: true,
      default: {
        fullName: '',
        jobTitle: '',
        userImage: '',
        contact: [],
      },
    },
    education: {
      type: [Education],
      required: true,
      trim: true,
      default: [],
    },
    experience: {
      type: [Experience],
      required: true,
      trim: true,
      default: [],
    },
    projects: {
      type: [Projects],
      required: true,
      trim: true,
      default: [],
    },
    certifications: {
      type: [Certifications],
      required: true,
      trim: true,
      default: [],
    },
    publications: {
      type: [Publications],
      required: true,
      trim: true,
      default: [],
    },
    skills: {
      type: Skills,
      required: true,
      trim: true,
      default: {
        hasCategories: true,
        data: [],
      },
    },
    customSection: {
      type: [customSection],
      required: true,
      trim: true,
      default: [],
    },
  },
  { timestamps: true },
);

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

import { Router } from 'express';
import {
  getResume,
  newResume,
  newResumeCopy,
  updateEEPCP,
  updateTemplate,
} from './resume.controller';
import { certificateValidation } from './validators/certification.validator';
import { imageValidation } from './validators/contact/image.validator';
import { jobTitleValidation } from './validators/contact/job.validator';
import { nameValidation } from './validators/contact/name.validator';
import { socialValidation } from './validators/contact/social.validator';
import { customSectionValidation } from './validators/customSection.validator';
import { educationValidation } from './validators/education.validator';
import { experienceValidation } from './validators/experience.validator';
import { projectValidation } from './validators/project.validator';
import { publicationValidation } from './validators/publication.validator';
import { skillCategoryValidation } from './validators/skills/categories.validator';
import { skillDataValidation } from './validators/skills/data.validator';
import { templateColorValidation } from './validators/template/color.validator';
import { templatefontValidation } from './validators/template/font.validator';
import { templateInputValidation } from './validators/template/inputs.validator';
import { templateLayoutValidation } from './validators/template/layout.validator';
import { templateSpacingValidation } from './validators/template/spacing.validator';

const router = Router();

router.get('/new', newResume);

router.get('/new/:id', newResumeCopy);

router.get('/:id', getResume);

router.patch('/education/:id', educationValidation, updateEEPCP('education'));

router.patch(
  '/experience/:id',
  experienceValidation,
  updateEEPCP('experience'),
);

router.patch('/project/:id', projectValidation, updateEEPCP('projects'));

router.patch(
  '/certification/:id',
  certificateValidation,
  updateEEPCP('certifications'),
);

router.patch(
  '/publication/:id',
  publicationValidation,
  updateEEPCP('publications'),
);

router.patch(
  '/publication/:id',
  publicationValidation,
  updateEEPCP('publications'),
);

router.patch(
  '/customsection/:id',
  customSectionValidation,
  updateEEPCP('customSections'),
);

router.patch(
  '/template/input/:id',
  templateInputValidation,
  updateTemplate('template', 'inputs'),
);

router.patch(
  '/template/layout/:id',
  templateLayoutValidation,
  updateTemplate('template', 'layout'),
);

router.patch(
  '/template/font/:id',
  templatefontValidation,
  updateTemplate('template', 'fontProfile'),
);

router.patch(
  '/template/spacing/:id',
  templateSpacingValidation,
  updateTemplate('template', 'spacing'),
);

router.patch(
  '/template/color/:id',
  templateColorValidation,
  updateTemplate('template', 'color'),
);

router.patch(
  '/skill/categories/:id',
  skillCategoryValidation,
  updateTemplate('skills', 'hasCategories'),
);

router.patch(
  '/skill/data/:id',
  skillDataValidation,
  updateTemplate('skills', 'data'),
);

router.patch(
  '/contact/name/:id',
  nameValidation,
  updateTemplate('contact', 'fullName'),
);

router.patch(
  '/contact/image/:id',
  imageValidation,
  updateTemplate('contact', 'userImage'),
);

router.patch(
  '/contact/job/:id',
  jobTitleValidation,
  updateTemplate('contact', 'jobTitle'),
);

router.patch(
  '/contact/social/:id',
  socialValidation,
  updateTemplate('contact', 'contact'),
);

export default router;

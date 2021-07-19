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

import * as dotenv from 'dotenv';
dotenv.config();

const ResumeConfig = {
  resumeCount: Number(process.env.RESUME_COUNT) || 1,
  educationCount: Number(process.env.EDUCATION_COUNT) || 10,
  experienceCount: Number(process.env.EXPERIENCE_COUNT) || 10,
  projectCount: Number(process.env.PROJECT_COUNT) || 10,
  certificationCount: Number(process.env.CERTIFICATION_COUNT) || 10,
  publicationCount: Number(process.env.PUBLICATION_COUNT) || 10,
  customSectionCount: Number(process.env.CUSTOM_SECTION_COUNT) || 3,
  skillCount: Number(process.env.SKILL_COUNT) || 10,
};

export { ResumeConfig };

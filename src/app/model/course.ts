import { CourseCategory } from '../enum/course-category.enum';

export interface Course {
  id: number;
  description: string;
  iconUrl: string;
  courseListIcon: string;
  longDescription: string;
  category: CourseCategory;
  lessonsCount: number;
}

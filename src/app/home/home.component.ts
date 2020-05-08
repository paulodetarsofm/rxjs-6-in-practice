import { Component, OnInit } from '@angular/core';
import { noop, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { CourseCategory } from '../enum/course-category.enum';
import { Course } from '../model/course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses: Course[] = [];
  advancedCourses: Course[] = [];

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    const courses$: Observable<Course[]> = http$.pipe(
      map((res) => Object.values(res['payload'])),
    );

    courses$.subscribe(
      (courses: Course[]) => {
        this.beginnerCourses = courses.filter((course) => course.category === CourseCategory.BEGINNER);
        this.advancedCourses = courses.filter((course) => course.category === CourseCategory.ADVANCED);
      },
      noop,
      () => console.log('completed')
    );
  }
}

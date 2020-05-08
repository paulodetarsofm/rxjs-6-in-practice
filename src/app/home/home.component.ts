import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { CourseCategory } from '../enum/course-category.enum';
import { Course } from '../model/course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    const courses$ = createHttpObservable('/api/courses')
      .pipe(
        map((res: Course[]) => Object.values(res['payload'])),
        shareReplay(),
      ) as Observable<Course[]>; // TODO: Is it possible to do without this?

    this.beginnerCourses$ = courses$.pipe(
      map((courses) => courses.filter((course) => course.category === CourseCategory.BEGINNER)),
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) => courses.filter((course) => course.category === CourseCategory.ADVANCED)),
    );
  }
}

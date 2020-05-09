import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements AfterViewInit, OnInit {

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true })
  input: ElementRef;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${courseId}`);
    this.lessons$ = createHttpObservable(`/api/lessons?courseId=${courseId}&pageSize=100`).pipe(
      map((response) => response['payload']),
    );
  }

  ngAfterViewInit() {
    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe(console.log);
  }
}

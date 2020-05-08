import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { concatMap, filter } from 'rxjs/operators';
import { Course } from '../model/course';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

  form: FormGroup;
  course: Course;

  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) course: Course,

    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
  ) {
    this.course = course;
    this.form = this.fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });
  }

  ngOnInit() {
    this.form
      .valueChanges
      .pipe(

        // Continue only when the form is valid
        filter(() => this.form.valid),

        // Avoid triggering the next save operation before the previous was finished
        concatMap((changes) => this.saveCourse(changes)),
      )
      .subscribe();
  }

  private saveCourse(formChanges: any): Observable<Response> {
    return fromPromise(
      fetch(
        `/api/courses/${this.course.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(formChanges),
          headers: { 'content-type': 'application/json' }
        }
      )
    );
  }

  close() {
    this.dialogRef.close();
  }
}

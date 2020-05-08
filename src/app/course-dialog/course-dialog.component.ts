import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { filter } from 'rxjs/operators';
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
      .pipe(filter(() => this.form.valid))
      .subscribe((changes) => {
        const saveCourse$ = fromPromise(
          fetch(
            `/api/courses/${this.course.id}`,
            {
              method: 'PUT',
              body: JSON.stringify(changes),
              headers: { 'content-type': 'application/json' }
            }
          )
        );

        /**
         * TODO: This is an anti-pattern, we need to avoid nested subscriptions. In addition, this way we cannot
         * guarantee the latest changes will be the final results (because the operations are asynchronous)
         */
        saveCourse$.subscribe();
      });
  }

  close() {
    this.dialogRef.close();
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

export interface Answer {
  text: string;
  correct: boolean;
  toFirstPage: boolean;
  toExternalLink: boolean;
  link: string;
}

export interface Image {
  filename: string;
  contentType: string;
}

export interface LessonPage {
  lemma: string;
  htmlLemma: string;
  richLemma: any;
  question: string;
  answers: Answer[];
  images: Image[];
}

export interface Lesson {
  name: string;
  pages: LessonPage[];
}

/*
  Generated class for the LessonDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LessonDataProvider {
  lessonUrl: string = "assets/data/lesson-4.json";
  lesson: any;

  constructor(public http: HttpClient) {
    console.log('Hello LessonDataProvider Provider');
  }

  getLesson(lessonNo: number): Observable<Lesson> {
    // TODO: use lessonNo (cache with lookup based on lessonNo)
    if (this.lesson) {
      return Observable.of(this.lesson);
    } else {
      return this.http.get<LessonPage>(this.lessonUrl)
        .pipe(catchError(this.handleError))
        .map(function(lesson: Lesson) {
          this.lesson = lesson;
          return this.lesson;
        }, this);
    }
  }

  getPage(lessonNo: number, pageNo: number): Observable<LessonPage> {
    // TODO: use lessonNo (cache with lookup based on lessonNo)
    if (this.lesson) {
      return Observable.of(this.lesson.pages[pageNo]);
    } else {
      return this.http.get<LessonPage>(this.lessonUrl)
        .pipe(catchError(this.handleError))
        .map(function(lesson: Lesson) {
          this.lesson = lesson;
          return this.lesson.pages[pageNo];
        }, this);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened; please try again later.');
  }
}

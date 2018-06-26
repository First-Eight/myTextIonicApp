import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavController, NavParams } from 'ionic-angular';
import { LessonDataProvider, Lesson, LessonPage, Answer } from '../../providers/lesson-data/lesson-data';

@Component({
  selector: 'page-les',
  templateUrl: 'les.html'
})
export class LesPage {
  pageNo: number = 0;
  maxPageNo: number = 0;
  lesson: Lesson;
  page: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public lessonDataProvider: LessonDataProvider,
    public sanitizer: DomSanitizer) {
    let paramPageNo = navParams.get('pageNo');
    this.pageNo = paramPageNo ? paramPageNo : 0;
    console.log("this.pageNo=" + this.pageNo);
    // TODO: read the selected lesson and show the right page
    lessonDataProvider.getLesson(4)
      .subscribe(lesson => {
        this.lesson = lesson;
        this.maxPageNo = lesson.pages.length;
        this.setPage(lesson, this.pageNo);
      });
  }

  setPage(lesson: Lesson, pageNo: number) {
    let page: LessonPage = lesson.pages[pageNo];
    // TODO: handle '\n' in the HTML's
    this.page = {
      htmlLemmaPs: this.toPs(page.htmlLemma),
      questionPs: this.toPs(page.question),
      answers: this.transformAnswers(page.answers)
    }
  }

  toPs(html: string): SafeHtml[] {
    return html.split("\n") //
      .map((ps, index) => this.sanitizer.bypassSecurityTrustHtml(ps));
  }

  transformAnswers(pageAnswers: Answer[]) {
    // transform the answers and the other things...
    const items = ['A', 'B', 'C', 'D'];
    let answers: any[] = [];
    pageAnswers.forEach((answer, index) => {
      let newAnswer = {
        item: items[index],
        correct: answer.correct,
        toFirstPage: answer.toFirstPage,
        toExternalLink: answer.toExternalLink,
        text: answer.text,
        link: answer.link
      }
      answers.push(newAnswer);
    });
    return answers;
  }

  handleAnswer(answer: Answer, pageNo: number) {
    // TODO: log the answer given
    console.log("Given answer: " + JSON.stringify(answer));
    if (answer.toExternalLink) {
      return this.openUrl(answer.link);
    }
    if (answer.correct) {
      if (this.pageNo + 1 == this.maxPageNo) {
        return this.gotoIndex();
      }
      return this.gotoNext();
    }
    if (answer.toFirstPage) {
      return this.gotoFirst();
    }
    return this.gotoPrevious();
  }

  openUrl(url: string) {
    console.log("Open URL: " + url);
    window.open(url);
  }

  gotoIndex() {
    this.navCtrl.goToRoot({});
  }

  gotoFirst() {
    this.navCtrl.remove(1, this.navCtrl.length() - 1);
  }

  gotoPrevious() {
    if (this.navCtrl.length() == 1) {
      return this.navCtrl.goToRoot({});
    }
    return this.navCtrl.pop();
  }

  gotoNext() {
    return this.gotoPage(null, this.pageNo + 1);
  }

  gotoPage(event, pageNo) {
    // TODO: see if we can navigate at allow
    if (pageNo < 0) {
      return;
    }
    if (pageNo == this.maxPageNo) {
      return;
    }
    this.navCtrl.push(LesPage, {
      pageNo: pageNo
    });
  }

  backToTheSart() {
    this.navCtrl.popToRoot({ duration: 5000 });
  }
}

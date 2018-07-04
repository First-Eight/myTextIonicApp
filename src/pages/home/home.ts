import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LesPage } from '../les/les';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // TODO: read list of lessons from JSON-file
  lessons: any[] = [
    {
      "id": 4,
      "icon": "book",
      "name": "Voorwaardsleren",
      "file": "lesson-4.json"
    },
    {
      "id": 1,
      "icon": "book",
      "name": "Organen en cellen",
      "file": "lesson-1.json"
    }
  ];

  constructor(public navCtrl: NavController) {
  }

  lessonTapped(event, lesson) {
    console.log("Selected: ", lesson);
    this.navCtrl.push(LesPage, {
      lessonNo: lesson.id,
      pageNo: 0
    });
  }
}

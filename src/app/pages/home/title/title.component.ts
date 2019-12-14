import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  private initialLoad = false;

  constructor() { }

  ngOnInit() {
    setTimeout(this.startAnimation.bind(this), 100);
  }

  startAnimation() {
    this.initialLoad = true;
  }

  get loadedState(): string {
    return this.initialLoad ? 'loaded' : '';
  }

}

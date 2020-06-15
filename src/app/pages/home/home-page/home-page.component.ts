import { Component, OnInit, Inject } from '@angular/core';
import { TapInput } from '../../../shared/inputs/tap-input';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Start the singleton of tapinput
    const _ = new TapInput(document);
  }

  ngOnInit() {
  }

}

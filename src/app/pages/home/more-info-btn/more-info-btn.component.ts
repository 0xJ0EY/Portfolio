import { Component, OnInit } from '@angular/core';
import { CubeService } from '../../../shared/services/cube.service';

@Component({
  selector: 'app-more-info-btn',
  templateUrl: './more-info-btn.component.html',
  styleUrls: ['./more-info-btn.component.scss']
})
export class MoreInfoBtnComponent implements OnInit {

  constructor(private service: CubeService) { }

  public onFadeout() {
    this.service.fadeout();
  }

  public onFadein() {
    this.service.fadein();
  }

  ngOnInit(): void {
  }

}

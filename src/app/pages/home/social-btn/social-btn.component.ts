import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService, CubeData, CubeDataState } from '../../../shared/services/cube.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-social-btn',
  templateUrl: './social-btn.component.html',
  styleUrls: ['./social-btn.component.scss']
})
export class SocialBtnComponent implements OnInit, OnDestroy {

  private readonly START_ANIMATION_WAIT_TIME = 100;
  private readonly START_ANIMATION_TIME = 250;
  private readonly ANIMATION_TIME = 100;

  public firstLoad = true;

  private transitioning = false;
  public state: 'idle' | 'start-fadein' | 'fadein' | 'fadeout' | 'hidden' = 'hidden';

  private cubeServiceSubscription: Subscription;

  constructor(private cubeService: CubeService) {
    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onCubeChange.bind(this));
  }

  ngOnInit(): void {
    this.startFadein();
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
  }

  private onCubeChange(cubeData: CubeData) {
    switch (cubeData.state) {
      case CubeDataState.FADEOUT:
        this.fadeout();
        break;

      case CubeDataState.FADEIN:
        this.fadein();
        break;
    }
  }

  private fadeout(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.state = 'fadeout';

    setTimeout(() => {
      this.hideButton();
      this.endTransition();
    }, this.ANIMATION_TIME);
  }

  private startFadein(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    // Every animation has a 100ms wait time
    setTimeout(() => {

      this.state = 'start-fadein';

      setTimeout(() => {
        this.showButton();
        this.endTransition();

        this.firstLoad = false;
      }, this.START_ANIMATION_TIME);
    }, this.START_ANIMATION_WAIT_TIME);

  }

  private fadein(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.state = 'fadein';

    setTimeout(() => {
      this.showButton();
      this.endTransition();
    }, this.ANIMATION_TIME);
  }

  private hideButton(): void {
    this.state = 'hidden';
  }

  private showButton(): void {
    this.state = 'idle';
  }

  private canTransition(): boolean {
    return this.transitioning === false;
  }

  private startTransition(): void {
    this.transitioning = true;
  }

  private endTransition(): void {
    this.transitioning = false;
  }

}

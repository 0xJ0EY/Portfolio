import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService, CubeData, CubeDataState } from 'src/app/shared/services/cube.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-less-info-btn',
  templateUrl: './less-info-btn.component.html',
  styleUrls: ['./less-info-btn.component.scss']
})
export class LessInfoBtnComponent implements OnInit, OnDestroy {

  private readonly ANIMATION_TIME = 100;

  public state: 'idle' | 'start-fadein' | 'fadein' | 'fadeout' | 'hidden' = 'hidden';

  private cubeServiceSubscription: Subscription;

  private transitioning = false;

  constructor(
    private service: CubeService,
  ) {
    this.cubeServiceSubscription = this.service.onChange.subscribe(this.onCubeChange.bind(this));
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
  }

  public onClick(): void {
    if (this.service.currentState !== CubeDataState.FADEOUT) { return; }

    this.service.fadein();
  }

  private onCubeChange(cubeData: CubeData) {
    switch (cubeData.state) {
      case CubeDataState.FADEOUT:
        this.fadeout();
        break;
      case CubeDataState.FADEIN:
        this.fadein();
        break;
      case CubeDataState.NORMAL:
        break;
    }
  }

  private fadeout(): void {
    if (!this.canTransistion()) { return; }
    this.startTransition();

    this.state = 'fadeout';

    setTimeout(() => {
      this.showButton();
      this.endTransistion();
    }, this.ANIMATION_TIME);
  }

  private fadein(): void {
    if (!this.canTransistion()) { return; }
    this.startTransition();

    this.state = 'fadein';

    setTimeout(() => {
      this.hideButton();
      this.endTransistion();
    }, this.ANIMATION_TIME);
  }

  private canTransistion(): boolean {
    return this.transitioning === false;
  }

  private startTransition(): void {
    this.transitioning = true;
  }

  private endTransistion(): void {
    this.transitioning = false;
  }

  private showButton(): void {
    this.state = 'idle';
  }

  private hideButton(): void {
    this.state = 'hidden';
  }

  ngOnInit(): void {
  }
}

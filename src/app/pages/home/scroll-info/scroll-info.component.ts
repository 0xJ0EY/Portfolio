import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CubeService, CubeData, CubeDataState } from 'src/app/shared/services/cube.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scroll-info',
  templateUrl: './scroll-info.component.html',
  styleUrls: ['./scroll-info.component.scss']
})
export class ScrollInfoComponent implements OnInit, OnDestroy {

  private readonly ANIMATION_TIME = 100;
  private readonly SCROLL_COOLDOWN = 1000;

  public state: 'idle' | 'start-fadein' | 'fadein' | 'fadeout' | 'hidden' = 'idle';

  private transitioning = false;

  private cubeServiceSubscription: Subscription;
  private mobile: boolean;
  private currentPage = 0;
  private animState: 'next' | 'previous' | 'none';
  private lastScroll = 0;

  constructor(
    private deviceService: DeviceDetectorService,
    private cubeService: CubeService
  ) {}

  ngOnInit() {
    this.mobile = this.checkIsMobileDevice();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onCubeChange.bind(this));
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
  }

  private onCubeChange(page: CubeData): void {
    switch (page.state) {
      case CubeDataState.FADEIN:
        this.fadein();
        break;
      case CubeDataState.FADEOUT:
        this.fadeout();
        break;
      case CubeDataState.NORMAL:
        this.normal(page.index);
        break;
    }
  }

  private fadeout(): void {
    if (!this.canTransistion()) { return; }
    this.startTransition();

    this.state = 'fadeout';

    setTimeout(() => {
      this.hideComponent();
      this.endTransistion();
    }, this.ANIMATION_TIME);
  }

  private fadein(): void {
    if (!this.canTransistion()) { return; }
    this.startTransition();

    this.state = 'fadein';

    setTimeout(() => {
      this.showComponent();
      this.endTransistion();
    }, this.ANIMATION_TIME);
  }

  private normal(page: number): void {
    if (this.currentPage === page) {
      return;
    }

    if (this.currentPage < page) {
      this.startAnimation('next');
    } else {
      this.startAnimation('previous');
    }

    this.currentPage = page;
  }

  private startAnimation(state: 'next' | 'previous'): void {
    this.animState = state;

    setTimeout(this.clearAnimation.bind(this), 100);
  }

  private clearAnimation(): void {
    this.animState = 'none';
  }

  get isMobile(): boolean {
    return this.mobile;
  }

  get animationState(): 'next' | 'previous' | 'none' {
    return this.animState;
  }

  private checkIsMobileDevice(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  public canClick(): boolean {
    return this.lastScroll + this.SCROLL_COOLDOWN < Date.now();
  }

  public updateClick(): void {
    this.lastScroll = Date.now();
  }

  public onClickNext(): void {
    if (!this.canClick()) { return; }

    this.cubeService.next();
    this.updateClick();
  }

  public onClickPrevious(): void {
    if (!this.canClick()) { return; }

    this.cubeService.previous();
    this.updateClick();
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

  private showComponent(): void {
    this.state = 'idle';
  }

  private hideComponent(): void {
    this.state = 'hidden';
  }

}

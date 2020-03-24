import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CubeService } from 'src/app/shared/services/cube.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scroll-info',
  templateUrl: './scroll-info.component.html',
  styleUrls: ['./scroll-info.component.scss']
})
export class ScrollInfoComponent implements OnInit, OnDestroy {

  private readonly SCROLL_COOLDOWN = 1000;

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

  private onCubeChange(page: number): void {
    // Do not update the number on a change of the project (because it is also used for updating the language)
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

}

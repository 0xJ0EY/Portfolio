import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-scroll-info',
  templateUrl: './scroll-info.component.html',
  styleUrls: ['./scroll-info.component.scss']
})
export class ScrollInfoComponent implements OnInit {

  private mobile: boolean;

  constructor(private deviceService: DeviceDetectorService) {
  }

  ngOnInit() {
    this.mobile = this.checkIsMobileDevice();
  }

  get isMobile(): boolean {
    return this.mobile;
  }

  private checkIsMobileDevice(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

}

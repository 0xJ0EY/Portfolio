import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService, CubeData } from '../../../shared/services/cube.service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../shared/services/language.service';
import { CubeDataState } from 'src/app/shared/services/cube.service';

export interface MoreInfoCard {
  type: 'text' | 'image';
}

export class MoreInfoText implements MoreInfoCard {
  public title: string;
  public text: string;
  public type: 'text' | 'image' = 'text';
}

export class MoreInfoImage implements MoreInfoCard {
  public title: string;
  public image: string;
  public description: string;

  public type: 'text' | 'image' = 'image';
}

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss']
})
export class MoreInfoComponent implements OnInit, OnDestroy {

  private readonly ANIMATION_TIME = 100;

  public state: 'idle' | 'start-fadein' | 'fadein' | 'fadeout' | 'hidden' = 'hidden';

  private cubeServiceSubscription: Subscription;
  private langServiceSubscription: Subscription;

  private transitioning = false;

  public cards = [
    {title: 'monkaS', text: 'Lorem ipsum', type: 'text'},
    {title: 'test', image: 'https://i.imgur.com/OTzULyY.jpeg', type: 'image'}
  ];

  constructor(
    private cubeService: CubeService,
    private langService: LanguageService
  ) {
    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));
    this.langServiceSubscription = this.langService.languageObservable.subscribe(this.onLanguageChange.bind(this));
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
    this.langServiceSubscription.unsubscribe();
  }

  private onProjectChange(cubeData: CubeData): void {
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

  private onLanguageChange(lang: string): void {
    
    
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

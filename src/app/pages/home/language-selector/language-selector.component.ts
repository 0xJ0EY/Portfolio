import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CubeService, CubeData, CubeDataState } from '../../../shared/services/cube.service';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {

  private readonly START_ANIMATION_WAIT_TIME = 100;
  private readonly START_ANIMATION_TIME = 250;
  private readonly ANIMATION_TIME = 100;

  public initialLoad = true;

  private transitioning = false;
  public state: 'idle' | 'start-fadein' | 'fadein' | 'fadeout' | 'hidden' | 'mobile-fadein' | 'mobile-fadeout' | 'mobile-hidden' = 'hidden';

  public animationState = 'idle';
  public prevAnimationState = 'in';
  private currentLangIndex = this.langService.languages.indexOf(this.langService.currentLanguage) || 0;

  public languageName: string;

  private langServiceSubscription: Subscription;
  private cubeServiceSubscription: Subscription;

  constructor(private langService: LanguageService, private cubeService: CubeService) {
    this.langServiceSubscription = this.langService.languageObservable.subscribe(this.onLanguageChange.bind(this));
    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onCubeChange.bind(this));
  }

  ngOnInit() {
    this.startFadein();
  }

  private onCubeChange(cubeData: CubeData): void {
    switch (cubeData.state) {
      case CubeDataState.FADEOUT:
        this.fadeout();
        break;
      case CubeDataState.FADEIN:
        this.fadein();
        break;
    }
  }

  private onLanguageChange(): void  {
    if (this.initialLoad) { return; } // We have not yet completed the first animation
    this.reload();
  }

  ngOnDestroy(): void {
    this.langServiceSubscription.unsubscribe();
    this.cubeServiceSubscription.unsubscribe();
  }

  private updateLanguageName(): void {
    const displayLangIndex = (this.currentLangIndex + 1) % this.langService.languages.length;
    const lang = this.langService.languages[displayLangIndex];

    this.languageName = this.langService.languageNames[lang];
  }

  public onClick() {
    this.currentLangIndex = (this.currentLangIndex + 1) % this.langService.languages.length;
    const lang = this.langService.languages[this.currentLangIndex];
    this.langService.update(lang);
  }

  private reload(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.state = 'fadeout';

    setTimeout(() => {
      this.updateLanguageName();
      this.state = 'fadein';

      setTimeout(() => {
        this.showButton();
      }, this.ANIMATION_TIME);
    }, this.ANIMATION_TIME);

    this.endTransition();
  }

  private fadeout(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.state = 'mobile-fadeout';

    setTimeout(() => {
      this.hideButton();
      this.endTransition();
    }, this.ANIMATION_TIME);
  }

  private startFadein(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.updateLanguageName();

    // Every animation has a 100ms wait time
    setTimeout(() => {

      this.state = 'start-fadein';

      setTimeout(() => {
        this.showButton();
        this.endTransition();

        this.initialLoad = false;
      }, this.START_ANIMATION_TIME);
    }, this.START_ANIMATION_WAIT_TIME);

  }

  private fadein(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.state = 'mobile-fadein';

    setTimeout(() => {
      this.showButton();
      this.endTransition();
    }, this.ANIMATION_TIME);
  }

  private hideButton(): void {
    this.state = 'mobile-hidden';
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

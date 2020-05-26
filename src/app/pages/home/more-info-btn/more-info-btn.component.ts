import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService, CubeData, CubeDataState } from '../../../shared/services/cube.service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-more-info-btn',
  templateUrl: './more-info-btn.component.html',
  styleUrls: ['./more-info-btn.component.scss']
})
export class MoreInfoBtnComponent implements OnInit, OnDestroy {

  private readonly START_ANIMATION_WAIT_TIME = 100;
  private readonly START_ANIMATION_TIME = 250;
  private readonly ANIMATION_TIME = 100;

  private format = '';
  public projectName = '';
  public projectColour = '#000';

  private transitioning = false;
  public state: 'idle' | 'start-fadein' | 'fadein' | 'fadeout' | 'hidden' = 'hidden';

  private cubeServiceSubscription: Subscription;
  private langServiceSubscription: Subscription;

  constructor(
    private service: CubeService,
    private langService: LanguageService
  ) {
    this.cubeServiceSubscription = this.service.onChange.subscribe(this.onCubeChange.bind(this));
    this.langServiceSubscription = this.langService.languageObservable.subscribe(this.onLangChange.bind(this));
  }

  ngOnInit(): void {
    this.startFadein();
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
    this.langServiceSubscription.unsubscribe();
  }

  public onFadeout() {
    this.service.fadeout();
  }

  public onFadein() {
    this.service.fadein();
  }

  public onClick() {
    if (this.service.currentState !== CubeDataState.NORMAL) { return; }

    this.service.fadeout();
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
        this.reload();
        break;
    }
  }

  private onLangChange(lang: string) {
    if (lang.startsWith('en')) {
      this.format = 'More information about ';
    } else if (lang.startsWith('nl')) {
      this.format = 'Meer informatie over ';
    }

    this.updateProjectName();

    if (this.state === 'idle' || this.state === 'fadein') {
      this.reload();
    }
  }

  private updateProjectName() {
    this.projectName = this.format + this.service.currentName;
  }

  private updateProjectColour() {
    const currentProject: any = this.service.getCurrentProject;
    const colours = currentProject.cubeParams.verticalColours;

    this.projectColour = [
      'rgb(',
      colours.r, ',',
      colours.g, ',',
      colours.b, ')'
    ].join('');
  }

  private reload(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.state = 'fadeout';

    setTimeout(() => {
      this.updateProjectName();
      this.updateProjectColour();
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

    this.state = 'fadeout';

    setTimeout(() => {
      this.hideButton();
      this.endTransition();
    }, this.ANIMATION_TIME);
  }

  private startFadein(): void {
    if (!this.canTransition()) { return; }
    this.startTransition();

    this.updateProjectName();
    this.updateProjectColour();

    // Every animation has a 100ms wait time
    setTimeout(() => {

      this.state = 'start-fadein';

      setTimeout(() => {
        this.showButton();
        this.endTransition();
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

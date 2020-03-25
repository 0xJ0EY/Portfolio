import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { LanguageService } from 'src/app/shared/services/language.service';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  animations: [
    trigger('languageChange', [
      state('in', style({})),
      state('idle', style({})),
      state('out', style({})),
      transition('in => idle', [
        animate('100ms')
      ]),
      transition('idle => out', [
        animate('100ms')
      ]),
      transition('out => in', [])
    ])
  ]
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {

  private initialLoad = false;

  public currentProject = 1;
  public maxProjects = 1;

  public animationState = 'idle';
  public prevAnimationState = 'in';
  private currentLangIndex = this.langService.languages.indexOf(this.langService.currentLanguage) || 0;

  public languageName: string;

  private langServiceSubscription: Subscription;

  constructor(private langService: LanguageService) { }

  ngOnInit() {
    this.onLanguageChange();

    this.langServiceSubscription = this.langService.languageObservable.subscribe(this.onLanguageChange.bind(this));

    setTimeout(this.startAnimation.bind(this), 100);
  }

  private onLanguageChange(): void  {
    this.updateAnimationState('out');
  }

  ngOnDestroy(): void {
    this.langServiceSubscription.unsubscribe();
  }

  startAnimation() {
    this.initialLoad = true;
  }

  private validAnimState(animState: string): boolean {
    return ['in', 'out', 'idle'].includes(animState);
  }

  get concatAnimationState(): string {
    return this.animationState + ' old_' + this.prevAnimationState + ' ' + this.currentProject;
  }

  get loadedState(): string {
    return this.initialLoad ? 'loaded' : '';
  }


  private updateAnimationState(animState: string) {
    if (!this.validAnimState(animState)) { throw new Error('Unsupported state'); }

    this.prevAnimationState = this.animationState;
    this.animationState = animState;
  }

  public onAnimationStart(event: any) {
    if (event.fromState === 'out' && event.toState === 'in') {
      this.updateAnimationState('idle');
    }
  }

  public onAnimationEnd(event: any) {
    if (event.toState === 'out') {
      this.updateLanguageName();
      this.updateAnimationState('in');
    }
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

}

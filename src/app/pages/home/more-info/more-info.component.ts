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

  public cards = [];

  constructor(
    private cubeService: CubeService,
    private langService: LanguageService
  ) {
    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));
    this.langServiceSubscription = this.langService.languageObservable.subscribe(this.onLanguageChange.bind(this));
  }

  ngOnInit(): void {
    const currentProject = this.cubeService.getCurrentProject;
    this.updateCards(currentProject);
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
        const currentProject = this.cubeService.getCurrentProject;
        this.updateCards(currentProject);
        break;
    }
  }

  private onLanguageChange(lang: string): void {
    if (this.state === 'hidden') { return; }

    this.reload();
  }

  private updateCards(project: any): void {
    const lang = this.langService.currentLanguage;

    // Make a shallow copy of the "immutable" cards and add the contact card under that
    this.cards = project.cards[lang].slice(0);
    this.addContactCard();
  }

  private addContactCard(): void {

    let card: MoreInfoCard;

    switch (this.langService.currentLanguage) {
      case 'en-US':
        card = {
          title: 'Contact',
          // tslint:disable-next-line
          text: 'To get in contact with me you can send me an email to <a href=\"mailto:contact@joeyderuiter.me\">contact@joeyderuiter.me</a> or add me on linkedin <a href=\"https://www.linkedin.com/in/j-de-ruiter/\">LinkedIn</a>',
          type: 'text'
        } as MoreInfoText;
        break;
      case 'nl-NL':
        card = {
          title: 'Contact',
          // tslint:disable-next-line
          text: 'Om contact met mij op te nemen kun je mij mailen naar <a href=\"mailto:contact@joeyderuiter.me\">contact@joeyderuiter.me</a> of mij toevoegen op <a href=\"https://www.linkedin.com/in/j-de-ruiter/\">LinkedIn</a>',
          type: 'text'
        } as MoreInfoText;
        break;
    }

    this.cards.push(card);
  }

  private reload(): void {
    if (!this.canTransistion()) { return; }
    this.startTransition();

    this.state = 'fadein';

    setTimeout(() => {
      const currentProject = this.cubeService.getCurrentProject;
      this.updateCards(currentProject);

      this.state = 'fadeout';

      setTimeout(() => {
        this.showButton();
        this.endTransistion();
      }, this.ANIMATION_TIME);
    }, this.ANIMATION_TIME);
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

}

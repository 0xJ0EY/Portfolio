import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { CubeService } from 'src/app/shared/services/cube.service';
import { DOCUMENT } from '@angular/common';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectInfoComponent implements OnInit, OnDestroy {

  private cubeServiceSubscription: Subscription;

  public headerIsOpen = false;

  public headerColour: any;
  public bodyColour: any;
  public bodyHtml: string;

  public moreInfo = '';
  public projectName = '';

  private langServerSubscription: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cubeService: CubeService,
    private langService: LanguageService
  ) { }

  ngOnInit() {
    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));
    this.document.addEventListener('keydown', this.onKeypress.bind(this));

    this.langServerSubscription = this.langService.languageObservable.subscribe(this.onLanguageChange.bind(this));
  }

  private onLanguageChange(lang: string) {
    if (lang.startsWith('en')) {
      this.moreInfo = 'More information about ';
      return;
    }

    if (lang.startsWith('nl')) {
      this.moreInfo = 'Meer informatie over ';
      return;
    }
  }

  onProjectChange() {
    const currentProject = this.cubeService.getCurrentProject;

    this.updateColours(currentProject);
    this.updateProjectName(currentProject);
    this.updateProjectContent(currentProject);
  }

  private onKeypress(evt: KeyboardEvent): void {
    switch (evt.code) {
      case 'Escape':
        this.closeHeader();
        break;
    }
  }

  private updateColours(project: any): void {
    {
      const headerColour = project.cubeParams.verticalColours;
      const headerRgb = this.createRgbString(headerColour.r, headerColour.g, headerColour.b);
      this.headerColour = headerRgb;
    }

    {
      const bodyColour = project.colour;
      const bodyRgb = this.createRgbString(bodyColour.r, bodyColour.g, bodyColour.b);
      this.bodyColour = bodyRgb;
    }
  }

  private updateProjectName(project: any): void {
    this.projectName = project.name;
  }

  private updateProjectContent(project: any): void {
    const lang = this.langService.currentLanguage;
    this.bodyHtml = project.description[lang];
  }

  public toggleHeader(): void {
    this.headerIsOpen = !this.headerIsOpen;
  }

  public openHeader(): void {
    this.headerIsOpen = true;
  }

  public closeHeader(): void {
    this.headerIsOpen = false;
  }

  get headerState(): string {
    return this.headerIsOpen ? 'open no-scroll no-swipe' : 'closed';
  }

  ngOnDestroy() {
    this.cubeServiceSubscription.unsubscribe();
    this.langServerSubscription.unsubscribe();
    this.document.removeEventListener('keydown', this.onKeypress.bind(this));
  }

  private createRgbString(r: number, g: number, b: number): string {
    // Why cant this language have a decent string format
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

}

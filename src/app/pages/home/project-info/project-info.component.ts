import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { CubeService } from 'src/app/shared/services/cube.service';
import { DOCUMENT } from '@angular/common';
import { canScroll, hasClassInDOMTree } from '../../../shared/inputs/mouse-input';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectInfoComponent implements OnInit, OnDestroy {

  private cubeServiceSubscription: Subscription;

  public openHeader = false;

  public headerColour: any;
  public bodyColour: any;
  public bodyHtml: string;

  public projectName: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cubeService: CubeService
  ) { }

  ngOnInit() {
    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));
    this.document.addEventListener('keydown', this.onKeypress.bind(this));
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
      const headerColour = project.cubeParams.horizontalColours;
      const headerRgb = this.createRgbString(headerColour.r, headerColour.g, headerColour.b);
      this.headerColour = headerRgb;
    }

    {
      const bodyColour = project.cubeParams.verticalColours;
      const bodyRgb = this.createRgbString(bodyColour.r, bodyColour.g, bodyColour.b);
      this.bodyColour = bodyRgb;
    }
  }

  private updateProjectName(project: any): void {
    this.projectName = project.name;
  }

  private updateProjectContent(project: any): void {
    this.bodyHtml = project.description;
  }

  public toggleHeader(): void {
    this.openHeader = !this.openHeader;
  }

  public closeHeader(): void {
    this.openHeader = false;
  }

  get headerState(): string {
    return this.openHeader ? 'open no-scroll' : 'closed';
  }

  ngOnDestroy() {
    this.cubeServiceSubscription.unsubscribe();
    this.document.removeEventListener('keydown', this.onKeypress.bind(this));
  }

  private createRgbString(r: number, g: number, b: number): string {
    // Why cant this language have a decent string format
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

}

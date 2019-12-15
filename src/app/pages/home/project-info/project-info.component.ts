import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CubeService } from 'src/app/shared/services/cube.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit, OnDestroy {

  private cubeServiceSubscription: Subscription;

  public openHeader = false;

  public headerColour: any;
  public bodyColour: any;

  public projectName: string;

  constructor(private cubeService: CubeService) { }

  ngOnInit() {
    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));
  }

  onProjectChange() {
    const currentProject = this.cubeService.getCurrentProject;

    this.updateColours(currentProject);
    this.updateProjectName(currentProject);
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

  public toggleHeader(): void {
    this.openHeader = !this.openHeader;
  }

  get headerState(): string {
    return this.openHeader ? 'open' : 'closed';
  }

  ngOnDestroy() {
    this.cubeServiceSubscription.unsubscribe();
  }

  private createRgbString(r: number, g: number, b: number): string {
    // Why cant this language have a decent string format
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

}

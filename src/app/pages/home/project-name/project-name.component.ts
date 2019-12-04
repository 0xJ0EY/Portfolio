import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService } from 'src/app/shared/services/cube.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss']
})
export class ProjectNameComponent implements OnInit, OnDestroy {

  private cubeServiceSubscription: Subscription;
  public name = '';

  constructor(private cubeService: CubeService) { }

  ngOnInit() {
    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
  }

  private onProjectChange() {
    this.name = this.cubeService.currentName;
    console.log(this.name);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService } from 'src/app/shared/services/cube.service';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss'],
  animations: [
    trigger('animationFade', [
      state('in-out', style({
        transform: 'translate3d(0, 0, 0) scale(1.05, 1)',
      })),
      state('idle', style({
        transform: 'translate3d(0, 0, 0) scale(1, 1)',
      })),
      state('out', style({
        transform: 'translate3d(0, 0, 0) scale(1.05, 1)',
      })),
      transition('in-out => idle', [
        animate('500ms')
      ]),
      transition('idle => in-out', [
        animate('500ms')
      ]),
    ])
  ]
})
export class ProjectNameComponent implements OnInit, OnDestroy {

  private initialLoad = true;

  private cubeServiceSubscription: Subscription;
  public name = '';

  public animationState = 'in-out';

  constructor(private cubeService: CubeService) { }

  ngOnInit() {
    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));

    setTimeout(this.updateNgStateToidle.bind(this), 100);
  }

  updateNgStateToidle() {
    this.updateAnimationState('idle');
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
  }

  private onProjectChange() {
    if (this.initialLoad) {
      this.name = this.cubeService.currentName;
      this.initialLoad = false;
      return;
    }

    this.updateAnimationState('in-out');
  }

  private updateAnimationState(animState: string) {
    if (!['in-out', 'idle'].includes(animState)) {
      throw new Error('Unsupported state');
    }

    this.animationState = animState;
  }

  public onAnimationEnd(event: any) {
    if (event.fromState === 'idle' && event.toState === 'in-out') {
      this.updateProjectName();
      this.updateAnimationState('idle');
    }
  }

  private updateProjectName() {
    this.name = this.cubeService.currentName;
  }

}

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

enum AnimationState {
  IN = 'in',
  OUT = 'out',
  IDLE = 'idle'
}

@Component({
  selector: 'app-project-counter',
  templateUrl: './project-counter.component.html',
  styleUrls: ['./project-counter.component.scss'],
  animations: [
    trigger('animationChangeNumber', [
      state(AnimationState.IN, style({})),
      state(AnimationState.IDLE, style({})),
      state(AnimationState.OUT, style({})),
      transition(AnimationState.IN + ' => ' + AnimationState.IDLE, [
        animate('100ms')
      ]),
      transition(AnimationState.IDLE + ' => ' + AnimationState.OUT, [
        animate('100ms')
      ]),
      transition(AnimationState.OUT + ' => ' + AnimationState.IN, [])
    ])
  ]
})
export class ProjectCounterComponent implements OnInit, OnDestroy {

  private initialLoad = false;

  public currentProject = 1;
  public maxProjects = 1;

  public animationState = AnimationState.IDLE;
  public prevAnimationState = AnimationState.IN;

  private cubeServiceSubscription: Subscription;

  constructor(private cubeService: CubeService) { }

  ngOnInit() {
    this.maxProjects = this.cubeService.maxPage;

    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));

    setTimeout(this.startAnimation.bind(this), 100);
  }

  ngOnDestroy(): void {
    this.cubeServiceSubscription.unsubscribe();
  }

  startAnimation() {
    this.initialLoad = true;
  }

  onProjectChange() {
    this.updateAnimationState(AnimationState.OUT);
  }

  get concatAnimationState(): string {
    return this.animationState + ' old_' + this.prevAnimationState;
  }

  get loadedState(): string {
    return this.initialLoad ? 'loaded' : '';
  }

  private updateProjectName() {
    this.currentProject = this.cubeService.currentPage;
  }


  private updateAnimationState(animState: AnimationState) {
    this.prevAnimationState = this.animationState;
    this.animationState = animState;
  }

  public onAnimationStart(event: any) {
    if (event.fromState === AnimationState.OUT && event.toState === AnimationState.IN) {
      this.updateAnimationState(AnimationState.IDLE);
    }
  }

  public onAnimationEnd(event: any) {
    if (event.toState === AnimationState.OUT) {
      this.updateProjectName();
      this.updateAnimationState(AnimationState.IN);
    }
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService, CubeDataState } from 'src/app/shared/services/cube.service';
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
    trigger('animationTextFadeIn', [
      state('in', style({
        transform: 'translate3d(0, 0, 0) scale(1.05, 1)',
      })),
      state('idle', style({
        transform: 'translate3d(0, 0, 0) scale(1, 1)',
      })),
      state('out', style({
        transform: 'translate3d(0, 0, 0) scale(1.05, 1)',
      })),
      transition('in => idle', [
        animate('1s')
      ]),
      transition('idle => out', [
        animate('1s')
      ]),
      transition('out => in', [])
    ]),
  ]
})
export class ProjectNameComponent implements OnInit, OnDestroy {

  private initialLoad = true;

  private cubeServiceSubscription: Subscription;
  public name = '';

  public animationState = 'in';
  public prevAnimationState = 'in';
  public angularAnimationState = 'in';

  constructor(private cubeService: CubeService) { }

  ngOnInit() {
    this.onProjectChange();

    this.cubeServiceSubscription = this.cubeService.onChange.subscribe(this.onProjectChange.bind(this));

    setTimeout(this.startAnimation.bind(this), 100);
  }

  startAnimation() {
    this.triggerAngularAnimation('idle');
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

    this.updateAnimationState('out');
    this.triggerAngularAnimation('out');
  }

  private updateAnimationState(animState: string) {
    if (!this.validAnimState(animState)) { throw new Error('Unsupported state'); }

    this.prevAnimationState = this.animationState;
    this.animationState = animState;
  }

  get concatAnimationState() {
    return this.animationState + ' old_' + this.prevAnimationState;
  }

  private validAnimState(animState: string): boolean {
    return ['in', 'out', 'idle'].includes(animState);
  }

  private triggerAngularAnimation(animState: string) {
    if (!this.validAnimState(animState)) { throw new Error('Unsupported state'); }

    this.angularAnimationState = animState;
  }

  // A nice produceral way of defining our animation states :^)
  // Prob not the most efficient way to define states
  public onAnimationStart(event: any) {
    if (!this.validAnimState(event.fromState)) { return; }

    if (event.fromState === 'out' && this.cubeService.currentState === CubeDataState.FADEOUT) {
      return;
    }

    if (event.fromState === 'in' && event.toState === 'idle') {
      this.updateAnimationState('idle');
      return;
    }

    if (event.fromState === 'out' && event.toState === 'in') {
      this.updateAnimationState('idle');
      this.triggerAngularAnimation('idle');
      return;
    }
  }

  public onAnimationEnd(event: any) {
    if (event.toState === 'out') {
      this.triggerAngularAnimation('in');
      this.updateAnimationState('in');

      this.updateProjectName();
    }
  }

  private updateProjectName() {
    if (this.cubeService.currentState === CubeDataState.FADEOUT) {
      this.name = '';
      this.updateAnimationState('out');
      return;
    }

    this.name = this.cubeService.currentName;
  }

}

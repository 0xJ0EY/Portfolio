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
import { isInternetExplorer } from 'src/app/shared/helpers/browser';


@Component({
  selector: 'app-project-counter',
  templateUrl: './project-counter.component.html',
  styleUrls: ['./project-counter.component.scss'],
  animations: [
    trigger('animationChangeNumber', [
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
export class ProjectCounterComponent implements OnInit, OnDestroy {

  private initialLoad = false;

  public currentProject = 1;
  public maxProjects = 1;

  public animationState = 'idle';
  public prevAnimationState = 'in';

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
    // Do not update the number on a change of the project (because it is also used for updating the language)
    if (this.currentProject === this.cubeService.currentPage) {
      return;
    }

    if (!isInternetExplorer()) {
      this.updateAnimationState('out');
    } else {
      this.updateProjectName();
    }
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

  private updateProjectName() {
    this.currentProject = this.cubeService.currentPage;
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
      this.updateProjectName();
      this.updateAnimationState('in');
    }
  }

}

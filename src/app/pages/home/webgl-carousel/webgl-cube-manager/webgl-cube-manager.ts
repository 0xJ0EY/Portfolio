import { WebGLCube } from '../../../../shared/models/webgl-cube.model';
import { WebGLObjectManager, WebGLRenderObject } from '../webgl-renderer/webgl-object-manager';
import { WebGLCubeStateMoveAway, WebGLCubeStateMoveToCenter } from '../../../../shared/models/webgl-cube-state';
import { CubeService } from '../../../../shared/services/cube.service';
import { Subscription, VirtualTimeScheduler } from 'rxjs';

export interface InteractiveCubeManager {
  showPrevious(): void;
  showNext(): void;
}

enum CubeManagerState {
  Noop,
  Transisitioning
}

export class WebGLCubeManager implements InteractiveCubeManager {
  private state: CubeManagerState = CubeManagerState.Noop;

  private cubeChangeSubscription: Subscription;

  private activeCubes: WebGLCube[] = [];

  constructor(private objectManager: WebGLObjectManager, private cubeService: CubeService) {}

  public init() {
    this.cubeService.registerCubeManager(this);
    this.addCubeFromCurrentIndex();

    this.cubeChangeSubscription = this.cubeService.onChange.subscribe(this.onCubeChange.bind(this));
  }

  public onDestroy() {
    this.cubeChangeSubscription.unsubscribe();
  }

  private onCubeChange(): void {
    this.startProcess();

    this.fadeOutLastCube();

    setTimeout(() => {
      this.deleteLastCube();

      this.addCubeFromCurrentIndex();

      this.processDone();
    }, 500);
  }

  private fadeOutLastCube(): void {
    if (this.activeCubes.length <= 0) { return; }
    const fadeOutCube = this.activeCubes[0];

    fadeOutCube.setState(new WebGLCubeStateMoveAway());
  }

  private deleteLastCube(): void {
    if (this.activeCubes.length <= 0) { return; }

    const cube = this.activeCubes.splice(0, 1)[0];

    this.objectManager.remove(cube);
  }

  private addCubeFromCurrentIndex(): void {
    const cube = this.cubeService.currentCube;

    this.objectManager.add(cube);
    this.activeCubes.push(cube);
  }

  showPrevious(): void {
    if (!this.canProcess()) { return; }
    this.cubeService.previous();
  }

  showNext(): void {
    if (!this.canProcess()) { return; }
    this.cubeService.next();
  }

  private canProcess(): boolean {
    return this.state === CubeManagerState.Noop;
  }

  private startProcess(): void {
    this.state = CubeManagerState.Transisitioning;
  }

  private processDone(): void {
    this.state = CubeManagerState.Noop;
  }
}

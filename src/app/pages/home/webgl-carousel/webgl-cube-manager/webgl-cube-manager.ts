import { WebGLCube } from '../../../../shared/models/webgl-cube.model';
import { WebGLObjectManager, WebGLRenderObject } from '../webgl-renderer/webgl-object-manager';
import { WebGLCubeStateMoveAway, WebGLCubeStateMoveToCenter } from '../../../../shared/models/webgl-cube-state';

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

  private activeCubes: WebGLCube[] = [];

  constructor(private objectManager: WebGLObjectManager) {}

  public init() {
    this.addCubeFromCurrentIndex();
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

    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    const cube = new WebGLCube('/assets/Firefox.mp4', { r, g, b }, { r, g, b }, this);


    // We need a deep copy, not copy by reference because this destroys it.
    // If we do not use a reference copy, we need to find a way to keep track of our cubes in the scene. Maybe another list?

    this.objectManager.add(cube);
    this.activeCubes.push(cube);
  }

  showPrevious(): void {
    if (!this.canProcess() || !this.hasPrevious()) { return; }
    this.startProcess();

    this.fadeOutLastCube();

    setTimeout(() => {
      this.deleteLastCube();
      this.fetchPrevious();
      this.addCubeFromCurrentIndex();
      this.processDone(); // Add timeout
    }, 500);
  }

  showNext(): void {
    if (!this.canProcess() || !this.hasNext()) { return; }
    this.startProcess();

    this.fadeOutLastCube();

    setTimeout(() => {
      this.deleteLastCube();
      this.fetchNext();
      this.addCubeFromCurrentIndex();
      this.processDone(); // Add timeout
    }, 500);
  }

  private fetchPrevious(): void {
    if (this.hasPrevious()) {
      // TODO: Via Angular Service
    }
  }

  private fetchNext(): void {
    if (this.hasNext()) { 
      // TOOD: Via Angular Service
    }
  }

  private hasPrevious(): boolean {
    return true;
  }

  private hasNext(): boolean {
    return true;
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

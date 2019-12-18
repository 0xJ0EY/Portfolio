import { quintEaseOut, euclideanDistance, clamp } from '../helpers/math';
import { WebGLCube } from './webgl-cube.model';
import { WebGLInputManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';
import { MouseScroll, MouseScrollDirection } from '../inputs/mouse-input';
import { InteractiveCubeManager } from 'src/app/pages/home/webgl-carousel/webgl-cube-manager/webgl-cube-manager';
import { SwipeState } from '../inputs/touch-input';

export abstract class WebGLCubeState {

  protected parent: WebGLCube;
  protected parentInput: WebGLInputManager;

  set cube(cube: WebGLCube) {
    this.parent = cube;
  }

  set input(input: WebGLInputManager) {
    this.parentInput = input;
  }

  abstract onScroll(mouseScroll: MouseScroll, cubeManager: InteractiveCubeManager): void;
  abstract onSwipe(swipeState: SwipeState, cubeManager: InteractiveCubeManager): void;

  abstract calculateRadius(deltaTime: number, oldRadius: number): number;
  abstract calculateRotation(deltaTime: number, oldRotation: any): { x: number, y: number };
  abstract calculateScale(deltaTime: number, oldScale: any): { x: number, y: number, z: number };
}

export class WebGLCubeStateMoveAway extends WebGLCubeState {

  onSwipe(swipeState: SwipeState, cubeManager: InteractiveCubeManager): void {
    // Noop
    return;
  }

  onScroll(mouseScroll: MouseScroll, cubeManager: InteractiveCubeManager): void {
    // Noop
    return;
  }

  calculateRadius(deltaTime: number, oldRadius: any): number {
    const progress = this.calculateProgress();
    const ratio = quintEaseOut(progress);

    return oldRadius - this.parent.SPEED * deltaTime * ratio;
  }

  calculateRotation(deltaTime: number, oldRotation: any): { x: number; y: number; } {
    return oldRotation;
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    oldScale.z = 1 + this.calculateProgress() * this.parent.SCALE;
    return oldScale;
  }

  private calculateProgress(): number {
    const euclideanDist = euclideanDistance(
      this.parent.getPositionX(),
      this.parent.getPositionY(),
      this.parent.getPositionZ()
    );

    return clamp(euclideanDist / this.parent.RADIUS, 0, 1) || 0;
  }

}

export class WebGLCubeStateIdle extends WebGLCubeState {

  onSwipe(swipeState: SwipeState, cubeManager: InteractiveCubeManager): void {
    switch (swipeState) {
      case SwipeState.LEFT:
        cubeManager.showPrevious();
        break;
      case SwipeState.RIGHT:
        cubeManager.showNext();
        break;
    }
  }

  onScroll(mouseScroll: MouseScroll, cubeManager: InteractiveCubeManager): void {

    switch (mouseScroll.direction) {
      case MouseScrollDirection.Down:
        cubeManager.showNext();
        break;
      case MouseScrollDirection.Up:
        cubeManager.showPrevious();
        break;
    }
  }

  calculateRadius(deltaTime: number, oldRadius: number): number {
    return oldRadius;
  }

  calculateRotation(deltaTime: number, oldRotation: any): { x: number; y: number; } {

    let position = {x: 0, y: 0};

    if (this.parentInput.touch.canUseTouchInput()) {
      position = this.parentInput.touch.percentage;
    } else {
      position = this.parentInput.mouse.percentage;
    }

    const verticalRotation = -40 + position.x * 80;
    const horizontalRotation = -40 + position.y * 80;

    return { x: horizontalRotation, y: verticalRotation };
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    oldScale.z = 1;
    return oldScale;
  }

}

export class WebGLCubeStateMoveToCenter extends WebGLCubeState {

  onSwipe(swipeState: SwipeState, cubeManager: InteractiveCubeManager): void {
    // Noop
    return;
  }

  onScroll(mouseScroll: MouseScroll, cubeManager: InteractiveCubeManager): void {
    // Noop
    return;
  }

  calculateRadius(deltaTime: number, oldRadius: number): number {

    if (Math.round(oldRadius * 100) / 100 > 0) {
      const progress = this.calculateProgress();
      const ratio = quintEaseOut(1 - progress);

      return Math.max(oldRadius - (this.parent.SPEED * deltaTime * ratio), 0);
    } else {
      this.parent.setState(new WebGLCubeStateIdle());
      return 0;
    }
  }

  calculateRotation(deltaTime: number, oldRotation: any): { x: number; y: number; } {
    return oldRotation;
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    oldScale.z = 1 + this.calculateProgress() * this.parent.SCALE;
    return oldScale;
  }

  private calculateProgress(): number {
    const euclideanDist = euclideanDistance(
      this.parent.getPositionX(),
      this.parent.getPositionY(),
      this.parent.getPositionZ()
    );

    return clamp(euclideanDist / this.parent.RADIUS, 0, 1) || 0;
  }

}

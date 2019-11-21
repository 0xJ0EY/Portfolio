import { quintEaseOut, euclideanDistance, clamp } from '../helpers/math';
import { WebGLCube } from './webgl-cube.model';
import { WebGLInputManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';

export abstract class WebGLCubeState {

  protected parent: WebGLCube;
  protected parentInput: WebGLInputManager;

  set cube(cube: WebGLCube) {
    this.parent = cube;
  }

  set input(input: WebGLInputManager) {
    this.parentInput = input;
  }

  abstract calculateRadius(deltaTime: number, oldRadius: number): number;
  abstract calculateRotation(deltaTime: number, oldRotation: any): { x: number, y: number };
  abstract calculateScale(deltaTime: number, oldScale: any): { x: number, y: number, z: number };
}

export class WebGLCubeStateMoveAway extends WebGLCubeState {

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

  calculateRadius(deltaTime: number, oldRadius: number): number {
    return oldRadius;
  }

  calculateRotation(deltaTime: number, oldRotation: any): { x: number; y: number; } {
    const mousePosition = this.parentInput.mouse.percentage;

    const verticalRotation = -40 + mousePosition.x * 80;
    const horizontalRotation = -40 + mousePosition.y * 80;

    return { x: horizontalRotation, y: verticalRotation };
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    oldScale.z = 1;
    return oldScale;
  }

}

export class WebGLCubeStateMoveToCenter extends WebGLCubeState {

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

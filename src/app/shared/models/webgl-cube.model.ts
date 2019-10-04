import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from './webgl-object.model';
import { rotationMatrix, euclideanDistance, quadraticEaseOut, clamp, quintEaseOut } from '../helpers/math';
import { WebGLInputManager } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';

abstract class WebGLCubeState {

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

class WebGLCubeStateMoveAway extends WebGLCubeState {

  calculateRadius(deltaTime: number, oldRadius: any): number {
    throw new Error('Method not implemented.');
  }

  calculateRotation(deltaTime: number, oldRotation: any): { x: number; y: number; } {
    throw new Error('Method not implemented.');
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    throw new Error('Method not implemented.');
  }

}

class WebGLCubeStateIdle extends WebGLCubeState {

  calculateRadius(deltaTime: number, oldRadius: number): number {
    return oldRadius;
  }

  calculateRotation(deltaTime: number, oldRotation: any): { x: number; y: number; } {
    const mousePosition = this.parentInput.mouse.percentage;

    if (mousePosition.x !== 0 && mousePosition.y !== 0) {

      const verticalRotation = -45 + mousePosition.x * 90;
      const horizontalRotation = -45 + mousePosition.y * 90;

      return { x: horizontalRotation, y: verticalRotation };
    } else {
      return oldRotation;
    }
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    return oldScale;
  }

}

class WebGLCubeStateMoveToCenter extends WebGLCubeState {

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

export class WebGLCube extends WebGLObject {
  public readonly SPEED = 50;
  public readonly ROTATION_SPEED = 350;
  public readonly RADIUS = 30;
  public readonly SCALE = 10;

  private currentRadius = this.RADIUS;
  public degreeRotation = { x: 0, y: 0 };

  private rotationChanged = false;

  private rotationStartTime = 0;
  private startRotation: { x: number, y: number };
  private targetRotation: { x: number, y: number };

  private state: WebGLCubeState;

  constructor() {
    super();

    this.targetRotation = this.startRotation = this.degreeRotation;
  }

  init() {
    this.setState(new WebGLCubeStateMoveToCenter());

    const mousePosition = this.input.mouse.percentage;

    this.degreeRotation.x = -45 + mousePosition.x * 90;
    this.degreeRotation.y = -45 + mousePosition.y * 90;

    this.updateRotation(0);
    this.updatePosition(0);
  }

  getVertices(): number[] {
    return [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];
  }
  getIndices(): number[] {
    return [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];
  }

  update(deltaTime: number): void {
    this.currentRadius = this.state.calculateRadius(deltaTime, this.currentRadius);

    const oldRotation = this.degreeRotation;
    this.degreeRotation = this.state.calculateRotation(deltaTime, this.degreeRotation);

    if (
      this.degreeRotation.x !== oldRotation.x &&
      this.degreeRotation.y !== oldRotation.y
    ) {
      this.rotationChanged = true;
    }

    this.scale = this.state.calculateScale(deltaTime, this.scale);

    this.updateRotation(deltaTime);
    this.updatePosition(this.currentRadius);
  }

  setState(state: WebGLCubeState) {
    state.cube = this;
    state.input = this.input;
    this.state = state;
  }

  private updateRotation(deltaTime: number): void {

    const distanceCovered = (this.time.time - this.rotationStartTime) * this.ROTATION_SPEED;

    const xRotationDistance = Math.sqrt(this.startRotation.x ** 2 + this.targetRotation.x ** 2);
    const xRotationFraction = clamp(distanceCovered / xRotationDistance, 0, 1);
    const xRot = (1 - xRotationFraction) * this.startRotation.x + xRotationFraction * this.targetRotation.x;

    const yRotationDistance = Math.sqrt(this.startRotation.y ** 2 + this.targetRotation.y ** 2);
    const yRotationFraction = clamp(distanceCovered / yRotationDistance, 0, 1);
    const yRot = (1 - yRotationFraction) * this.startRotation.y + yRotationFraction * this.targetRotation.y;

    this.rotation.x = xRot * Math.PI / 180;
    this.rotation.y = yRot * Math.PI / 180;

    if (this.rotationChanged) {
      this.rotationChanged = false;
      this.targetRotation = this.degreeRotation;

      this.startRotation = {
        x: this.rotation.x * 180 / Math.PI,
        y: this.rotation.y * 180 / Math.PI,
      };

      this.rotationStartTime = this.time.time;
    }
  }

  private updatePosition(radius: number): void {
    const rotationMat = rotationMatrix(this.rotation.x, this.rotation.y);

    this.position.x = radius * -rotationMat.y;
    this.position.y = radius * rotationMat.x;
    this.position.z = radius * -rotationMat.z;
  }

  getVertexShader(): string {
    return vertexShaderSource;
  }

  generateAttribLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): {} {
    return {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    };
  }

  getFragmentShader(): string {
    return fragmentShaderSource;
  }

  generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): {} {
    return {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    };
  }

}

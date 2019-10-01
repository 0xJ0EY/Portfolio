import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from './webgl-object.model';
import { rotationMatrix, euclideanDistance, quadraticEaseOut, clamp } from '../helpers/math';
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

  abstract calculateRadius(deltaTime: number): number;
  abstract calculateRotation(deltaTime: number): { x: number, y: number };
}

class WebGLCubeStateMoveAway extends WebGLCubeState {

  calculateRadius(deltaTime: number): number {
    throw new Error('Method not implemented.');
  }

  calculateRotation(deltaTime: number): { x: number; y: number; } {
    throw new Error('Method not implemented.');
  }

}

class WebGLCubeStateIdle extends WebGLCubeState {

  calculateRadius(deltaTime: number): number {
    return this.parent.radius;
  }

  calculateRotation(deltaTime: number): { x: number; y: number; } {
    const mousePosition = this.parentInput.mouse.percentage;

    if (mousePosition.x !== 0 && mousePosition.y !== 0) {

      const verticalRotation = -45 + mousePosition.x * 90;
      const horizontalRotation = -45 + mousePosition.y * 90;

      return { x: horizontalRotation, y: verticalRotation };
    } else {
      return this.parent.degreeRotation;
    }
  }

}

class WebGLCubeStateMoveToCenter extends WebGLCubeState {

  calculateRadius(deltaTime: number): number {
    if (this.parent.radius > 0.1) {
      const euclideanDist = euclideanDistance(
        this.parent.getPositionX(),
        this.parent.getPositionY(),
        this.parent.getPositionZ()
      );

      const progress = clamp(euclideanDist / this.parent.startDistance, 0, 1);
      const ratio = quadraticEaseOut(1 - progress);

      return Math.max(this.parent.radius - deltaTime * this.parent.speed * ratio, 0);
    } else {
      this.parent.setState(new WebGLCubeStateIdle());
      return this.parent.radius;
    }
  }

  calculateRotation(deltaTime: number): { x: number; y: number; } {
    return this.parent.degreeRotation;
  }

}

export class WebGLCube extends WebGLObject {

  public speed = 15;
  public radius = 20;

  public degreeRotation = { x: 0, y: 0 };
  public startDistance: number;

  private state: WebGLCubeState;

  constructor() {
    super();

    this.degreeRotation.x = -30 + Math.random() * 60;
    this.degreeRotation.y = -30 + Math.random() * 60;

    this.startDistance = this.radius;

    this.updateRotation(0);
    this.updatePosition(0);
  }

  init() {
    this.setState(new WebGLCubeStateMoveToCenter());
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
    this.radius = this.state.calculateRadius(deltaTime);
    this.degreeRotation = this.state.calculateRotation(deltaTime);

    this.updateRotation(deltaTime);
    this.updatePosition(deltaTime);
  }

  setState(state: WebGLCubeState) {
    state.cube = this;
    state.input = this.input;
    this.state = state;
  }

  private updateRotation(deltaTime: number): void {
    this.rotation.x = this.degreeRotation.x * Math.PI / 180;
    this.rotation.y = this.degreeRotation.y * Math.PI / 180;
  }

  private updatePosition(deltaTime: number): void {
    const rotationMat = rotationMatrix(this.rotation.x, this.rotation.y);

    this.position.z -= deltaTime;
    // this.position.x = this.position.x + (1 * deltaTime);

    // this.position.x = rotationMat.x * this.radius;
    // this.position.y = rotationMat.y * this.radius;
    // console.log(rotationMat.z);
    // this.position.z = rotationMat.z * this.radius;
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

import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from './webgl-object.model';
import { rotationMatrix, euclideanDistance, quadraticEaseOut, clamp, quintEaseOut } from '../helpers/math';
import { WebGLInputManager } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';
import { ImageTexture, Texture, ColourTexture, VideoTexture } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-textures';

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

    const verticalRotation = -40 + mousePosition.x * 80;
    const horizontalRotation = -40 + mousePosition.y * 80;

    return { x: horizontalRotation, y: verticalRotation };
  }

  calculateScale(deltaTime: number, oldScale: any): { x: number; y: number; z: number; } {
    oldScale.z = 1;
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
  public readonly ROTATION_SPEED = 500;
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

    const height = 1.3;
    const width = height * 1.77;
    const depth = 1.25;

    return [
      // Front face
      -width, -height, depth,
      width, -height, depth,
      width,  height, depth,
      -width,  height, depth,

      // Back face
      -width, -height, -depth,
      -width, height, -depth,
      width, height, -depth,
      width, -height, -depth,

      // Top face
      -width, height, -depth,
      -width, height, depth,
      width, height, depth,
      width, height, -depth,

      -width, -height, -depth,
      width, -height, -depth,
      width, -height, depth,
      -width, -height, depth,

      // Right face
      width, -height, -depth,
      width, height, -depth,
      width, height, depth,
      width, -height, depth,

      // Left face
      -width, -height, -depth,
      -width, -height, depth,
      -width, height, depth,
      -width, height, -depth,
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
    const oldRotation = this.degreeRotation;

    this.currentRadius = this.state.calculateRadius(deltaTime, this.currentRadius);
    this.degreeRotation = this.state.calculateRotation(deltaTime, this.degreeRotation);

    if (this.rotationHasChanged(oldRotation)) {
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

  private rotationHasChanged(oldRotation: { x: number, y: number }): boolean {
    return  this.degreeRotation.x !== oldRotation.x ||
            this.degreeRotation.y !== oldRotation.y;
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
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    };
  }

  getFragmentShader(): string {
    return fragmentShaderSource;
  }

  generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): {} {
    return {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
    };
  }

  getTextures(): Texture[] {
    return [
      new VideoTexture(
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        [
          // Front
          1.0,  1.0,
          0.0,  1.0,
          0.0,  0.0,
          1.0,  0.0,
          // Back
          1.0,  1.0,
          1.0,  0.0,
          0.0,  0.0,
          0.0,  1.0,
        ]
      ),
      new ColourTexture(
        { r: 255, g: 0, b: 0 },
        [
          // Top
          0.0,  0.0,
          0.0,  1.0,
          1.0,  1.0,
          1.0,  0.0,
          // Bottom
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
        ]
      ),
      new ImageTexture(
        'https://i.imgur.com/1uznUQP.jpg',
        [
          // Right
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Left
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
        ]
      )
    ];
  }
}

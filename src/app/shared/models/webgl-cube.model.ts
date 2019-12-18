import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from './webgl-object.model';
import { rotationMatrix, clamp } from '../helpers/math';
import { Texture, ColourTexture, VideoTexture, TextureColour } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-textures';
import { WebGLCubeState, WebGLCubeStateMoveToCenter } from './webgl-cube-state';
import { InteractiveCubeManager } from '../../pages/home/webgl-carousel/webgl-cube-manager/webgl-cube-manager';
import { MouseScrollDirection } from '../inputs/mouse-input';
import { SwipeState } from '../inputs/touch-input';

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

  constructor(
    private videoUrl: string,
    private thumbnailUrl: string,
    private horizontalColours: TextureColour,
    private verticalColours: TextureColour,
    private cubeManager: InteractiveCubeManager,
  ) {
    super();

    this.targetRotation = this.startRotation = this.degreeRotation;
  }

  init() {
    this.setState(new WebGLCubeStateMoveToCenter());

    const mousePosition = this.input.mouse.percentage;

    this.degreeRotation.x = -45 + mousePosition.y * 90;
    this.degreeRotation.y = -45 + mousePosition.x * 90;

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

    ];
  }

  update(deltaTime: number): void {
    const oldRotation = this.degreeRotation;

    this.currentRadius = this.state.calculateRadius(deltaTime, this.currentRadius);
    this.degreeRotation = this.state.calculateRotation(deltaTime, this.degreeRotation);

    if (this.rotationHasChanged(oldRotation)) {
      this.rotationChanged = true;
    }

    if (this.hasSwiped()) {
      this.state.onSwipe(this.input.touch.currentSwipeState, this.cubeManager);
    }

    if (this.hasScrolled()) {
      this.state.onScroll(this.input.mouse.scroll, this.cubeManager);
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

  private hasSwiped() {
    return this.input.touch.currentSwipeState !== SwipeState.NONE;
  }

  private hasScrolled() {
    return this.input.mouse.scroll.direction !== MouseScrollDirection.None;
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
        this.videoUrl,
        this.thumbnailUrl,
        [
          // Front
          0.0,  1.0,
          1.0,  1.0,
          1.0,  0.0,
          0.0,  0.0,
        ]
      ),
      new ColourTexture(
        this.horizontalColours,
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
      new ColourTexture(
        this.verticalColours,
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

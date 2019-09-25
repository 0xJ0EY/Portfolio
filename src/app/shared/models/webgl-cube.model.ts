import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from './webgl-object.model';
import { mat4, vec3, quat } from 'gl-matrix';
import { rotationMatrix, euclideanDistance, quadraticEaseOut, cubicEaseOut, quintEaseOut, clamp } from '../helpers/math';

export class WebGLCube extends WebGLObject {

  private speed = 15;
  private radius = 20;

  private degreeRotation = { x: 0, y: 0 };
  private startDistance: number;

  constructor() {
    super();

    this.degreeRotation.x = -30 + Math.random() * 60;
    this.degreeRotation.y = -30 + Math.random() * 60;

    this.startDistance = this.radius;

    this.updateRotation();
    this.updatePosition();
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
    this.updateRotation();
    this.updatePosition();

    if (this.radius > 0) {
      const progress = clamp(this.calculateCurrentDistance() / this.startDistance, 0, 1);
      const ratio = quadraticEaseOut(1 - progress);

      this.radius -= deltaTime * (this.speed * ratio);
    } else {
      this.radius = 0;
    }
  }

  private updateRotation(): void {
    this.rotation.x = this.degreeRotation.x * Math.PI / 180;
    this.rotation.y = this.degreeRotation.y * Math.PI / 180;
  }

  private updatePosition(): void {
    const rotationMat = rotationMatrix(this.rotation.x, this.rotation.y);

    this.position.x = rotationMat.x * -this.radius;
    this.position.y = rotationMat.y * -this.radius;
    this.position.z = rotationMat.z * -this.radius;
  }

  private calculateCurrentDistance(): number {
    return euclideanDistance(this.position.x, this.position.y, this.position.z);
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

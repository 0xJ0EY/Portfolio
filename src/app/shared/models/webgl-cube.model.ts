import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from "./webgl-object.model";

export class WebGLCube extends WebGLObject {

  private speed: number = 5;

  constructor() {
    super();

    this.position.x = -5 + Math.random() * 10;
    this.position.y = -5 + Math.random() * 10;
    this.position.z = -10;

    // Set the X and Y rotation axis in radians
    this.rotation.x = Math.atan(this.position.x / this.position.z) || 0; // Yaw
    this.rotation.y = Math.atan(this.position.y / this.position.z) || 0; // Pitch

    console.log(this.rotation.x * 180/Math.PI, this.rotation.y * 180/Math.PI);
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

    // Euclidean distance
    const euclideanDistance = Math.sqrt(this.position.x**2 + this.position.y**2 + this.position.z**2);

    const cords = {
      x: Math.sin(this.rotation.x) * Math.cos(this.rotation.y),
      y: Math.sin(this.rotation.y),
      z: Math.cos(this.rotation.x)
    }

    if (this.position.z <= 0) {
      this.position.x += cords.x * this.speed * deltaTime;
      this.position.y += cords.y * this.speed * deltaTime;
      this.position.z += cords.z * this.speed * deltaTime;
    }

    console.log(this.position);
  }

  getVertexShader(): string {
    return vertexShaderSource;
  }

  generateAttribLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): {} {
    return {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    }
  }

  getFragmentShader(): string {
    return fragmentShaderSource;
  }

  generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): {} {
    return {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    }
  }

}

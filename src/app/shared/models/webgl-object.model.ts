export abstract class WebGLObject {

  protected position = { x: 0, y: 0, z: 0 }
  protected rotation = { x: 0, y: 0, z: 0 }

  getPositionX(): number { return this.position.x };
  getPositionY(): number { return this.position.y };
  getPositionZ(): number { return this.position.z };

  getRotationX(): number { return this.rotation.x };
  getRotationY(): number { return this.rotation.y };
  getRotationZ(): number { return this.rotation.z };
  
  abstract getVertices(): number[];
  abstract getIndices(): number[];

  abstract getVertexShader(): string;
  abstract generateAttribLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

  abstract getFragmentShader(): string;
  abstract generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

  update(deltaTime: number) {}

  delete() {}

}
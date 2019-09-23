export abstract class WebGLObject {

  protected position = { x: 0, y: 0, z: 0 }
  protected rotation = { x: 0, y: 0, z: 0 }
  protected scale = { x: 1, y: 1, z: 1 }

  getPositionX(): number { return this.position.x };
  getPositionY(): number { return this.position.y };
  getPositionZ(): number { return this.position.z };

  getRotationX(): number { return this.rotation.x };
  getRotationY(): number { return this.rotation.y };
  getRotationZ(): number { return this.rotation.z };

  getScaleX(): number { return this.scale.x };
  getScaleY(): number { return this.scale.y };
  getScaleZ(): number { return this.scale.y };
  
  abstract getVertices(): number[];
  abstract getIndices(): number[];

  abstract getVertexShader(): string;
  abstract generateAttribLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

  abstract getFragmentShader(): string;
  abstract generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

  update(deltaTime: number) {}

  delete() {}

}
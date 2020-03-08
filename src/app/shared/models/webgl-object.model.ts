import { WebGLInputManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';
import { WebGLTimeManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-time-manager';
import { WebGLObjectManager, WebGLRenderObject } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-object-manager';
import { Texture } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-textures';


export abstract class WebGLObject {

  protected position = { x: 0, y: 0, z: 0 };
  protected rotation = { x: 0, y: 0, z: 0 };
  protected scale = { x: 1, y: 1, z: 1 };
  protected input: WebGLInputManager;
  protected time: WebGLTimeManager;
  protected objectManager: WebGLObjectManager;
  protected renderObject: WebGLRenderObject;

  setInput(input: WebGLInputManager): void {
    this.input = input;
  }

  setTime(time: WebGLTimeManager): void {
    this.time = time;
  }

  setObjectManager(objectManager: WebGLObjectManager): void {
    this.objectManager = objectManager;
  }

  setRenderObject(object: WebGLRenderObject): void {
    this.renderObject = object;
  }

  getRenderObject(): WebGLRenderObject {
    return this.renderObject;
  }

  getPositionX(): number { return this.position.x; }
  getPositionY(): number { return this.position.y; }
  getPositionZ(): number { return this.position.z; }

  getRotationX(): number { return this.rotation.x; }
  getRotationY(): number { return this.rotation.y; }
  getRotationZ(): number { return this.rotation.z; }

  getScaleX(): number { return this.scale.x; }
  getScaleY(): number { return this.scale.y; }
  getScaleZ(): number { return this.scale.z; }

  abstract getVertices(): number[];
  abstract getIndices(): number[];

  abstract getVertexShader(): string;
  abstract generateAttribLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

  abstract getFragmentShader(): string;
  abstract generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

  abstract getTextures(): Texture[];

  init() {}

  update(deltaTime: number) {}

  delete() {
    this.input = null;
    this.time = null;
    this.objectManager = null;
  }

}

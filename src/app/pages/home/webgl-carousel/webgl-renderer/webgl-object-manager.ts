import { WebGLObject } from 'src/app/shared/models/webgl-object.model';
import { WebGLInputManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';
import { WebGLTimeManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-time-manager';
import { Texture, AnimatedTexture, isAnimatedTexture } from './webgl-textures';

export class WebGLRenderObject {
  public shaderProgram: WebGLProgram;
  public vertexShader: WebGLShader;
  public fragmentShader: WebGLShader;
  public programInfo: any;
  public buffers: any;
  public textures: Texture[];
  public object: WebGLObject;
}

export class WebGLObjectManager {

  private readonly inputManager = new WebGLInputManager(this.document, this.gl.canvas);
  private readonly timeManager = new WebGLTimeManager();

  private objects: WebGLRenderObject[] = [];

  constructor(private gl: WebGLRenderingContext, private document: Document) {}

  get renderObjects(): WebGLRenderObject[] {
    return this.objects;
  }

  public add(object: WebGLObject): WebGLRenderObject {
    object.setInput(this.inputManager);
    object.setTime(this.timeManager);
    object.setObjectManager(this);
    object.init();

    const renderObject = new WebGLRenderObject();
    object.setRenderObject(renderObject);

    const shaders = this.createProgram(object.getVertexShader(), object.getFragmentShader());

    renderObject.object = object;
    renderObject.vertexShader = shaders[0];
    renderObject.fragmentShader = shaders[1];
    renderObject.shaderProgram = shaders[2];

    // Load textures
    renderObject.textures = [];

    object.getTextures().forEach(texture => {
      texture.renderTexture(this.gl);
      renderObject.textures.push(texture);
    });

    renderObject.programInfo = {
      program: renderObject.shaderProgram,
      attribLocations: renderObject.object.generateAttribLocations(this.gl, renderObject.shaderProgram),
      uniformLocations: renderObject.object.generateUniformLocations(this.gl, renderObject.shaderProgram),
    };

    renderObject.buffers = this.initBuffers(renderObject.object);

    this.objects.push(renderObject);
    return renderObject;
  }

  private createProgram(vertexShaderSrc: string, fragmentShaderSrc: string): [WebGLShader, WebGLShader, WebGLProgram] {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);

    const shaderProgram: WebGLProgram = this.gl.createProgram();

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);

    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
    }

    return [vertexShader, fragmentShader, shaderProgram];
  }

  private loadShader(type: GLenum, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);

    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + error);
    }

    return shader;
  }

  private initBuffers(object: WebGLObject): any {
    // Position buffer
    const positionBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.getVertices()), this.gl.STATIC_DRAW);

    // Texture buffer
    const textureCoordBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoords = object.getTextures()
                                .map(x => x.getTextureCoords())
                                .reduce((x, y) => x.concat(y));

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);

    // Indices buffer
    const indexBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.getIndices()), this.gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      textureCoords: textureCoordBuffer,
      indices: indexBuffer
    };
  }

  public remove(object: WebGLObject): void {
    const renderObj = object.getRenderObject();

    this.gl.deleteShader(renderObj.vertexShader);
    this.gl.deleteShader(renderObj.fragmentShader);
    this.gl.deleteProgram(renderObj.shaderProgram);

    renderObj.textures.map(t => t.remove(this.gl));

    // Delete the WebGLObject
    object.delete();

    // Remove the WebGLRenderObject
    const index = this.objects.indexOf(renderObj);
    this.objects.splice(index, 1);
  }

  // Update the inner objects
  public update(deltaTime: number): void {
    this.timeManager.add(deltaTime);
    this.objects.forEach(val => {
      val.object.update(deltaTime);

      val.textures
        .filter(texture => isAnimatedTexture(texture))
        .forEach(texture => (texture as AnimatedTexture).update(this.gl));
    });

    // Clear old inputs by updating the inputmanager
    this.inputManager.update();
  }

  public clear(): void {
    this.objects = [];
  }

  public onDestroy() {
    this.inputManager.onDestroy();
  }

}

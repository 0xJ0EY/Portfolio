import { WebGLObject } from 'src/app/shared/models/webgl-object.model';
import { WebGLInputManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';
import { WebGLTimeManager } from 'src/app/pages/home/webgl-carousel/webgl-renderer/webgl-time-manager';
import { isPowerOf2 } from 'src/app/shared/helpers/math';

export class WebGLRenderObject {
  public shaderProgram: WebGLProgram;
  public programInfo: any;
  public buffers: any;
  public texture: any;
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

  public add(object: WebGLObject): void {
    object.setInput(this.inputManager);
    object.setTime(this.timeManager);
    object.setObjectManager(this);
    object.init();

    const renderObject = new WebGLRenderObject();

    renderObject.object = object;
    renderObject.shaderProgram = this.createProgram(object.getVertexShader(), object.getFragmentShader());
    renderObject.texture = this.loadTexture(object.getTexture());

    renderObject.programInfo = {
      program: renderObject.shaderProgram,
      attribLocations: renderObject.object.generateAttribLocations(this.gl, renderObject.shaderProgram),
      uniformLocations: renderObject.object.generateUniformLocations(this.gl, renderObject.shaderProgram),
    };

    renderObject.buffers = this.initBuffers(renderObject.object);

    this.objects.push(renderObject);
  }

  private createProgram(vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);

    const shaderProgram: WebGLProgram = this.gl.createProgram();

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);

    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
  }

  private loadShader(type: GLenum, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);

    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
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
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.getTextureCoordinates()), this.gl.STATIC_DRAW);

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

  private loadTexture(url: string): WebGLTexture | null {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    const mipmapLevel = 0;
    const internalFormat = this.gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.gl.RGBA;
    const srcType = this.gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D, mipmapLevel, internalFormat,
      width, height, border, srcFormat, srcType, pixel
    );

    const image = new Image();
    image.onload = () => {

      console.log(image)

      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, mipmapLevel, internalFormat,
        srcFormat, srcType, image
      );

      // TODO: Might have to set the way the mipmap is rendered;

      console.log(width, height);
      console.log(isPowerOf2(width), isPowerOf2(height));

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
      } else {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      }
    };

    image.crossOrigin = '';
    image.src = url;

    return texture;
  }

  public remove(object: WebGLObject): void {
    // TODO
  }

  // Update the inner objects
  public update(deltaTime: number): void {
    this.timeManager.add(deltaTime);
    this.objects.forEach(val => val.object.update(deltaTime));
  }

  public clear(): void {
    this.objects = [];
  }

  public onDestroy() {
    this.inputManager.onDestroy();
  }

}

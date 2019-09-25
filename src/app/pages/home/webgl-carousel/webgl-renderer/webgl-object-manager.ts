import { WebGLObject } from 'src/app/shared/models/webgl-object.model';

export class WebGLRenderObject {
  public shaderProgram: WebGLProgram;
  public programInfo: any;
  public buffers: any;
  public object: WebGLObject;
}

export class WebGLObjectManager {

  private objects: WebGLRenderObject[] = [];

  constructor(private gl: WebGLRenderingContext) {}

  get renderObjects(): WebGLRenderObject[] {
    return this.objects;
  }

  public add(object: WebGLObject): void {

    const renderObject = new WebGLRenderObject();

    renderObject.object = object;
    renderObject.shaderProgram = this.createProgram(object.getVertexShader(), object.getFragmentShader());

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
    const positionBuffer = this.gl.createBuffer();

    // Select the position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.getVertices()), this.gl.STATIC_DRAW);


    const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];

    // Convert the array of colors into a table for all the vertices.

    let colors = [];

    for (let j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];

      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.getIndices()), this.gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer
    };
  }

  public remove(object: WebGLObject): void {
    // TODO
  }

  // Update the inner objects
  public update(deltaTime: number): void {
    this.objects.forEach(val => val.object.update(deltaTime));
  }

  public clear(): void {
    this.objects = [];
  }

}

import { mat4 } from 'gl-matrix';
import { WebGLObjectManager, WebGLRenderObject } from './webgl-object-manager';

export class WebGLRenderer {

  private scale: number;

  constructor(
    private gl: WebGLRenderingContext,
    private objectManager: WebGLObjectManager,
    private devicePixelRatio
  ) {
    this.scale = this.objectScaleOnWidth();
  }

  resize() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.scale = this.objectScaleOnWidth();
  }

  private objectScaleOnWidth() {
    const width = this.gl.canvas.width / this.devicePixelRatio;

    if (width > 800) {
      return 1;
    } else if (width > 800) { // 800 - 601
      return .90;
    } else if (width > 600) { // 401 - 600
      return .80;
    } else { // < 400
      return .7;
    }
  }

  update() {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.STENCIL_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

    this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.REPLACE);
    this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xFF);
    this.gl.stencilMask(0xFF);

    const projectionMatrix = mat4.create();

    this.updateCamera(projectionMatrix);

    this.renderObjects(projectionMatrix);

    this.gl.stencilFunc(this.gl.NOTEQUAL, 1, 0xFF);
    this.gl.stencilMask(0x00);
    this.gl.disable(this.gl.DEPTH_TEST);

    this.renderBorderObject(projectionMatrix);
  }

  private updateCamera(projectionMatrix: mat4): void {
    const fov = 50 * Math.PI / 180;
    const aspect = this.gl.canvas.width / this.gl.canvas.height;
    const zNear = .1;
    const zFar = 100;

    // Set camera perspective
    mat4.perspective(
      projectionMatrix,
      fov,
      aspect,
      zNear,
      zFar
    );

    // Move camera back
    mat4.translate(
      projectionMatrix,
      projectionMatrix,
      [
        0,
        0,
        -8
      ]
    );
  }

  private translateObject(modelViewMatrix: mat4, renderObject: WebGLRenderObject): void {
    mat4.translate(
      modelViewMatrix,
      modelViewMatrix,
      [
        renderObject.object.getPositionX(),
        renderObject.object.getPositionY(),
        renderObject.object.getPositionZ(),
      ]
    );
  }

  private rotateObject(modelViewMatrix: mat4, renderObject: WebGLRenderObject): void {
    mat4.rotateX(modelViewMatrix, modelViewMatrix, renderObject.object.getRotationX());
    mat4.rotateY(modelViewMatrix, modelViewMatrix, renderObject.object.getRotationY());
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, renderObject.object.getRotationZ());
  }

  private scaleObjects(modelViewMatrix: mat4, renderObject: WebGLRenderObject, scaleFactor: number): void {
    mat4.scale(
      modelViewMatrix,
      modelViewMatrix,
      [
        renderObject.object.getScaleX() * this.scale * scaleFactor,
        renderObject.object.getScaleY() * this.scale * scaleFactor,
        renderObject.object.getScaleZ() * this.scale * scaleFactor
      ]
    );
  }

  private setupRenderBuffers(modelViewMatrix: mat4, renderObject: WebGLRenderObject, projectionMatrix: mat4) {
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
      const numComponents = 3;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderObject.buffers.position);
      this.gl.vertexAttribPointer(
        renderObject.programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(
          renderObject.programInfo.attribLocations.vertexPosition
      );
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
      const numComponents = 2;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderObject.buffers.textureCoords);
      this.gl.vertexAttribPointer(
        renderObject.programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );

      this.gl.enableVertexAttribArray(renderObject.programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL which indices to use to index the vertices
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, renderObject.buffers.indices);

    // Tell WebGL to use our program when drawing
    this.gl.useProgram(renderObject.programInfo.program);

    // Set the shader uniforms
    this.gl.uniformMatrix4fv(
      renderObject.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );

    this.gl.uniformMatrix4fv(
      renderObject.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
  }

  private renderObjects(projectionMatrix: mat4): void {
    this.objectManager.renderObjects.forEach((renderObject) => {
      const modelViewMatrix = mat4.create();

      this.translateObject(modelViewMatrix, renderObject);
      this.rotateObject(modelViewMatrix, renderObject);
      this.scaleObjects(modelViewMatrix, renderObject, 1);

      this.setupRenderBuffers(modelViewMatrix, renderObject, projectionMatrix);

      let sidesDrawn = 0;

      renderObject.textures.forEach(texture => {

        const vertexCount = 6;
        const textureCoordCount = 8;
        const sides = texture.getTextureCoords().length / textureCoordCount;

        const type = this.gl.UNSIGNED_SHORT;
        const UNSIGNED_SHORT_SIZEOF_IN_BYTES = 2;

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.getTexture());

        for (let i = 0; i  < sides; i++) {

          const offset = (sidesDrawn + i) * vertexCount;

          this.gl.drawElements(
            this.gl.TRIANGLES,
            vertexCount,
            type,
            offset * UNSIGNED_SHORT_SIZEOF_IN_BYTES
          );
        }

        sidesDrawn += sides;
      });

    });
  }

  private renderBorderObject(projectionMatrix): void {
    this.objectManager.renderObjects.forEach((renderObject) => {
      const modelViewMatrix = mat4.create();

      this.translateObject(modelViewMatrix, renderObject);
      this.rotateObject(modelViewMatrix, renderObject);
      this.scaleObjects(modelViewMatrix, renderObject, 1.03);

      this.setupRenderBuffers(modelViewMatrix, renderObject, projectionMatrix);

      let sidesDrawn = 0;

      renderObject.textures.forEach(texture => {

        const vertexCount = 6;
        const textureCoordCount = 8;
        const sides = texture.getTextureCoords().length / textureCoordCount;

        const type = this.gl.UNSIGNED_SHORT;
        const UNSIGNED_SHORT_SIZEOF_IN_BYTES = 2;

        for (let i = 0; i  < sides; i++) {

          const offset = (sidesDrawn + i) * vertexCount;

          this.gl.drawElements(
            this.gl.TRIANGLES,
            vertexCount,
            type,
            offset * UNSIGNED_SHORT_SIZEOF_IN_BYTES
          );
        }

        sidesDrawn += sides;
      });

    });
  }

}

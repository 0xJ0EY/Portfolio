import { mat4 } from 'gl-matrix';
import { WebGLObjectManager } from './webgl-object-manager';

export class WebGLRenderer {

  private scale: number;

  constructor(private gl: WebGLRenderingContext, private objectManager: WebGLObjectManager) {
    this.scale = this.objectScaleOnWidth();
  }

  resize() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.scale = this.objectScaleOnWidth();
  }

  private objectScaleOnWidth() {
    const width = this.gl.canvas.width;

    if (width > 800) {
      return 1;
    } else if (width > 600) { // 800 - 601
      return .75;
    } else if (width > 400) { // 401 - 600
      return .5;
    } else { // < 400
      return .4;
    }
  }

  update() {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Our FOV is currently 45, but subject to change
    const fov = 50 * Math.PI / 180;
    const aspect = this.gl.canvas.width / this.gl.canvas.height;
    const zNear = .1;
    const zFar = 100;

    const projectionMatrix = mat4.create();

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

    this.objectManager.renderObjects.forEach((renderObject) => {
      const modelViewMatrix = mat4.create();

      mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [
          renderObject.object.getPositionX(),
          renderObject.object.getPositionY(),
          renderObject.object.getPositionZ(),
        ]
      );

      mat4.rotateX(modelViewMatrix, modelViewMatrix, renderObject.object.getRotationX());
      mat4.rotateY(modelViewMatrix, modelViewMatrix, renderObject.object.getRotationY());
      mat4.rotateZ(modelViewMatrix, modelViewMatrix, renderObject.object.getRotationZ());

      mat4.scale(
        modelViewMatrix,
        modelViewMatrix,
        [
          renderObject.object.getScaleX() * this.scale,
          renderObject.object.getScaleY() * this.scale,
          renderObject.object.getScaleZ() * this.scale
        ]
      );

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

}

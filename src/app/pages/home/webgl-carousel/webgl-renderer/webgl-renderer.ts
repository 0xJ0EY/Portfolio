import { mat4 } from "gl-matrix";
import { WebGLObjectManager } from './webgl-object-manager';

export class WebGLRenderer {

  constructor(private gl: WebGLRenderingContext, private objectManager: WebGLObjectManager) {}

  resize() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  update() {
    
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clearDepth(1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Our FOV is currently 45, but subject to change
    const fov = 45 * Math.PI / 180;
    const aspect = this.gl.canvas.width / this.gl.canvas.height;           
    const zNear = .1;
    const zFar = 100;
    
    const projectionMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix,
      fov,
      aspect,
      zNear,
      zFar
    );

    this.objectManager.renderObjects.forEach((renderObject) => {
      const modelViewMatrix = mat4.create();

      mat4.translate(
        modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [ // amount to translate
          renderObject.object.getPositionX(),
          renderObject.object.getPositionY(),
          renderObject.object.getPositionZ() - 10,
        ]
      );

      mat4.rotate(
        modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        renderObject.object.getRotationZ(),     // amount to rotate in radians
        [ // axis to rotate around (Z)
          0, 
          0, 
          1
        ]   
      );

      mat4.rotate(
        modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        renderObject.object.getRotationX(),// amount to rotate in radians
        [ // axis to rotate around (X)
          0,
          1,
          0
        ]
      );

      mat4.rotate(
        modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        renderObject.object.getRotationY(),// amount to rotate in radians
        [ // axis to rotate around (Y)
          -1,
          0,
          0
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
        const numComponents = 4;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderObject.buffers.color);
        this.gl.vertexAttribPointer(
          renderObject.programInfo.attribLocations.vertexColor,
          numComponents,
          type,
          normalize,
          stride,
          offset
        );

        this.gl.enableVertexAttribArray(
          renderObject.programInfo.attribLocations.vertexColor
        );
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

      {
        const vertexCount = 36;
        const type = this.gl.UNSIGNED_SHORT;
        const offset = 0;
        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
      }
    });

  }
    
}
import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from "./webgl-object.model";

export class WebGLCube implements WebGLObject {

    private x = (Math.random() * 10) - 5;
    private y = (Math.random() * 10) - 5;
    private z = -10 - (Math.random() * 10);

    private rotX = Math.random() * (Math.PI * 2);
    private rotY = Math.random() * (Math.PI * 2);
    private rotZ = Math.random() * (Math.PI * 2);

    getPositionX(): number {
        return this.x;
    }    
    getPositionY(): number {
        return this.y;
    }
    getPositionZ(): number {
        return this.z;
    }
    getRotationX(): number {
        return this.rotX;
    }
    getRotationY(): number {
        return this.rotY;
    }
    getRotationZ(): number {
        return this.rotZ;
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

        this.rotX += deltaTime;
        this.rotY += deltaTime;
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

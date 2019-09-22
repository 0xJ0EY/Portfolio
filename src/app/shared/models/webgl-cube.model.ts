import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLObject } from "./webgl-object.model";

export class WebGLCube extends WebGLObject {

    constructor() {
        super();

        this.position.x = (Math.random() * 10) - 5;
        this.position.y = (Math.random() * 10) - 5;
        this.position.z = -10 - (Math.random() * 10);

        this.rotation.x = Math.random() * (Math.PI * 2);
        this.rotation.y = Math.random() * (Math.PI * 2);
        this.rotation.z = Math.random() * (Math.PI * 2);
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
        this.rotation.x += deltaTime;
        this.rotation.y += deltaTime;
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

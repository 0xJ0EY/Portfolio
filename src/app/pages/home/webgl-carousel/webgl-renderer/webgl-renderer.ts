import vertexShaderSource from '!!raw-loader!src/app/shared/shaders/vertex-shader.vert';
import fragmentShaderSource from '!!raw-loader!src/app/shared/shaders/fragment-shader.frag';
import { WebGLCube } from '../../../../shared/models/webgl-cube.model';
import { mat4 } from "gl-matrix"

export class WebGLRenderer {

    constructor(private gl: WebGLRenderingContext) {}

    private shaderProgram: WebGLProgram;
    private programInfo: any;
    private buffers: any;

    private cubeRotation = 0;

    init() {
        this.shaderProgram = this.initShaderProgram(vertexShaderSource, fragmentShaderSource);

        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            },
        }

        this.buffers = this.initBuffers();
    }

    resize() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    update(deltaTime: number) {
        // Draw the scene
        
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

        mat4.perspective(projectionMatrix,
                   fov,
                   aspect,
                   zNear,
                   zFar);

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            [-0.0, 0.0, -6.0]);  // amount to translate
        mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                this.cubeRotation,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                this.cubeRotation * .7,// amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (X)

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 3;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(
                this.programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);

            this.gl.enableVertexAttribArray(
                this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        // Tell WebGL to use our program when drawing

        this.gl.useProgram(this.programInfo.program);

        // Set the shader uniforms

        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);

        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const vertexCount = 36;
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        }

        // Update the rotation for the next draw

        this.cubeRotation += deltaTime;
                

    }

    private initBuffers() : any {
        const positionBuffer = this.gl.createBuffer();

        // Select the position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        const cube = new WebGLCube();

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cube.getVertices()), this.gl.STATIC_DRAW)


        const faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red
            [0.0,  1.0,  0.0,  1.0],    // Top face: green
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0],    // Left face: purple
        ];
    
        // Convert the array of colors into a table for all the vertices.
    
        var colors = [];
    
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
        
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }
    
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.getIndices()), this.gl.STATIC_DRAW);

        return {
            'position': positionBuffer,
            'color': colorBuffer,
            'indices': indexBuffer
        };
    }

    private initShaderProgram(vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram {
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
            throw new Error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader))
        }

        return shader;
    }
    
}
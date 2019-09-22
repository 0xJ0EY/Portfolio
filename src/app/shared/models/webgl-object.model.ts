export abstract class WebGLObject {

    abstract getPositionX(): number;
    abstract getPositionY(): number;
    abstract getPositionZ(): number;

    abstract getRotationX(): number;
    abstract getRotationY(): number;
    abstract getRotationZ(): number;
    
    abstract getVertices(): number[];
    abstract getIndices(): number[];

    abstract getVertexShader(): string;
    abstract generateAttribLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

    abstract getFragmentShader(): string;
    abstract generateUniformLocations(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): any;

    update(deltaTime: number) {}

}
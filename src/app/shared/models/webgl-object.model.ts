export interface WebGLObject {

    getPositionX(): number;
    getPositionY(): number;
    getPositionZ(): number;

    getRotationX(): number;
    getRotationY(): number;
    getRotationZ(): number;
    
    getVertices(): number[];
    getIndices(): number[];

}
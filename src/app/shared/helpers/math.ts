export function rotationMatrix(x: number, y: number): any {
  return {
    z: Math.cos(x) * Math.cos(y),
    x: Math.sin(x),
    y: Math.sin(y)
  };
}

export function clamp(value: number, min: number, max: number): number {
  return value > max ? max : value < min ? min : value;
}

export function euclideanDistance(x: number, y: number, z: number): number {
  return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}

export function cubicEaseOut(t: number): number {
  return 1 - t * t * t;
}

export function quadraticEaseOut(t: number): number {
  return 1 - t * t * t * t;
}

export function quintEaseOut(t: number): number {
  return 1 - t * t * t * t * t;
}

import { MouseInput } from '../../../../shared/inputs/mouse-input';
import { KeyboardInput } from '../../../../shared/inputs/keyboard-input';

export interface WebGLInput {
  onDestroy(): void;
}

export class WebGLInputManager implements WebGLInput {
  public readonly mouse: MouseInput;
  public readonly keyboard = new KeyboardInput();

  constructor(private document: Document, private canvas: HTMLCanvasElement | OffscreenCanvas) {
    this.mouse = new MouseInput(this.canvas as HTMLCanvasElement);
  }

  public update(): void {
    this.mouse.release();
  }

  public onDestroy(): void {
    this.mouse.onDestroy();
  }
}

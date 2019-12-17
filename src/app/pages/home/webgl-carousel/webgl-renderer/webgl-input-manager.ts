import { MouseInput } from '../../../../shared/inputs/mouse-input';
import { KeyboardInput } from '../../../../shared/inputs/keyboard-input';
import { TouchInput } from '../../../../shared/inputs/touch-input';

export interface WebGLInput {
  onDestroy(): void;
}

export class WebGLInputManager implements WebGLInput {
  public readonly mouse: MouseInput;
  public readonly touch: TouchInput;
  public readonly keyboard = new KeyboardInput();

  constructor(private document: Document, private canvas: HTMLCanvasElement | OffscreenCanvas) {
    this.mouse = new MouseInput(this.document, this.canvas as HTMLCanvasElement);
    this.touch = new TouchInput(this.document, this.canvas as HTMLCanvasElement);
  }

  public update(): void {
    this.mouse.release();
  }

  public onDestroy(): void {
    this.mouse.onDestroy();
    this.touch.onDestroy();
  }
}

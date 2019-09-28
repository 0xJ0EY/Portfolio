import { WebGLInput } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';

class MouseInputButtons {
  public left = false;
  public middle = false;
  public right = false;
}

class MouseInputCoords {
  public x = 0;
  public y = 0;
}

export class MouseInput implements WebGLInput {

  private mouseCoords: MouseInputCoords = new MouseInputCoords();
  private mouseButtons: MouseInputButtons = new MouseInputButtons();

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.onMouseClickDown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseClickUp.bind(this));
  }

  get x(): number {
    return this.mouseCoords.x;
  }

  get y(): number {
    return this.mouseCoords.y;
  }

  get coords(): MouseInputCoords {
    return this.mouseCoords;
  }

  get buttons(): MouseInputButtons {
    return this.mouseButtons;
  }

  private onMouseMove(evt: MouseEvent) {
    this.mouseCoords.x = evt.clientX;
    this.mouseCoords.y = evt.clientY;
  }

  private onMouseClickDown(evt: MouseEvent) {
    this.mouseButtons = this.buttonsFromMask(evt.buttons);
  }

  private onMouseClickUp(evt: MouseEvent) {
    this.mouseButtons = this.buttonsFromMask(evt.buttons);
  }

  private buttonsFromMask(mask: number): MouseInputButtons {
    const mouseButtons = new MouseInputButtons();

    mouseButtons.left   = (mask & 1) > 0;
    mouseButtons.middle = (mask & 4) > 0;
    mouseButtons.right  = (mask & 2) > 0;

    return mouseButtons;
  }

  public onDestroy(): void {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mousedown', this.onMouseClickDown);
    this.canvas.removeEventListener('mouseup', this.onMouseClickUp);
  }
}

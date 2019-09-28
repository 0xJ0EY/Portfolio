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

  private mouseMoveListener: any;
  private mouseClickDownListener: any;
  private mouseClickUpListener: any;

  constructor(private canvas: HTMLCanvasElement) {

    this.mouseMoveListener = this.onMouseMove.bind(this);
    this.mouseClickDownListener = this.onMouseClickDown.bind(this);
    this.mouseClickUpListener = this.onMouseClickUp.bind(this);

    this.canvas.addEventListener('mousemove', this.mouseMoveListener);
    this.canvas.addEventListener('mousedown', this.mouseClickDownListener);
    this.canvas.addEventListener('mouseup', this.mouseClickUpListener);
    this.canvas.oncontextmenu = () => false;
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

  get xPercentage(): number {
    return this.mouseCoords.x / this.canvas.getBoundingClientRect().width;
  }

  get yPercentage(): number {
    return this.mouseCoords.y / this.canvas.getBoundingClientRect().height;
  }

  get percentage(): MouseInputCoords {
    const mouseInputCoords = new MouseInputCoords();

    mouseInputCoords.x = this.xPercentage;
    mouseInputCoords.y = this.yPercentage;

    return mouseInputCoords;
  }

  get parent(): HTMLCanvasElement {
    return this.canvas;
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
    this.canvas.removeEventListener('mousemove', this.mouseMoveListener);
    this.canvas.removeEventListener('mousedown', this.mouseClickDownListener);
    this.canvas.removeEventListener('mouseup', this.mouseClickUpListener);

    this.mouseMoveListener = null;
    this.mouseClickDownListener = null;
    this.mouseClickUpListener = null;
  }
}

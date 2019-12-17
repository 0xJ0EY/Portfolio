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

export enum MouseScrollDirection {
  None = 0,
  Up,
  Down
}

export class MouseScroll {
  public direction: MouseScrollDirection = MouseScrollDirection.None;
}

export function hasClassInDOMTree(target: Element, cls: string): boolean {

  // No classlist, must be an invalid target or the HTMLDocument.
  if (target.classList == null) { return false; }

  // Check if the current target has the class
  if (target.classList.contains(cls)) {
    return true;
  }

  // Call the parent if it has one.
  if (target.parentElement !== null) {
    return hasClassInDOMTree(target.parentElement as Element, cls);
  }

  return false;
}

export function canScroll(evt: WheelEvent): boolean {
  return !hasClassInDOMTree(evt.target as Element, 'no-scroll');
}

export class MouseInput implements WebGLInput {

  private devicePixelRatio = window.devicePixelRatio || 1;

  private mouseCoords: MouseInputCoords = new MouseInputCoords();
  private mouseButtons: MouseInputButtons = new MouseInputButtons();
  private mouseScroll: MouseScroll = new MouseScroll();

  private mouseMoveListener: any;
  private mouseClickDownListener: any;
  private mouseClickUpListener: any;

  constructor(private document: Document, private canvas: HTMLCanvasElement) {
    this.mouseMoveListener = this.onMouseMove.bind(this);
    this.mouseClickDownListener = this.onMouseClickDown.bind(this);
    this.mouseClickUpListener = this.onMouseClickUp.bind(this);

    this.document.addEventListener('mousemove', this.mouseMoveListener);
    this.document.addEventListener('mousedown', this.mouseClickDownListener);
    this.document.addEventListener('mouseup', this.mouseClickUpListener);
    this.document.addEventListener('wheel', this.onScroll.bind(this));
    this.canvas.oncontextmenu = () => false;
  }

  get x(): number {
    return this.mouseCoords.x;
  }

  get xNormalized(): number {
    return this.mouseCoords.x / this.devicePixelRatio;
  }

  get y(): number {
    return this.mouseCoords.y;
  }

  get yNormalized(): number {
    return this.mouseCoords.y / this.devicePixelRatio;
  }

  get coords(): MouseInputCoords {
    return this.mouseCoords;
  }

  get xPercentage(): number {
    const width = this.canvas.getBoundingClientRect().width * this.devicePixelRatio;
    const x = Math.min(this.mouseCoords.x, width);
    return x / width;
  }

  get yPercentage(): number {
    const height = this.canvas.getBoundingClientRect().height * this.devicePixelRatio;
    const y = Math.min(this.mouseCoords.y, height);
    return y / height;
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

  get scroll(): MouseScroll {
    return this.mouseScroll;
  }

  private onMouseMove(evt: MouseEvent) {
    this.mouseCoords.x = (evt.pageX - this.canvas.offsetLeft) * this.devicePixelRatio;
    this.mouseCoords.y = (evt.pageY - this.canvas.offsetTop) * this.devicePixelRatio;
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

  private onScroll(evt: WheelEvent) {
    if (!canScroll(evt)) { return; }

    evt.deltaY < 0 ? this.onScrollWheelUp() : this.onScrollWheelDown();
  }

  private onScrollNone() {
    const mouseScroll = new MouseScroll();
    mouseScroll.direction = MouseScrollDirection.None;
    this.mouseScroll = mouseScroll;
  }

  private onScrollWheelUp() {
    const mouseScroll = new MouseScroll();
    mouseScroll.direction = MouseScrollDirection.Up;
    this.mouseScroll = mouseScroll;
  }

  private onScrollWheelDown() {
    const mouseScroll = new MouseScroll();
    mouseScroll.direction = MouseScrollDirection.Down;
    this.mouseScroll = mouseScroll;
  }

  public onDestroy(): void {
    this.canvas.removeEventListener('mousemove', this.mouseMoveListener);
    this.canvas.removeEventListener('mousedown', this.mouseClickDownListener);
    this.canvas.removeEventListener('mouseup', this.mouseClickUpListener);

    this.mouseMoveListener = null;
    this.mouseClickDownListener = null;
    this.mouseClickUpListener = null;
  }

  public release(): void {
    // Reset scroll to none
    this.onScrollNone();
  }
}

import Hammer from 'hammerjs';
import { WebGLInput } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';
import { hasClassInDOMTree } from './mouse-input';

class PanCoords {
  public x = 0;
  public y = 0;
}

export enum SwipeState {
  NONE,
  LEFT,
  RIGHT
}

export class TouchInput implements WebGLInput {

  private touchInput = false;
  private devicePixelRatio = window.devicePixelRatio || 1;

  private panCoords: PanCoords = new PanCoords();
  private swipeState: SwipeState = SwipeState.NONE;

  private readonly hammer: HammerManager;

  constructor(private document: Document, private canvas: HTMLCanvasElement) {
    const body = document.querySelector('body');

    const cssProps: CssProps = {
      contentZooming: 'auto',
      tapHighlightColor: 'auto',
      touchCallout: 'auto',
      touchSelect: 'auto',
      userDrag: 'auto',
      userSelect: 'auto',
    };

    this.hammer = new Hammer(body as HTMLElement, {
      cssProps
    });

    this.hammer.on('pan', this.onPan.bind(this));
    this.hammer.on('swipeleft swiperight', this.onSwipe.bind(this));
  }

  private onPan(evt: any): void {
    this.useTouchInput(evt.pointerType);

    this.panCoords.x = evt.changedPointers[0].clientX as number;
    this.panCoords.y = evt.changedPointers[0].clientY as number;
  }

  get x(): number {
    return this.panCoords.x;
  }

  get xNormalized(): number {
    return this.panCoords.x / this.devicePixelRatio;
  }

  get y(): number {
    return this.panCoords.y;
  }

  get yNormalized(): number {
    return this.panCoords.y / this.devicePixelRatio;
  }

  get coords(): PanCoords {
    return this.panCoords;
  }

  get currentSwipeState(): SwipeState {
    return this.swipeState;
  }

  get xPercentage(): number {
    const width = this.canvas.getBoundingClientRect().width * this.devicePixelRatio;
    const x = Math.min(this.x * this.devicePixelRatio, width);
    return x / width;
  }

  get yPercentage(): number {
    const height = this.canvas.getBoundingClientRect().height * this.devicePixelRatio;
    const y = Math.min(this.y * this.devicePixelRatio, height);
    return y / height;
  }

  get percentage(): PanCoords {
    const panCoords = new PanCoords();

    panCoords.x = this.xPercentage;
    panCoords.y = this.yPercentage;

    return panCoords;
  }

  private onSwipe(evt: any): void {
    if (hasClassInDOMTree(evt.target, 'no-swipe')) { return; }

    this.useTouchInput(evt.pointerType);

    switch (evt.type) {
      case 'swipeleft':
        this.onSwipeLeft();
        break;
      case 'swiperight':
        this.onSwipeRight();
        break;
    }
  }

  public canUseTouchInput(): boolean {
    return this.touchInput;
  }

  private useTouchInput(pointerType: string): void {
    if (pointerType !== 'mouse') {
      this.touchInput = true;
    }
  }

  private onSwipeLeft(): void {
    this.swipeState = SwipeState.LEFT;
  }

  private onSwipeRight(): void {
    this.swipeState = SwipeState.RIGHT;
  }

  private onSwipeNone(): void {
    this.swipeState = SwipeState.NONE;
  }

  public release(): void {
    this.onSwipeNone();
  }

  onDestroy(): void {
    this.hammer.destroy();
  }
}

import Hammer from 'hammerjs';
import { WebGLInput } from '../../pages/home/webgl-carousel/webgl-renderer/webgl-input-manager';

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

  private devicePixelRatio = window.devicePixelRatio || 1;

  private panCoords: PanCoords = new PanCoords();
  private swipeState: SwipeState = SwipeState.NONE;

  private readonly hammer: HammerManager;

  constructor(private document: Document, private canvas: HTMLCanvasElement) {
    const body = document.querySelector('body');
    this.hammer = new Hammer(body as HTMLElement, {});

    this.hammer.on('pan', this.onPan.bind(this));
    this.hammer.on('swipeleft swiperight', this.onSwipe.bind(this));
  }

  private onPan(evt: any): void {
    this.panCoords.x = evt.changedPointers[0].x as number;
    this.panCoords.y = evt.changedPointers[0].y as number;
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

  private onSwipe(evt: any): void {
    switch (evt.type) {
      case 'swipeleft':
        this.onSwipeLeft();
        break;
      case 'swiperight':
        this.onSwipeRight();
        break;
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

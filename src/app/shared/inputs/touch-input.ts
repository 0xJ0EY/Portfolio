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
        console.log('pan', evt);
    }

    private onSwipe(evt: any): void {
        console.log('swipe', evt);
    }

    private onScrollLeft(): void {
        this.swipeState = SwipeState.LEFT;
    }

    private onScrollRight(): void {
        this.swipeState = SwipeState.RIGHT;
    }

    private onScrollNone(): void {
        this.swipeState = SwipeState.NONE;
    }

    onDestroy(): void {
        this.hammer.destroy();
    }
}

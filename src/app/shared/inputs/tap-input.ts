export class TapInput {
  private static instance: TapInput;

  private callbacks: [(evt: any) => void];
  private readonly hammer: HammerManager;

  public static getInstance(): TapInput {
    if (!TapInput.instance) { return null; }
    return TapInput.instance;
  }

  constructor(document: Document) {
    if (TapInput.instance) {
      throw new Error('TapInstance already instantiated');
    }

    const body = document.querySelector('body');

    const cssProps: CssProps = {
      contentZooming: 'auto',
      tapHighlightColor: 'auto',
      touchCallout: 'auto',
      touchSelect: 'auto',
      userDrag: 'auto',
      userSelect: 'auto',
    };

    this.hammer = new Hammer(body as HTMLElement, { cssProps });
    this.hammer.on('tap', this.onTap.bind(this));

    TapInput.instance = this;
  }

  public registerCallback(callback: (evt: any) => void): void {
    if (!this.callbacks) {
      this.callbacks = [callback];
      return;
    }

    this.callbacks.push(callback);
  }

  public deleteCallback(callback: (evt: any) => void): void {
    const index = this.callbacks.indexOf(callback);
    this.callbacks.slice(index, 1);
  }

  private onTap(evt: any): void {
    if (!this.callbacks) { return; }
    if (evt.pointerType === 'mouse') { return; }

    this.callbacks.forEach(callback => {
      callback(evt);
    });

  }
}
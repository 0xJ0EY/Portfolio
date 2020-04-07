import { isPowerOf2 } from 'src/app/shared/helpers/math';

export interface Texture {
  renderTexture(gl: WebGLRenderingContext): void;
  getTexture(): WebGLTexture;
  getTextureCoords(): number[];
  remove(gl: WebGLRenderingContext): void;
}

export interface AnimatedTexture extends Texture {
  update(gl: WebGLRenderingContext): void;
}

export function isAnimatedTexture(obj: any): obj is AnimatedTexture {
  return (obj as AnimatedTexture).update !== undefined;
}

export class ImageTexture implements Texture {

  private texture: WebGLTexture;

  constructor(private url: string, private coords: number[]) {}

  renderTexture(gl: WebGLRenderingContext): void {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const mipmapLevel = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]);

    gl.texImage2D(
      gl.TEXTURE_2D, mipmapLevel, internalFormat,
      width, height, border, srcFormat, srcType, pixel
    );

    this.loadImage(this.url).then(image => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D, mipmapLevel, internalFormat,
        srcFormat, srcType, image
      );

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    });

    this.texture = texture;
  }

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
      const image = new Image();

      image.addEventListener('load', () => {
        resolve(image);
      });

      image.src = url;
      image.crossOrigin = '';
    });
  }

  getTexture(): WebGLTexture {
    return this.texture;
  }

  getTextureCoords(): number[] {
    return this.coords;
  }

  remove(gl: WebGLRenderingContext): void {
    gl.deleteTexture(this.texture);
  }
}

export class TextureColour {
  public r: number;
  public g: number;
  public b: number;
}

export class ColourTexture implements Texture {

  private texture: WebGLTexture;

  constructor(private colour: TextureColour, private coords: number[]) {}

  renderTexture(gl: WebGLRenderingContext): void {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const mipmapLevel = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([
      this.colour.r,
      this.colour.g,
      this.colour.b,
      255
    ]);

    gl.texImage2D(
      gl.TEXTURE_2D, mipmapLevel, internalFormat,
      width, height, border, srcFormat, srcType, pixel
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    this.texture = texture;
  }

  getTexture(): WebGLTexture {
    return this.texture;
  }

  getTextureCoords(): number[] {
    return this.coords;
  }

  remove(gl: WebGLRenderingContext): void {
    gl.deleteTexture(this.texture);
  }

}

export class VideoTexture implements AnimatedTexture {
  private loaded = false;
  private texture: WebGLTexture;
  private video: HTMLVideoElement;

  constructor(private url: string, private thumbnail: string, private coords: number[]) {}

  renderTexture(gl: WebGLRenderingContext): void {

    const preloadTexture = new ImageTexture(this.thumbnail, this.coords);

    preloadTexture.renderTexture(gl);

    this.texture = preloadTexture.getTexture();

    this.loadVideo(this.url).then(() => { this.loaded = true; });
  }

  private loadVideo(url: string) {
    return new Promise<HTMLVideoElement>(resolve => {
      let playing = false;
      let timeupdate = false;
      const video = document.createElement('video');

      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.setAttribute('playsinline', '');

      const checkStatus = () => {
        if (playing && timeupdate) {
          resolve(video);
        }
      };

      const checkPlaying = () => {
        playing = true;
        checkStatus();

        video.removeEventListener('playing', checkPlaying);
      };

      const checkTimeupdate = () => {
        timeupdate = true;
        checkStatus();

        video.removeEventListener('timeupdate', checkTimeupdate);
      };

      video.addEventListener('playing', checkPlaying);
      video.addEventListener('timeupdate', checkTimeupdate);

      video.addEventListener('load', () => {
        resolve(video);
      });

      video.crossOrigin = '';
      video.src = url;
      video.play();

      this.video = video;
    });
  }

  update(gl: WebGLRenderingContext): void {
    if (!this.loaded) { return; }

    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    // Bugfix for Firefox
    // If this the currentTime is exacly 0, it will throw mipmapping errors and will decrease performance.
    if (this.video.currentTime === 0) { return; }

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, this.video);
  }

  getTexture(): WebGLTexture {
    return this.texture;
  }

  getTextureCoords(): number[] {
    return this.coords;
  }

  remove(gl: WebGLRenderingContext): void {
    this.video.pause();
    this.video.removeAttribute('src');
    this.video.load();

    gl.deleteTexture(this.texture);
  }

}

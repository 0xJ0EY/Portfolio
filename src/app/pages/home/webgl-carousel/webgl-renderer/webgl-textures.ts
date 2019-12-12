import { isPowerOf2 } from 'src/app/shared/helpers/math';

export interface Texture {
  renderTexture(gl: WebGLRenderingContext): void;
  getTexture(): WebGLTexture;
  getTextureCoords(): number[];
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

    const image = new Image();
    image.onload = () => {

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
    };

    image.crossOrigin = '';
    image.src = this.url;

    this.texture = texture;
  }

  getTexture(): WebGLTexture {
    return this.texture;
  }

  getTextureCoords(): number[] {
    return this.coords;
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

}

export class VideoTexture implements AnimatedTexture {
  private loaded = false;
  private texture: WebGLTexture;
  private video: TexImageSource;

  constructor(private url: string, private thumbnail: string, private coords: number[]) {}

  renderTexture(gl: WebGLRenderingContext): void {

    // Just use a black ColourTexture for the preload texture
    const preloadTexture = new ImageTexture(this.thumbnail, this.coords);

    preloadTexture.renderTexture(gl);

    this.texture = preloadTexture.getTexture();

    this.loadVideo();
  }

  private loadVideo(): void {
    const video = document.createElement('video');
    let playing = true;
    let timeupdate = false;

    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    video.setAttribute('playsinline', '');

    const checkStatus = () => {
      if (playing && timeupdate) {
        this.loaded = true;
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

    video.crossOrigin = '';
    video.src = this.url;
    video.play();

    this.video = video;
  }

  update(gl: WebGLRenderingContext): void {
    if (!this.loaded) { return; }

    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

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

}

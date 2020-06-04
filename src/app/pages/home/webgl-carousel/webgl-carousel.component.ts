import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { WindowRefService } from 'src/app/shared/helpers/window-ref.service';
import { WebGLRenderer } from './webgl-renderer/webgl-renderer';
import { ResizeService } from '../../../shared/services/resize.service';
import { Subscription } from 'rxjs';
import { WebGLObjectManager } from './webgl-renderer/webgl-object-manager';
import { DOCUMENT } from '@angular/common';
import { WebGLCubeManager } from './webgl-cube-manager/webgl-cube-manager';
import { CubeService } from '../../../shared/services/cube.service';

@Component({
  selector: 'app-webgl-carousel',
  templateUrl: './webgl-carousel.component.html',
  styleUrls: ['./webgl-carousel.component.scss']
})

export class WebGLCarouselComponent implements AfterViewInit, OnDestroy {

  @ViewChild('webGL', { static: true }) public webGL: ElementRef;

  public window: any;
  private resizeSubscription: Subscription;

  private renderer: WebGLRenderer;
  private objectManager: WebGLObjectManager;
  private cubeManager: WebGLCubeManager;

  private animationFrameId: number;
  private then = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private windowRefService: WindowRefService,
    private resizeService: ResizeService,
    private cubeService: CubeService
  ) {
    this.window = this.windowRefService.nativeWindow;
  }

  ngAfterViewInit(): void {
    this.onResize();

    // Hack to render it after the page has been loaded, to improve performance
    setTimeout(this.startRenderer.bind(this), 1);
  }

  startRenderer(): void {
    this.resizeSubscription = this.resizeService.onResize.subscribe(this.onResize.bind(this));

    const gl = this.webGL.nativeElement.getContext('webgl', { stencil: true });

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }

    this.objectManager = new WebGLObjectManager(gl, this.document);
    this.cubeManager = new WebGLCubeManager(this.objectManager, this.cubeService);
    this.cubeManager.init();

    const devicePixelRatio = window.devicePixelRatio || 1;

    this.renderer = new WebGLRenderer(gl, this.objectManager, devicePixelRatio);

    this.animationFrameId = this.window.requestAnimationFrame(this.onAnimationFrame.bind(this));
  }

  onResize(): void {

    const devicePixelRatio = window.devicePixelRatio || 1;

    this.webGL.nativeElement.width = Math.round(this.window.innerWidth * devicePixelRatio);
    this.webGL.nativeElement.height = Math.round(this.window.innerHeight * devicePixelRatio);

    // If it has a viewport, update it aswell
    if (this.renderer != null) {
      this.renderer.resize();
    }
  }

  ngOnDestroy(): void {
    // Destory leaking loop
    this.window.cancelAnimationFrame(this.animationFrameId);
    this.objectManager.onDestroy();
    this.cubeManager.onDestroy();
    this.resizeSubscription.unsubscribe();
  }

  onAnimationFrame(now: number): void {
    now *= 0.001; // Convert to seconds
    const deltaTime = now - this.then;
    this.then = now;

    this.objectManager.update(deltaTime);
    this.renderer.update();

    // Restart the animation frame
    this.animationFrameId = this.window.requestAnimationFrame(this.onAnimationFrame.bind(this));
  }

}

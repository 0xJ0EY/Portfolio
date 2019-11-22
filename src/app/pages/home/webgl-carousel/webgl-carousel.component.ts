import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { WindowRefService } from 'src/app/shared/helpers/window-ref.service';
import { WebGLRenderer } from './webgl-renderer/webgl-renderer';
import { ResizeService } from '../../../shared/services/resize.service';
import { Subscription } from 'rxjs';
import { WebGLObjectManager } from './webgl-renderer/webgl-object-manager';
import { DOCUMENT } from '@angular/common';
import { WebGLCubeManager } from './webgl-cube-manager/webgl-cube-manager';

@Component({
  selector: 'app-webgl-carousel',
  templateUrl: './webgl-carousel.component.html',
  styleUrls: ['./webgl-carousel.component.scss']
})

export class WebGLCarouselComponent implements AfterViewInit, OnDestroy {

  @ViewChild('webGL', {static: false}) public webGL: ElementRef;

  public window: any;
  private resizeSubscription: Subscription;

  private renderer: WebGLRenderer;
  private objectManager: WebGLObjectManager;

  private animationFrameId: number;
  private then = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private windowRefService: WindowRefService,
    private resizeService: ResizeService
  ) {
    this.window = this.windowRefService.nativeWindow;
  }

  ngAfterViewInit(): void {
    this.onResize();

    this.resizeSubscription = this.resizeService.onResize.subscribe(this.onResize.bind(this));

    const gl = this.webGL.nativeElement.getContext('webgl');

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }

    this.objectManager = new WebGLObjectManager(gl, this.document);

    this.renderer = new WebGLRenderer(gl, this.objectManager);

    (new WebGLCubeManager(this.objectManager)).init();

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

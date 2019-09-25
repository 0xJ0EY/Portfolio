import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { WindowRefService } from 'src/app/shared/helpers/window-ref.service';
import { WebGLRenderer } from './webgl-renderer/webgl-renderer';
import { ResizeService } from '../../../shared/services/resize.service';
import { Subscription } from 'rxjs';
import { WebGLObjectManager } from './webgl-renderer/webgl-object-manager';
import { WebGLCube } from '../../../shared/models/webgl-cube.model';

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

    this.objectManager = new WebGLObjectManager(gl);

    this.renderer = new WebGLRenderer(gl, this.objectManager);

    this.objectManager.add(new WebGLCube());

    this.animationFrameId = this.window.requestAnimationFrame(this.onAnimationFrame.bind(this));
  }

  onResize(): void {
    this.webGL.nativeElement.width = this.window.innerWidth;
    this.webGL.nativeElement.height = this.window.innerHeight;

    // If it has a viewport, update it aswell
    if (this.renderer != null) {
      this.renderer.resize();
    }
  }

  ngOnDestroy(): void {
    // Destory leaking loop
    this.window.cancelAnimationFrame(this.animationFrameId);

    this.resizeSubscription.unsubscribe();
  }

  onAnimationFrame(now): void {

    now *= 0.001; // Convert to seconds
    const deltaTime = now - this.then;
    this.then = now;

    this.objectManager.update(deltaTime);
    this.renderer.update();

    // Restart the animation frame
    this.animationFrameId = this.window.requestAnimationFrame(this.onAnimationFrame.bind(this));
  }

}

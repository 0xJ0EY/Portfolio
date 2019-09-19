import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { WindowRefService } from 'src/app/shared/helpers/window-ref.service';
import { WebGLRenderer } from "./webgl-renderer/webgl-renderer";

@Component({
  selector: 'app-webgl-carousel',
  templateUrl: './webgl-carousel.component.html',
  styleUrls: ['./webgl-carousel.component.scss']
})

export class WebGLCarouselComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('webGL', {static: false}) public webGL: ElementRef;

  private window: any;

  private renderer: WebGLRenderer;
  private animationFrameId: number;
  private then: number = 0;

  constructor(private windowRefService: WindowRefService) {
    this.window = this.windowRefService.nativeWindow;
  }

  ngAfterViewInit(): void {
    var gl = this.webGL.nativeElement.getContext('webgl');

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      return;
    }

    this.renderer = new WebGLRenderer(gl);

    this.animationFrameId = this.window.requestAnimationFrame(this.onAnimationFrame.bind(this));
  }

  ngOnDestroy(): void {
    // Destory leaking loop
    this.window.cancelAnimationFrame(this.animationFrameId);
  }

  onAnimationFrame(now): void {

    now *= 0.001; // Convert to seconds
    const deltaTime = now - this.then;
    this.then = now; 

    this.renderer.init();
    this.renderer.update(deltaTime);
    
    // Restart the animation frame
    this.animationFrameId = this.window.requestAnimationFrame(this.onAnimationFrame.bind(this));
  }

}

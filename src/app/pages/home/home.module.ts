import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { WebGLCarouselComponent } from './webgl-carousel/webgl-carousel.component';

@NgModule({
  declarations: [HomePageComponent, WebGLCarouselComponent],
  imports: [
    CommonModule
  ],
  exports: [
    HomePageComponent
  ]
})
export class HomeModule { }

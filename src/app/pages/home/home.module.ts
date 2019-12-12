import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { WebGLCarouselComponent } from './webgl-carousel/webgl-carousel.component';
import { ProjectNameComponent } from './project-name/project-name.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectCounterComponent } from './project-counter/project-counter.component';

@NgModule({
  declarations: [HomePageComponent, WebGLCarouselComponent, ProjectNameComponent, ProjectCounterComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    HomePageComponent
  ]
})
export class HomeModule { }

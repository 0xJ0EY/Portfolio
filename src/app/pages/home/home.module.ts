import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { WebGLCarouselComponent } from './webgl-carousel/webgl-carousel.component';
import { ProjectNameComponent } from './project-name/project-name.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { TitleComponent } from './title/title.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { SharedModule } from '../../shared/shared.module';
import { ScrollInfoComponent } from './scroll-info/scroll-info.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

@NgModule({
  declarations: [
    HomePageComponent,
    WebGLCarouselComponent,
    ProjectNameComponent,
    ProjectCounterComponent,
    TitleComponent,
    ProjectInfoComponent,
    ScrollInfoComponent,
    LanguageSelectorComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  exports: [
    HomePageComponent
  ]
})
export class HomeModule { }

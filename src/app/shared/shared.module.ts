import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronComponent } from './components/chevron/chevron.component';



@NgModule({
  declarations: [ChevronComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ChevronComponent
  ]
})
export class SharedModule { }

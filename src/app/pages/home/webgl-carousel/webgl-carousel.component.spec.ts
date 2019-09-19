import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebGLCarouselComponent } from './webgl-carousel.component';

describe('WebglCarouselComponent', () => {
  let component: WebGLCarouselComponent;
  let fixture: ComponentFixture<WebGLCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebGLCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebGLCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

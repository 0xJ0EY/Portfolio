import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WebGLCarouselComponent } from './webgl-carousel.component';

describe('WebglCarouselComponent', () => {
  let component: WebGLCarouselComponent;
  let fixture: ComponentFixture<WebGLCarouselComponent>;

  beforeEach(waitForAsync(() => {
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

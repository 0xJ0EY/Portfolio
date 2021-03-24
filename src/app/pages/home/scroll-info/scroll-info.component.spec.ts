import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScrollInfoComponent } from './scroll-info.component';

describe('ScrollInfoComponent', () => {
  let component: ScrollInfoComponent;
  let fixture: ComponentFixture<ScrollInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

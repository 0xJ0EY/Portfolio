import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollInfoComponent } from './scroll-info.component';

describe('ScrollInfoComponent', () => {
  let component: ScrollInfoComponent;
  let fixture: ComponentFixture<ScrollInfoComponent>;

  beforeEach(async(() => {
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

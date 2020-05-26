import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessInfoBtnComponent } from './less-info-btn.component';

describe('LessInfoBtnComponent', () => {
  let component: LessInfoBtnComponent;
  let fixture: ComponentFixture<LessInfoBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessInfoBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessInfoBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

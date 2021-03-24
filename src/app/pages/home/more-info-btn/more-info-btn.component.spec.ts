import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoreInfoBtnComponent } from './more-info-btn.component';

describe('MoreInfoBtnComponent', () => {
  let component: MoreInfoBtnComponent;
  let fixture: ComponentFixture<MoreInfoBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreInfoBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreInfoBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreInfoBtnComponent } from './more-info-btn.component';

describe('MoreInfoBtnComponent', () => {
  let component: MoreInfoBtnComponent;
  let fixture: ComponentFixture<MoreInfoBtnComponent>;

  beforeEach(async(() => {
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

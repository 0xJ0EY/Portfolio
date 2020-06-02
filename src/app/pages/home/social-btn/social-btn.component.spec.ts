import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialBtnComponent } from './social-btn.component';

describe('SocialBtnComponent', () => {
  let component: SocialBtnComponent;
  let fixture: ComponentFixture<SocialBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

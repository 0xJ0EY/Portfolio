import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectNameComponent } from './project-name.component';

describe('ProjectNameComponent', () => {
  let component: ProjectNameComponent;
  let fixture: ComponentFixture<ProjectNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

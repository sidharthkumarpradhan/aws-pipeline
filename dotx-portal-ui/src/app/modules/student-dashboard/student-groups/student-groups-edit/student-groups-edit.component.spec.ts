import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGroupsEditComponent } from './student-groups-edit.component';

describe('StudentGroupsEditComponent', () => {
  let component: StudentGroupsEditComponent;
  let fixture: ComponentFixture<StudentGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentGroupsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

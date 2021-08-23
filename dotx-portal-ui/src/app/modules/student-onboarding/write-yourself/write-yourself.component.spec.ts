import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteYourselfComponent } from './write-yourself.component';

describe('WriteYourselfComponent', () => {
  let component: WriteYourselfComponent;
  let fixture: ComponentFixture<WriteYourselfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteYourselfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

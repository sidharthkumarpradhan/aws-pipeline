import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCodesModelComponent } from './join-codes-model.component';

describe('JoinCodesModelComponent', () => {
  let component: JoinCodesModelComponent;
  let fixture: ComponentFixture<JoinCodesModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinCodesModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCodesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

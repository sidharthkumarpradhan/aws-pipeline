import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SendMessagePopupComponent} from './send-message-popup.component';

describe('SendMessagePopupComponent', () => {
  let component: SendMessagePopupComponent;
  let fixture: ComponentFixture<SendMessagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendMessagePopupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDotxComponent } from './about-dotx.component';

describe('AboutDotxComponent', () => {
  let component: AboutDotxComponent;
  let fixture: ComponentFixture<AboutDotxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDotxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDotxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

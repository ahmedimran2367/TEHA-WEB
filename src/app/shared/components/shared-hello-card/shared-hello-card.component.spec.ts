import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedHelloCardComponent } from './shared-hello-card.component';

describe('SharedHelloCardComponent', () => {
  let component: SharedHelloCardComponent;
  let fixture: ComponentFixture<SharedHelloCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharedHelloCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedHelloCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

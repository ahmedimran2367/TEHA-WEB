import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsTilesComponent } from './persons-tiles.component';

describe('PersonsTilesComponent', () => {
  let component: PersonsTilesComponent;
  let fixture: ComponentFixture<PersonsTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonsTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTypes } from './session-types';

describe('SessionTypes', () => {
  let component: SessionTypes;
  let fixture: ComponentFixture<SessionTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

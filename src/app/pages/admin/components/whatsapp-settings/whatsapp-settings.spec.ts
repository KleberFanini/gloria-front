import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappSettings } from './whatsapp-settings';

describe('WhatsappSettings', () => {
  let component: WhatsappSettings;
  let fixture: ComponentFixture<WhatsappSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

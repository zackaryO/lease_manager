import { TestBed } from '@angular/core/testing';

import { EmailReminderService } from './email-reminder.service';

describe('EmailReminderService', () => {
  let service: EmailReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

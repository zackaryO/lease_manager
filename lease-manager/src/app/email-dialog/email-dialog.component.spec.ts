import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailDialogComponent } from './email-dialog.component';

describe('SendEmailDialogComponent', () => {
  let component: SendEmailDialogComponent;
  let fixture: ComponentFixture<SendEmailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailDialogComponent]
    });
    fixture = TestBed.createComponent(SendEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseHolderFormModalComponent } from './lease-holder-form-modal.component';

describe('LeaseHolderFormModalComponent', () => {
  let component: LeaseHolderFormModalComponent;
  let fixture: ComponentFixture<LeaseHolderFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaseHolderFormModalComponent]
    });
    fixture = TestBed.createComponent(LeaseHolderFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

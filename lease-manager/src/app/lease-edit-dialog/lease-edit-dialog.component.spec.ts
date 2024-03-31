import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseEditDialogComponent } from './lease-edit-dialog.component';

describe('LeaseEditDialogComponent', () => {
  let component: LeaseEditDialogComponent;
  let fixture: ComponentFixture<LeaseEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaseEditDialogComponent]
    });
    fixture = TestBed.createComponent(LeaseEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

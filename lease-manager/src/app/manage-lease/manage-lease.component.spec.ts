import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeaseComponent } from './manage-lease.component';

describe('ManageLeaseComponent', () => {
  let component: ManageLeaseComponent;
  let fixture: ComponentFixture<ManageLeaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageLeaseComponent]
    });
    fixture = TestBed.createComponent(ManageLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

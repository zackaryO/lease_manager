import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaseeComponent } from './add-leasee.component';

describe('AddLeaseeComponent', () => {
  let component: AddLeaseeComponent;
  let fixture: ComponentFixture<AddLeaseeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLeaseeComponent]
    });
    fixture = TestBed.createComponent(AddLeaseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

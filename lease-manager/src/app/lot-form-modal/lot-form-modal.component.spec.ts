import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotFormModalComponent } from './lot-form-modal.component';

describe('LotFormModalComponent', () => {
  let component: LotFormModalComponent;
  let fixture: ComponentFixture<LotFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LotFormModalComponent]
    });
    fixture = TestBed.createComponent(LotFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

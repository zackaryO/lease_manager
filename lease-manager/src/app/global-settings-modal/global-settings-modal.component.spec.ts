import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingsModalComponent } from './global-settings-modal.component';

describe('GlobalSettingsModalComponent', () => {
  let component: GlobalSettingsModalComponent;
  let fixture: ComponentFixture<GlobalSettingsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSettingsModalComponent]
    });
    fixture = TestBed.createComponent(GlobalSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

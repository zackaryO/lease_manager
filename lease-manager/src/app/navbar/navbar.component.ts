import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GlobalDefault } from '../models/global-default.model';
import { GlobalDefaultService } from '../services/global-default.service';
import { ComponentCanDeactivate } from '../unsaved-changes.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, ComponentCanDeactivate {
  globalDefault: GlobalDefault = new GlobalDefault();
  updatedGlobalDefault: GlobalDefault = new GlobalDefault();
  daysInMonth: number[] = [];
  menuActive = false;

  constructor(private cdr: ChangeDetectorRef, private globalDefaultService: GlobalDefaultService) { }

  ngOnInit(): void {
    this.fillDaysInMonth();
    this.globalDefaultService.getGlobalDefault().subscribe(
      globalDefault => {
        this.globalDefault = globalDefault;
        this.updatedGlobalDefault = GlobalDefault.deserialize(globalDefault.serialize());
      },
      error => {
        console.error('Error fetching global defaults:', error);
      }
    );
  }

  canDeactivate(): boolean | Observable<boolean> {
    return JSON.stringify(this.globalDefault) === JSON.stringify(this.updatedGlobalDefault);
  }

  onDueDayChange(newDueDay: number): void {
    this.globalDefault.dueDay = newDueDay;
  }

  saveUpdates(): void {
    const confirmation = confirm('Do you want to save these changes?');
    if (confirmation) {
      this.globalDefaultService.updateGlobalDefault(this.updatedGlobalDefault.serialize()).subscribe(
        () => {
          console.log('Update successful');
          alert('Changes saved successfully.');
        },
        error => {
          console.error('An error occurred while updating settings.', error);
          alert('An error occurred while saving changes.');
        }
      );
    }
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
    console.log('Menu toggled, menuActive:', this.menuActive); // log for debugging
    this.cdr.detectChanges(); // manually trigger change detection
  }

  fillDaysInMonth(): void {
    for (let i = 1; i <= 31; i++) {
      this.daysInMonth.push(i);
    }
  }
}

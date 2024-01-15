import { Component, OnInit } from '@angular/core';
import { GlobalDefaultService } from '../services/global-default.service';
import { MatDialogRef } from '@angular/material/dialog';

// Define an interface for the settings if possible, for better type checking
interface GlobalSettings {
  due_date: number;
  grace_period: number;
}

@Component({
  selector: 'app-global-settings-modal',
  templateUrl: './global-settings-modal.component.html',
  styleUrls: ['./global-settings-modal.component.css']
})
export class GlobalSettingsModalComponent implements OnInit {
  globalSettings: GlobalSettings = { due_date: 0, grace_period: 0 };

  constructor(private dialogRef: MatDialogRef<GlobalSettingsModalComponent>, private globalDefaultService: GlobalDefaultService) { }

  ngOnInit() {
    this.fetchSettings();
  }

  fetchSettings() {
    this.globalDefaultService.fetchGlobalSettings().subscribe(
      (settings: GlobalSettings) => {
        this.globalSettings = settings;
      },
      error => {
        console.error('Error fetching global settings:', error);
        // Handle the error appropriately
      }
    );
  }

  updateSettings() {
    this.globalDefaultService.updateGlobalSettings(this.globalSettings).subscribe(
      updatedSettings => {
        // Handle successful update
        // You might want to give feedback to the user or close the modal here
        console.log('Settings updated:', updatedSettings);
      },
      error => {
        console.error('Error updating settings:', error);
        // Handle the error appropriately
      }
    );
  }

  // Add modal closing logic here
  closeModal() {
    this.dialogRef.close();
  }
}

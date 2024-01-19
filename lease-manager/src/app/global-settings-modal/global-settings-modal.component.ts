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
    this.globalDefaultService.fetchGlobalSettings().subscribe({
      // 'next' is called whenever the Observable emits a value.
      // In this case, it's called when global settings data is successfully fetched.
      next: (settings: GlobalSettings) => {
        // The emitted value (the fetched settings) is assigned to 'this.globalSettings'.
        this.globalSettings = settings;
      },

      // 'error' is called if the Observable encounters an error condition.
      // This could happen if there's a network issue, server error, etc.
      error: error => {
        // Logs the error to the console.
        console.error('Error fetching global settings:', error);
        // This is where you can handle the error appropriately.
        // For example, you could show a user-friendly message or retry the operation.
      }

      // Note: The 'complete' handler is not used here.
      // 'complete' is called when the Observable completes (i.e., emits all its values).
      // For an HTTP request, 'complete' would be called after the response is received.
      // However, for this specific use case, handling the 'complete' notification is not necessary.
    });
  }



  updateSettings() {
    this.globalDefaultService.updateGlobalSettings(this.globalSettings).subscribe({
      next: updatedSettings => {
        // Handle successful update
        // You might want to give feedback to the user or close the modal here
        console.log('Settings updated:', updatedSettings);
      },
      error: error => {
        console.error('Error updating settings:', error);
        // Handle the error appropriately
      }
    });
  }


  // Add modal closing logic here
  closeModal() {
    this.dialogRef.close();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule  // Add SharedModule to the imports array
  ]
})
export class DashboardModule { }

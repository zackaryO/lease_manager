import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    SharedModule  // Add SharedModule to the imports array
  ]
})
export class ReportsModule { }

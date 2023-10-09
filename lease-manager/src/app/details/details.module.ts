import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './main/details.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule  // Add SharedModule to the imports array
  ]
})
export class DetailsModule { }

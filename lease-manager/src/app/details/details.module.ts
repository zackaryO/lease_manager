import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './main/details.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule  // Add SharedModule to the imports array
  ]
})
export class DetailsModule { }

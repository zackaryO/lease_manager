import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DetailsComponent } from './details.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';


@NgModule({

  providers: [
    DatePipe
  ],
  declarations: [
    // DetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    FormsModule  // Add SharedModule to the imports array
  ]
})
export class DetailsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsComponent } from '../details/details.component';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';


@NgModule({
  providers: [
    DatePipe
  ],
  declarations: [
    DashboardComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,  // Add SharedModule to the imports array
    ReactiveFormsModule,
    MatListModule,
    FormsModule

  ]
})
export class DashboardModule { }

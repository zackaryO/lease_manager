import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DetailsComponent } from '../details/details.component';
import { SharedModule } from '../shared/shared.module';  // Import SharedModule
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    DetailsComponent
  ],
  imports: [
    MatListModule,
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,  // Add SharedModule to the imports array
    ReactiveFormsModule,

  ]
})
export class DashboardModule { }

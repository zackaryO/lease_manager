import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // import FormsModule
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { DetailsModule } from './details/details.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AddLeaseeComponent } from './add-leasee/add-leasee.component';
import { RentalService } from './services/rental-detail.service';
import { ManageLeaseComponent } from './manage-lease/manage-lease.component';
import { GlobalSettingsModalComponent } from './global-settings-modal/global-settings-modal.component';
import { LotFormModalComponent } from './lot-form-modal/lot-form-modal.component';
import { LeaseHolderFormModalComponent } from './lease-holder-form-modal/lease-holder-form-modal.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PaymentDialogComponent,
    AddLeaseeComponent,
    ManageLeaseComponent,
    GlobalSettingsModalComponent,
    LotFormModalComponent,
    LeaseHolderFormModalComponent,
    ErrorDialogComponent,
    EmailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    ReportsModule,
    DetailsModule,
    AuthenticationModule,
    HttpClientModule,
    FormsModule,  // Add FormsModule here
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,

  ],
  providers: [RentalService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }

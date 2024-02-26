import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components and guards
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './authentication/auth.guard';

// Import the other components
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import { ReportsComponent } from './reports/reports.component';
import { ManageLeaseComponent } from './manage-lease/manage-lease.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' }, // Redirect to details by default
      { path: 'details', component: DetailsComponent }, // Nested route for details
      { path: 'reports', component: ReportsComponent },
      { path: 'manage', component: ManageLeaseComponent },
    ],
  },
  { path: '**', redirectTo: 'login' }, // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

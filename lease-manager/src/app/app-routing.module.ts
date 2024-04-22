import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components and guards
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './authentication/auth.guard';
import { RegisterComponent } from './authentication/register/register.component';

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
      // Define the child route for DetailsComponent here
      {
        path: 'details/:id', // Assuming you want to access details with an ID
        component: DetailsComponent,
        canActivate: [AuthGuard], // Apply AuthGuard if needed
      },
      // You can add more child routes under DashboardComponent if necessary
    ],
  },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'manage', component: ManageLeaseComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },

  // This wildcard route should be last in the list. It ensures that any unmatched path will be redirected to the login
  { path: '**', redirectTo: 'login' }, // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

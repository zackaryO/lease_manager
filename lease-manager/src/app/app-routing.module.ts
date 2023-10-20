import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components and guards
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './authentication/auth.guard';

// Import the other components
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'details/:lotNumber', component: DetailsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },

  // This wildcard route should be last in the list. It ensures that any unmatched path will be redirected to the login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

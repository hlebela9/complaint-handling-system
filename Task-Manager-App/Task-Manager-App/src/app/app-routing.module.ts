import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';  // Example components
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ViewProfileComponent } from './profile/view-profile/view-profile.component';
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ViewProfileComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Setup routes
  exports: [RouterModule]                  // Export RouterModule to be used in AppModule
})
export class AppRoutingModule { }

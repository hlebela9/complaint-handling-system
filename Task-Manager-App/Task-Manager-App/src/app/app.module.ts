import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './auth/register/register.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './home/home.component';
import { ViewProfileComponent } from './profile/view-profile/view-profile.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent, 
    EditProfileComponent,  
    DashboardComponent,
    HomeComponent,
    ViewProfileComponent,
    ChangePwdComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}







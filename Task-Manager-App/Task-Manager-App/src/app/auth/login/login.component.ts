import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { UserInfoService } from '../../shared/user-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup 

  user: any;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,private sharedService: UserInfoService // Inject MatSnackBar
  ) {
    this.user = this.sharedService.get('users', 'local')
    if (!this.user.length) {
      this.sharedService.store([{
        fullName: 'Built-In Admin',
        email: 'admin@sysAdmin.ac.za',
        role: 'admin',
        phoneNumber: null,
        address: null,
        password: 'admin@12'
      }], 'users', 'local')
      
    }
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),

    })
  }

  submit(): void {
    // Fetch all users from local storage
    let _users = localStorage.getItem('users');
    const users = _users ? JSON.parse(_users) : [];

    // Check if the form is valid
    if (this.loginForm.valid) {
      // Find the user by email
      const foundUser = users.find((user: any) => user.email === this.loginForm.controls['email'].value);

      if (!foundUser) {
        // Show error if the user does not exist
        this.snackBar.open('User does not exist.', 'OK', { duration: 3000 });
      } else if (foundUser.password !== this.loginForm.controls['password'].value) {
        // Show error if the password is incorrect
        this.snackBar.open('Password incorrect', 'OK', { duration: 3000 });
      } else {
        // Store current user in session storage and navigate to home
        sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
        this.snackBar.open('Login successful', 'OK', { duration: 3000 });
        this.router.navigate(['/home']);
      }
    }
  }

  resetForm() {
    this.loginForm.reset();
  }
}





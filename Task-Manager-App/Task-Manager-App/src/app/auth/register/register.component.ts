import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required ]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
    confirmPass: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
  });

  submit() {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
    }
  }

  resetForm() {
    this.registerForm.reset();
  }
}

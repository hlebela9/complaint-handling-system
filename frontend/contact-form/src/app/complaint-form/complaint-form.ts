import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-form.html',
})

export class ComplaintForm {
  complaintText = '';
  email = '';

  onSubmit() {
    console.log('Complaint:', this.complaintText);
    console.log('Email:', this.email);
    alert('Thank you! Your complaint has been submitted.');

    this.complaintText = '';
    this.email = '';
  }
}

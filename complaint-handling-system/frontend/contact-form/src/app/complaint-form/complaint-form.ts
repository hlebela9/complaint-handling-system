import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Add HttpClientModule here
  templateUrl: './complaint-form.html',
})
export class ComplaintForm {
  complaintText = '';
  email = '';

  
  //this must be replaced with the Real API-URL
  private apiUrl = 'https://your-backend-api.com/api/complaints';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.complaintText || !this.email) {
      alert('Please fill in both complaint and email.');
      return;
    }

    const payload = {
      complaintText: this.complaintText,
      email: this.email,
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        alert('Thank you! Your complaint has been submitted.');
        this.complaintText = '';
        this.email = '';
      },
      error: (error) => {
        console.error('Error submitting complaint:', error);
        alert('Error submitting your complaint. Please try again later.');
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './complaint-form/complaint-form.html',
  styleUrls: ['./complaint-form/complaint-form.css']
})
export class AppComponent {
  complaintText = '';
  email = '';

  onSubmit() {
    console.log('Complaint:', this.complaintText);
    console.log('Email:', this.email);
    alert('Thank you! Your complaint has been submitted.');
  }
}


//-------------------



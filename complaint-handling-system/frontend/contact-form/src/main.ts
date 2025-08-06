import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // ✅ Import the class you exported

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));

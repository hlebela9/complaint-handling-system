import { bootstrapApplication } from '@angular/platform-browser';
import { Dashboard } from './app/dashboard/dashboard';

bootstrapApplication(Dashboard)
  .catch(err => console.error(err));

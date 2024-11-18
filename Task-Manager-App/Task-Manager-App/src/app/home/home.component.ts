import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'; // Import the necessary modules
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserInfoService } from '../shared/user-info.service';

// import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: any;
  menuItems: any[] = [];


  isHandset$: Observable<boolean> ;

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userInfo: UserInfoService) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
   
    this.user = this.userInfo.get('currentUser', 'session');

    this.router.navigate(['/home/dashboard'])

    if (this.user.role === 'admin') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/home/dashboard' }, 
         { label: 'user', icon: 'group', route: '/home/user' },
        { label: 'profile', icon: 'person', route: '/home/profile' },
      ]
    }
 
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  


}

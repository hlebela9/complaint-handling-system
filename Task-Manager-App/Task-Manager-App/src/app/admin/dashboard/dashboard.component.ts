import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from '../../shared/user-info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  
  // Data for dashboard sections
  totalUsers: number = 100; // Replace with actual data
  totalTasks: number = 50; // Replace with actual data
  recentActivities: any[] = [
    { action: 'Task creation', description: 'New task added by John Doe' },
    { action: 'Task update', description: 'Task ID 123 updated by Jane Smith' },
    { action: 'Task deletion', description: 'Task ID 456 deleted by Admin' }
  ];

  // Placeholder data for table functionality
  displayedColumns: string[] = ['Name', 'Email', 'Role', 'Actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([
    { Name: 'John Doe', Email: 'johndoe@example.com', Role: 'Admin', Actions: 'Edit Delete' }
  ]);

  user: any;

  // Initialize approvedSchedule and monthSchedules with default empty arrays
  approvedSchedule: any[] = [];
  monthSchedules: any[] = [];

  constructor(private router: Router, private userService: UserInfoService) {
    // Fetch user data from sessionStorage
    this.user = sessionStorage.getItem('currentUser');
    this.user = JSON.parse(this.user);

    // Fetch data for total users, total tasks, and recent activity
    this.fetchTotalUsers();
    this.fetchTotalTasks();
    this.fetchRecentActivity();
  }

  ngOnInit() {
    // Any other logic needed for component initialization
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Data fetching methods
  private fetchTotalUsers() {
    // Your API call or database query to get total users
    // this.totalUsers = fetchedTotalUsers;
  }

  private fetchTotalTasks() {
    // Your API call or database query to get total tasks
    // this.totalTasks = fetchedTotalTasks;
  }

  private fetchRecentActivity() {
    // Your API call or database query to get recent activity
    // this.recentActivities = fetchedRecentActivity;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

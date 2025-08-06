import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface Complaint {
  department: any;
  complain: any;
  id: number;
  userId: string;
  type: string;
  classification: string;
  status: 'Unprocessed' | 'Processing' | 'Processed' | 'Escalated' | 'Resolved';
  dateTime: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  complaints: Complaint[] = [
    {
      id: 1, userId: 'USER001', complain: 'Text', type: 'Service', department: undefined, 
      classification: 'Urgent', status: 'Unprocessed', dateTime: '2023-05-15T10:30:00'
    },
    {
      id: 2, userId: 'USER002', complain: 'Voicenote', type: 'Billing', department: 'Billing', 
      classification: 'Normal', status: 'Processing', dateTime: '2023-05-16T11:45:00'
    },
    {
      id: 3, userId: 'USER003', complain: 'Screenshot', type: 'Technical', department: 'Card', 
      classification: 'Critical', status: 'Processed', dateTime: '2023-05-17T09:15:00'
    },
    {
      id: 4, userId: 'USER004', complain: 'file', type: 'Account', department: 'Froud', 
      classification: 'Normal', status: 'Escalated', dateTime: '2023-05-18T14:20:00'
    },
    {
      id: 5, userId: 'USER005', complain: 'file', type: 'Service', department: 'Technical Support', 
      classification: 'Urgent', status: 'Unprocessed', dateTime: '2023-05-19T16:10:00'
    }
  ];
  
  filteredComplaints: Complaint[] = [];
  filterStatus: string = 'All';
  monthlyStats: number[] = [12, 19, 15, 8, 12, 15, 18, 14, 10, 13, 16, 20];
  chart: Chart | undefined;
  unprocessedCount: number = 0;
  processingCount: number = 0;
  escalatedCount: number = 0;
  resolvedCount: number = 0;

  ngOnInit() {
    this.filteredComplaints = this.complaints;
    this.updateStatusCounts();
    this.createChart();
  }

  updateStatusCounts() {
    this.unprocessedCount = this.complaints.filter(c => c.status === 'Unprocessed').length;
    this.processingCount = this.complaints.filter(c => c.status === 'Processing').length;
    this.escalatedCount = this.complaints.filter(c => c.status === 'Escalated').length;
    this.resolvedCount = this.complaints.filter(c => c.status === 'Resolved').length;
  }

  createChart() {
    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Complaints',
          data: this.monthlyStats,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Complaints'
            }
          }
        }
      }
    });
  }

  applyFilter() {
    if (this.filterStatus === 'All') {
      this.filteredComplaints = this.complaints;
    } else {
      this.filteredComplaints = this.complaints.filter(
        complaint => complaint.status === this.filterStatus
      );
    }
    this.updateStatusCounts();
  }

  onStatusChange() {
    this.updateStatusCounts();
    this.applyFilter();
  }
}
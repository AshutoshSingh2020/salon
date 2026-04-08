import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dashboard</h2>
    <div class="grid">
      <div class="card">
        <h4>Total Bookings</h4>
        <strong>{{ stats?.totalBookings }}</strong>
      </div>
      <div class="card">
        <h4>Today's Bookings</h4>
        <strong>{{ stats?.todayBookings }}</strong>
      </div>
      <div class="card">
        <h4>Total Revenue</h4>
        <strong>{{ stats?.totalRevenue | currency:'INR' }}</strong>
      </div>
    </div>

    <div class="card" *ngIf="stats?.popularServices?.length">
      <h4>Popular Services</h4>
      <ul>
        <li *ngFor="let item of stats.popularServices">
          {{ item.name }} ({{ item.count }})
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        margin-bottom: 16px;
      }
    `
  ]
})
export class DashboardComponent implements OnInit {
  stats: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe((data) => (this.stats = data));
  }
}

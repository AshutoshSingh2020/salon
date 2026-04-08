import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-staff-reports",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Staff Performance</h2>
    <div class="card">
      <div class="filters">
        <label>
          Date
          <input type="date" [(ngModel)]="staffDate" />
        </label>
        <label>
          Month
          <input type="month" [(ngModel)]="staffMonth" />
        </label>
        <button (click)="loadStaffReport()">Load</button>
      </div>
      <table class="table" *ngIf="staffReport.length">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Assigned Services</th>
            <th>Total Bookings</th>
            <th>Completed</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of staffReport">
            <td>{{ row.name }}</td>
            <td>{{ row.assigned_services }}</td>
            <td>{{ row.total_bookings }}</td>
            <td>{{ row.completed_bookings }}</td>
            <td>{{ row.revenue | currency:'INR' }}</td>
          </tr>
        </tbody>
      </table>
      <p class="status" *ngIf="staffStatus">{{ staffStatus }}</p>
    </div>
  `,
  styles: [
    `
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }
      .filters {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: flex-end;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      input {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }
      button {
        background: var(--accent);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 12px;
      }
      .table th,
      .table td {
        padding: 10px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }
      .status {
        color: var(--muted);
        margin: 8px 0 0;
      }
    `
  ]
})
export class StaffReportsComponent {
  staffDate = "";
  staffMonth = "";
  staffReport: any[] = [];
  staffStatus = "";

  constructor(private adminService: AdminService) {}

  loadStaffReport(): void {
    this.staffStatus = "";
    this.staffReport = [];
    const params: { date?: string; month?: string } = {};
    if (this.staffDate) {
      params.date = this.staffDate;
    } else if (this.staffMonth) {
      params.month = this.staffMonth;
    }
    this.adminService.getStaffReport(params).subscribe({
      next: (res) => {
        this.staffReport = res.data || [];
        if (!this.staffReport.length) {
          this.staffStatus = "No data for selected period.";
        }
      },
      error: (err) => (this.staffStatus = getApiErrorMessage(err, "Failed to load staff report."))
    });
  }
}

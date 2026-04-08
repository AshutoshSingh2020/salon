import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Reports</h2>
    <div class="card">
      <label>
        Daily Revenue
        <input type="date" [(ngModel)]="date" />
      </label>
      <button (click)="loadDaily()">Fetch</button>
      <div *ngIf="dailyTotal !== null">Total: {{ dailyTotal | currency:'INR' }}</div>
    </div>

    <div class="card">
      <label>
        Monthly Revenue
        <input type="month" [(ngModel)]="month" />
      </label>
      <button (click)="loadMonthly()">Fetch</button>
      <div *ngIf="monthlyTotal !== null">Total: {{ monthlyTotal | currency:'INR' }}</div>
    </div>

  `,
  styles: [
    `
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        margin-bottom: 12px;
        display: grid;
        gap: 8px;
        max-width: 360px;
      }
      label {
        display: grid;
        gap: 6px;
      }
      button {
        width: fit-content;
        background: var(--accent);
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
      }
    `
  ]
})
export class ReportsComponent {
  date = "";
  month = "";
  dailyTotal: number | null = null;
  monthlyTotal: number | null = null;

  constructor(private adminService: AdminService) {}

  loadDaily(): void {
    if (!this.date) return;
    this.adminService.getDailyReport(this.date).subscribe((res) => (this.dailyTotal = res.total));
  }

  loadMonthly(): void {
    if (!this.month) return;
    this.adminService.getMonthlyReport(this.month).subscribe((res) => (this.monthlyTotal = res.total));
  }
}

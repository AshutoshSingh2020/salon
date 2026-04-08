import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BookingService } from "../../services/booking.service";
import { getApiErrorMessage } from "../../utils/api-error";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Bookings</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Service</th>
          <th>Staff</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Action</th>
          <th>Check-In</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let booking of bookings">
          <td>{{ booking.customer_name }}</td>
          <td>{{ booking.service_name }}</td>
          <td>{{ booking.staff_name || "Unassigned" }}</td>
          <td>{{ booking.booking_date }}</td>
          <td>{{ booking.start_time }}</td>
          <td>
            <select [(ngModel)]="booking.newStatus" [name]="'status-' + booking.id">
              <option *ngFor="let option of statusOptions" [ngValue]="option.value">
                {{ option.label }}
              </option>
            </select>
          </td>
          <td>
            <button (click)="updateStatus(booking)">Update</button>
          </td>
          <td>
            <div class="checkin">
              <input
                type="text"
                placeholder="Code"
                [(ngModel)]="booking.checkInCodeInput"
                [name]="'code-' + booking.id"
                [disabled]="isCheckInDisabled(booking)"
              />
              <button
                type="button"
                (click)="checkIn(booking)"
                [disabled]="isCheckInDisabled(booking)"
              >
                Check In
              </button>
            </div>
          </td>
          <td>
            <div class="payment">
              <span class="pill" [class.inactive]="booking.payment_mode === 'offline'">
                {{ booking.payment_mode || "offline" }}
              </span>
              <small>{{ booking.payment_status }}</small>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="status">{{ status }}</p>
  `,
  styles: [
    `
      .table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 12px;
        overflow: hidden;
      }
      th, td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }
      select {
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
      }
      .checkin {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .checkin input {
        width: 90px;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
      }
      button {
        background: var(--accent);
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .payment {
        display: grid;
        gap: 4px;
        font-size: 12px;
      }
      .pill {
        background: #dcfce7;
        color: #166534;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        width: fit-content;
      }
      .pill.inactive {
        background: #e5e7eb;
        color: #374151;
      }
      .status {
        color: var(--muted);
        margin-top: 12px;
      }
    `
  ]
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  status = "";
  statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "checked_in", label: "Checked In" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  constructor(
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.bookingService.listBookings().subscribe({
      next: (data) => {
        this.bookings = data.map((b) => ({ ...b, newStatus: b.status, checkInCodeInput: "" }));
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Failed to load bookings."))
    });
  }

  updateStatus(booking: any): void {
    this.status = "";
    this.bookingService.updateStatus(booking.id, booking.newStatus).subscribe({
      next: () => {
        booking.status = booking.newStatus;
        this.status = "Status updated.";
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Status update failed."))
    });
  }

  isCheckInDisabled(booking: any): boolean {
    return ["checked_in", "completed", "cancelled"].includes(booking.status);
  }

  checkIn(booking: any): void {
    this.status = "";
    if (!booking.checkInCodeInput) {
      this.status = "Enter check-in code.";
      this.toast.warn(this.status);
      return;
    }
    this.bookingService.checkIn(booking.id, booking.checkInCodeInput).subscribe({
      next: () => {
        booking.status = "checked_in";
        booking.newStatus = "checked_in";
        this.status = "Checked in.";
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Invalid check-in code."))
    });
  }
}

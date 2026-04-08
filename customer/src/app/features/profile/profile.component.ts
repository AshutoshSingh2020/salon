import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BookingService } from "../../services/booking.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>My Bookings</h2>
    <div class="list">
      <div class="item" *ngFor="let booking of bookings">
        <strong>{{ booking.service_name }}</strong>
        <div>{{ booking.booking_date }} • {{ booking.start_time }}</div>
        <div class="status">Status: {{ booking.status }}</div>
        <div class="code" *ngIf="showCheckInCode(booking)">
          Check-in Code: <span>{{ booking.check_in_code }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .list {
        display: grid;
        gap: 12px;
      }
      .item {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }
      .status {
        color: var(--muted);
      }
      .code {
        margin-top: 6px;
        font-size: 13px;
        color: #111827;
      }
      .code span {
        background: #e5e7eb;
        padding: 2px 6px;
        border-radius: 6px;
        font-weight: 600;
      }
    `
  ]
})
export class ProfileComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe((data) => (this.bookings = data));
  }

  showCheckInCode(booking: any): boolean {
    if (!booking?.check_in_code) return false;
    return !["cancelled", "completed"].includes(booking.status);
  }
}

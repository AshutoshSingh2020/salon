import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ServicesService } from "../../services/services.service";
import { BookingService } from "../../services/booking.service";
import { AuthService } from "../../services/auth.service";
import { getCustomerApiErrorMessage, getCustomerApiFieldErrors } from "../../utils/api-error";

@Component({
  selector: "app-booking",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Book an Appointment</h2>

    <div class="login-box" *ngIf="!auth.isLoggedIn()">
      <h3>Quick Login</h3>
      <p>Enter your phone to continue booking.</p>
      <div class="login-row">
        <input type="text" [(ngModel)]="loginPhone" name="loginPhone" placeholder="Phone number" />
        <button type="button" (click)="loginWithPhone()">Continue</button>
      </div>
      <small class="field-error" *ngIf="loginSubmitted && !loginPhone.trim()">Phone number is required.</small>
      <small class="field-error" *ngIf="loginSubmitted && !!loginPhone.trim() && loginPhone.trim().length < 7">Phone number should be at least 7 digits.</small>
      <small class="field-error" *ngIf="loginFieldError('phone')">{{ loginFieldError("phone") }}</small>
      <p class="status">{{ loginStatus }}</p>
    </div>

    <div class="booking-layout">
    <form #bookingForm="ngForm" (ngSubmit)="submit(bookingForm)" class="form">
      <label>
        Service
        <select [(ngModel)]="form.serviceId" name="serviceId" required (change)="loadSlots()">
          <option [ngValue]="null">Select service</option>
          <option *ngFor="let service of services" [ngValue]="service.id">
            {{ service.name }} ({{ service.duration_minutes }} min)
          </option>
        </select>
        <small class="field-error" *ngIf="controlError('serviceId')">{{ controlError("serviceId") }}</small>
        <small class="field-error" *ngIf="fieldError('serviceId')">{{ fieldError("serviceId") }}</small>
      </label>

      <label>
        Date
        <input type="date" [(ngModel)]="form.bookingDate" name="bookingDate" required (change)="loadSlots()" />
        <small class="field-error" *ngIf="controlError('bookingDate')">{{ controlError("bookingDate") }}</small>
        <small class="field-error" *ngIf="fieldError('bookingDate')">{{ fieldError("bookingDate") }}</small>
      </label>

      <label>
        Available Slots
        <div class="slots">
          <button
            type="button"
            *ngFor="let slot of slots"
            (click)="selectSlot(slot)"
            [class.active]="form.startTime === slot.startTime"
          >
            {{ slot.startTime }}
          </button>
        </div>
        <div class="selected" *ngIf="form.startTime">Selected slot: {{ form.startTime }}</div>
        <small class="field-error" *ngIf="controlError('startTime')">{{ controlError("startTime") }}</small>
        <small class="field-error" *ngIf="fieldError('startTime')">{{ fieldError("startTime") }}</small>
      </label>

      <label>
        Name
        <input type="text" [(ngModel)]="form.customerName" name="customerName" required minlength="2" />
        <small class="field-error" *ngIf="controlError('customerName')">{{ controlError("customerName") }}</small>
        <small class="field-error" *ngIf="fieldError('customerName')">{{ fieldError("customerName") }}</small>
      </label>

      <label>
        Phone
        <input type="text" [(ngModel)]="form.customerPhone" name="customerPhone" required minlength="7" />
        <small class="field-error" *ngIf="controlError('customerPhone')">{{ controlError("customerPhone") }}</small>
        <small class="field-error" *ngIf="fieldError('customerPhone')">{{ fieldError("customerPhone") }}</small>
      </label>

      <label>
        Email
        <input type="email" [(ngModel)]="form.customerEmail" name="customerEmail" />
        <small class="field-error" *ngIf="controlError('customerEmail')">{{ controlError("customerEmail") }}</small>
        <small class="field-error" *ngIf="fieldError('customerEmail')">{{ fieldError("customerEmail") }}</small>
      </label>

      <label>
        Payment Mode
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" [(ngModel)]="form.paymentMode" name="paymentMode" value="offline" />
            Offline (Pay at salon)
          </label>
          <label class="radio-item">
            <input type="radio" [(ngModel)]="form.paymentMode" name="paymentMode" value="online" />
            Online (Pay now)
          </label>
        </div>
      </label>

      <button type="submit" [disabled]="isSubmitting">Confirm Booking</button>
    </form>
    <div class="image-panel"></div>
    </div>

    <p class="status">{{ status }}</p>
    <div class="toast" *ngIf="toastVisible">{{ toastMessage }}</div>

    <div class="modal-backdrop" *ngIf="showPaymentModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Dummy Payment Gateway</h3>
          <button type="button" class="close" (click)="closePaymentModal()">×</button>
        </div>
        <p>Service: {{ selectedService?.name }}</p>
        <p>Amount: {{ selectedService?.price | currency:'INR' }}</p>
        <p>Date: {{ form.bookingDate }} • {{ form.startTime }}</p>
        <div class="actions">
          <button type="button" (click)="confirmDummyPayment()">Pay Now</button>
          <button type="button" class="ghost" (click)="closePaymentModal()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .form {
        display: grid;
        gap: 16px;
        max-width: 420px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }
      label {
        display: grid;
        gap: 8px;
        font-size: 14px;
      }
      input, select {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }
      button {
        background: var(--brand);
        color: white;
        border: none;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .slots {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .slots button {
        background: #e5e7eb;
        color: var(--text);
      }
      .slots button.active {
        background: var(--brand);
        color: white;
      }
      .selected {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }
      .field-error {
        color: #b91c1c;
        font-size: 12px;
      }
      .status {
        margin-top: 12px;
        color: var(--muted);
      }
      .radio-group {
        display: grid;
        gap: 6px;
      }
      .radio-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }
      .toast {
        position: fixed;
        right: 24px;
        bottom: 24px;
        background: #111827;
        color: white;
        padding: 12px 16px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      }
      .booking-layout {
        display: grid;
        grid-template-columns: minmax(280px, 420px) 1fr;
        gap: 24px;
        align-items: stretch;
      }
      .image-panel {
        border-radius: 12px;
        background: linear-gradient(135deg, #fcd34d, #f97316);
        min-height: 420px;
        position: relative;
        overflow: hidden;
      }
      .image-panel::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.4), transparent 40%),
          radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.3), transparent 40%);
      }
      .login-box {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
      }
      .login-row {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .login-row input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }
      .login-row button {
        background: var(--brand);
        color: white;
        border: none;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      @media (max-width: 900px) {
        .booking-layout {
          grid-template-columns: 1fr;
        }
        .image-panel {
          min-height: 240px;
        }
      }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: grid;
        place-items: center;
        z-index: 1000;
      }
      .modal {
        background: white;
        padding: 20px;
        border-radius: 12px;
        width: 100%;
        max-width: 420px;
        border: 1px solid #e5e7eb;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .close {
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
      .actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .ghost {
        background: transparent;
        color: var(--text);
        border: 1px solid #e5e7eb;
      }
    `
  ]
})
export class BookingComponent implements OnInit {
  services: any[] = [];
  slots: any[] = [];
  status = "";
  isSubmitting = false;
  toastVisible = false;
  toastMessage = "";
  bookingCode = "";
  loginPhone = "";
  loginStatus = "";
  loginSubmitted = false;
  submitted = false;
  fieldErrors: Record<string, string[]> = {};
  loginFieldErrors: Record<string, string[]> = {};
  showPaymentModal = false;

  form: any = {
    serviceId: null,
    bookingDate: "",
    startTime: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    paymentMode: "offline"
  };

  constructor(
    private servicesService: ServicesService,
    private bookingService: BookingService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.servicesService.getServices().subscribe((data) => (this.services = data));
  }

  loadSlots(): void {
    if (!this.form.serviceId || !this.form.bookingDate) {
      this.slots = [];
      this.form.startTime = "";
      this.bookingCode = "";
      return;
    }
    this.form.startTime = "";
    this.status = "";
    this.bookingCode = "";
    this.bookingService
      .getAvailability(this.form.bookingDate, this.form.serviceId)
      .subscribe({
        next: (slots) => {
          this.slots = slots || [];
          if (!this.slots.length) {
            this.status = "No slots available for the selected date.";
          }
        },
        error: (err) => {
          this.status = getCustomerApiErrorMessage(err, "Unable to load available slots.");
        }
      });
  }

  selectSlot(slot: any): void {
    this.form.startTime = slot.startTime;
  }

  submit(_formRef: NgForm): void {
    this.submitted = true;
    this.fieldErrors = {};
    if (!this.auth.isLoggedIn()) {
      this.status = "Please login with phone number to book.";
      return;
    }
    if (!this.form.serviceId) {
      this.status = "Please select a service.";
      return;
    }
    if (!this.form.bookingDate) {
      this.status = "Please select a booking date.";
      return;
    }
    if (!this.form.customerName || String(this.form.customerName).trim().length < 2) {
      this.status = "Please enter your name.";
      return;
    }
    if (!this.form.customerPhone || String(this.form.customerPhone).trim().length < 7) {
      this.status = "Please enter a valid phone number.";
      return;
    }
    if (this.form.customerEmail) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(this.form.customerEmail).trim());
      if (!validEmail) {
        this.status = "Please enter a valid email address.";
        return;
      }
    }
    if (!this.form.startTime) {
      this.status = "Please choose a slot.";
      return;
    }
    if (this.form.paymentMode === "online") {
      this.showPaymentModal = true;
      return;
    }
    this.createBooking(false);
  }

  confirmDummyPayment(): void {
    this.showPaymentModal = false;
    this.createBooking(true);
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  private createBooking(paymentCompleted: boolean): void {
    this.isSubmitting = true;
    const bookedTime = this.form.startTime;
    const payload = {
      ...this.form,
      paymentCompleted
    };
    this.bookingService.createBooking(payload).subscribe({
      next: (res: any) => {
        this.bookingCode = res?.checkInCode || "";
        this.status = this.bookingCode
          ? `Booking confirmed. Your check-in code is ${this.bookingCode}. Keep it until the booking is cancelled or completed.`
          : "Booking confirmed.";
        this.showToast("Booking confirmed.");
        this.isSubmitting = false;
        this.form.startTime = "";
        this.slots = this.slots.filter((slot) => slot.startTime !== bookedTime);
      },
      error: (err) => {
        this.fieldErrors = getCustomerApiFieldErrors(err);
        this.status = getCustomerApiErrorMessage(err, "Booking failed. Please try again.");
        this.isSubmitting = false;
      }
    });
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 2500);
  }

  get selectedService(): any {
    return this.services.find((service) => service.id === this.form.serviceId);
  }

  loginWithPhone(): void {
    this.loginSubmitted = true;
    this.loginFieldErrors = {};
    this.loginStatus = "";
    if (!this.loginPhone.trim()) {
      this.loginStatus = "Phone number is required.";
      return;
    }
    if (this.loginPhone.trim().length < 7) {
      this.loginStatus = "Phone number should be at least 7 digits.";
      return;
    }
    this.auth.loginWithPhone(this.loginPhone).subscribe({
      next: () => {
        this.loginStatus = "Logged in.";
        this.status = "";
      },
      error: (err) => {
        this.loginFieldErrors = getCustomerApiFieldErrors(err);
        this.loginStatus = getCustomerApiErrorMessage(err, "Login failed. Please try again.");
      }
    });
  }

  fieldError(name: string): string {
    const list = this.fieldErrors[name];
    if (!Array.isArray(list) || !list.length) return "";
    return list[0];
  }

  loginFieldError(name: string): string {
    const list = this.loginFieldErrors[name];
    if (!Array.isArray(list) || !list.length) return "";
    return list[0];
  }

  controlError(name: string): string {
    if (!this.submitted) return "";
    if (name === "serviceId" && !this.form.serviceId) return "Please select a service.";
    if (name === "bookingDate" && !this.form.bookingDate) return "Please select a date.";
    if (name === "startTime" && !this.form.startTime) return "Please select an available slot.";
    if (name === "customerName") {
      const value = String(this.form.customerName || "").trim();
      if (value.length < 2) return "Name should be at least 2 characters.";
    }
    if (name === "customerPhone") {
      const value = String(this.form.customerPhone || "").trim();
      if (value.length < 7) return "Phone number should be at least 7 digits.";
    }
    if (name === "customerEmail") {
      const value = String(this.form.customerEmail || "").trim();
      if (!value) return "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
    }
    return "";
  }
}

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { getCustomerApiErrorMessage, getCustomerApiFieldErrors } from "../../utils/api-error";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wrap">
      <div class="card">
        <form (ngSubmit)="loginWithPhone()" class="form">
          <label>
            Phone Number
            <input type="text" [(ngModel)]="phone" name="phone" required minlength="7" />
          </label>
          <small class="field-error" *ngIf="submitted && !phone.trim()">Phone number is required.</small>
          <small class="field-error" *ngIf="submitted && !!phone.trim() && phone.trim().length < 7">Phone number should be at least 7 digits.</small>
          <small class="field-error" *ngIf="fieldError('phone')">{{ fieldError("phone") }}</small>
          <button type="submit">Continue</button>
        </form>

        <p class="status">{{ status }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .wrap {
        display: grid;
        place-items: center;
        min-height: 70vh;
      }
      .card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        width: 100%;
        max-width: 380px;
      }
      .form {
        display: grid;
        gap: 10px;
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
        background: var(--brand);
        color: white;
        border: none;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .status {
        color: var(--muted);
        margin-top: 10px;
      }
      .field-error {
        color: #b91c1c;
        font-size: 12px;
        margin-top: -2px;
      }
    `
  ]
})
export class AuthComponent {
  status = "";
  submitted = false;
  fieldErrors: Record<string, string[]> = {};

  phone = "";

  constructor(private authService: AuthService, private router: Router) {}

  loginWithPhone(): void {
    this.submitted = true;
    this.fieldErrors = {};
    this.status = "";
    if (!this.phone.trim()) {
      this.status = "Phone number is required.";
      return;
    }
    if (this.phone.trim().length < 7) {
      this.status = "Phone number should be at least 7 digits.";
      return;
    }
    this.authService.loginWithPhone(this.phone).subscribe({
      next: () => this.router.navigate(["/profile"]),
      error: (err) => {
        this.fieldErrors = getCustomerApiFieldErrors(err);
        this.status = getCustomerApiErrorMessage(err, "Login failed. Please try again.");
      }
    });
  }

  fieldError(name: string): string {
    const list = this.fieldErrors[name];
    if (!Array.isArray(list) || !list.length) return "";
    return list[0];
  }
}

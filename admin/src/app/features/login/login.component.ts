import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TenantContextService } from "../../services/tenant-context.service";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wrap">
      <form class="card" (ngSubmit)="login()">
        <h2>Admin Login</h2>
        <label>
          Email
          <input type="email" [(ngModel)]="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" [(ngModel)]="password" name="password" required />
        </label>
        <button type="submit">Sign In</button>
        <p class="status">{{ status }}</p>
      </form>
    </div>
  `,
  styles: [
    `
      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #f8fafc, #fef3c7);
      }
      .card {
        background: white;
        padding: 32px;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        width: 100%;
        max-width: 360px;
        display: grid;
        gap: 12px;
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
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .status {
        color: var(--muted);
        margin: 0;
      }
    `
  ]
})
export class LoginComponent {
  email = "";
  password = "";
  status = "";

  constructor(
    private authService: AuthService,
    private tenantContext: TenantContextService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        if (!this.authService.isAdmin()) {
          this.authService.logout();
          this.status = "Access denied. Admin role required.";
          return;
        }
        this.tenantContext.setSelectedTenantDomain(null);
        const payload = this.authService.getPayload();
        if (payload?.tenantId) {
          this.tenantContext.setSelectedTenantId(Number(payload.tenantId));
        }
        if (payload?.role === "super_admin") {
          this.status = "Select a tenant before opening dashboard.";
          this.router.navigate(["/tenants"]);
          return;
        }
        if (!payload?.tenantId) {
          this.authService.logout();
          this.status = "No tenant is assigned to this account.";
          return;
        }
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.status = getApiErrorMessage(err, "Login failed. Check your credentials.");
      }
    });
  }
}

import { Component, OnInit } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { AdminService } from "../../services/admin.service";
import { TenantContextService } from "../../services/tenant-context.service";

@Component({
  selector: "admin-shell",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <h2>Salon Admin</h2>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">Dashboard</a>
          <a routerLink="/staff" routerLinkActive="active" class="sidebar-link">Staff</a>
          <a routerLink="/reports" routerLinkActive="active" class="sidebar-link">Reports</a>
          <a routerLink="/staff-reports" routerLinkActive="active" class="sidebar-link">Staff Reports</a>
          <a *ngIf="isSuperAdmin" routerLink="/services" routerLinkActive="active" class="sidebar-link">Services</a>
          <a routerLink="/bookings" routerLinkActive="active" class="sidebar-link">Bookings</a>
          <a routerLink="/reviews" routerLinkActive="active" class="sidebar-link">Reviews</a>
          <a *ngIf="isSuperAdmin" routerLink="/gallery" routerLinkActive="active" class="sidebar-link">Gallery</a>
          <a *ngIf="isSuperAdmin" routerLink="/about" routerLinkActive="active" class="sidebar-link">About Us</a>
          <a *ngIf="isSuperAdmin" routerLink="/contacts" routerLinkActive="active" class="sidebar-link">Contact Requests</a>
          <a *ngIf="isSuperAdmin" routerLink="/pages" routerLinkActive="active" class="sidebar-link">Pages</a>
          <a *ngIf="isSuperAdmin" routerLink="/menus" routerLinkActive="active" class="sidebar-link">Menus</a>
          <a *ngIf="isSuperAdmin" routerLink="/tenants" routerLinkActive="active" class="sidebar-link">Tenants</a>
          <div *ngIf="isSuperAdmin" class="sidebar-section">Theme</div>
          <a *ngIf="isSuperAdmin" routerLink="/theme/header" routerLinkActive="active" class="sidebar-link submenu">Header</a>
          <a *ngIf="isSuperAdmin" routerLink="/theme/footer" routerLinkActive="active" class="sidebar-link submenu">Footer</a>
          <a *ngIf="isSuperAdmin" routerLink="/settings" routerLinkActive="active" class="sidebar-link">Settings</a>
        </nav>
      </aside>
      <main class="content">
        <div class="topbar">
          <span>Admin Panel</span>
          <div class="topbar-actions">
            <label *ngIf="isSuperAdmin" class="tenant-select">
              <span>Tenant</span>
              <select [ngModel]="selectedTenantId" (ngModelChange)="onTenantChange($event)">
                <option *ngFor="let tenant of tenants" [ngValue]="tenant.id">
                  {{ tenant.name }}
                </option>
              </select>
            </label>
            <button class="logout" (click)="logout()">Logout</button>
          </div>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        display: grid;
        grid-template-columns: 240px 1fr;
        min-height: 100vh;
      }
      .sidebar {
        background: white;
        padding: 24px;
        border-right: 1px solid #e5e7eb;
      }
      .content {
        padding: 32px;
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .tenant-select {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--muted);
      }
      .tenant-select select {
        border: 1px solid #e5e7eb;
        padding: 6px 10px;
        border-radius: 8px;
        background: white;
      }
      .logout {
        border: none;
        background: var(--accent);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      nav {
        display: grid;
        gap: 8px;
      }
      .sidebar-section {
        margin-top: 12px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--muted);
      }
      .submenu {
        padding-left: 12px;
        font-size: 14px;
      }
    `
  ]
})
export class AdminShellComponent implements OnInit {
  tenants: Array<{ id: number; name: string }> = [];
  selectedTenantId: number | null = null;
  isSuperAdmin = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private adminService: AdminService,
    private tenantContext: TenantContextService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.auth.isSuperAdmin();
    if (!this.isSuperAdmin) return;
    this.adminService.listTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants || [];
        const saved = this.tenantContext.getSelectedTenantId();
        if (saved && this.tenants.some((t) => t.id === saved)) {
          this.selectedTenantId = saved;
          return;
        }
        if (this.tenants.length) {
          this.selectedTenantId = this.tenants[0].id;
          this.tenantContext.setSelectedTenantId(this.selectedTenantId);
        }
      }
    });
  }

  onTenantChange(value: number) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    this.selectedTenantId = parsed;
    this.tenantContext.setSelectedTenantId(parsed);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}

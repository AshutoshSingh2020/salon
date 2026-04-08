import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import { TenantContextService } from "../../services/tenant-context.service";
import { AuthService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/api-error";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-tenants",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h2>Tenants</h2>
          <p class="muted">Switch tenants, manage domains, or start onboarding.</p>
        </div>
        <a class="primary" routerLink="/tenants/onboard">New Tenant Wizard</a>
      </div>

      <section class="card">
        <h3>Create Tenant (Quick)</h3>
        <div class="grid">
          <label>
            Name
            <input type="text" [(ngModel)]="createForm.name" />
          </label>
          <label>
            Domain (optional)
            <input type="text" [(ngModel)]="createForm.domain" placeholder="salonA.localhost" />
          </label>
        </div>
        <button class="primary" (click)="createTenant()">Create Tenant</button>
        <p class="status">{{ createStatus }}</p>
      </section>

      <section class="card" *ngIf="!isSuperAdmin">
        <p class="muted">Only super admins can manage tenants.</p>
      </section>

      <section class="card" *ngIf="isSuperAdmin">
        <h3>All Tenants</h3>
        <div class="tenant-list">
          <div class="tenant-row" *ngFor="let tenant of tenants">
            <div>
              <strong>{{ tenant.name }}</strong>
              <div class="muted">
                ID: {{ tenant.id }} • Status: {{ tenant.status }} • Admins: {{ tenant.admin_count ?? 0 }}
              </div>
            </div>
            <div class="actions">
              <button class="ghost" (click)="setActiveTenant(tenant.id)">Switch</button>
              <button class="ghost" (click)="loadDomains(tenant.id)">Domains</button>
              <a class="ghost" [routerLink]="['/tenants', tenant.id, 'onboard']">Onboard Admin</a>
            </div>
          </div>
        </div>
      </section>

      <section class="card" *ngIf="selectedTenantId">
        <div class="header-row">
          <h3>Domains for Tenant #{{ selectedTenantId }}</h3>
          <span class="muted">Active tenant: {{ activeTenantId || "none" }}</span>
        </div>
        <div class="domain-list">
          <div class="domain-row" *ngFor="let domain of domains">
            <span>{{ domain.domain }}</span>
            <span class="pill" *ngIf="domain.is_primary">Primary</span>
          </div>
        </div>
        <div class="grid">
          <label>
            New Domain
            <input type="text" [(ngModel)]="domainForm.domain" placeholder="salonB.localhost" />
          </label>
          <label class="checkbox">
            <input type="checkbox" [(ngModel)]="domainForm.isPrimary" />
            Set as primary
          </label>
        </div>
        <button class="primary" (click)="addDomain()">Add Domain</button>
        <p class="status">{{ domainStatus }}</p>

        <div class="header-row">
          <h3>Admins for Tenant #{{ selectedTenantId }}</h3>
          <span class="muted">Total: {{ tenantAdminsCount }}</span>
        </div>
        <div class="tenant-list" *ngIf="tenantAdmins.length; else noAdmins">
          <div class="tenant-row" *ngFor="let admin of tenantAdmins">
            <div>
              <strong>{{ admin.name }}</strong>
              <div class="muted">{{ admin.email }} • {{ admin.phone || "No phone" }}</div>
            </div>
            <span class="pill">{{ admin.role }}</span>
          </div>
        </div>
        <ng-template #noAdmins>
          <p class="muted">No admins found for this tenant.</p>
        </ng-template>
        <p class="status">{{ adminsStatus }}</p>
      </section>
    </div>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 20px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 20px;
        display: grid;
        gap: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .tenant-list {
        display: grid;
        gap: 12px;
      }
      .tenant-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .domain-list {
        display: grid;
        gap: 8px;
      }
      .domain-row {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 6px;
      }
      .pill {
        background: #eef2ff;
        color: #4338ca;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 12px;
      }
      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .primary {
        background: var(--accent);
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
      }
      .ghost {
        background: transparent;
        border: 1px solid #e5e7eb;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .status {
        color: var(--muted);
        margin: 0;
      }
      .muted {
        color: var(--muted);
      }
      @media (max-width: 720px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .tenant-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
      }
    `
  ]
})
export class TenantsComponent implements OnInit {
  tenants: any[] = [];
  domains: any[] = [];
  selectedTenantId: number | null = null;
  activeTenantId: number | null = null;
  createForm = { name: "", domain: "" };
  domainForm = { domain: "", isPrimary: false };
  tenantAdmins: any[] = [];
  tenantAdminsCount = 0;
  createStatus = "";
  domainStatus = "";
  adminsStatus = "";
  isSuperAdmin = false;

  constructor(
    private adminService: AdminService,
    private tenantContext: TenantContextService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.auth.isSuperAdmin();
    this.activeTenantId = this.tenantContext.getSelectedTenantId();
    if (this.isSuperAdmin) {
      this.loadTenants();
    }
  }

  loadTenants() {
    this.adminService.listTenants().subscribe({
      next: (data) => {
        this.tenants = data || [];
      },
      error: (err) => (this.createStatus = getApiErrorMessage(err, "Failed to load tenants."))
    });
  }

  createTenant() {
    if (!this.createForm.name.trim()) {
      this.createStatus = "Name is required.";
      this.toast.warn(this.createStatus);
      return;
    }
    this.adminService.createTenant({ name: this.createForm.name.trim(), domain: this.createForm.domain || undefined }).subscribe({
      next: () => {
        this.createStatus = "Tenant created.";
        this.createForm = { name: "", domain: "" };
        this.loadTenants();
      },
      error: (err) => {
        this.createStatus = getApiErrorMessage(err, "Failed to create tenant.");
      }
    });
  }

  setActiveTenant(tenantId: number) {
    this.tenantContext.setSelectedTenantId(tenantId);
    this.activeTenantId = tenantId;
    this.domainStatus = "Switched active tenant.";
  }

  loadDomains(tenantId: number) {
    this.selectedTenantId = tenantId;
    this.adminService.listTenantDomains(tenantId).subscribe({
      next: (data) => {
        this.domains = data || [];
      },
      error: (err) => (this.domainStatus = getApiErrorMessage(err, "Failed to load domains."))
    });
    this.loadAdmins(tenantId);
  }

  loadAdmins(tenantId: number) {
    this.adminService.listTenantAdmins(tenantId).subscribe({
      next: (data) => {
        this.tenantAdmins = data?.admins || [];
        this.tenantAdminsCount = data?.totalAdmins || 0;
        this.adminsStatus = "";
      },
      error: (err) => {
        this.tenantAdmins = [];
        this.tenantAdminsCount = 0;
        this.adminsStatus = getApiErrorMessage(err, "Failed to load tenant admins.");
      }
    });
  }

  addDomain() {
    if (!this.selectedTenantId) return;
    if (!this.domainForm.domain.trim()) {
      this.domainStatus = "Domain is required.";
      this.toast.warn(this.domainStatus);
      return;
    }
    this.adminService
      .addTenantDomain(this.selectedTenantId, {
        domain: this.domainForm.domain.trim(),
        isPrimary: this.domainForm.isPrimary
      })
      .subscribe({
        next: () => {
          this.domainStatus = "Domain added.";
          this.domainForm = { domain: "", isPrimary: false };
          this.loadDomains(this.selectedTenantId as number);
        },
        error: (err) => {
          this.domainStatus = getApiErrorMessage(err, "Failed to add domain.");
        }
      });
  }
}

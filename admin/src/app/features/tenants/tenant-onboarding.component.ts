import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import { TenantContextService } from "../../services/tenant-context.service";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-tenant-onboarding",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h2>Tenant Onboarding</h2>
          <p class="muted">Create a tenant, admin account, and auto-provision starter pages.</p>
          <p class="muted" *ngIf="existingTenantId">Onboarding admin for tenant #{{ existingTenantId }}.</p>
        </div>
        <button class="ghost" (click)="goBack()">Back</button>
      </div>

      <div class="steps">
        <div class="step" [class.active]="step === 1">1. Tenant</div>
        <div class="step" [class.active]="step === 2">2. Admin</div>
        <div class="step" [class.active]="step === 3">3. Defaults</div>
        <div class="step" [class.active]="step === 4">4. Done</div>
      </div>

      <section class="card" *ngIf="step === 1">
        <h3>Tenant Details</h3>
        <label>
          Salon Name
          <input type="text" [(ngModel)]="form.name" (input)="updateSlug()" />
        </label>
        <label>
          Slug (auto)
          <input type="text" [(ngModel)]="form.slug" />
        </label>
        <div class="grid">
          <label class="radio">
            <input type="radio" name="mode" value="subdomain" [(ngModel)]="form.domainMode" />
            Subdomain
          </label>
          <label class="radio">
            <input type="radio" name="mode" value="custom" [(ngModel)]="form.domainMode" />
            Custom domain
          </label>
        </div>
        <div *ngIf="form.domainMode === 'subdomain'" class="grid">
          <label>
            Base Domain
            <input type="text" [(ngModel)]="form.baseDomain" (input)="updateDomain()" placeholder="localhost" />
          </label>
          <label>
            Generated Domain
            <input type="text" [value]="computedDomain" disabled />
          </label>
        </div>
        <label *ngIf="form.domainMode === 'custom'">
          Custom Domain
          <input type="text" [(ngModel)]="form.customDomain" placeholder="salonA.com" />
        </label>
        <div class="actions">
          <button class="primary" (click)="next()">Next</button>
        </div>
      </section>

      <section class="card" *ngIf="step === 2">
        <h3>Admin Account</h3>
        <div class="grid">
          <label>
            Admin Name
            <input type="text" [(ngModel)]="form.adminName" />
          </label>
          <label>
            Admin Email
            <input type="email" [(ngModel)]="form.adminEmail" />
          </label>
          <label>
            Admin Phone
            <input type="text" [(ngModel)]="form.adminPhone" />
          </label>
          <label>
            Admin Password
            <input type="password" [(ngModel)]="form.adminPassword" />
          </label>
        </div>
        <div class="actions">
          <button class="ghost" (click)="prev()">Back</button>
          <button class="primary" (click)="next()">Next</button>
        </div>
      </section>

      <section class="card" *ngIf="step === 3">
        <h3>Auto-Provision Defaults</h3>
        <label class="checkbox">
          <input type="checkbox" [(ngModel)]="form.seedDefaults" />
          Create default pages + menu + salon settings
        </label>
        <label>
          Timezone
          <input type="text" [(ngModel)]="form.timezone" placeholder="Asia/Kolkata" />
        </label>
        <div class="summary">
          <p><strong>Tenant:</strong> {{ existingTenantId ? ("#" + existingTenantId) : form.name }}</p>
          <p><strong>Domain:</strong> {{ existingTenantId ? "Use Domains tab" : (computedDomain || "Not set") }}</p>
          <p><strong>Admin:</strong> {{ form.adminEmail }}</p>
        </div>
        <div class="actions">
          <button class="ghost" (click)="prev()">Back</button>
          <button class="primary" (click)="provision()">Provision Tenant</button>
        </div>
        <p class="status">{{ status }}</p>
      </section>

      <section class="card" *ngIf="step === 4">
        <h3>Provisioned</h3>
        <p>Tenant created successfully.</p>
        <div class="summary">
          <p><strong>Tenant ID:</strong> {{ result?.tenantId }}</p>
          <p><strong>Admin ID:</strong> {{ result?.adminId }}</p>
          <p><strong>Domain:</strong> {{ computedDomain }}</p>
          <p><strong>Admin Email:</strong> {{ form.adminEmail }}</p>
        </div>
        <div class="actions">
          <button class="primary" (click)="switchAndExit()">Switch & Exit</button>
          <button class="ghost" (click)="goBack()">Back to Tenants</button>
        </div>
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
      .steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
      }
      .step {
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 999px;
        text-align: center;
        font-size: 12px;
        color: var(--muted);
      }
      .step.active {
        border-color: var(--accent);
        color: var(--accent);
        font-weight: 600;
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
      .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
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
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
      }
      .checkbox,
      .radio {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .summary {
        background: #f8fafc;
        padding: 12px;
        border-radius: 12px;
        border: 1px dashed #e2e8f0;
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
      }
    `
  ]
})
export class TenantOnboardingComponent implements OnInit {
  step = 1;
  status = "";
  result: { tenantId: number; adminId: number } | null = null;
  existingTenantId: number | null = null;

  form = {
    name: "",
    slug: "",
    domainMode: "subdomain",
    baseDomain: "localhost",
    customDomain: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    seedDefaults: true,
    timezone: "Asia/Kolkata"
  };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private tenantContext: TenantContextService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tenantId = this.route.snapshot.paramMap.get("id");
    if (tenantId) {
      const parsed = Number(tenantId);
      if (Number.isFinite(parsed)) {
        this.existingTenantId = parsed;
        this.step = 2;
      }
    }
  }

  get computedDomain(): string {
    if (this.form.domainMode === "custom") {
      return this.form.customDomain.trim();
    }
    const slug = this.form.slug || this.slugify(this.form.name);
    if (!slug) return "";
    const base = (this.form.baseDomain || "localhost").trim();
    return `${slug}.${base}`;
  }

  slugify(value: string): string {
    return (value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  updateSlug() {
    this.form.slug = this.slugify(this.form.name);
  }

  updateDomain() {
    // computed property will update
  }

  next() {
    if (this.step === 1 && !this.form.name.trim()) {
      this.status = "Tenant name is required.";
      return;
    }
    if (this.step === 2 && (!this.form.adminEmail.trim() || !this.form.adminPassword.trim())) {
      this.status = "Admin email and password are required.";
      return;
    }
    this.status = "";
    this.step += 1;
  }

  prev() {
    this.step = Math.max(1, this.step - 1);
  }

  provision() {
    if (this.existingTenantId) {
      this.status = "Creating admin...";
      this.adminService
        .createTenantAdmin(this.existingTenantId, {
          adminName: this.form.adminName.trim() || "Admin",
          adminEmail: this.form.adminEmail.trim(),
          adminPhone: this.form.adminPhone.trim() || "0000000000",
          adminPassword: this.form.adminPassword,
          timezone: this.form.timezone.trim() || undefined,
          seedDefaults: this.form.seedDefaults
        })
        .subscribe({
          next: (res) => {
            this.result = { tenantId: this.existingTenantId as number, adminId: res.adminId };
            this.status = "";
            this.step = 4;
          },
          error: (err) => {
            this.status = getApiErrorMessage(err, "Admin creation failed.");
          }
        });
      return;
    }
    const payload = {
      name: this.form.name.trim(),
      domain: this.computedDomain || undefined,
      adminName: this.form.adminName.trim() || this.form.name.trim(),
      adminEmail: this.form.adminEmail.trim(),
      adminPhone: this.form.adminPhone.trim() || "0000000000",
      adminPassword: this.form.adminPassword,
      timezone: this.form.timezone.trim() || undefined,
      seedDefaults: this.form.seedDefaults
    };
    this.status = "Provisioning...";
    this.adminService.provisionTenant(payload).subscribe({
      next: (res) => {
        this.result = res;
        this.status = "";
        this.step = 4;
      },
      error: (err) => {
        this.status = getApiErrorMessage(err, "Provision failed. Please check inputs.");
      }
    });
  }

  switchAndExit() {
    if (this.result?.tenantId) {
      this.tenantContext.setSelectedTenantId(this.result.tenantId);
    }
    this.router.navigate(["/tenants"]);
  }

  goBack() {
    this.router.navigate(["/tenants"]);
  }
}

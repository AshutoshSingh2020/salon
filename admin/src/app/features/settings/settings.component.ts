import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { AdminService } from "../../services/admin.service";
import { ToastService } from "../../services/toast.service";
import { getApiErrorMessage, getApiFieldErrors } from "../../utils/api-error";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Salon Settings</h2>
    <form class="card" #settingsForm="ngForm" (ngSubmit)="save(settingsForm)">
      <label>
        Opening Time
        <input type="time" [(ngModel)]="form.openTime" name="openTime" required />
      </label>
      <small class="field-error" *ngIf="controlError(settingsForm, 'openTime')">{{ controlError(settingsForm, "openTime") }}</small>
      <small class="field-error" *ngIf="fieldError('openTime')">{{ fieldError("openTime") }}</small>
      <label>
        Closing Time
        <input type="time" [(ngModel)]="form.closeTime" name="closeTime" required />
      </label>
      <small class="field-error" *ngIf="controlError(settingsForm, 'closeTime')">{{ controlError(settingsForm, "closeTime") }}</small>
      <small class="field-error" *ngIf="fieldError('closeTime')">{{ fieldError("closeTime") }}</small>
      <label>
        Slot Duration (minutes)
        <input type="number" [(ngModel)]="form.slotDurationMinutes" name="slotDurationMinutes" required min="1" />
      </label>
      <small class="field-error" *ngIf="controlError(settingsForm, 'slotDurationMinutes')">{{ controlError(settingsForm, "slotDurationMinutes") }}</small>
      <small class="field-error" *ngIf="fieldError('slotDurationMinutes')">{{ fieldError("slotDurationMinutes") }}</small>
      <label>
        Timezone
        <input type="text" [(ngModel)]="form.timezone" name="timezone" minlength="3" />
      </label>
      <small class="field-error" *ngIf="controlError(settingsForm, 'timezone')">{{ controlError(settingsForm, "timezone") }}</small>
      <small class="field-error" *ngIf="fieldError('timezone')">{{ fieldError("timezone") }}</small>
      <button type="submit">Save</button>
    </form>
    <p class="status">{{ status }}</p>
  `,
  styles: [
    `
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
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
      .status {
        color: var(--muted);
      }
      .field-error {
        margin-top: -2px;
        color: #b91c1c;
        font-size: 12px;
      }
    `
  ]
})
export class SettingsComponent implements OnInit {
  form: any = { openTime: "", closeTime: "", slotDurationMinutes: 30, timezone: "Asia/Kolkata" };
  status = "";
  submitted = false;
  fieldErrors: Record<string, string[]> = {};

  constructor(
    private adminService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.adminService.getSettings().subscribe({
      next: (data) => {
        if (!data) return;
        this.form = {
          openTime: String(data.open_time || "").slice(0, 5),
          closeTime: String(data.close_time || "").slice(0, 5),
          slotDurationMinutes: data.slot_duration_minutes,
          timezone: data.timezone || "Asia/Kolkata"
        };
      }
    });
  }

  save(formRef: NgForm): void {
    this.submitted = true;
    this.fieldErrors = {};
    if (formRef.invalid) {
      this.status = "Please fix highlighted fields.";
      this.toast.warn(this.status);
      return;
    }
    this.adminService.updateSettings(this.form).subscribe({
      next: () => {
        this.status = "Settings saved.";
        this.toast.success(this.status);
      },
      error: (err) => {
        this.fieldErrors = getApiFieldErrors(err);
        this.status = getApiErrorMessage(err, "Save failed.");
      }
    });
  }

  fieldError(name: string): string {
    const errors = this.fieldErrors[name];
    if (!Array.isArray(errors) || !errors.length) return "";
    return errors[0];
  }

  controlError(formRef: NgForm, controlName: string): string {
    const control = formRef.controls[controlName];
    if (!control || (!this.submitted && !control.touched)) return "";
    if (!control.invalid) return "";
    if (control.errors?.["required"]) return "This field is required.";
    if (control.errors?.["minlength"]) return `Minimum length is ${control.errors["minlength"].requiredLength}.`;
    if (control.errors?.["min"]) return "Value must be greater than 0.";
    return "Invalid value.";
  }
}

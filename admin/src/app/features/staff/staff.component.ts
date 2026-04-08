import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StaffService } from "../../services/staff.service";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-staff",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <h2>Staff</h2>
      <button class="add-btn" type="button" (click)="openModal()">+</button>
    </div>
    <div class="card" *ngFor="let member of staff">
      <div class="row">
        <strong>{{ member.name }}</strong>
        <span class="pill" [class.inactive]="!member.is_active">
          {{ member.is_active ? "Active" : "Inactive" }}
        </span>
      </div>
      <div class="chips">
        <span class="chip" *ngFor="let spec of parseSpecializations(member.specialization)">{{ spec }}</span>
      </div>
      <small>{{ member.phone }}</small>
      <div class="row-actions">
        <button type="button" (click)="openModal(member)">Edit</button>
        <button type="button" class="danger" (click)="remove(member.id)">Delete</button>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="modalOpen">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingId ? "Edit Staff" : "Add Staff" }}</h3>
          <button type="button" class="close" (click)="closeModal()">×</button>
        </div>
        <form class="form" (ngSubmit)="save()">
          <label>
            Name
            <input type="text" [(ngModel)]="form.name" name="name" required />
          </label>
          <label>
            Phone
            <input type="text" [(ngModel)]="form.phone" name="phone" required />
          </label>
          <label>
            Specializations (comma separated)
            <input type="text" [(ngModel)]="form.specialization" name="specialization" required />
          </label>
          <label class="toggle">
            <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" />
            Active
          </label>
          <div class="actions">
            <button type="submit">{{ editingId ? "Update" : "Create" }}</button>
            <button type="button" class="ghost" (click)="closeModal()">Cancel</button>
          </div>
          <p class="status">{{ status }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .add-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--accent);
        color: white;
        font-size: 22px;
        cursor: pointer;
      }
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        margin-bottom: 12px;
      }
      .form {
        display: grid;
        gap: 8px;
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
      .actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      button {
        background: var(--accent);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      button.ghost {
        background: transparent;
        color: var(--brand);
        border: 1px solid #e5e7eb;
      }
      .row-actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
      .row-actions .danger {
        background: #ef4444;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 6px 0;
      }
      .chip {
        background: #e5e7eb;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 12px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .pill {
        background: #dcfce7;
        color: #166534;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }
      .pill.inactive {
        background: #fee2e2;
        color: #991b1b;
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .status {
        color: var(--muted);
        margin: 0;
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
        margin-bottom: 12px;
      }
      .close {
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
    `
  ]
})
export class StaffComponent implements OnInit {
  staff: any[] = [];
  status = "";
  editingId: number | null = null;
  form: any = { name: "", phone: "", specialization: "", isActive: true };
  modalOpen = false;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.staffService.listAll().subscribe((data) => (this.staff = data));
  }

  openModal(member?: any): void {
    if (member) {
      this.editingId = member.id;
      this.form = {
        name: member.name,
        phone: member.phone,
        specialization: member.specialization,
        isActive: !!member.is_active
      };
    } else {
      this.editingId = null;
      this.form = { name: "", phone: "", specialization: "", isActive: true };
    }
    this.status = "";
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.resetForm();
  }

  save(): void {
    this.status = "";
    const payload = {
      name: this.form.name,
      phone: this.form.phone,
      specialization: this.form.specialization,
      isActive: !!this.form.isActive
    };
    if (this.editingId) {
      this.staffService.update(this.editingId, payload).subscribe({
        next: () => {
          this.status = "Staff updated.";
          this.closeModal();
          this.load();
        },
        error: (err) => (this.status = getApiErrorMessage(err, "Update failed."))
      });
      return;
    }
    this.staffService.create(payload).subscribe({
      next: () => {
        this.status = "Staff created.";
        this.closeModal();
        this.load();
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Create failed."))
    });
  }

  remove(id: number): void {
    this.staffService.remove(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.status = getApiErrorMessage(err, "Delete failed."))
    });
  }

  parseSpecializations(value: string): string[] {
    if (!value) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: "", phone: "", specialization: "", isActive: true };
  }
}

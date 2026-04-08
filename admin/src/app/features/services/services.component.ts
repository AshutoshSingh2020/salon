import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ServicesService } from "../../services/services.service";
import { RouterLink } from "@angular/router";
import { getApiErrorMessage, getApiFieldErrors } from "../../utils/api-error";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="header">
      <h2>Service Management</h2>
      <button class="add-btn" type="button" (click)="openModal()">+</button>
    </div>
    <div class="card" *ngFor="let service of services">
      <div class="row">
        <strong>{{ service.name }}</strong>
        <span class="pill" [class.inactive]="!service.is_active">
          {{ service.is_active ? "Active" : "Inactive" }}
        </span>
      </div>
      <div>{{ service.description }}</div>
      <small>{{ service.duration_minutes }} min • {{ service.price | currency:'INR' }}</small>
      <div class="row-actions">
        <button type="button" (click)="openModal(service)">Edit</button>
        <a class="ghost" [routerLink]="['/services', service.id, 'detail']">Detail Page</a>
        <button type="button" class="danger" (click)="remove(service.id)">Delete</button>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="modalOpen">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingId ? "Edit Service" : "Add Service" }}</h3>
          <button type="button" class="close" (click)="closeModal()">×</button>
        </div>
        <form class="form" #serviceForm="ngForm" (ngSubmit)="save(serviceForm)">
          <label>
            Name
            <input type="text" [(ngModel)]="form.name" name="name" required minlength="3" />
          </label>
          <small class="field-error" *ngIf="controlError(serviceForm, 'name')">{{ controlError(serviceForm, "name") }}</small>
          <small class="field-error" *ngIf="fieldError('name')">{{ fieldError("name") }}</small>
          <label>
            Category
            <input type="text" [(ngModel)]="form.category" name="category" placeholder="Hair, Beard, Spa" />
          </label>
          <small class="field-error" *ngIf="fieldError('category')">{{ fieldError("category") }}</small>
          <label>
            Description
            <textarea rows="3" [(ngModel)]="form.description" name="description" required minlength="5"></textarea>
          </label>
          <small class="field-error" *ngIf="controlError(serviceForm, 'description')">{{ controlError(serviceForm, "description") }}</small>
          <small class="field-error" *ngIf="fieldError('description')">{{ fieldError("description") }}</small>
          <label>
            Details
            <textarea rows="3" [(ngModel)]="form.details" name="details" placeholder="What is included in this service"></textarea>
          </label>
          <small class="field-error" *ngIf="fieldError('details')">{{ fieldError("details") }}</small>
          <label>
            Benefits
            <textarea rows="3" [(ngModel)]="form.benefits" name="benefits" placeholder="One per line or comma separated"></textarea>
          </label>
          <small class="field-error" *ngIf="fieldError('benefits')">{{ fieldError("benefits") }}</small>
          <small class="helper">Tip: add multiple benefits separated by new lines or commas.</small>
          <label>
            Aftercare
            <textarea rows="3" [(ngModel)]="form.aftercare" name="aftercare" placeholder="Care instructions after service"></textarea>
          </label>
          <small class="field-error" *ngIf="fieldError('aftercare')">{{ fieldError("aftercare") }}</small>
          <label>
            Price (INR)
            <input type="number" [(ngModel)]="form.price" name="price" required min="1" />
          </label>
          <small class="field-error" *ngIf="controlError(serviceForm, 'price')">{{ controlError(serviceForm, "price") }}</small>
          <small class="field-error" *ngIf="fieldError('price')">{{ fieldError("price") }}</small>
          <label>
            Duration (minutes)
            <input type="number" [(ngModel)]="form.durationMinutes" name="durationMinutes" required min="1" />
          </label>
          <small class="field-error" *ngIf="controlError(serviceForm, 'durationMinutes')">{{ controlError(serviceForm, "durationMinutes") }}</small>
          <small class="field-error" *ngIf="fieldError('durationMinutes')">{{ fieldError("durationMinutes") }}</small>
          <label>
            Service Image
            <input type="file" accept="image/*" (change)="onFileChange($event)" />
          </label>
          <small class="field-error" *ngIf="fieldError('image')">{{ fieldError("image") }}</small>
          <small class="file-name" *ngIf="imageName">Selected: {{ imageName }}</small>
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
      .form {
        display: grid;
        gap: 8px;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      input, textarea {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: inherit;
      }
      .file-name {
        color: var(--muted);
        font-size: 12px;
      }
      .helper {
        color: var(--muted);
        font-size: 12px;
        margin-top: -4px;
      }
      .field-error {
        color: #b91c1c;
        font-size: 12px;
        margin-top: -4px;
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
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
      .row-actions .ghost {
        background: transparent;
        color: var(--brand);
        border: 1px solid #e5e7eb;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 8px;
      }
      .row-actions .danger {
        background: #ef4444;
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
        max-width: 640px;
        max-height: 85vh;
        overflow: auto;
        border: 1px solid #e5e7eb;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        position: sticky;
        top: 0;
        background: white;
        padding-bottom: 8px;
        z-index: 1;
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
export class ServicesComponent implements OnInit {
  services: any[] = [];
  status = "";
  editingId: number | null = null;
  modalOpen = false;
  submitted = false;
  fieldErrors: Record<string, string[]> = {};
  imageFile: File | null = null;
  imageName = "";
  form: any = {
    name: "",
    category: "",
    description: "",
    details: "",
    benefits: "",
    aftercare: "",
    price: "",
    durationMinutes: "",
    isActive: true
  };

  constructor(
    private servicesService: ServicesService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.servicesService.listAll().subscribe((data) => (this.services = data));
  }

  openModal(service?: any): void {
    this.submitted = false;
    this.fieldErrors = {};
    if (service) {
      this.editingId = service.id;
      this.form = {
        name: service.name,
        category: service.category || "",
        description: service.description,
        details: service.details || "",
        benefits: service.benefits || "",
        aftercare: service.aftercare || "",
        price: service.price,
        durationMinutes: service.duration_minutes,
        isActive: !!service.is_active
      };
      this.imageFile = null;
      this.imageName = service.image_url ? service.image_url.split("/").pop() : "";
    } else {
      this.editingId = null;
      this.form = {
        name: "",
        category: "",
        description: "",
        details: "",
        benefits: "",
        aftercare: "",
        price: "",
        durationMinutes: "",
        isActive: true
      };
      this.imageFile = null;
      this.imageName = "";
    }
    this.status = "";
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.resetForm();
  }

  save(formRef: NgForm): void {
    this.submitted = true;
    this.fieldErrors = {};
    this.status = "";
    if (formRef.invalid) {
      this.status = "Please fix highlighted fields.";
      this.toast.warn(this.status);
      return;
    }
    const formData = new FormData();
    formData.append("name", this.form.name);
    formData.append("category", this.form.category || "");
    formData.append("description", this.form.description);
    formData.append("details", this.form.details || "");
    formData.append("benefits", this.form.benefits || "");
    formData.append("aftercare", this.form.aftercare || "");
    formData.append("price", String(Number(this.form.price)));
    formData.append("durationMinutes", String(Number(this.form.durationMinutes)));
    formData.append("isActive", String(!!this.form.isActive));
    if (this.imageFile) {
      formData.append("image", this.imageFile);
    }
    if (this.editingId) {
      this.servicesService.update(this.editingId, formData).subscribe({
        next: () => {
          this.status = "Service updated.";
          this.toast.success(this.status);
          this.closeModal();
          this.load();
        },
        error: (err) => {
          this.fieldErrors = getApiFieldErrors(err);
          this.status = getApiErrorMessage(err, "Update failed.");
        }
      });
      return;
    }
    this.servicesService.create(formData).subscribe({
      next: () => {
        this.status = "Service created.";
        this.toast.success(this.status);
        this.closeModal();
        this.load();
      },
      error: (err) => {
        this.fieldErrors = getApiFieldErrors(err);
        this.status = getApiErrorMessage(err, "Create failed.");
      }
    });
  }

  remove(id: number): void {
    this.servicesService.remove(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.status = getApiErrorMessage(err, "Delete failed."))
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form = {
      name: "",
      category: "",
      description: "",
      details: "",
      benefits: "",
      aftercare: "",
      price: "",
      durationMinutes: "",
      isActive: true
    };
    this.imageFile = null;
    this.imageName = "";
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFile = input.files[0];
      this.imageName = this.imageFile.name;
    }
  }

  fieldError(name: string): string {
    const list = this.fieldErrors[name];
    if (!Array.isArray(list) || !list.length) return "";
    return list[0];
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

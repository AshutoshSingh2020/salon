import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ContentService } from "../../../services/content.service";
import { getCustomerApiErrorMessage, getCustomerApiFieldErrors } from "../../../utils/api-error";

@Component({
  selector: "app-contact-form-section",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="hero">
      <div>
        <span class="badge">{{ data?.badge || "Contact Us" }}</span>
        <h1>{{ data?.heading || "We are here to help" }}</h1>
        <p>{{ data?.subtitle || "Tell us what you need. Our team responds quickly during working hours." }}</p>
      </div>
      <div class="card">
        <h3>{{ data?.hoursTitle || "Salon Hours" }}</h3>
        <p *ngFor="let line of hours">{{ line }}</p>
        <p class="muted" *ngIf="data?.supportText">{{ data.supportText }}</p>
      </div>
    </section>

    <section class="form-wrap">
      <form class="form" (ngSubmit)="submit()">
        <div class="row">
          <label>
            Full Name
            <input type="text" [(ngModel)]="form.name" name="name" required minlength="2" />
            <small class="field-error" *ngIf="controlError('name')">{{ controlError("name") }}</small>
            <small class="field-error" *ngIf="fieldError('name')">{{ fieldError("name") }}</small>
          </label>
          <label>
            Phone
            <input type="text" [(ngModel)]="form.phone" name="phone" />
            <small class="field-error" *ngIf="controlError('phone')">{{ controlError("phone") }}</small>
            <small class="field-error" *ngIf="fieldError('phone')">{{ fieldError("phone") }}</small>
          </label>
        </div>
        <div class="row">
          <label>
            Email
            <input type="email" [(ngModel)]="form.email" name="email" />
            <small class="field-error" *ngIf="controlError('email')">{{ controlError("email") }}</small>
            <small class="field-error" *ngIf="fieldError('email')">{{ fieldError("email") }}</small>
          </label>
          <label>
            Subject
            <input type="text" [(ngModel)]="form.subject" name="subject" />
            <small class="field-error" *ngIf="fieldError('subject')">{{ fieldError("subject") }}</small>
          </label>
        </div>
        <label>
          Message
          <textarea rows="5" [(ngModel)]="form.message" name="message" required minlength="5"></textarea>
          <small class="field-error" *ngIf="controlError('message')">{{ controlError("message") }}</small>
          <small class="field-error" *ngIf="fieldError('message')">{{ fieldError("message") }}</small>
        </label>
        <button type="submit" [disabled]="isSubmitting">
          {{ data?.ctaText || "Send Message" }}
        </button>
        <p class="status">{{ status }}</p>
      </form>
      <div class="side">
        <h3>{{ data?.visitTitle || "Visit Us" }}</h3>
        <p class="muted">{{ data?.visitSubtitle || "Walk-ins are welcome. For priority service, book in advance." }}</p>
        <div class="box">
          <strong>{{ data?.locationName || "Salonify Studio" }}</strong>
          <span *ngFor="let line of addressLines">{{ line }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        display: grid;
        grid-template-columns: minmax(260px, 1fr) minmax(240px, 0.8fr);
        gap: 24px;
        padding: 28px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color: white;
        margin-bottom: 28px;
      }
      .badge {
        display: inline-flex;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      .hero h1 {
        margin: 0 0 8px;
      }
      .hero p {
        margin: 0;
        color: #e2e8f0;
      }
      .card {
        background: rgba(255, 255, 255, 0.1);
        padding: 18px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .card p {
        margin: 6px 0;
      }
      .form-wrap {
        display: grid;
        grid-template-columns: minmax(280px, 1.2fr) minmax(220px, 0.8fr);
        gap: 24px;
      }
      .form {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 18px;
        display: grid;
        gap: 12px;
      }
      .row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      input,
      textarea {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: inherit;
      }
      button {
        background: var(--brand);
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 10px;
        cursor: pointer;
      }
      .status {
        color: var(--muted);
        margin: 0;
      }
      .field-error {
        color: #b91c1c;
        font-size: 12px;
        margin-top: -2px;
      }
      .side {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 18px;
        display: grid;
        gap: 12px;
      }
      .box {
        display: grid;
        gap: 6px;
        background: white;
        border-radius: 12px;
        padding: 12px;
        border: 1px solid #e5e7eb;
      }
      .muted {
        color: var(--muted);
      }
      @media (max-width: 900px) {
        .hero,
        .form-wrap {
          grid-template-columns: 1fr;
        }
        .row {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ContactFormSectionComponent {
  @Input() data: any = {};
  form: any = {
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  };
  status = "";
  isSubmitting = false;
  submitted = false;
  fieldErrors: Record<string, string[]> = {};

  constructor(private contentService: ContentService) {}

  get hours(): string[] {
    if (Array.isArray(this.data?.hours)) return this.data.hours;
    return ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: Closed"];
  }

  get addressLines(): string[] {
    if (Array.isArray(this.data?.addressLines)) return this.data.addressLines;
    return ["21 MG Road, Bengaluru", "India"];
  }

  isValid(): boolean {
    return (
      !!this.form.name &&
      this.form.name.trim().length >= 2 &&
      !!this.form.message &&
      this.form.message.trim().length >= 5 &&
      (!!this.form.phone || !!this.form.email)
    );
  }

  submit(): void {
    this.submitted = true;
    this.fieldErrors = {};
    if (!this.isValid()) {
      this.status = "Please correct the highlighted fields.";
      return;
    }
    this.isSubmitting = true;
    this.status = "";
    this.contentService.submitContact(this.form).subscribe({
      next: () => {
        this.status = "Thanks! Your message has been sent.";
        this.form = { name: "", phone: "", email: "", subject: "", message: "" };
        this.isSubmitting = false;
      },
      error: (err) => {
        this.fieldErrors = getCustomerApiFieldErrors(err);
        this.status = getCustomerApiErrorMessage(err, "We could not send your message. Please try again.");
        this.isSubmitting = false;
      }
    });
  }

  fieldError(name: string): string {
    const list = this.fieldErrors[name];
    if (!Array.isArray(list) || !list.length) return "";
    return list[0];
  }

  controlError(name: string): string {
    if (!this.submitted) return "";
    const value = (this.form?.[name] || "").toString().trim();
    if (name === "name" && value.length < 2) return "Name should be at least 2 characters.";
    if (name === "message" && value.length < 5) return "Message should be at least 5 characters.";
    if (name === "email" && value) {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) return "Please enter a valid email address.";
    }
    if (name === "phone" && !this.form.phone && !this.form.email) return "Add phone or email.";
    return "";
  }
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preview-contact-form-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div>
        <span class="badge">{{ data?.badge || "Contact Us" }}</span>
        <h2>{{ data?.heading || "We are here to help" }}</h2>
        <p>{{ data?.subtitle || "Tell us what you need." }}</p>
      </div>
      <div class="card">
        <h4>{{ data?.hoursTitle || "Salon Hours" }}</h4>
        <p *ngFor="let line of hours">{{ line }}</p>
      </div>
    </section>

    <section class="form-wrap">
      <div class="form">
        <div class="row">
          <div class="field"></div>
          <div class="field"></div>
        </div>
        <div class="row">
          <div class="field"></div>
          <div class="field"></div>
        </div>
        <div class="field tall"></div>
        <div class="button">Send Message</div>
      </div>
      <div class="side">
        <h4>{{ data?.visitTitle || "Visit Us" }}</h4>
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
        padding: 24px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color: white;
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
      .card {
        background: rgba(255, 255, 255, 0.1);
        padding: 18px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .form-wrap {
        display: grid;
        grid-template-columns: minmax(280px, 1.2fr) minmax(220px, 0.8fr);
        gap: 24px;
        margin-top: 20px;
      }
      .form,
      .side {
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
      .field {
        height: 38px;
        border-radius: 8px;
        background: #e2e8f0;
      }
      .field.tall {
        height: 90px;
      }
      .button {
        height: 40px;
        border-radius: 10px;
        background: #f97316;
        color: white;
        display: grid;
        place-items: center;
        font-weight: 600;
      }
      .box {
        display: grid;
        gap: 6px;
      }
      @media (max-width: 900px) {
        .hero,
        .form-wrap {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class PreviewContactFormSectionComponent {
  @Input() data: any = {};

  get hours(): string[] {
    if (Array.isArray(this.data?.hours)) return this.data.hours;
    return ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: Closed"];
  }

  get addressLines(): string[] {
    if (Array.isArray(this.data?.addressLines)) return this.data.addressLines;
    return ["21 MG Road, Bengaluru", "India"];
  }
}

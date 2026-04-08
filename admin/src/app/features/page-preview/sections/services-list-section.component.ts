import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preview-services-list-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="services">
      <div class="heading">
        <h3>{{ data?.heading || "Services" }}</h3>
        <p *ngIf="data?.subtitle">{{ data.subtitle }}</p>
      </div>
      <div class="grid">
        <div class="card" *ngFor="let item of mockCards">
          <div class="thumb"></div>
          <h4>{{ item }}</h4>
          <p>Sample service description</p>
          <div class="meta">45 min • ₹499</div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .services {
        display: grid;
        gap: 16px;
      }
      .heading h3 {
        margin: 0 0 6px;
      }
      .heading p {
        margin: 0;
        color: var(--muted);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }
      .thumb {
        height: 120px;
        border-radius: 10px;
        background: #e2e8f0;
        margin-bottom: 10px;
      }
      .meta {
        color: var(--muted);
        font-size: 13px;
      }
    `
  ]
})
export class PreviewServicesListSectionComponent {
  @Input() data: any = {};
  mockCards = ["Haircut", "Facial", "Spa"];
}

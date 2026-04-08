import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-testimonials-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="testimonials">
      <div class="header">
        <h3>{{ data?.heading || "Testimonials" }}</h3>
        <p *ngIf="data?.subtitle">{{ data.subtitle }}</p>
      </div>
      <div class="cards" *ngIf="items.length; else empty">
        <article *ngFor="let item of items">
          <p class="quote">"{{ item.quote || "Add a testimonial quote." }}"</p>
          <span class="name">- {{ item.name || "Guest" }}</span>
        </article>
      </div>
      <ng-template #empty>
        <div class="placeholder">Add testimonials to highlight client feedback.</div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .testimonials {
        padding: 24px;
        border-radius: 16px;
        background: #0f172a;
        color: white;
        display: grid;
        gap: 16px;
      }
      .header h3 {
        margin: 0 0 6px;
      }
      .header p {
        margin: 0;
        color: #cbd5f5;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      article {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .quote {
        margin: 0 0 10px;
      }
      .name {
        color: #e2e8f0;
        font-size: 13px;
      }
      .placeholder {
        padding: 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px dashed rgba(255, 255, 255, 0.2);
        color: #e2e8f0;
      }
    `
  ]
})
export class TestimonialsSectionComponent {
  @Input() data: any = {};

  get items() {
    return Array.isArray(this.data?.items) ? this.data.items : [];
  }
}

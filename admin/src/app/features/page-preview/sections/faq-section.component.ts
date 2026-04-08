import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preview-faq-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq">
      <h3>{{ data?.heading || "FAQ" }}</h3>
      <div class="items">
        <div class="item" *ngFor="let item of items">
          <strong>{{ item.q || "Question?" }}</strong>
          <p>{{ item.a || "Answer text goes here." }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .faq {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 16px;
        display: grid;
        gap: 12px;
      }
      .item {
        padding: 10px;
        border-radius: 10px;
        background: #f8fafc;
      }
      p {
        margin: 6px 0 0;
        color: var(--muted);
      }
    `
  ]
})
export class PreviewFaqSectionComponent {
  @Input() data: any = {};

  get items() {
    return Array.isArray(this.data?.items) ? this.data.items : [];
  }
}

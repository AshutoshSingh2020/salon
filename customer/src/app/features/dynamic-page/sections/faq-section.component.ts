import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-faq-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq">
      <h3>{{ data?.heading || "FAQ" }}</h3>
      <div class="items" *ngIf="items.length; else empty">
        <details *ngFor="let item of items">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </div>
      <ng-template #empty>
        <p class="muted">Add FAQ items to answer common questions.</p>
      </ng-template>
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
      summary {
        cursor: pointer;
        font-weight: 600;
      }
      p {
        margin: 8px 0 0;
        color: var(--muted);
      }
      .muted {
        color: var(--muted);
        margin: 0;
      }
    `
  ]
})
export class FaqSectionComponent {
  @Input() data: any = {};

  get items() {
    return Array.isArray(this.data?.items) ? this.data.items : [];
  }
}

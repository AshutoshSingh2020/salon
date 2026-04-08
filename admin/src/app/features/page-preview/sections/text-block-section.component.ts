import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preview-text-block-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="text-block">
      <h3 *ngIf="data?.heading">{{ data.heading }}</h3>
      <p>{{ data?.body || "Add text content for this section." }}</p>
    </section>
  `,
  styles: [
    `
      .text-block {
        padding: 24px;
        border-radius: 16px;
        background: white;
        border: 1px solid #e5e7eb;
      }
      h3 {
        margin: 0 0 8px;
      }
      p {
        margin: 0;
        color: var(--muted);
        white-space: pre-line;
      }
    `
  ]
})
export class PreviewTextBlockSectionComponent {
  @Input() data: any = {};
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preview-banner-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="banner">
      <div class="copy">
        <span class="badge" *ngIf="data?.badge">{{ data.badge }}</span>
        <h2>{{ data?.title || "Section Title" }}</h2>
        <p>{{ data?.subtitle || "Add a short subtitle for this banner." }}</p>
        <div class="cta" *ngIf="data?.ctaText && data?.ctaLink">
          <a class="primary" [href]="data.ctaLink" target="_blank" rel="noopener">{{ data.ctaText }}</a>
        </div>
      </div>
      <div class="media" *ngIf="imageUrl">
        <img [src]="imageUrl" [alt]="data?.title || 'Banner image'" />
      </div>
    </section>
  `,
  styles: [
    `
      .banner {
        display: grid;
        grid-template-columns: minmax(240px, 1.2fr) minmax(220px, 0.8fr);
        gap: 24px;
        padding: 28px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0f172a, #1f2937);
        color: white;
        align-items: center;
      }
      .badge {
        display: inline-flex;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-bottom: 10px;
      }
      h2 {
        margin: 0 0 8px;
        font-size: 30px;
      }
      p {
        margin: 0 0 16px;
        color: #e2e8f0;
      }
      .primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 10px;
        background: #f97316;
        color: #111827;
        font-weight: 600;
      }
      .media {
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      @media (max-width: 900px) {
        .banner {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class PreviewBannerSectionComponent {
  @Input() data: any = {};

  get imageUrl(): string {
    const images = Array.isArray(this.data?.images) ? this.data.images : [];
    const first = images.length ? images[0] : null;
    if (typeof first === "string") return first;
    if (first && typeof first === "object") return first.url || "";
    return this.data?.imageUrl || "";
  }
}

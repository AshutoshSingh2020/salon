import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-gallery-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="gallery">
      <div class="header">
        <h3>{{ data?.heading || "Gallery" }}</h3>
        <p *ngIf="data?.subtitle">{{ data.subtitle }}</p>
      </div>
      <div class="grid" *ngIf="images.length; else empty">
        <figure *ngFor="let image of images">
          <img [src]="image.url" [alt]="image.alt || 'Gallery image'" />
          <figcaption *ngIf="image.caption">{{ image.caption }}</figcaption>
        </figure>
      </div>
      <ng-template #empty>
        <div class="placeholder">Add images to this gallery section.</div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .gallery {
        padding: 24px;
        border-radius: 16px;
        background: white;
        border: 1px solid #e5e7eb;
        display: grid;
        gap: 16px;
      }
      .header h3 {
        margin: 0 0 6px;
      }
      .header p {
        margin: 0;
        color: var(--muted);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
      }
      figure {
        margin: 0;
        border-radius: 12px;
        overflow: hidden;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }
      img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        display: block;
      }
      figcaption {
        padding: 8px 10px;
        font-size: 12px;
        color: var(--muted);
      }
      .placeholder {
        padding: 16px;
        border-radius: 12px;
        background: #f8fafc;
        border: 1px dashed #e2e8f0;
        color: var(--muted);
      }
    `
  ]
})
export class GallerySectionComponent {
  @Input() data: any = {};

  get images() {
    return Array.isArray(this.data?.images) ? this.data.images : [];
  }
}

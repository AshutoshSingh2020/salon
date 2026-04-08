import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-banner-section",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="banner">
      <div class="copy">
        <span class="badge" *ngIf="data?.badge">{{ data.badge }}</span>
        <h2>{{ data?.title || "Section Title" }}</h2>
        <p>{{ data?.subtitle || "Add a short subtitle for this banner." }}</p>
        <div class="cta" *ngIf="data?.ctaText && data?.ctaLink">
          <ng-container *ngIf="isInternal(data.ctaLink); else externalCta">
            <a class="primary" [routerLink]="data.ctaLink">{{ data.ctaText }}</a>
          </ng-container>
          <ng-template #externalCta>
            <a class="primary" [href]="data.ctaLink" target="_blank" rel="noopener">{{ data.ctaText }}</a>
          </ng-template>
        </div>
      </div>
      <div class="media" *ngIf="imageList.length">
        <img [src]="imageList[activeIndex]" [alt]="data?.title || 'Banner image'" />
        <div class="dots" *ngIf="imageList.length > 1">
          <button
            type="button"
            *ngFor="let img of imageList; let i = index"
            [class.active]="i === activeIndex"
            (click)="setIndex(i)"
          ></button>
        </div>
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
        position: relative;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .dots {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        display: flex;
        gap: 6px;
        justify-content: center;
      }
      .dots button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
      }
      .dots button.active {
        background: #f97316;
      }
      @media (max-width: 900px) {
        .banner {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class BannerSectionComponent implements OnInit, OnDestroy {
  @Input() data: any = {};
  imageList: string[] = [];
  activeIndex = 0;
  private timer: any;

  ngOnInit(): void {
    const imagesRaw = Array.isArray(this.data?.images) ? this.data.images : [];
    const images = imagesRaw
      .map((item: any) => (typeof item === "string" ? item : item?.url))
      .filter((item: string) => !!item);
    const single = this.data?.imageUrl ? [this.data.imageUrl] : [];
    this.imageList = images.length ? images : single;
    if (this.imageList.length > 1) {
      this.timer = setInterval(() => {
        this.activeIndex = (this.activeIndex + 1) % this.imageList.length;
      }, 3500);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  isInternal(link: string): boolean {
    return typeof link === "string" && link.startsWith("/");
  }

  setIndex(index: number): void {
    this.activeIndex = index;
  }
}

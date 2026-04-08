import { Component, OnInit } from "@angular/core";
import { CommonModule, NgComponentOutlet } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ServicesService } from "../../services/services.service";
import { environment } from "../../../environments/environment";
import { BannerSectionComponent } from "../dynamic-page/sections/banner-section.component";
import { TextBlockSectionComponent } from "../dynamic-page/sections/text-block-section.component";
import { GallerySectionComponent } from "../dynamic-page/sections/gallery-section.component";
import { TestimonialsSectionComponent } from "../dynamic-page/sections/testimonials-section.component";
import { FaqSectionComponent } from "../dynamic-page/sections/faq-section.component";

@Component({
  selector: "app-service-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgComponentOutlet,
    BannerSectionComponent,
    TextBlockSectionComponent,
    GallerySectionComponent,
    TestimonialsSectionComponent,
    FaqSectionComponent
  ],
  template: `
    <a class="back" routerLink="/services">← Back to services</a>

    <div class="wrap" *ngIf="service && layout === 'default'">
      <div class="image" [style.backgroundImage]="imageUrl ? 'url(' + imageUrl + ')' : ''"></div>
      <div class="content">
        <h2>{{ service.name }}</h2>
        <p>{{ service.description }}</p>
        <div class="section" *ngIf="service.category">
          <span class="tag">{{ service.category }}</span>
        </div>
        <div class="meta">
          <span>{{ service.duration_minutes }} min</span>
          <span>{{ service.price | currency:'INR' }}</span>
        </div>
        <div class="section" *ngIf="service.details">
          <h4>Details</h4>
          <p class="muted">{{ service.details }}</p>
        </div>
        <div class="section" *ngIf="benefitsList.length">
          <h4>Benefits</h4>
          <ul class="list">
            <li *ngFor="let item of benefitsList">{{ item }}</li>
          </ul>
        </div>
        <div class="section" *ngIf="aftercareList.length">
          <h4>Aftercare</h4>
          <ul class="list">
            <li *ngFor="let item of aftercareList">{{ item }}</li>
          </ul>
        </div>
        <a class="cta" routerLink="/booking">Book This Service</a>
      </div>
    </div>

    <div class="blocks" *ngIf="sections.length">
      <ng-container *ngFor="let section of sections">
        <ng-container
          *ngComponentOutlet="resolveComponent(section.type); inputs: { data: section.data }"
        ></ng-container>
      </ng-container>
    </div>

    <p class="status" *ngIf="!service && loaded">Service not found.</p>
  `,
  styles: [
    `
      .back {
        display: inline-block;
        margin-bottom: 16px;
        color: var(--muted);
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(240px, 360px) 1fr;
        gap: 24px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
      }
      .image {
        min-height: 240px;
        border-radius: 12px;
        background: #f3f4f6;
        background-size: cover;
        background-position: center;
      }
      .content h2 {
        margin-top: 0;
      }
      .meta {
        display: flex;
        gap: 16px;
        margin: 12px 0 20px;
        color: var(--muted);
        font-weight: 600;
      }
      .section {
        margin: 12px 0 16px;
      }
      .section h4 {
        margin: 0 0 6px;
        font-size: 15px;
      }
      .muted {
        color: var(--muted);
        white-space: pre-line;
      }
      .tag {
        display: inline-flex;
        padding: 4px 10px;
        border-radius: 999px;
        background: #e0f2fe;
        color: #075985;
        font-weight: 600;
        font-size: 12px;
      }
      .list {
        margin: 0;
        padding-left: 18px;
        color: var(--muted);
      }
      .cta {
        display: inline-block;
        background: var(--brand);
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
      }
      .status {
        color: var(--muted);
      }
      .blocks {
        margin-top: 24px;
        display: grid;
        gap: 20px;
      }
      @media (max-width: 900px) {
        .wrap {
          grid-template-columns: 1fr;
        }
        .image {
          min-height: 200px;
        }
      }
    `
  ]
})
export class ServiceDetailComponent implements OnInit {
  service: any = null;
  loaded = false;
  imageUrl = "";
  benefitsList: string[] = [];
  aftercareList: string[] = [];
  layout: "default" | "custom" = "default";
  sections: any[] = [];

  constructor(private route: ActivatedRoute, private servicesService: ServicesService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) {
      this.loaded = true;
      return;
    }
    this.servicesService.getServiceDetail(id).subscribe({
      next: (data) => {
        const service = data?.service || null;
        this.service = service;
        this.layout = data?.layout === "custom" ? "custom" : "default";
        this.sections = data?.sections || [];
        if (service) {
          this.imageUrl = this.resolveImageUrl(service?.image_url);
          this.benefitsList = this.toList(service?.benefits);
          this.aftercareList = this.toList(service?.aftercare);
        }
        this.loaded = true;
      },
      error: () => {
        this.loaded = true;
      }
    });
  }

  private resolveImageUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = environment.apiBaseUrl.replace(/\/api$/, "");
    return `${base}${path}`;
  }

  private toList(value: string): string[] {
    if (!value) return [];
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  resolveComponent(type: string) {
    const map: Record<string, any> = {
      banner: BannerSectionComponent,
      text_block: TextBlockSectionComponent,
      gallery: GallerySectionComponent,
      testimonials: TestimonialsSectionComponent,
      faq: FaqSectionComponent
    };
    return map[type] || TextBlockSectionComponent;
  }
}

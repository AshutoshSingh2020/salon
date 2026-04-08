import { Component, OnInit } from "@angular/core";
import { CommonModule, NgComponentOutlet } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ContentService } from "../../services/content.service";
import { BannerSectionComponent } from "./sections/banner-section.component";
import { TextBlockSectionComponent } from "./sections/text-block-section.component";
import { GallerySectionComponent } from "./sections/gallery-section.component";
import { TestimonialsSectionComponent } from "./sections/testimonials-section.component";
import { ServicesListSectionComponent } from "./sections/services-list-section.component";
import { ContactFormSectionComponent } from "./sections/contact-form-section.component";
import { AboutContentSectionComponent } from "./sections/about-content-section.component";
import { FaqSectionComponent } from "./sections/faq-section.component";

@Component({
  selector: "app-dynamic-page",
  standalone: true,
  imports: [
    CommonModule,
    NgComponentOutlet,
    BannerSectionComponent,
    TextBlockSectionComponent,
    GallerySectionComponent,
    TestimonialsSectionComponent,
    ServicesListSectionComponent,
    ContactFormSectionComponent,
    AboutContentSectionComponent,
    FaqSectionComponent
  ],
  template: `
    <div class="page" *ngIf="page; else loading" [ngClass]="'template-' + (page?.template || 'default')">
      <div class="page-header" *ngIf="page.title">
        <h1>{{ page.title }}</h1>
        <p *ngIf="page.metaDescription">{{ page.metaDescription }}</p>
      </div>
      <ng-container *ngFor="let section of page.sections">
        <ng-container
          *ngComponentOutlet="resolveComponent(section.type); inputs: { data: section.data }"
        ></ng-container>
      </ng-container>
    </div>
    <ng-template #loading>
      <div class="state">{{ error || "Loading page..." }}</div>
    </ng-template>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 24px;
      }
      .template-promo {
        background: linear-gradient(180deg, rgba(249, 115, 22, 0.08), transparent 40%);
        padding: 12px;
        border-radius: 20px;
      }
      .template-story {
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.04), transparent 35%);
        padding: 12px;
        border-radius: 20px;
      }
      .page-header h1 {
        margin: 0 0 6px;
        font-size: 32px;
      }
      .page-header p {
        margin: 0;
        color: var(--muted);
      }
      .state {
        padding: 24px;
        border-radius: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: var(--muted);
      }
    `
  ]
})
export class DynamicPageComponent implements OnInit {
  page: any = null;
  error = "";

  private componentMap: Record<string, any> = {
    banner: BannerSectionComponent,
    text_block: TextBlockSectionComponent,
    gallery: GallerySectionComponent,
    testimonials: TestimonialsSectionComponent,
    services_list: ServicesListSectionComponent,
    contact_form: ContactFormSectionComponent,
    about_content: AboutContentSectionComponent,
    faq: FaqSectionComponent
  };

  constructor(private route: ActivatedRoute, private content: ContentService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get("slug") || (this.route.snapshot.data?.["slug"] as string) || "";
      this.load(slug);
    });
  }

  load(slug: string): void {
    this.error = "";
    this.page = null;
    this.content.getPageBySlug(slug).subscribe({
      next: (data) => (this.page = data),
      error: () => (this.error = "Page not found.")
    });
  }

  resolveComponent(type: string) {
    return this.componentMap[type] || TextBlockSectionComponent;
  }
}

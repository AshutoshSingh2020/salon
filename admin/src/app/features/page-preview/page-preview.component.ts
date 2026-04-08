import { Component, OnInit } from "@angular/core";
import { CommonModule, NgComponentOutlet } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import { PreviewBannerSectionComponent } from "./sections/banner-section.component";
import { PreviewTextBlockSectionComponent } from "./sections/text-block-section.component";
import { PreviewGallerySectionComponent } from "./sections/gallery-section.component";
import { PreviewTestimonialsSectionComponent } from "./sections/testimonials-section.component";
import { PreviewServicesListSectionComponent } from "./sections/services-list-section.component";
import { PreviewContactFormSectionComponent } from "./sections/contact-form-section.component";
import { PreviewAboutContentSectionComponent } from "./sections/about-content-section.component";
import { PreviewFaqSectionComponent } from "./sections/faq-section.component";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-page-preview",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgComponentOutlet,
    PreviewBannerSectionComponent,
    PreviewTextBlockSectionComponent,
    PreviewGallerySectionComponent,
    PreviewTestimonialsSectionComponent,
    PreviewServicesListSectionComponent,
    PreviewContactFormSectionComponent,
    PreviewAboutContentSectionComponent,
    PreviewFaqSectionComponent
  ],
  template: `
    <div class="header">
      <div>
        <h2>Page Preview</h2>
        <p class="hint">{{ page?.title || "Preview" }}</p>
      </div>
      <a class="ghost" routerLink="/pages">Back to Pages</a>
    </div>

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
      <div class="state">{{ error || "Loading preview..." }}</div>
    </ng-template>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .hint {
        margin: 6px 0 0;
        color: var(--muted);
      }
      .ghost {
        background: transparent;
        border: 1px solid #e5e7eb;
        color: #111827;
        padding: 8px 12px;
        border-radius: 8px;
        text-decoration: none;
      }
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
export class PagePreviewComponent implements OnInit {
  page: any = null;
  error = "";

  private componentMap: Record<string, any> = {
    banner: PreviewBannerSectionComponent,
    text_block: PreviewTextBlockSectionComponent,
    gallery: PreviewGallerySectionComponent,
    testimonials: PreviewTestimonialsSectionComponent,
    services_list: PreviewServicesListSectionComponent,
    contact_form: PreviewContactFormSectionComponent,
    about_content: PreviewAboutContentSectionComponent,
    faq: PreviewFaqSectionComponent
  };

  constructor(private route: ActivatedRoute, private admin: AdminService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.error = "Page not found.";
      return;
    }
    this.admin.getPage(id).subscribe({
      next: (data) => (this.page = data),
      error: (err) => (this.error = getApiErrorMessage(err, "Page not found."))
    });
  }

  resolveComponent(type: string) {
    return this.componentMap[type] || PreviewTextBlockSectionComponent;
  }
}

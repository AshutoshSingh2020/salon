import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { AdminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

type PageSectionDraft = {
  type: string;
  data: any;
  dataJson: string;
  jsonMode: boolean;
  error?: string;
};

@Component({
  selector: "app-page-editor",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CdkDropList, CdkDrag],
  template: `
    <div class="header">
      <div>
        <h2>{{ isNew ? "New Page" : "Edit Page" }}</h2>
        <p class="hint">URL preview: <span class="mono">/pages/{{ form.slug || "your-slug" }}</span></p>
      </div>
      <div class="header-actions">
        <button type="button" class="ghost" (click)="preview()" [disabled]="isNew || !form.slug">Preview</button>
        <button type="button" class="ghost" routerLink="/pages">Back</button>
        <button type="button" (click)="save()">Save</button>
        <button type="button" class="publish" (click)="publish()" [disabled]="!form.title || !form.slug">
          Publish
        </button>
      </div>
    </div>

    <form class="form">
      <div class="grid">
        <label>
          Title
          <input type="text" [(ngModel)]="form.title" name="title" (blur)="autoSlug()" />
        </label>
        <label>
          Slug
          <input type="text" [(ngModel)]="form.slug" name="slug" />
        </label>
        <label class="toggle">
          <input type="checkbox" [(ngModel)]="form.status" name="status" />
          Live
        </label>
      </div>
      <label>
        Meta Title
        <input type="text" [(ngModel)]="form.metaTitle" name="metaTitle" />
      </label>
      <label>
        Meta Description
        <textarea rows="3" [(ngModel)]="form.metaDescription" name="metaDescription"></textarea>
      </label>
      <label>
        Template
        <div class="template-row">
          <select [(ngModel)]="form.template" name="template">
            <option *ngFor="let template of templates" [value]="template.key">{{ template.label }}</option>
          </select>
          <button type="button" class="ghost" (click)="applyTemplate()">Apply Template</button>
        </div>
      </label>
    </form>

    <div class="sections">
      <div class="sections-head">
        <h3>Sections</h3>
        <div class="add-section">
          <select [(ngModel)]="newSectionType" name="newSectionType">
            <option *ngFor="let item of sectionTypes" [value]="item.type">{{ item.label }}</option>
          </select>
          <button type="button" class="ghost" (click)="addSection()">Add Section</button>
        </div>
      </div>

      <div class="section-list" cdkDropList (cdkDropListDropped)="drop($event)">
        <div class="section-card" *ngFor="let section of sections; let i = index" cdkDrag>
          <div class="section-bar">
            <div class="section-title">
              <span class="drag-handle" cdkDragHandle>⋮⋮</span>
              <strong>{{ section.type }}</strong>
            </div>
            <div class="section-actions">
              <button type="button" class="ghost" (click)="toggleJson(section)">
                {{ section.jsonMode ? "Hide JSON" : "Edit JSON" }}
              </button>
              <button type="button" class="danger" (click)="removeSection(i)">Remove</button>
            </div>
          </div>

          <div class="section-form" [ngSwitch]="section.type">
            <div *ngSwitchCase="'banner'" class="field-grid">
              <label>
                Badge
                <input type="text" [(ngModel)]="section.data.badge" [name]="'badge-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Title
                <input type="text" [(ngModel)]="section.data.title" [name]="'title-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Subtitle
                <input type="text" [(ngModel)]="section.data.subtitle" [name]="'subtitle-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Image URL
                <input type="text" [(ngModel)]="section.data.imageUrl" [name]="'image-' + i" (input)="syncJson(section)" />
              </label>
              <div class="list">
                <div class="list-header">
                  <span>Carousel Images</span>
                  <button type="button" class="ghost" (click)="addBannerImage(section)">Add Image</button>
                </div>
                <div class="list-item" *ngFor="let image of section.data.images; let idx = index">
                  <input type="text" placeholder="Image URL" [(ngModel)]="section.data.images[idx]" [name]="'banner-img-' + i + '-' + idx" (input)="syncJson(section)" />
                  <button type="button" class="danger" (click)="removeBannerImage(section, idx)">Remove</button>
                </div>
              </div>
              <label>
                CTA Text
                <input type="text" [(ngModel)]="section.data.ctaText" [name]="'ctaText-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                CTA Link
                <input type="text" [(ngModel)]="section.data.ctaLink" [name]="'ctaLink-' + i" (input)="syncJson(section)" />
              </label>
            </div>

            <div *ngSwitchCase="'text_block'" class="field-grid single">
              <label>
                Heading
                <input type="text" [(ngModel)]="section.data.heading" [name]="'heading-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Body
                <textarea rows="4" [(ngModel)]="section.data.body" [name]="'body-' + i" (input)="syncJson(section)"></textarea>
              </label>
            </div>

            <div *ngSwitchCase="'gallery'" class="field-grid single">
              <label>
                Heading
                <input type="text" [(ngModel)]="section.data.heading" [name]="'gallery-heading-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Subtitle
                <input type="text" [(ngModel)]="section.data.subtitle" [name]="'gallery-subtitle-' + i" (input)="syncJson(section)" />
              </label>
              <div class="list">
                <div class="list-header">
                  <span>Images</span>
                  <button type="button" class="ghost" (click)="addGalleryImage(section)">Add Image</button>
                </div>
                <div class="list-item" *ngFor="let image of section.data.images; let idx = index">
                  <input type="text" placeholder="Image URL" [(ngModel)]="image.url" [name]="'img-url-' + i + '-' + idx" (input)="syncJson(section)" />
                  <input type="text" placeholder="Alt text" [(ngModel)]="image.alt" [name]="'img-alt-' + i + '-' + idx" (input)="syncJson(section)" />
                  <input type="text" placeholder="Caption" [(ngModel)]="image.caption" [name]="'img-cap-' + i + '-' + idx" (input)="syncJson(section)" />
                  <button type="button" class="danger" (click)="removeGalleryImage(section, idx)">Remove</button>
                </div>
              </div>
            </div>

            <div *ngSwitchCase="'testimonials'" class="field-grid single">
              <label>
                Heading
                <input type="text" [(ngModel)]="section.data.heading" [name]="'testi-heading-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Subtitle
                <input type="text" [(ngModel)]="section.data.subtitle" [name]="'testi-subtitle-' + i" (input)="syncJson(section)" />
              </label>
              <div class="list">
                <div class="list-header">
                  <span>Testimonials</span>
                  <button type="button" class="ghost" (click)="addTestimonial(section)">Add</button>
                </div>
                <div class="list-item" *ngFor="let item of section.data.items; let idx = index">
                  <input type="text" placeholder="Name" [(ngModel)]="item.name" [name]="'testi-name-' + i + '-' + idx" (input)="syncJson(section)" />
                  <input type="text" placeholder="Quote" [(ngModel)]="item.quote" [name]="'testi-quote-' + i + '-' + idx" (input)="syncJson(section)" />
                  <button type="button" class="danger" (click)="removeTestimonial(section, idx)">Remove</button>
                </div>
              </div>
            </div>

            <div *ngSwitchCase="'faq'" class="field-grid single">
              <label>
                Heading
                <input type="text" [(ngModel)]="section.data.heading" [name]="'faq-heading-' + i" (input)="syncJson(section)" />
              </label>
              <div class="list">
                <div class="list-header">
                  <span>FAQ Items</span>
                  <button type="button" class="ghost" (click)="addFaq(section)">Add FAQ</button>
                </div>
                <div class="list-item" *ngFor="let item of section.data.items; let idx = index">
                  <input type="text" placeholder="Question" [(ngModel)]="item.q" [name]="'faq-q-' + i + '-' + idx" (input)="syncJson(section)" />
                  <input type="text" placeholder="Answer" [(ngModel)]="item.a" [name]="'faq-a-' + i + '-' + idx" (input)="syncJson(section)" />
                  <button type="button" class="danger" (click)="removeFaq(section, idx)">Remove</button>
                </div>
              </div>
            </div>

            <div *ngSwitchCase="'services_list'" class="field-grid single">
              <label>
                Heading
                <input type="text" [(ngModel)]="section.data.heading" [name]="'services-heading-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Subtitle
                <input type="text" [(ngModel)]="section.data.subtitle" [name]="'services-subtitle-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Card CTA Text
                <input type="text" [(ngModel)]="section.data.ctaText" [name]="'services-cta-' + i" (input)="syncJson(section)" />
              </label>
            </div>

            <div *ngSwitchCase="'contact_form'" class="field-grid single">
              <label>
                Badge
                <input type="text" [(ngModel)]="section.data.badge" [name]="'contact-badge-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Heading
                <input type="text" [(ngModel)]="section.data.heading" [name]="'contact-heading-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Subtitle
                <input type="text" [(ngModel)]="section.data.subtitle" [name]="'contact-subtitle-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Hours Title
                <input type="text" [(ngModel)]="section.data.hoursTitle" [name]="'contact-hours-title-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Hours (comma separated)
                <input type="text" [(ngModel)]="section.data.hours" [name]="'contact-hours-' + i" (input)="parseCommaList(section, 'hours')" />
              </label>
              <label>
                Support Text
                <input type="text" [(ngModel)]="section.data.supportText" [name]="'contact-support-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Visit Title
                <input type="text" [(ngModel)]="section.data.visitTitle" [name]="'contact-visit-title-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Visit Subtitle
                <input type="text" [(ngModel)]="section.data.visitSubtitle" [name]="'contact-visit-subtitle-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Location Name
                <input type="text" [(ngModel)]="section.data.locationName" [name]="'contact-location-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Address Lines (comma separated)
                <input type="text" [(ngModel)]="section.data.addressLines" [name]="'contact-address-' + i" (input)="parseCommaList(section, 'addressLines')" />
              </label>
              <label>
                Button Text
                <input type="text" [(ngModel)]="section.data.ctaText" [name]="'contact-cta-' + i" (input)="syncJson(section)" />
              </label>
            </div>

            <div *ngSwitchCase="'about_content'" class="field-grid single">
              <label>
                Badge
                <input type="text" [(ngModel)]="section.data.badge" [name]="'about-badge-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                CTA Text
                <input type="text" [(ngModel)]="section.data.ctaText" [name]="'about-cta-text-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                CTA Link
                <input type="text" [(ngModel)]="section.data.ctaLink" [name]="'about-cta-link-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Promise Title
                <input type="text" [(ngModel)]="section.data.promiseTitle" [name]="'about-promise-title-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Promise Text
                <input type="text" [(ngModel)]="section.data.promiseText" [name]="'about-promise-text-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Stat One Value
                <input type="text" [(ngModel)]="section.data.statOneValue" [name]="'about-stat1-value-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Stat One Label
                <input type="text" [(ngModel)]="section.data.statOneLabel" [name]="'about-stat1-label-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Stat Two Value
                <input type="text" [(ngModel)]="section.data.statTwoValue" [name]="'about-stat2-value-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Stat Two Label
                <input type="text" [(ngModel)]="section.data.statTwoLabel" [name]="'about-stat2-label-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Story Title
                <input type="text" [(ngModel)]="section.data.storyTitle" [name]="'about-story-title-' + i" (input)="syncJson(section)" />
              </label>
              <label>
                Story Body
                <textarea rows="3" [(ngModel)]="section.data.storyBody" [name]="'about-story-body-' + i" (input)="syncJson(section)"></textarea>
              </label>
            </div>

            <div *ngSwitchDefault class="field-grid single">
              <p class="muted">No custom editor available for this component type.</p>
            </div>
          </div>

          <div class="json-block" *ngIf="section.jsonMode">
            <label>
              JSON Data
              <textarea rows="8" [(ngModel)]="section.dataJson" [name]="'section-' + i"></textarea>
            </label>
            <div class="json-actions">
              <button type="button" class="ghost" (click)="applyJson(section)">Apply JSON</button>
            </div>
          </div>
          <p class="error" *ngIf="section.error">{{ section.error }}</p>
        </div>
      </div>
      <p class="status">{{ status }}</p>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
      }
      .header-actions {
        display: flex;
        gap: 8px;
      }
      .hint {
        margin: 6px 0 0;
        color: var(--muted);
      }
      .mono {
        font-family: "SFMono-Regular", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      }
      button {
        background: var(--accent);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .ghost {
        background: transparent;
        border: 1px solid #e5e7eb;
        color: #111827;
      }
      .publish {
        background: #0ea5e9;
      }
      .danger {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
      }
      .form {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        display: grid;
        gap: 12px;
        max-width: 900px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        align-items: end;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      input,
      textarea,
      select {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: inherit;
      }
      .template-row {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }
      .sections {
        margin-top: 24px;
        display: grid;
        gap: 16px;
        max-width: 900px;
      }
      .section-list {
        display: grid;
        gap: 16px;
      }
      .sections-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .add-section {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .section-card {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        background: white;
        display: grid;
        gap: 10px;
      }
      .section-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .drag-handle {
        font-size: 18px;
        cursor: grab;
        color: var(--muted);
      }
      .section-form {
        display: grid;
        gap: 12px;
      }
      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .field-grid.single {
        grid-template-columns: 1fr;
      }
      .list {
        border: 1px dashed #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        display: grid;
        gap: 10px;
      }
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: var(--muted);
      }
      .list-item {
        display: grid;
        grid-template-columns: 1.2fr 1fr 1fr auto;
        gap: 8px;
        align-items: center;
      }
      .muted {
        color: var(--muted);
        margin: 0;
      }
      .json-block {
        display: grid;
        gap: 6px;
        border-top: 1px dashed #e5e7eb;
        padding-top: 10px;
      }
      .json-actions {
        display: flex;
        justify-content: flex-end;
      }
      .section-actions {
        display: flex;
        gap: 6px;
      }
      .error {
        color: #b91c1c;
        margin: 0;
        font-size: 12px;
      }
      .status {
        color: var(--muted);
        margin: 0;
      }
      @media (max-width: 900px) {
        .field-grid {
          grid-template-columns: 1fr;
        }
        .list-item {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class PageEditorComponent implements OnInit {
  form: any = {
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    template: "default",
    status: true
  };
  sections: PageSectionDraft[] = [];
  status = "";
  isNew = true;
  pageId: string | null = null;

  sectionTypes = [
    {
      type: "banner",
      label: "Banner",
      sample: {
        title: "Best Salon in Delhi",
        subtitle: "Professional Hair Care",
        imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60",
        ctaText: "Book Now",
        ctaLink: "/booking"
      }
    },
    {
      type: "text_block",
      label: "Text Block",
      sample: {
        heading: "Our Story",
        body: "Share the story behind your brand, mission, and values."
      }
    },
    {
      type: "gallery",
      label: "Gallery",
      sample: {
        heading: "Gallery",
        images: [
          { url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=60", alt: "Salon interior" },
          { url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=60", alt: "Hair styling" }
        ]
      }
    },
    {
      type: "testimonials",
      label: "Testimonials",
      sample: {
        heading: "Testimonials",
        items: [
          { name: "Ayesha", quote: "The booking experience was effortless and the service was amazing." },
          { name: "Rahul", quote: "Clean, calm, and professional. Highly recommended." }
        ]
      }
    },
    {
      type: "faq",
      label: "FAQ",
      sample: {
        heading: "FAQ",
        items: [
          { q: "How long does it take?", a: "Most services take 45-60 minutes." }
        ]
      }
    },
    {
      type: "services_list",
      label: "Services List",
      sample: {
        heading: "Services",
        subtitle: "Explore our top services and book instantly.",
        ctaText: "View details →"
      }
    },
    {
      type: "contact_form",
      label: "Contact Form",
      sample: {
        badge: "Contact Us",
        heading: "We are here to help",
        subtitle: "Tell us what you need. Our team responds quickly during working hours.",
        hoursTitle: "Salon Hours",
        hours: ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: Closed"],
        supportText: "Support: +91 99999 99999",
        visitTitle: "Visit Us",
        visitSubtitle: "Walk-ins are welcome. For priority service, book in advance.",
        locationName: "Salonify Studio",
        addressLines: ["21 MG Road, Bengaluru", "India"],
        ctaText: "Send Message"
      }
    },
    {
      type: "about_content",
      label: "About Content",
      sample: {
        badge: "About Us",
        ctaText: "Book a Visit",
        ctaLink: "/booking",
        promiseTitle: "Our Promise",
        promiseText: "Clean, consistent, and confident - every single appointment.",
        statOneValue: "7+",
        statOneLabel: "Years Experience",
        statTwoValue: "4.9",
        statTwoLabel: "Average Rating",
        storyTitle: "Our Story",
        storyBody: "We are building a modern salon experience focused on comfort, craft, and confidence."
      }
    }
  ];
  newSectionType = "banner";
  templates = [
    { key: "default", label: "Default" },
    { key: "promo", label: "Promo Landing" },
    { key: "story", label: "Story Page" }
  ];

  constructor(private adminService: AdminService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get("id");
    this.isNew = !this.pageId || this.pageId === "new";
    if (!this.isNew && this.pageId) {
      this.adminService.getPage(this.pageId).subscribe((data) => {
        this.form = {
          title: data?.title || "",
          slug: data?.slug || "",
          metaTitle: data?.metaTitle || "",
          metaDescription: data?.metaDescription || "",
          template: data?.template || "default",
          status: !!data?.status
        };
        this.sections = (data?.sections || []).map((section: any) =>
          this.createSectionDraft(section.type, section.data ?? {})
        );
      });
    }
  }

  autoSlug(): void {
    if (this.form.slug) return;
    const base = (this.form.title || "").trim().toLowerCase();
    if (!base) return;
    this.form.slug = base
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  addSection(): void {
    const template = this.sectionTypes.find((item) => item.type === this.newSectionType)?.sample || {};
    this.sections.push(this.createSectionDraft(this.newSectionType, template));
  }

  removeSection(index: number): void {
    this.sections = this.sections.filter((_item, i) => i !== index);
  }

  drop(event: CdkDragDrop<PageSectionDraft[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const updated = [...this.sections];
    const [item] = updated.splice(event.previousIndex, 1);
    updated.splice(event.currentIndex, 0, item);
    this.sections = updated;
  }

  toggleJson(section: PageSectionDraft): void {
    section.jsonMode = !section.jsonMode;
    if (section.jsonMode) {
      this.syncJson(section);
    }
  }

  syncJson(section: PageSectionDraft): void {
    if (section.jsonMode) return;
    section.dataJson = JSON.stringify(section.data ?? {}, null, 2);
  }

  applyJson(section: PageSectionDraft): void {
    try {
      section.data = JSON.parse(section.dataJson || "{}");
      section.error = undefined;
    } catch (_err) {
      section.error = "Invalid JSON for this section.";
    }
  }

  addGalleryImage(section: PageSectionDraft): void {
    if (!Array.isArray(section.data.images)) section.data.images = [];
    section.data.images.push({ url: "", alt: "", caption: "" });
    this.syncJson(section);
  }

  removeGalleryImage(section: PageSectionDraft, index: number): void {
    if (!Array.isArray(section.data.images)) return;
    section.data.images = section.data.images.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  addBannerImage(section: PageSectionDraft): void {
    if (!Array.isArray(section.data.images)) section.data.images = [];
    section.data.images.push("");
    this.syncJson(section);
  }

  removeBannerImage(section: PageSectionDraft, index: number): void {
    if (!Array.isArray(section.data.images)) return;
    section.data.images = section.data.images.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  parseCommaList(section: PageSectionDraft, key: string): void {
    const value = section.data?.[key];
    if (Array.isArray(value)) {
      this.syncJson(section);
      return;
    }
    if (typeof value !== "string") return;
    const list = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    section.data[key] = list;
    this.syncJson(section);
  }

  addFaq(section: PageSectionDraft): void {
    if (!Array.isArray(section.data.items)) section.data.items = [];
    section.data.items.push({ q: "", a: "" });
    this.syncJson(section);
  }

  removeFaq(section: PageSectionDraft, index: number): void {
    if (!Array.isArray(section.data.items)) return;
    section.data.items = section.data.items.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  addTestimonial(section: PageSectionDraft): void {
    if (!Array.isArray(section.data.items)) section.data.items = [];
    section.data.items.push({ name: "", quote: "" });
    this.syncJson(section);
  }

  removeTestimonial(section: PageSectionDraft, index: number): void {
    if (!Array.isArray(section.data.items)) return;
    section.data.items = section.data.items.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  save(): void {
    this.status = "";
    const parsedSections: Array<{ type: string; data: any }> = [];
    for (const section of this.sections) {
      section.error = undefined;
      try {
        const data = section.jsonMode ? JSON.parse(section.dataJson || "{}") : section.data;
        parsedSections.push({ type: section.type, data: data ?? {} });
      } catch (_err) {
        section.error = "Invalid JSON for this section.";
        this.status = `Invalid JSON in section: ${section.type}`;
        return;
      }
    }
    const payload = {
      title: this.form.title,
      slug: this.form.slug,
      metaTitle: this.form.metaTitle,
      metaDescription: this.form.metaDescription,
      template: this.form.template,
      status: !!this.form.status
    };
    if (this.isNew) {
      this.adminService.createPage({ ...payload, sections: parsedSections }).subscribe({
        next: (res) => {
          this.status = "Page created.";
          if (res?.id) {
            this.router.navigate(["/pages", res.id]);
          }
        },
        error: (err) => (this.status = getApiErrorMessage(err, "Save failed."))
      });
      return;
    }
    if (!this.pageId) return;
    this.adminService.updatePage(this.pageId, payload).subscribe({
      next: () => {
        this.adminService.updatePageSections(this.pageId as string, parsedSections).subscribe({
          next: () => (this.status = "Page saved."),
          error: (err) => (this.status = getApiErrorMessage(err, "Sections save failed."))
        });
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Save failed."))
    });
  }

  publish(): void {
    this.form.status = true;
    this.save();
  }

  preview(): void {
    if (!this.pageId) return;
    this.router.navigate(["/pages", this.pageId, "preview"]);
  }

  private createSectionDraft(type: string, data: any): PageSectionDraft {
    const normalized = this.normalizeData(type, data);
    return {
      type,
      data: normalized,
      dataJson: JSON.stringify(normalized ?? {}, null, 2),
      jsonMode: false
    };
  }

  private normalizeData(type: string, data: any): any {
    const base = data && typeof data === "object" ? { ...data } : {};
    if (type === "gallery") {
      base.images = Array.isArray(base.images) ? base.images : [];
    }
    if (type === "testimonials") {
      base.items = Array.isArray(base.items) ? base.items : [];
    }
    if (type === "faq") {
      base.items = Array.isArray(base.items) ? base.items : [];
    }
    if (type === "banner") {
      base.images = Array.isArray(base.images) ? base.images : [];
    }
    if (type === "contact_form") {
      base.hours = Array.isArray(base.hours) ? base.hours : [];
      base.addressLines = Array.isArray(base.addressLines) ? base.addressLines : [];
    }
    return base;
  }

  applyTemplate(): void {
    const key = String(this.form.template || "default");
    const preset = this.templatePresets()[key];
    if (!preset) return;
    this.sections = preset.map((section: any) => this.createSectionDraft(section.type, section.data));
  }

  private templatePresets(): Record<string, Array<{ type: string; data: any }>> {
    return {
      default: [
        {
          type: "banner",
          data: {
            badge: "Welcome",
            title: "Premium Salon Experience",
            subtitle: "Book a look that feels effortless.",
            imageUrl:
              "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=60",
            ctaText: "Book Now",
            ctaLink: "/booking"
          }
        },
        {
          type: "text_block",
          data: {
            heading: "Why Choose Us",
            body: "Share the unique value of your salon, staff expertise, and the experience clients can expect."
          }
        }
      ],
      promo: [
        {
          type: "banner",
          data: {
            badge: "Limited Offer",
            title: "Spring Refresh Package",
            subtitle: "Haircut + spa combo at a special rate this month.",
            imageUrl:
              "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60",
            ctaText: "Claim Offer",
            ctaLink: "/booking"
          }
        },
        {
          type: "gallery",
          data: {
            heading: "Before & After",
            subtitle: "See the transformations our clients love.",
            images: [
              {
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=60",
                alt: "Style 1"
              },
              {
                url: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=800&q=60",
                alt: "Style 2"
              }
            ]
          }
        },
        {
          type: "testimonials",
          data: {
            heading: "Clients Say",
            subtitle: "Real stories from our regulars.",
            items: [
              { name: "Aarav", quote: "Loved the offer and the service quality." },
              { name: "Neha", quote: "Quick booking, amazing results." }
            ]
          }
        }
      ],
      story: [
        {
          type: "text_block",
          data: {
            heading: "Our Story",
            body: "Tell your story, values, and journey in an authentic tone."
          }
        },
        {
          type: "gallery",
          data: {
            heading: "Behind the Scenes",
            images: [
              {
                url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=60",
                alt: "Salon space"
              }
            ]
          }
        },
        {
          type: "testimonials",
          data: {
            heading: "Our Community",
            items: [{ name: "Priya", quote: "They made me feel at home." }]
          }
        }
      ]
    };
  }
}

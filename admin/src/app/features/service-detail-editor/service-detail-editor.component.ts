import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { ServicesService } from "../../services/services.service";
import { getApiErrorMessage } from "../../utils/api-error";

type DetailSectionDraft = {
  type: string;
  data: any;
  dataJson: string;
  jsonMode: boolean;
  error?: string;
};

@Component({
  selector: "app-service-detail-editor",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CdkDropList, CdkDrag],
  template: `
    <div class="header">
      <div>
        <h2>Service Detail Builder</h2>
        <p class="hint">Service: {{ serviceName || "Loading..." }}</p>
      </div>
      <div class="header-actions">
        <a class="ghost" routerLink="/services">Back</a>
        <button type="button" (click)="save()">Save</button>
      </div>
    </div>

    <div class="form">
      <label class="toggle">
        <input type="checkbox" [(ngModel)]="useCustomLayout" name="useCustomLayout" />
        Use Custom Layout (ignore default service detail layout)
      </label>
      <p class="muted" *ngIf="!useCustomLayout">
        Default layout will show service info first, then the blocks below.
      </p>
    </div>

    <div class="sections">
      <div class="sections-head">
        <h3>Detail Blocks</h3>
        <div class="add-section">
          <select [(ngModel)]="newSectionType" name="newSectionType">
            <option *ngFor="let item of sectionTypes" [value]="item.type">{{ item.label }}</option>
          </select>
          <button type="button" class="ghost" (click)="addSection()">Add Block</button>
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

            <div *ngSwitchDefault class="field-grid single">
              <p class="muted">No editor for this block type.</p>
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
        text-decoration: none;
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
        gap: 8px;
        max-width: 900px;
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .muted {
        color: var(--muted);
        margin: 0;
      }
      .sections {
        margin-top: 24px;
        display: grid;
        gap: 16px;
        max-width: 900px;
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
      select,
      input,
      textarea {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: inherit;
      }
      .section-list {
        display: grid;
        gap: 16px;
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
      .status {
        color: var(--muted);
        margin: 0;
      }
      .error {
        color: #b91c1c;
        margin: 0;
        font-size: 12px;
      }
      @media (max-width: 900px) {
        .field-grid,
        .list-item {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ServiceDetailEditorComponent implements OnInit {
  serviceId: number | null = null;
  serviceName = "";
  sections: DetailSectionDraft[] = [];
  status = "";
  useCustomLayout = false;
  newSectionType = "banner";

  sectionTypes = [
    {
      type: "banner",
      label: "Banner",
      sample: {
        badge: "Featured Service",
        title: "Service Highlight",
        subtitle: "Short description for this service.",
        imageUrl: ""
      }
    },
    {
      type: "text_block",
      label: "Text Block",
      sample: { heading: "Details", body: "Share additional details about this service." }
    },
    {
      type: "gallery",
      label: "Gallery",
      sample: { heading: "Gallery", images: [] }
    },
    {
      type: "testimonials",
      label: "Testimonials",
      sample: { heading: "Reviews", items: [] }
    },
    {
      type: "faq",
      label: "FAQ",
      sample: { heading: "FAQ", items: [{ q: "How long does it take?", a: "45 minutes." }] }
    }
  ];

  constructor(private route: ActivatedRoute, private servicesService: ServicesService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) return;
    this.serviceId = id;
    this.servicesService.getDetail(id).subscribe((data) => {
      this.serviceName = data?.service?.name || "";
      this.useCustomLayout = data?.layout === "custom";
      this.sections = (data?.sections || []).map((section: any) => this.createSectionDraft(section.type, section.data));
    });
  }

  addSection(): void {
    const template = this.sectionTypes.find((item) => item.type === this.newSectionType)?.sample || {};
    this.sections.push(this.createSectionDraft(this.newSectionType, template));
  }

  drop(event: CdkDragDrop<DetailSectionDraft[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const updated = [...this.sections];
    const [item] = updated.splice(event.previousIndex, 1);
    updated.splice(event.currentIndex, 0, item);
    this.sections = updated;
  }

  removeSection(index: number): void {
    this.sections = this.sections.filter((_item, i) => i !== index);
  }

  toggleJson(section: DetailSectionDraft): void {
    section.jsonMode = !section.jsonMode;
    if (section.jsonMode) {
      this.syncJson(section);
    }
  }

  syncJson(section: DetailSectionDraft): void {
    if (section.jsonMode) return;
    section.dataJson = JSON.stringify(section.data ?? {}, null, 2);
  }

  applyJson(section: DetailSectionDraft): void {
    try {
      section.data = JSON.parse(section.dataJson || "{}");
      section.error = undefined;
    } catch (_err) {
      section.error = "Invalid JSON for this section.";
    }
  }

  addGalleryImage(section: DetailSectionDraft): void {
    if (!Array.isArray(section.data.images)) section.data.images = [];
    section.data.images.push({ url: "", alt: "", caption: "" });
    this.syncJson(section);
  }

  removeGalleryImage(section: DetailSectionDraft, index: number): void {
    if (!Array.isArray(section.data.images)) return;
    section.data.images = section.data.images.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  addTestimonial(section: DetailSectionDraft): void {
    if (!Array.isArray(section.data.items)) section.data.items = [];
    section.data.items.push({ name: "", quote: "" });
    this.syncJson(section);
  }

  removeTestimonial(section: DetailSectionDraft, index: number): void {
    if (!Array.isArray(section.data.items)) return;
    section.data.items = section.data.items.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  addFaq(section: DetailSectionDraft): void {
    if (!Array.isArray(section.data.items)) section.data.items = [];
    section.data.items.push({ q: "", a: "" });
    this.syncJson(section);
  }

  removeFaq(section: DetailSectionDraft, index: number): void {
    if (!Array.isArray(section.data.items)) return;
    section.data.items = section.data.items.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  addBannerImage(section: DetailSectionDraft): void {
    if (!Array.isArray(section.data.images)) section.data.images = [];
    section.data.images.push("");
    this.syncJson(section);
  }

  removeBannerImage(section: DetailSectionDraft, index: number): void {
    if (!Array.isArray(section.data.images)) return;
    section.data.images = section.data.images.filter((_item: any, i: number) => i !== index);
    this.syncJson(section);
  }

  save(): void {
    if (!this.serviceId) return;
    this.status = "";
    const parsedSections = [];
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
    this.servicesService
      .updateDetail(this.serviceId, { layout: this.useCustomLayout ? "custom" : "default", sections: parsedSections })
      .subscribe({
        next: () => (this.status = "Detail page saved."),
        error: (err) => (this.status = getApiErrorMessage(err, "Save failed."))
      });
  }

  private createSectionDraft(type: string, data: any): DetailSectionDraft {
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
    if (type === "testimonials" || type === "faq") {
      base.items = Array.isArray(base.items) ? base.items : [];
    }
    if (type === "banner") {
      base.images = Array.isArray(base.images) ? base.images : [];
    }
    return base;
  }
}

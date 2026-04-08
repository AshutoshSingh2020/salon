import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-theme-header",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <h2>Header Settings</h2>
      <button type="button" (click)="saveSettings()">Save Settings</button>
    </div>

    <form class="form">
      <label>
        CTA Text
        <input type="text" [(ngModel)]="settings.ctaText" name="ctaText" />
      </label>
      <label>
        CTA Link
        <input type="text" [(ngModel)]="settings.ctaLink" name="ctaLink" />
      </label>
      <label class="toggle">
        <input type="checkbox" [(ngModel)]="settings.showTopBar" name="showTopBar" />
        Show Top Bar
      </label>
      <label>
        Instagram URL
        <input type="text" [(ngModel)]="settings.instagramUrl" name="instagramUrl" />
      </label>
      <label>
        Facebook URL
        <input type="text" [(ngModel)]="settings.facebookUrl" name="facebookUrl" />
      </label>
      <label>
        WhatsApp URL
        <input type="text" [(ngModel)]="settings.whatsappUrl" name="whatsappUrl" />
      </label>
      <hr style="border:0; border-top:1px solid #e5e7eb; margin:10px 0" />
      <h4 style="margin: 0; padding-top: 4px;">Fixed Menu Labels</h4>
      <label>
        Home Label
        <input type="text" [(ngModel)]="settings.homeLabel" name="homeLabel" />
      </label>
      <label>
        Services Label
        <input type="text" [(ngModel)]="settings.servicesLabel" name="servicesLabel" />
      </label>
      <label>
        About Us Label
        <input type="text" [(ngModel)]="settings.aboutLabel" name="aboutLabel" />
      </label>
      <label>
        Contact Us Label
        <input type="text" [(ngModel)]="settings.contactLabel" name="contactLabel" />
      </label>
      <p class="status">{{ status }}</p>
    </form>

    <div class="links-header">
      <h3>Custom Menu Links</h3>
      <button type="button" class="ghost" (click)="addLink()">+ Add Link</button>
    </div>

    <div class="link-card" *ngFor="let link of links">
      <label>
        Label
        <input type="text" [(ngModel)]="link.label" name="label-{{ link._key }}" />
      </label>
      <label>
        URL
        <input type="text" [(ngModel)]="link.url" name="url-{{ link._key }}" />
      </label>
      <label>
        Position
        <input type="number" [(ngModel)]="link.position" name="pos-{{ link._key }}" />
      </label>
      <label class="toggle">
        <input type="checkbox" [(ngModel)]="link.isActive" name="active-{{ link._key }}" />
        Active
      </label>
      <div class="actions">
        <button type="button" (click)="saveLink(link)">{{ link.id ? "Update" : "Create" }}</button>
        <button type="button" class="danger" (click)="removeLink(link)">Delete</button>
      </div>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
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
        color: var(--brand);
      }
      .form {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        display: grid;
        gap: 10px;
        max-width: 680px;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      input {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .status {
        color: var(--muted);
        margin: 0;
      }
      .links-header {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .link-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        display: grid;
        gap: 8px;
        margin-top: 12px;
        max-width: 680px;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .danger {
        background: #ef4444;
      }
    `
  ]
})
export class ThemeHeaderComponent implements OnInit {
  settings: any = {
    ctaText: "Book Now",
    ctaLink: "/booking",
    showTopBar: true,
    instagramUrl: "",
    facebookUrl: "",
    whatsappUrl: "",
    homeLabel: "Home",
    servicesLabel: "Services",
    aboutLabel: "About Us",
    contactLabel: "Contact Us"
  };
  links: any[] = [];
  status = "";
  private counter = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminService.getHeaderTheme().subscribe({
      next: (data) => {
        const settings = data?.settings || {};
        this.settings = {
          ctaText: settings.cta_text || "Book Now",
          ctaLink: settings.cta_link || "/booking",
          showTopBar: settings.show_top_bar !== undefined ? !!settings.show_top_bar : true,
          instagramUrl: settings.instagram_url || "",
          facebookUrl: settings.facebook_url || "",
          whatsappUrl: settings.whatsapp_url || "",
          homeLabel: settings.home_label || "Home",
          servicesLabel: settings.services_label || "Services",
          aboutLabel: settings.about_label || "About Us",
          contactLabel: settings.contact_label || "Contact Us"
        };
        this.links = (data?.links || []).map((link: any) => ({
          ...link,
          isActive: !!link.is_active,
          _key: link.id || this.nextKey()
        }));
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Failed to load header settings."))
    });
  }

  saveSettings(): void {
    this.status = "";
    this.adminService.updateHeaderTheme(this.settings).subscribe({
      next: () => (this.status = "Header settings saved."),
      error: (err) => (this.status = getApiErrorMessage(err, "Save failed."))
    });
  }

  addLink(): void {
    this.links.unshift({
      label: "",
      url: "",
      position: 0,
      isActive: true,
      _key: this.nextKey()
    });
  }

  saveLink(link: any): void {
    const payload = {
      label: link.label,
      url: link.url,
      position: Number(link.position || 0),
      isActive: !!link.isActive
    };
    if (link.id) {
      this.adminService.updateHeaderLink(link.id, payload).subscribe({
        next: () => (this.status = "Header link updated."),
        error: (err) => (this.status = getApiErrorMessage(err, "Failed to update header link."))
      });
      return;
    }
    this.adminService.createHeaderLink(payload).subscribe({
      next: (res: any) => {
        link.id = res?.id;
        link._key = link.id || link._key;
        this.status = "Header link created.";
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Failed to create header link."))
    });
  }

  removeLink(link: any): void {
    if (!link.id) {
      this.links = this.links.filter((item) => item._key !== link._key);
      return;
    }
    this.adminService.deleteHeaderLink(link.id).subscribe({
      next: () => {
        this.links = this.links.filter((item) => item.id !== link.id);
        this.status = "Header link deleted.";
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Failed to delete header link."))
    });
  }

  private nextKey(): number {
    this.counter += 1;
    return this.counter;
  }
}

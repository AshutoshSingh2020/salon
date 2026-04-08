import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ContentService } from "../../services/content.service";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <div class="brand">{{ footerSettings.brandName }}</div>
          <p class="tagline">{{ footerSettings.tagline }}</p>
          <div class="socials">
            <a class="social-link" *ngIf="footerSettings.instagramUrl" [href]="footerSettings.instagramUrl" aria-label="Instagram" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zm4.2-3a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
                />
              </svg>
            </a>
            <a class="social-link" *ngIf="footerSettings.facebookUrl" [href]="footerSettings.facebookUrl" aria-label="Facebook" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M13 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"
                />
              </svg>
            </a>
            <a class="social-link" *ngIf="footerSettings.whatsappUrl" [href]="footerSettings.whatsappUrl" aria-label="WhatsApp" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 2a7 7 0 0 1 0 14a7 7 0 0 1-3.5-.9l-.4-.2l-2.1.6l.6-2.1l-.2-.4A7 7 0 0 1 12 5zm3.9 9.1c-.2-.1-1.2-.6-1.4-.7c-.2-.1-.4-.1-.5.1c-.1.2-.6.7-.7.9c-.1.1-.3.2-.5.1c-.2-.1-1-.4-1.8-1.2c-.7-.6-1.1-1.4-1.2-1.6c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5c-.1-.1-.5-1.1-.6-1.3c-.2-.4-.4-.3-.5-.3h-.4c-.2 0-.4.1-.5.3c-.2.2-.7.7-.7 1.7c0 1 .7 2 .8 2.1c.1.1 1.4 2.2 3.3 3.1c1.9.9 1.9.6 2.2.6c.4 0 1.2-.5 1.4-1c.2-.5.2-.9.2-1c0-.1-.2-.2-.4-.3z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4>Important</h4>
          <nav class="links">
            <ng-container *ngFor="let item of menuItems">
              <div class="footer-item">
                <ng-container *ngIf="isInternal(item.url); else footerExternal">
                  <a [routerLink]="item.url">{{ item.label }}</a>
                </ng-container>
                <ng-template #footerExternal>
                  <a [href]="item.url" target="_blank" rel="noopener">{{ item.label }}</a>
                </ng-template>
                <div class="footer-sub" *ngIf="item.children?.length">
                  <ng-container *ngFor="let child of item.children">
                    <a *ngIf="isInternal(child.url)" [routerLink]="child.url">{{ child.label }}</a>
                    <a *ngIf="!isInternal(child.url)" [href]="child.url" target="_blank" rel="noopener">
                      {{ child.label }}
                    </a>
                  </ng-container>
                </div>
              </div>
            </ng-container>
          </nav>
        </div>

        <div>
          <h4>Contact</h4>
          <div class="contact">
            <span *ngIf="footerSettings.phone">Phone: {{ footerSettings.phone }}</span>
            <span *ngIf="footerSettings.email">Email: {{ footerSettings.email }}</span>
            <span *ngIf="footerSettings.address">{{ footerSettings.address }}</span>
          </div>
        </div>

        <div>
          <h4>Find Us</h4>
          <div class="mini-map">
            <div class="pin"></div>
          </div>
          <a class="map-link" *ngIf="footerSettings.mapLink" [href]="footerSettings.mapLink" target="_blank" rel="noopener">Open in Maps</a>
        </div>
      </div>

      <div class="bottom">
        <span>{{ footerSettings.tagline }}</span>
        <span>{{ footerSettings.copyrightText }}</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        margin-top: 48px;
        padding: 32px;
        color: #e2e8f0;
        border-top: 1px solid #e5e7eb;
        background: #0f172a;
        width: 100%;
        display: block;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr 0.9fr 1fr;
        gap: 24px;
      }
      .brand {
        font-size: 20px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 8px;
      }
      .tagline {
        margin: 0 0 14px;
        color: #cbd5f5;
      }
      h4 {
        margin: 0 0 10px;
        color: #f8fafc;
      }
      .links {
        display: grid;
        gap: 8px;
      }
      .footer-sub {
        margin-left: 12px;
        display: grid;
        gap: 6px;
      }
      .links a {
        color: #cbd5f5;
      }
      .contact {
        display: grid;
        gap: 6px;
        color: #cbd5f5;
        font-size: 14px;
      }
      .mini-map {
        margin-top: 8px;
        height: 140px;
        border-radius: 16px;
        background:
          radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.25), transparent 45%),
          radial-gradient(circle at 70% 60%, rgba(56, 189, 248, 0.25), transparent 45%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.12);
        position: relative;
        overflow: hidden;
      }
      .mini-map::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px
          ),
          linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
        background-size: 22px 22px;
        opacity: 0.4;
      }
      .pin {
        position: absolute;
        left: 58%;
        top: 48%;
        width: 18px;
        height: 18px;
        background: #f97316;
        border-radius: 50% 50% 50% 0;
        transform: translate(-50%, -50%) rotate(-45deg);
        box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
      }
      .pin::after {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background: #111827;
        border-radius: 50%;
        top: 5px;
        left: 5px;
      }
      .map-link {
        display: inline-block;
        margin-top: 10px;
        color: #fde68a;
        font-size: 13px;
        font-weight: 600;
      }
      .socials {
        display: flex;
        gap: 10px;
      }
      .social-link {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
      }
      .social-link svg {
        width: 18px;
        height: 18px;
        fill: white;
      }
      .bottom {
        margin-top: 28px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: #94a3b8;
        font-size: 13px;
        flex-wrap: wrap;
      }
      @media (max-width: 900px) {
        .footer {
          padding: 24px;
        }
        .footer-grid {
          grid-template-columns: 1fr;
        }
        .bottom {
          flex-direction: column;
        }
      }
    `
  ]
})
export class FooterComponent implements OnInit {
  footerSettings: any = {
    brandName: "Salonify",
    tagline: "Premium grooming with effortless booking.",
    phone: "",
    email: "",
    address: "",
    mapLink: "",
    copyrightText: "(c) 2026 Salonify. All rights reserved.",
    instagramUrl: "",
    facebookUrl: "",
    whatsappUrl: "",
    homeLabel: "Home",
    servicesLabel: "Services",
    aboutLabel: "About Us",
    contactLabel: "Contact Us"
  };
  footerLinks: any[] = [];
  menuItems: any[] = [];

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getFooter().subscribe((data) => {
      const settings = data?.settings || {};
      this.footerSettings = {
        brandName: settings.brand_name || "Salonify",
        tagline: settings.tagline || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        mapLink: settings.map_link || "",
        copyrightText: settings.copyright_text || "",
        instagramUrl: settings.instagram_url || "",
        facebookUrl: settings.facebook_url || "",
        whatsappUrl: settings.whatsapp_url || "",
        homeLabel: settings.home_label || "Home",
        servicesLabel: settings.services_label || "Services",
        aboutLabel: settings.about_label || "About Us",
        contactLabel: settings.contact_label || "Contact Us"
      };
      this.footerLinks = data?.links || [];
      if (data?.menu?.length) {
        this.menuItems = data.menu;
      } else if (this.footerLinks.length) {
        this.menuItems = this.mapLinksToMenu(this.footerLinks);
      } else {
        this.menuItems = this.defaultMenu();
      }
    });
  }

  isInternal(url: string): boolean {
    if (!url) return true;
    return url.startsWith("/");
  }

  private mapLinksToMenu(links: any[]) {
    return (links || []).map((link) => ({ ...link, children: [] }));
  }

  private defaultMenu() {
    return [
      { label: this.footerSettings.homeLabel, url: "/", children: [] },
      { label: this.footerSettings.servicesLabel, url: "/services", children: [] },
      { label: this.footerSettings.aboutLabel, url: "/about", children: [] },
      { label: this.footerSettings.contactLabel, url: "/contact", children: [] }
    ];
  }
}

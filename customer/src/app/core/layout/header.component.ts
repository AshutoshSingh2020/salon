import { Component, OnInit } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { ContentService } from "../../services/content.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="top-bar" *ngIf="headerSettings.showTopBar">
        <ng-container *ngIf="isInternal(headerSettings.ctaLink); else ctaExternal">
          <a class="book-cta" [routerLink]="headerSettings.ctaLink">{{ headerSettings.ctaText }}</a>
        </ng-container>
        <ng-template #ctaExternal>
          <a class="book-cta" [href]="headerSettings.ctaLink" target="_blank" rel="noopener">
            {{ headerSettings.ctaText }}
          </a>
        </ng-template>
        <span class="top-text">Follow us</span>
        <div class="socials">
          <a class="social-link" *ngIf="headerSettings.instagramUrl" [href]="headerSettings.instagramUrl" aria-label="Instagram" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zm4.2-3a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
              />
            </svg>
          </a>
          <a class="social-link" *ngIf="headerSettings.facebookUrl" [href]="headerSettings.facebookUrl" aria-label="Facebook" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M13 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"
              />
            </svg>
          </a>
          <a class="social-link" *ngIf="headerSettings.whatsappUrl" [href]="headerSettings.whatsappUrl" aria-label="WhatsApp" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 2a7 7 0 0 1 0 14a7 7 0 0 1-3.5-.9l-.4-.2l-2.1.6l.6-2.1l-.2-.4A7 7 0 0 1 12 5zm3.9 9.1c-.2-.1-1.2-.6-1.4-.7c-.2-.1-.4-.1-.5.1c-.1.2-.6.7-.7.9c-.1.1-.3.2-.5.1c-.2-.1-1-.4-1.8-1.2c-.7-.6-1.1-1.4-1.2-1.6c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5c-.1-.1-.5-1.1-.6-1.3c-.2-.4-.4-.3-.5-.3h-.4c-.2 0-.4.1-.5.3c-.2.2-.7.7-.7 1.7c0 1  .7 2 .8 2.1c.1.1 1.4 2.2 3.3 3.1c1.9.9 1.9.6 2.2.6c.4 0 1.2-.5 1.4-1c.2-.5.2-.9.2-1c0-.1-.2-.2-.4-.3z"
              />
            </svg>
          </a>
        </div>
      </div>
      <div class="main-bar">
        <div class="logo">Salonify</div>
        <ng-container *ngIf="headerSettings.ctaText">
          <ng-container *ngIf="isInternal(headerSettings.ctaLink); else ctaExternalMobile">
            <a class="book-cta mobile-only" [routerLink]="headerSettings.ctaLink">{{ headerSettings.ctaText }}</a>
          </ng-container>
          <ng-template #ctaExternalMobile>
            <a class="book-cta mobile-only" [href]="headerSettings.ctaLink" target="_blank" rel="noopener">
              {{ headerSettings.ctaText }}
            </a>
          </ng-template>
        </ng-container>
        <button class="menu-btn" type="button" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen">
          Menu
        </button>
        <nav class="nav-links" [class.open]="menuOpen">
          <div class="drawer-header">
            <span>Menu</span>
            <button type="button" class="drawer-close" (click)="closeMenu()">X</button>
          </div>
          <ng-container *ngFor="let item of menuItems">
            <div class="nav-item" [class.has-children]="item.children?.length">
              <ng-container *ngIf="isInternal(item.url); else externalMenu">
                <a [routerLink]="item.url" (click)="closeMenu()">{{ item.label }}</a>
              </ng-container>
              <ng-template #externalMenu>
                <a [href]="item.url" target="_blank" rel="noopener" (click)="closeMenu()">{{ item.label }}</a>
              </ng-template>
              <div class="submenu" *ngIf="item.children?.length">
                <ng-container *ngFor="let child of item.children">
                  <a *ngIf="isInternal(child.url)" [routerLink]="child.url" (click)="closeMenu()">
                    {{ child.label }}
                  </a>
                  <a
                    *ngIf="!isInternal(child.url)"
                    [href]="child.url"
                    target="_blank"
                    rel="noopener"
                    (click)="closeMenu()"
                  >
                    {{ child.label }}
                  </a>
                </ng-container>
              </div>
            </div>
          </ng-container>
          <a routerLink="/profile" routerLinkActive="active" *ngIf="auth.isLoggedIn()" (click)="closeMenu()">My Bookings</a>
          <a routerLink="/auth" routerLinkActive="active" *ngIf="!auth.isLoggedIn()" (click)="closeMenu()">Login</a>
          <button class="link-btn" type="button" (click)="logout()" *ngIf="auth.isLoggedIn()">Logout</button>
        </nav>
      </div>
    </header>
    <div class="overlay" *ngIf="menuOpen" (click)="closeMenu()"></div>
  `,
  styles: [
    `
      .header {
        background: white;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 30;
        display: grid;
      }
      .top-bar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        padding: 6px 32px;
        background: #0f172a;
        color: white;
        font-size: 12px;
      }
      .top-text {
        color: #e2e8f0;
      }
      .socials {
        display: flex;
        gap: 8px;
      }
      .book-cta {
        background: linear-gradient(135deg, #f97316, #facc15);
        color: #111827;
        padding: 8px 18px;
        border-radius: 999px;
        font-weight: 700;
        position: relative;
        overflow: hidden;
        animation: glow 1.2s infinite;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        box-shadow: 0 10px 20px rgba(249, 115, 22, 0.35);
      }
      .mobile-only {
        display: none;
      }
      .book-cta::after {
        content: "";
        position: absolute;
        inset: -8px;
        border-radius: 999px;
        border: 3px solid rgba(249, 115, 22, 0.7);
        animation: pulse 1.4s infinite;
      }
      .book-cta::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(255, 255, 255, 0.7) 45%,
          transparent 60%
        );
        transform: translateX(-120%);
        animation: shimmer 1.6s infinite;
      }
      .social-link {
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
      }
      .social-link svg {
        width: 16px;
        height: 16px;
        fill: white;
      }
      @keyframes pulse {
        0% {
          transform: scale(0.85);
          opacity: 0.8;
        }
        70% {
          transform: scale(1.3);
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes glow {
        0%,
        100% {
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.7), 0 0 30px rgba(250, 204, 21, 0.6);
        }
        50% {
          box-shadow: 0 0 24px rgba(249, 115, 22, 0.9), 0 0 40px rgba(250, 204, 21, 0.75);
        }
      }
      @keyframes shimmer {
        0% {
          transform: translateX(-120%);
        }
        100% {
          transform: translateX(120%);
        }
      }
      .main-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 32px;
        gap: 16px;
      }
      .logo {
        font-weight: 700;
        color: var(--brand);
        letter-spacing: 0.5px;
      }
      .nav-links {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 6px;
        border-radius: 999px;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
      }
      .nav-item {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .nav-links a {
        color: var(--text);
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 999px;
        transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      }
      .nav-links a:hover {
        background: #e2e8f0;
      }
      .nav-links a.active {
        background: #111827;
        color: white;
        box-shadow: 0 8px 16px rgba(15, 23, 42, 0.2);
      }
      .submenu {
        display: none;
        position: absolute;
        top: 42px;
        left: 0;
        min-width: 180px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 10px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        z-index: 40;
      }
      .submenu a {
        display: block;
        padding: 6px 8px;
        border-radius: 8px;
      }
      .nav-item:hover .submenu {
        display: block;
      }
      .link-btn {
        background: transparent;
        border: none;
        color: var(--text);
        font-weight: 500;
        cursor: pointer;
        padding: 0;
      }
      .drawer-header {
        display: none;
      }
      .menu-btn {
        display: none;
        background: #111827;
        color: white;
        border: none;
        border-radius: 10px;
        padding: 8px 12px;
        cursor: pointer;
      }
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.4);
        z-index: 20;
      }
      @media (max-width: 860px) {
        .top-bar {
          display: none;
        }
        .mobile-only {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          font-size: 12px;
          animation: glow 1.4s infinite;
        }
        .main-bar {
          padding: 12px 16px;
        }
        .menu-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        nav {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 260px;
          background: white;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          box-shadow: -20px 0 40px rgba(15, 23, 42, 0.2);
          transform: translateX(110%);
          transition: transform 0.25s ease;
          z-index: 40;
          border-radius: 0;
        }
        .nav-links {
          border-radius: 0;
        }
        .nav-links a {
          border-radius: 10px;
        }
        .nav-links {
          background: white;
          border: none;
          align-items: stretch;
        }
        .nav-item {
          width: 100%;
        }
        .submenu {
          position: static;
          display: grid;
          gap: 6px;
          padding: 6px 0 0 12px;
          border: none;
          box-shadow: none;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 6px 20px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .drawer-close {
          background: #111827;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
        }
        nav.open {
          transform: translateX(0);
        }
        .nav-links a,
        .link-btn {
          font-size: 16px;
          padding: 12px 10px;
          text-align: left;
          border-radius: 12px;
        }
        .nav-links a.active {
          background: #111827;
          color: white;
        }
      }
    `
  ]
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  headerSettings: any = {
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
  headerLinks: any[] = [];
  menuItems: any[] = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.contentService.getHeader().subscribe((data) => {
      const settings = data?.settings || {};
      this.headerSettings = {
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
      this.headerLinks = data?.links || [];
      if (data?.menu?.length) {
        this.menuItems = data.menu;
      } else if (this.headerLinks.length) {
        this.menuItems = this.mapLinksToMenu(this.headerLinks);
      } else {
        this.menuItems = this.defaultMenu();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(["/"]);
    this.menuOpen = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
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
      { label: this.headerSettings.homeLabel, url: "/", children: [] },
      { label: this.headerSettings.servicesLabel, url: "/services", children: [] },
      { label: this.headerSettings.aboutLabel, url: "/about", children: [] },
      { label: this.headerSettings.contactLabel, url: "/contact", children: [] }
    ];
  }
}

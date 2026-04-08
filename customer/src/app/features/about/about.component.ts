import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ContentService } from "../../services/content.service";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div>
        <span class="badge">About Us</span>
        <h1>{{ about?.title || "About Us" }}</h1>
        <p>{{ about?.subtitle || "Premium grooming with a personal touch." }}</p>
        <a class="cta" routerLink="/booking">Book a Visit</a>
      </div>
      <div class="hero-card">
        <h3>Our Promise</h3>
        <p>Clean, consistent, and confident - every single appointment.</p>
        <div class="meta">
          <div>
            <strong>7+</strong>
            <span>Years Experience</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>Average Rating</span>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="story">
        <h2>Our Story</h2>
        <p class="text">{{ about?.content || "We are building a modern salon experience focused on comfort, craft, and confidence." }}</p>
      </div>
      <div class="highlights" *ngIf="highlights.length">
        <h3>Why Clients Love Us</h3>
        <ul>
          <li *ngFor="let item of highlights">{{ item }}</li>
        </ul>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        display: grid;
        grid-template-columns: minmax(260px, 1fr) minmax(220px, 0.8fr);
        gap: 24px;
        padding: 28px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0f172a, #1f2937);
        color: white;
        margin-bottom: 32px;
      }
      .badge {
        display: inline-flex;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 12px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .hero h1 {
        margin: 0 0 10px;
        font-size: 36px;
      }
      .hero p {
        margin: 0 0 16px;
        color: #e2e8f0;
      }
      .cta {
        display: inline-block;
        padding: 10px 18px;
        border-radius: 10px;
        background: #f97316;
        color: #111827;
        font-weight: 600;
      }
      .hero-card {
        background: rgba(255, 255, 255, 0.08);
        padding: 18px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .hero-card h3 {
        margin: 0 0 8px;
      }
      .hero-card p {
        margin: 0 0 16px;
        color: #e2e8f0;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        font-size: 12px;
        color: #e2e8f0;
      }
      .meta strong {
        display: block;
        font-size: 18px;
        color: white;
      }
      .content {
        display: grid;
        grid-template-columns: minmax(280px, 1.3fr) minmax(220px, 0.7fr);
        gap: 24px;
      }
      .story h2 {
        margin: 0 0 10px;
      }
      .text {
        white-space: pre-line;
        color: var(--muted);
        margin: 0;
      }
      .highlights {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 16px;
      }
      .highlights h3 {
        margin: 0 0 10px;
      }
      .highlights ul {
        margin: 0;
        padding-left: 18px;
        color: var(--muted);
      }
      @media (max-width: 860px) {
        .hero,
        .content {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AboutComponent implements OnInit {
  about: any = null;
  highlights: string[] = [];

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getAbout().subscribe((data) => {
      this.about = data;
      this.highlights = this.toList(data?.highlights);
    });
  }

  private toList(value: string): string[] {
    if (!value) return [];
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}

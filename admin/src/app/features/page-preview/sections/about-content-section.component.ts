import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preview-about-content-section",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div>
        <span class="badge">{{ data?.badge || "About Us" }}</span>
        <h2>{{ data?.title || "About Us" }}</h2>
        <p>{{ data?.subtitle || "Premium grooming with a personal touch." }}</p>
        <span class="cta">{{ data?.ctaText || "Book a Visit" }}</span>
      </div>
      <div class="hero-card">
        <h3>{{ data?.promiseTitle || "Our Promise" }}</h3>
        <p>{{ data?.promiseText || "Clean, consistent, and confident." }}</p>
        <div class="meta">
          <div>
            <strong>{{ data?.statOneValue || "7+" }}</strong>
            <span>{{ data?.statOneLabel || "Years Experience" }}</span>
          </div>
          <div>
            <strong>{{ data?.statTwoValue || "4.9" }}</strong>
            <span>{{ data?.statTwoLabel || "Average Rating" }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="content">
      <div class="story">
        <h3>{{ data?.storyTitle || "Our Story" }}</h3>
        <p class="text">{{ data?.storyBody || "Share your story here." }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        display: grid;
        grid-template-columns: minmax(260px, 1fr) minmax(220px, 0.8fr);
        gap: 24px;
        padding: 24px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0f172a, #1f2937);
        color: white;
      }
      .badge {
        display: inline-flex;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      .cta {
        display: inline-flex;
        margin-top: 12px;
        padding: 8px 16px;
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
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        font-size: 12px;
      }
      .content {
        margin-top: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 16px;
      }
      .text {
        margin: 0;
        color: var(--muted);
      }
      @media (max-width: 860px) {
        .hero {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class PreviewAboutContentSectionComponent {
  @Input() data: any = {};
}

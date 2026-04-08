import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="badge">Premium Salon Studio</span>
        <h1>Salonify</h1>
        <p>
          Make every visit effortless. Discover curated services, reserve your slot,
          and walk in with confidence.
        </p>
        <div class="hero-actions">
          <a class="cta" routerLink="/booking">Book Now</a>
          <a class="ghost" routerLink="/services">Explore Services</a>
        </div>
        <div class="hero-metrics">
          <div>
            <strong>2000+</strong>
            <span>Happy Clients</span>
          </div>
          <div>
            <strong>45+</strong>
            <span>Pro Stylists</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>Average Rating</span>
          </div>
        </div>
      </div>

      <div class="slider">
        <div class="slider-track">
          <div class="slide" *ngFor="let slide of slides" [style.backgroundImage]="'url(' + slide.image + ')'">
            <div class="slide-label">{{ slide.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="services-preview">
      <div class="section-head">
        <div>
          <h2>Services You Will Love</h2>
          <p>Curated treatments with transparent pricing and expert care.</p>
        </div>
        <a class="link" routerLink="/services">View All</a>
      </div>
      <div class="card-grid">
        <article class="service-card" *ngFor="let card of serviceCards">
          <div class="card-image" [style.backgroundImage]="'url(' + card.image + ')'"></div>
          <div class="card-body">
            <h4>{{ card.title }}</h4>
            <p>{{ card.desc }}</p>
          </div>
          <div class="card-actions">
            <a routerLink="/booking">Book Now</a>
            <a class="ghost" routerLink="/services">Details</a>
          </div>
        </article>
      </div>
    </section>

    <section class="booking-cta">
      <div class="cta-card">
        <h3>Ready for a fresh look?</h3>
        <p>Pick a service, choose a stylist, and lock your preferred slot in minutes.</p>
        <div class="cta-actions">
          <a class="cta" routerLink="/booking">Start Booking</a>
          <a class="ghost" routerLink="/services">See Menu</a>
        </div>
      </div>
      <div class="cta-points">
        <div class="point">
          <h4>Instant Confirmation</h4>
          <p>Get your booking code instantly after payment or offline selection.</p>
        </div>
        <div class="point">
          <h4>Flexible Payments</h4>
          <p>Pay online or in-store. Update or cancel from your profile anytime.</p>
        </div>
        <div class="point">
          <h4>Verified Pros</h4>
          <p>Every stylist is vetted for skill, hygiene, and client satisfaction.</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        display: grid;
        gap: 32px;
        grid-template-columns: minmax(260px, 1fr) minmax(280px, 1.2fr);
        align-items: center;
        padding: 28px;
        border-radius: 20px;
        background: radial-gradient(circle at top left, #1f2937, #0f172a);
        color: white;
        position: relative;
        overflow: hidden;
        margin-bottom: 40px;
      }
      .hero::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.12), transparent 45%),
          radial-gradient(circle at 80% 30%, rgba(249, 115, 22, 0.25), transparent 50%);
        pointer-events: none;
      }
      .hero-copy {
        position: relative;
        z-index: 1;
      }
      .badge {
        display: inline-flex;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 12px;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .hero h1 {
        font-size: 44px;
        margin: 0 0 12px;
      }
      .hero p {
        margin: 0;
        color: #e2e8f0;
        max-width: 440px;
      }
      .hero-actions {
        display: flex;
        gap: 12px;
        margin-top: 18px;
      }
      .cta {
        display: inline-block;
        background: #f97316;
        color: #111827;
        padding: 10px 18px;
        border-radius: 10px;
        font-weight: 600;
      }
      .ghost {
        display: inline-block;
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 10px 18px;
        border-radius: 10px;
      }
      .hero-metrics {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 20px;
        font-size: 12px;
        color: #cbd5f5;
      }
      .hero-metrics strong {
        display: block;
        font-size: 18px;
        color: white;
      }
      .slider {
        position: relative;
        z-index: 1;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      }
      .slider-track {
        display: flex;
        width: 500%;
        animation: slide 24s infinite;
      }
      .slide {
        flex: 0 0 100%;
        min-height: 320px;
        background-size: cover;
        background-position: center;
        display: grid;
        align-items: end;
        position: relative;
      }
      .slide::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.35) 100%);
      }
      .slide-label {
        position: relative;
        z-index: 1;
        margin: 18px;
        color: white;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.3px;
      }
      @keyframes slide {
        0%, 16% {
          transform: translateX(0);
        }
        20%, 36% {
          transform: translateX(-100%);
        }
        40%, 56% {
          transform: translateX(-200%);
        }
        60%, 76% {
          transform: translateX(-300%);
        }
        80%, 98% {
          transform: translateX(-400%);
        }
        100% {
          transform: translateX(-400%);
        }
      }
      .services-preview {
        margin-bottom: 40px;
      }
      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        margin-bottom: 18px;
      }
      .section-head h2 {
        margin: 0 0 6px;
      }
      .section-head p {
        margin: 0;
        color: var(--muted);
      }
      .link {
        color: var(--brand);
        font-weight: 600;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }
      .service-card {
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        overflow: hidden;
        display: grid;
        grid-template-rows: 140px 1fr auto;
        min-height: 320px;
      }
      .card-image {
        background-size: cover;
        background-position: center;
      }
      .card-body {
        padding: 16px;
      }
      .card-body h4 {
        margin: 0 0 8px;
      }
      .card-body p {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .card-actions {
        display: flex;
        gap: 10px;
        padding: 0 16px 16px;
      }
      .card-actions a {
        padding: 8px 14px;
        border-radius: 10px;
        background: #0f172a;
        color: white;
        font-size: 13px;
      }
      .card-actions .ghost {
        background: transparent;
        color: var(--brand);
        border: 1px solid #e5e7eb;
      }
      .booking-cta {
        display: grid;
        grid-template-columns: minmax(260px, 1fr) minmax(260px, 1fr);
        gap: 24px;
        align-items: stretch;
        padding: 24px;
        border-radius: 20px;
        background: linear-gradient(135deg, #fef3c7, #fde68a);
      }
      .cta-card h3 {
        margin: 0 0 8px;
      }
      .cta-card p {
        margin: 0 0 16px;
        color: #7c2d12;
      }
      .cta-actions {
        display: flex;
        gap: 12px;
      }
      .cta-actions .cta {
        background: #111827;
        color: white;
      }
      .cta-actions .ghost {
        border-color: rgba(15, 23, 42, 0.2);
        color: #111827;
      }
      .cta-points {
        display: grid;
        gap: 12px;
      }
      .point {
        background: rgba(255, 255, 255, 0.7);
        padding: 14px;
        border-radius: 12px;
        border: 1px solid rgba(15, 23, 42, 0.08);
      }
      .point h4 {
        margin: 0 0 6px;
      }
      .point p {
        margin: 0;
        color: #7c2d12;
        font-size: 13px;
      }
      @media (max-width: 960px) {
        .hero {
          grid-template-columns: 1fr;
        }
        .slider-track {
          width: 500%;
        }
        .booking-cta {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .hero-metrics {
          grid-template-columns: 1fr;
        }
        .hero-actions,
        .cta-actions,
        .card-actions {
          flex-direction: column;
        }
      }
    `
  ]
})
export class HomeComponent {
  slides = [
    { label: "Haircut", image: "assets/slide-haircut.svg" },
    { label: "Beard Trim", image: "assets/slide-beard.svg" },
    { label: "Hair Color", image: "assets/slide-color.svg" },
    { label: "Facial", image: "assets/slide-facial.svg" },
    { label: "Spa", image: "assets/slide-spa.svg" }
  ];

  serviceCards = [
    {
      title: "Haircut & Styling",
      desc: "Personalized cuts with modern finishing for every face shape.",
      image: "assets/slide-haircut.svg"
    },
    {
      title: "Beard Grooming",
      desc: "Sharp lines and clean detailing for a confident look.",
      image: "assets/slide-beard.svg"
    },
    {
      title: "Hair Coloring",
      desc: "Premium shades with long-lasting shine and protection.",
      image: "assets/slide-color.svg"
    },
    {
      title: "Skin Facial",
      desc: "Deep cleanse + hydration to keep your skin glowing.",
      image: "assets/slide-facial.svg"
    },
    {
      title: "Relaxing Spa",
      desc: "Release stress with our signature rejuvenation rituals.",
      image: "assets/slide-spa.svg"
    }
  ];
}

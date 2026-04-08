import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServicesService } from "../../services/services.service";
import { RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-services",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Services</h2>
    <div class="grid">
      <a class="card" *ngFor="let service of services" [routerLink]="['/services', service.id]">
        <div class="thumb" [style.backgroundImage]="getImageUrl(service) ? 'url(' + getImageUrl(service) + ')' : ''"></div>
        <h3>{{ service.name }}</h3>
        <p>{{ service.description }}</p>
        <div class="meta">{{ service.duration_minutes }} min • {{ service.price | currency:'INR' }}</div>
        <span class="link">View details →</span>
      </a>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        display: block;
      }
      .thumb {
        height: 140px;
        border-radius: 10px;
        background: #f3f4f6;
        background-size: cover;
        background-position: center;
        margin-bottom: 10px;
      }
      .meta {
        color: var(--muted);
        font-size: 14px;
      }
      .link {
        display: inline-block;
        margin-top: 8px;
        color: var(--brand);
        font-weight: 600;
        font-size: 13px;
      }
    `
  ]
})
export class ServicesComponent implements OnInit {
  services: any[] = [];

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.servicesService.getServices().subscribe((data) => (this.services = data));
  }

  getImageUrl(service: any): string {
    const path = service?.image_url;
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = environment.apiBaseUrl.replace(/\/api$/, "");
    return `${base}${path}`;
  }
}

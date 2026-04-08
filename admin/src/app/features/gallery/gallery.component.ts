import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GalleryService } from "../../services/gallery.service";

@Component({
  selector: "app-gallery",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Gallery</h2>
    <div class="grid">
      <div class="card" *ngFor="let item of gallery">
        <strong>{{ item.title }}</strong>
        <div>{{ item.category }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }
    `
  ]
})
export class GalleryComponent implements OnInit {
  gallery: any[] = [];

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.galleryService.listAll().subscribe((data) => (this.gallery = data));
  }
}

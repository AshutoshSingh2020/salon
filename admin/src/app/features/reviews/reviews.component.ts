import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReviewsService } from "../../services/reviews.service";

@Component({
  selector: "app-reviews",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Reviews</h2>
    <div class="card" *ngFor="let review of reviews">
      <strong>{{ review.user_name }}</strong>
      <div>Rating: {{ review.rating }}</div>
      <p>{{ review.comment }}</p>
      <small>Status: {{ review.status }}</small>
    </div>
  `,
  styles: [
    `
      .card {
        background: white;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        margin-bottom: 12px;
      }
    `
  ]
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit(): void {
    this.reviewsService.listAll().subscribe((data) => (this.reviews = data));
  }
}

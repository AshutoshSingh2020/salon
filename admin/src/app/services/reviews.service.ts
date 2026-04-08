import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class ReviewsService {
  constructor(private api: ApiService) {}

  listAll() {
    return this.api.get<any[]>("/reviews/admin");
  }

  updateStatus(id: number, status: string) {
    return this.api.patch(`/reviews/${id}/status`, { status });
  }

  remove(id: number) {
    return this.api.delete(`/reviews/${id}`);
  }
}

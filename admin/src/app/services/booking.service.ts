import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class BookingService {
  constructor(private api: ApiService) {}

  listBookings() {
    return this.api.get<any[]>("/bookings");
  }

  updateStatus(id: number, status: string) {
    return this.api.patch(`/bookings/${id}/status`, { status });
  }

  checkIn(id: number, code: string) {
    return this.api.post(`/bookings/${id}/check-in`, { code });
  }

  cancel(id: number) {
    return this.api.delete(`/bookings/${id}`);
  }
}

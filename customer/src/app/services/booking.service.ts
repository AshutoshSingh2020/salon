import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class BookingService {
  constructor(private api: ApiService) {}

  getAvailability(date: string, serviceId: number, staffId?: number) {
    const params = new URLSearchParams({ date, serviceId: String(serviceId) });
    if (staffId) params.append("staffId", String(staffId));
    return this.api.get<any[]>(`/bookings/availability?${params.toString()}`);
  }

  createBooking(payload: any) {
    return this.api.post("/bookings", payload);
  }

  getMyBookings() {
    return this.api.get<any[]>("/bookings/my");
  }
}

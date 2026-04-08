import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class StaffService {
  constructor(private api: ApiService) {}

  listAll() {
    return this.api.get<any[]>("/staff/admin");
  }

  create(payload: any) {
    return this.api.post("/staff", payload);
  }

  update(id: number, payload: any) {
    return this.api.put(`/staff/${id}`, payload);
  }

  remove(id: number) {
    return this.api.delete(`/staff/${id}`);
  }
}

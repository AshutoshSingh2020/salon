import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class ServicesService {
  constructor(private api: ApiService) {}

  listAll() {
    return this.api.get<any[]>("/services/admin");
  }

  create(payload: any) {
    return this.api.post("/services", payload);
  }

  update(id: number, payload: any) {
    return this.api.put(`/services/${id}`, payload);
  }

  getDetail(id: number) {
    return this.api.get<any>(`/services/${id}/detail`);
  }

  updateDetail(id: number, payload: any) {
    return this.api.put(`/services/${id}/detail`, payload);
  }

  remove(id: number) {
    return this.api.delete(`/services/${id}`);
  }
}

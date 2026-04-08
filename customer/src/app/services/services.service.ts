import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class ServicesService {
  constructor(private api: ApiService) {}

  getServices() {
    return this.api.get<any[]>("/services");
  }

  getService(id: number) {
    return this.api.get<any>(`/services/${id}`);
  }

  getServiceDetail(id: number) {
    return this.api.get<any>(`/services/${id}/detail`);
  }
}

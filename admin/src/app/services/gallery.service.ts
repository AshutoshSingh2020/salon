import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class GalleryService {
  constructor(private api: ApiService) {}

  listAll() {
    return this.api.get<any[]>("/gallery");
  }

  create(payload: any) {
    return this.api.post("/gallery", payload);
  }

  remove(id: number) {
    return this.api.delete(`/gallery/${id}`);
  }
}

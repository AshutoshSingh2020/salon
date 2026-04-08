import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class ContentService {
  constructor(private api: ApiService) {}

  getAbout() {
    return this.api.get<any>("/content/about");
  }

  getHeader() {
    return this.api.get<any>("/content/header");
  }

  getFooter() {
    return this.api.get<any>("/content/footer");
  }

  getPageBySlug(slug: string) {
    return this.api.get<any>(`/content/pages/${slug}`);
  }

  submitContact(payload: any) {
    return this.api.post<any>("/contact", payload);
  }
}

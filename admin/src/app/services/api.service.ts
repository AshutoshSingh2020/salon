import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Array<{ field?: string; message?: string }> | null;
};

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  private unwrap<T>(payload: T | ApiEnvelope<T>): T {
    if (payload && typeof payload === "object" && "success" in (payload as any) && "data" in (payload as any)) {
      return (payload as ApiEnvelope<T>).data;
    }
    return payload as T;
  }

  get<T>(path: string) {
    return this.http.get<T | ApiEnvelope<T>>(`${environment.apiBaseUrl}${path}`).pipe(map((res) => this.unwrap<T>(res)));
  }

  post<T>(path: string, body: any) {
    return this.http
      .post<T | ApiEnvelope<T>>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(map((res) => this.unwrap<T>(res)));
  }

  put<T>(path: string, body: any) {
    return this.http
      .put<T | ApiEnvelope<T>>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(map((res) => this.unwrap<T>(res)));
  }

  patch<T>(path: string, body: any) {
    return this.http
      .patch<T | ApiEnvelope<T>>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(map((res) => this.unwrap<T>(res)));
  }

  delete<T>(path: string) {
    return this.http.delete<T | ApiEnvelope<T>>(`${environment.apiBaseUrl}${path}`).pipe(map((res) => this.unwrap<T>(res)));
  }
}

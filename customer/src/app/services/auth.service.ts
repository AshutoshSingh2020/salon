import { Injectable } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";

const TOKEN_KEY = "salon_token";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    return this.api.post<{ token: string }>("/auth/login", { email, password }).pipe(
      tap((res) => localStorage.setItem(TOKEN_KEY, res.token))
    );
  }

  register(payload: { name: string; email: string; phone: string; password: string }) {
    return this.api.post<{ token: string }>("/auth/register", payload).pipe(
      tap((res) => localStorage.setItem(TOKEN_KEY, res.token))
    );
  }

  loginWithPhone(phone: string) {
    return this.api.post<{ token: string }>("/auth/phone", { phone }).pipe(
      tap((res) => localStorage.setItem(TOKEN_KEY, res.token))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantDomain = window.location.hostname?.trim().toLowerCase();
  if (tenantDomain) {
    req = req.clone({ setHeaders: { "X-Tenant-Domain": tenantDomain } });
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

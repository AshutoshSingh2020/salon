import { Injectable, inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { ApiService } from "./api.service";
import { tap } from "rxjs/operators";
import { TenantContextService } from "./tenant-context.service";

const TOKEN_KEY = "salon_admin_token";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    return this.api.post<{ token: string }>("/auth/login", { email, password }).pipe(
      tap((res) => localStorage.setItem(TOKEN_KEY, res.token))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch (_error) {
      return null;
    }
  }

  isAdmin() {
    const payload = this.getPayload();
    return !!payload && (payload.role === "admin" || payload.role === "super_admin");
  }

  isSuperAdmin() {
    const payload = this.getPayload();
    return !!payload && payload.role === "super_admin";
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthLoginRequest = req.url.includes("/auth/login") || req.url.includes("/auth/phone");
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  const auth = inject(AuthService);
  const tenantContext = inject(TenantContextService);
  const tenantDomain = tenantContext.getSelectedTenantDomain();
  if (tenantDomain && !isAuthLoginRequest) {
    req = req.clone({ setHeaders: { "X-Tenant-Domain": tenantDomain } });
  }
  const payload = auth.getPayload();
  if (payload?.role === "super_admin") {
    const tenantId = tenantContext.getSelectedTenantId();
    if (tenantId) {
      req = req.clone({ setHeaders: { "X-Tenant-Id": String(tenantId) } });
    }
  }
  return next(req);
};

import { Injectable } from "@angular/core";

const TENANT_KEY = "salon_selected_tenant";
const TENANT_DOMAIN_KEY = "salon_selected_tenant_domain";

@Injectable({ providedIn: "root" })
export class TenantContextService {
  getSelectedTenantId(): number | null {
    const raw = localStorage.getItem(TENANT_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return parsed;
  }

  setSelectedTenantId(id: number | null) {
    if (id === null || id === undefined) {
      localStorage.removeItem(TENANT_KEY);
      return;
    }
    localStorage.setItem(TENANT_KEY, String(id));
  }

  getSelectedTenantDomain(): string | null {
    const raw = localStorage.getItem(TENANT_DOMAIN_KEY);
    if (!raw) return null;
    const normalized = raw.trim().toLowerCase();
    return normalized || null;
  }

  setSelectedTenantDomain(domain: string | null) {
    if (!domain) {
      localStorage.removeItem(TENANT_DOMAIN_KEY);
      return;
    }
    const normalized = domain.trim().toLowerCase();
    if (!normalized) {
      localStorage.removeItem(TENANT_DOMAIN_KEY);
      return;
    }
    localStorage.setItem(TENANT_DOMAIN_KEY, normalized);
  }
}

import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(private api: ApiService) {}

  getDashboard() {
    return this.api.get<any>("/admin/dashboard");
  }

  getSettings() {
    return this.api.get<any>("/admin/settings");
  }

  updateSettings(payload: any) {
    return this.api.put<any>("/admin/settings", payload);
  }

  getDailyReport(date: string) {
    return this.api.get<any>(`/admin/reports/daily?date=${date}`);
  }

  getMonthlyReport(month: string) {
    return this.api.get<any>(`/admin/reports/monthly?month=${month}`);
  }

  getStaffReport(params: { date?: string; month?: string } = {}) {
    const query = new URLSearchParams();
    if (params.date) query.append("date", params.date);
    if (params.month) query.append("month", params.month);
    const suffix = query.toString();
    return this.api.get<any>(`/admin/reports/staff${suffix ? `?${suffix}` : ""}`);
  }

  getAbout() {
    return this.api.get<any>("/admin/about");
  }

  updateAbout(payload: any) {
    return this.api.put<any>("/admin/about", payload);
  }

  getContacts() {
    return this.api.get<any[]>("/admin/contacts");
  }

  updateContactStatus(id: number, status: string) {
    return this.api.patch(`/admin/contacts/${id}`, { status });
  }

  getHeaderTheme() {
    return this.api.get<any>("/admin/theme/header");
  }

  updateHeaderTheme(payload: any) {
    return this.api.put<any>("/admin/theme/header", payload);
  }

  createHeaderLink(payload: any) {
    return this.api.post<any>("/admin/theme/header-links", payload);
  }

  updateHeaderLink(id: number, payload: any) {
    return this.api.put<any>(`/admin/theme/header-links/${id}`, payload);
  }

  deleteHeaderLink(id: number) {
    return this.api.delete<any>(`/admin/theme/header-links/${id}`);
  }

  getFooterTheme() {
    return this.api.get<any>("/admin/theme/footer");
  }

  updateFooterTheme(payload: any) {
    return this.api.put<any>("/admin/theme/footer", payload);
  }

  createFooterLink(payload: any) {
    return this.api.post<any>("/admin/theme/footer-links", payload);
  }

  updateFooterLink(id: number, payload: any) {
    return this.api.put<any>(`/admin/theme/footer-links/${id}`, payload);
  }

  deleteFooterLink(id: number) {
    return this.api.delete<any>(`/admin/theme/footer-links/${id}`);
  }

  listPages() {
    return this.api.get<any[]>("/admin/pages");
  }

  getPage(id: number | string) {
    return this.api.get<any>(`/admin/pages/${id}`);
  }

  createPage(payload: any) {
    return this.api.post<any>("/admin/pages", payload);
  }

  updatePage(id: number | string, payload: any) {
    return this.api.put<any>(`/admin/pages/${id}`, payload);
  }

  updatePageSections(id: number | string, sections: any[]) {
    return this.api.put<any>(`/admin/pages/${id}/sections`, { sections });
  }

  deletePage(id: number | string) {
    return this.api.delete<any>(`/admin/pages/${id}`);
  }

  listMenuItems(location: "header" | "footer") {
    return this.api.get<any[]>(`/admin/menus?location=${location}`);
  }

  createMenuItem(payload: any) {
    return this.api.post<any>("/admin/menus", payload);
  }

  updateMenuItem(id: number | string, payload: any) {
    return this.api.put<any>(`/admin/menus/${id}`, payload);
  }

  deleteMenuItem(id: number | string) {
    return this.api.delete<any>(`/admin/menus/${id}`);
  }

  listTenants() {
    return this.api.get<any[]>("/admin/tenants");
  }

  createTenant(payload: { name: string; domain?: string }) {
    return this.api.post<{ id: number }>("/admin/tenants", payload);
  }

  provisionTenant(payload: {
    name: string;
    domain?: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    adminPassword: string;
    timezone?: string;
    seedDefaults?: boolean;
  }) {
    return this.api.post<{ tenantId: number; adminId: number }>("/admin/tenants/provision", payload);
  }

  listTenantDomains(tenantId: number | string) {
    return this.api.get<any[]>(`/admin/tenants/${tenantId}/domains`);
  }

  listTenantAdmins(tenantId: number | string) {
    return this.api.get<{ tenantId: number; totalAdmins: number; admins: any[] }>(`/admin/tenants/${tenantId}/admins`);
  }

  addTenantDomain(tenantId: number | string, payload: { domain: string; isPrimary?: boolean }) {
    return this.api.post<{ id: number }>(`/admin/tenants/${tenantId}/domains`, payload);
  }

  createTenantAdmin(
    tenantId: number | string,
    payload: {
      adminName: string;
      adminEmail: string;
      adminPhone: string;
      adminPassword: string;
      timezone?: string;
      seedDefaults?: boolean;
    }
  ) {
    return this.api.post<{ adminId: number }>(`/admin/tenants/${tenantId}/admins`, payload);
  }
}

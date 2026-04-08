import { Routes } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { ServicesComponent } from "./features/services/services.component";
import { BookingsComponent } from "./features/bookings/bookings.component";
import { StaffComponent } from "./features/staff/staff.component";
import { ReportsComponent } from "./features/reports/reports.component";
import { ReviewsComponent } from "./features/reviews/reviews.component";
import { GalleryComponent } from "./features/gallery/gallery.component";
import { SettingsComponent } from "./features/settings/settings.component";
import { StaffReportsComponent } from "./features/staff-reports/staff-reports.component";
import { AboutAdminComponent } from "./features/about/about.component";
import { ContactsComponent } from "./features/contacts/contacts.component";
import { ThemeHeaderComponent } from "./features/theme-header/theme-header.component";
import { ThemeFooterComponent } from "./features/theme-footer/theme-footer.component";
import { LoginComponent } from "./features/login/login.component";
import { AdminShellComponent } from "./core/layout/admin-shell.component";
import { PagesComponent } from "./features/pages/pages.component";
import { PageEditorComponent } from "./features/page-editor/page-editor.component";
import { PagePreviewComponent } from "./features/page-preview/page-preview.component";
import { MenusComponent } from "./features/menus/menus.component";
import { ServiceDetailEditorComponent } from "./features/service-detail-editor/service-detail-editor.component";
import { TenantsComponent } from "./features/tenants/tenants.component";
import { TenantOnboardingComponent } from "./features/tenants/tenant-onboarding.component";
import { adminAuthGuard } from "./guards/admin-auth.guard";
import { superAdminGuard } from "./guards/super-admin.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: AdminShellComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "dashboard", component: DashboardComponent },
      { path: "services", component: ServicesComponent, canActivate: [superAdminGuard] },
      { path: "bookings", component: BookingsComponent },
      { path: "staff", component: StaffComponent },
      { path: "reports", component: ReportsComponent },
      { path: "staff-reports", component: StaffReportsComponent },
      { path: "reviews", component: ReviewsComponent },
      { path: "gallery", component: GalleryComponent, canActivate: [superAdminGuard] },
      { path: "about", component: AboutAdminComponent, canActivate: [superAdminGuard] },
      { path: "contacts", component: ContactsComponent, canActivate: [superAdminGuard] },
      { path: "pages", component: PagesComponent, canActivate: [superAdminGuard] },
      { path: "menus", component: MenusComponent, canActivate: [superAdminGuard] },
      { path: "tenants", component: TenantsComponent, canActivate: [superAdminGuard] },
      { path: "tenants/onboard", component: TenantOnboardingComponent, canActivate: [superAdminGuard] },
      { path: "tenants/:id/onboard", component: TenantOnboardingComponent, canActivate: [superAdminGuard] },
      { path: "services/:id/detail", component: ServiceDetailEditorComponent, canActivate: [superAdminGuard] },
      { path: "pages/new", component: PageEditorComponent, canActivate: [superAdminGuard] },
      { path: "pages/:id/preview", component: PagePreviewComponent, canActivate: [superAdminGuard] },
      { path: "pages/:id", component: PageEditorComponent, canActivate: [superAdminGuard] },
      { path: "theme/header", component: ThemeHeaderComponent, canActivate: [superAdminGuard] },
      { path: "theme/footer", component: ThemeFooterComponent, canActivate: [superAdminGuard] },
      { path: "settings", component: SettingsComponent, canActivate: [superAdminGuard] }
    ]
  }
];

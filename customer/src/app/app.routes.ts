import { Routes } from "@angular/router";
import { ServiceDetailComponent } from "./features/service-detail/service-detail.component";
import { BookingComponent } from "./features/booking/booking.component";
import { ProfileComponent } from "./features/profile/profile.component";
import { authGuard } from "./guards/auth.guard";
import { AuthComponent } from "./features/auth/auth.component";
import { DynamicPageComponent } from "./features/dynamic-page/dynamic-page.component";

export const routes: Routes = [
  { path: "", component: DynamicPageComponent, data: { slug: "home" } },
  { path: "services/:id", component: ServiceDetailComponent },
  { path: "booking", component: BookingComponent },
  { path: "pages/:slug", component: DynamicPageComponent },
  { path: "auth", component: AuthComponent },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: ":slug", component: DynamicPageComponent }
];

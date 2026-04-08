import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastService } from "./toast.service";
import { getApiErrorMessage } from "../utils/api-error";

const isBackgroundAssetRequest = (url: string): boolean => url.includes("/assets/") || url.includes("/uploads/");

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err) => {
      if (!isBackgroundAssetRequest(req.url)) {
        toast.warn(getApiErrorMessage(err, "Request failed."));
      }
      return throwError(() => err);
    })
  );
};

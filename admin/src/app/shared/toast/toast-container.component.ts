import { Component } from "@angular/core";
import { AsyncPipe, NgClass, NgFor } from "@angular/common";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-toast-container",
  standalone: true,
  imports: [NgFor, NgClass, AsyncPipe],
  template: `
    <div class="toast-wrap">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="toast"
        [ngClass]="toast.type"
        (click)="toastService.dismiss(toast.id)"
      >
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [
    `
      .toast-wrap {
        position: fixed;
        right: 16px;
        top: 16px;
        z-index: 10000;
        display: grid;
        gap: 8px;
        width: min(360px, calc(100vw - 24px));
      }
      .toast {
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 13px;
        line-height: 1.4;
        border: 1px solid transparent;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
        background: white;
        cursor: pointer;
      }
      .toast.warning {
        background: #fffbeb;
        border-color: #f59e0b;
        color: #92400e;
      }
      .toast.success {
        background: #ecfdf5;
        border-color: #22c55e;
        color: #166534;
      }
      .toast.info {
        background: #eff6ff;
        border-color: #3b82f6;
        color: #1d4ed8;
      }
    `
  ]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}

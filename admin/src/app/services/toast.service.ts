import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type ToastType = "warning" | "success" | "info";

export type ToastMessage = {
  id: number;
  type: ToastType;
  message: string;
};

@Injectable({ providedIn: "root" })
export class ToastService {
  private readonly stream = new BehaviorSubject<ToastMessage[]>([]);
  private seq = 0;

  readonly toasts$ = this.stream.asObservable();

  warn(message: string, durationMs = 3500): void {
    this.push("warning", message, durationMs);
  }

  success(message: string, durationMs = 2800): void {
    this.push("success", message, durationMs);
  }

  info(message: string, durationMs = 3000): void {
    this.push("info", message, durationMs);
  }

  dismiss(id: number): void {
    const current = this.stream.getValue();
    this.stream.next(current.filter((item) => item.id !== id));
  }

  private push(type: ToastType, message: string, durationMs: number): void {
    const trimmed = (message || "").trim();
    if (!trimmed) return;
    const id = ++this.seq;
    const toast: ToastMessage = { id, type, message: trimmed };
    this.stream.next([...this.stream.getValue(), toast]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}

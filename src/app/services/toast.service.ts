import { Injectable, signal } from "@angular/core";

interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number; // duration in milliseconds
}
@Injectable({
  providedIn: 'root'
})

export class ToastService {
  public toasts = signal<Toast[]>([]);

  showToast(message: string, type: 'success' | 'error' | 'info', duration: number = 5000) {
    const toast: Toast = { message, type, duration };
    this.toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t !== toast));
    }, duration);
  }
}

import { Injectable, signal } from "@angular/core";

interface Toast {
  message: string;
  type: ToastType;
  duration: number; // duration in milliseconds
}

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  public toasts = signal<Toast[]>([]);

  showToast(message: string, type: ToastType, duration: number = 5000) {
    const toast: Toast = { message, type, duration };
    this.toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t !== toast));
    }, duration);
  }

  showSuccess(message: string, duration: number = 5000) {
    this.showToast(message, ToastType.Success, duration);
  }

  showError(message: string, duration: number = 5000) {
    this.showToast(message, ToastType.Error, duration);
  }

  showWarning(message: string, duration: number = 5000) {
    this.showToast(message, ToastType.Warning, duration);
  }

  showInfo(message: string, duration: number = 5000) {
    this.showToast(message, ToastType.Info, duration);
  }
}

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}
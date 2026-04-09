import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../../models/appNotification.model';
import { NotificationApi } from '../../services/notification-api';
import { notificationStyle } from '../../components/notifications-list/notification-style';

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-history.html',
})
export class NotificationHistory implements OnInit {
  isLoading: WritableSignal<boolean> = signal(true);
  notifications: WritableSignal<AppNotification[]> = signal([]);
  currentPage: WritableSignal<number> = signal(1);
  totalPages: WritableSignal<number> = signal(1);
  total: WritableSignal<number> = signal(0);

  pages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = 7;
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  constructor(private notificationApi: NotificationApi) {}

  ngOnInit(): void {
    this.notificationApi.getAllTotal().subscribe({
      next: (res) => {
        this.total.set(res.totalItems);
        this.totalPages.set(res.totalPages);
        this.loadPage(1);
      }
    });
  }

  loadPage(page: number): void {
    this.isLoading.set(true);
    this.notificationApi.getAll(page).subscribe({
      next: (items) => {
        this.notifications.set(items.map(n => notificationStyle(n)));
        this.currentPage.set(page);
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number): void { if (page >= 1 && page <= this.totalPages()) this.loadPage(page); }
  prevPage(): void { this.goToPage(this.currentPage() - 1); }
  nextPage(): void { this.goToPage(this.currentPage() + 1); }
}

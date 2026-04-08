import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../../models/appNotification.model';

@Component({
  selector: 'app-notifications-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.css',
})
export class NotificationsList {
  @Input() notifications: AppNotification[] = [];
  @Input() isLoadingNotifications: boolean = false;
  @Input() isLoadingMore: boolean = false;
  @Input() hasMore: boolean = false;
  @Output() loadMore = new EventEmitter<void>();
  @Output() markAsRead = new EventEmitter<number>();
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;

  onLoadMore(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const scrollTop = this.containerRef?.nativeElement.scrollTop ?? 0;
    this.loadMore.emit();
    // restaura o scroll após o Angular re-renderizar
    setTimeout(() => {
      if (this.containerRef?.nativeElement) {
        this.containerRef.nativeElement.scrollTop = scrollTop;
      }
    });
  }
}

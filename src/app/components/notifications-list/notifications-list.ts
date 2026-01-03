import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    @Output() notificationRead = new EventEmitter<number>();

  onNotificationClick(id: number) {
    this.notificationRead.emit(id);
  }
}

// ng generate component notifications-list --skip-tests --standalone   

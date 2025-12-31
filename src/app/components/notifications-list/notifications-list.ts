import { Component, Input } from '@angular/core';
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
}

// ng generate component notifications-list --skip-tests --standalone   

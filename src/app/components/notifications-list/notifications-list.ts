import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.css',
})
export class NotificationsList {
  @Input() notifications: any[] = [];
}

// ng generate component notifications-list --skip-tests --standalone   

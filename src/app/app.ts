import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toasts } from "./components/toasts/toasts";
import { Sidebar } from "./components/sidebar/sidebar";
import { AuthService } from './services/auth.service';
import { NotificationsList } from "./components/notifications-list/notifications-list";
import { AppNotification } from './models/appNotification.model';
import { NotificationApi } from './services/notification-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toasts, Sidebar, NotificationsList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('XpemMercurioClient');
  notifications = signal<AppNotification[]>([]);
  notReadNotificationsCount = signal(0);
  isLoadingNotifications: WritableSignal<boolean> = signal(false);

  constructor(public authService: AuthService, private notificationApi: NotificationApi) { }

  ngOnInit() {
    this.LoadTotalNotificationsUnread();
  }

  private LoadTotalNotificationsUnread() {
    this.notificationApi.getTotalUnread().subscribe({
      next: (result) => {
        this.notReadNotificationsCount.set(result);
      },
      error: (e) => {
        console.error("Erro ao carregar total de notificações não lidas", e);
      }
    });
  }

  loadNotReadNotifications() {
    this.isLoadingNotifications.set(true);
    this.notificationApi.getTopUnread().subscribe({
      next: (result) => {
        this.notifications.set(result);
        this.isLoadingNotifications.set(false);
      },
      error: (e) => {
        console.error("Erro ao carregar notificações não lidas", e);
        this.isLoadingNotifications.set(false);
      }
    });
  }

  // Função para remover a notificação ao clicar
  markAsRead(id: number) {
    this.notifications.update(prev => prev.filter(n => n.id !== id));
  }

  // Função para limpar tudo
  clearAll() {
    this.notifications.set([]);
    this.notReadNotificationsCount.set(0);
  }
}


// ng g c home --skip-tests
import { Component, OnDestroy, OnInit, signal, WritableSignal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toasts } from "./components/toasts/toasts";
import { Sidebar } from "./components/sidebar/sidebar";
import { AuthService } from './services/auth.service';
import { NotificationsList } from "./components/notifications-list/notifications-list";
import { AppNotification, NotificationObjectType, NotificationType } from './models/appNotification.model';
import { NotificationApi } from './services/notification-api';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toasts, Sidebar, NotificationsList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit, OnDestroy {
  protected readonly title = signal('XpemMercurioClient');
  notifications = signal<AppNotification[]>([]);
  notReadNotificationsCount = signal(0);
  isLoadingNotifications: WritableSignal<boolean> = signal(false);

  private notificationInterval: any;

  constructor(public authService: AuthService, private notificationApi: NotificationApi) {
    // Reage às mudanças no estado de autenticação
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      
      if (isAuthenticated) {
        this.startNotificationPolling();
      } else {
        this.stopNotificationPolling();
      }
    });
  }

  ngOnInit() {
    // Verifica o estado de autenticação através da API
    this.authService.checkSessionStatus().subscribe();
  }

  ngOnDestroy() {
    this.stopNotificationPolling();
  }

  private startNotificationPolling() {
    // Evita múltiplos intervals
    if (this.notificationInterval) {
      return;
    }

    // Carrega imediatamente
    this.loadTotalNotificationsUnread();

    // Depois continua carregando a cada 20 segundos
    this.notificationInterval = setInterval(() => {
      this.loadTotalNotificationsUnread();
    }, 20000);
  }

  private stopNotificationPolling() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
  }

  private loadTotalNotificationsUnread() {
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
    this.notificationApi.getTopUnread()
      .pipe(
        map(notifications =>
          notifications.map(notification => ({
            ...notification,
            borderStyle: this.getNotificationBorderStyle(notification.type),
            icon: this.getNotificationIcon(notification.objectType || NotificationObjectType.System)
          }))
        )
      )
      .subscribe({
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

  private getNotificationBorderStyle(type: NotificationType): string {
    const borderStyleMap: Record<NotificationType, string> = {
      [NotificationType.Info]: 'info',
      [NotificationType.Warning]: 'warning',
      [NotificationType.Error]: 'danger',
      [NotificationType.Success]: 'success',
    };
    return borderStyleMap[type] || 'secondary';
  }

  private getNotificationIcon(objectType: NotificationObjectType): string {
    const iconMap: Record<NotificationObjectType, string> = {
      [NotificationObjectType.Order]: 'cart-check',
      [NotificationObjectType.Product]: 'box-seam',
      [NotificationObjectType.Shipment]: 'truck',
      [NotificationObjectType.User]: 'person-circle',
      [NotificationObjectType.MarketPlace]: 'shop',
      [NotificationObjectType.System]: 'cpu',
    };
    return iconMap[objectType] || 'bell';
  }


  // Função para remover a notificação ao clicar
  markAsRead(id: number) {
    this.notifications.update(prev => prev.filter(n => n.id !== id));
    this.notReadNotificationsCount.update(count => Math.max(0, count - 1));
    this.notificationApi.markAsRead([id]).subscribe({
      next: () => {
        // Notificação marcada como lida com sucesso
      },
      error: (e) => {
        const ids = this.notifications().map(n => n.id);

        this.notifications.set([]);
        this.notReadNotificationsCount.set(0);

        if (!ids.length) {
          return;
        }
      }
    });
  }

  clearAll() {
    this.notifications.set([]);
    this.notReadNotificationsCount.set(0);

    const ids = this.notifications().map(n => n.id);
    this.notificationApi.markAsRead(ids).subscribe({
      next: () => {
        // Notificações marcadas como lidas com sucesso
        console.log("Todas as notificações foram marcadas como lidas");
      },
      error: (e) => {
        console.error("Erro ao marcar todas as notificações como lidas", e);
      }
    });
  }
}


// ng g c home --skip-tests
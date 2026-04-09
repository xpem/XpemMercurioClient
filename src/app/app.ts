import { Component, OnDestroy, OnInit, signal, WritableSignal, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Toasts } from "./components/toasts/toasts";
import { Sidebar } from "./components/sidebar/sidebar";
import { AuthService } from './services/auth.service';
import { NotificationsList } from "./components/notifications-list/notifications-list";
import { AppNotification, NotificationObjectType, NotificationType } from './models/appNotification.model';
import { NotificationApi } from './services/notification-api';
import { map, filter } from 'rxjs';
import { notificationStyle } from './components/notifications-list/notification-style';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toasts, Sidebar, NotificationsList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit, OnDestroy {
  protected readonly pageTitle = signal('...');
  notifications = signal<AppNotification[]>([]);
  notReadNotificationsCount = signal(0);
  isLoadingNotifications: WritableSignal<boolean> = signal(false);
  isLoadingMore: WritableSignal<boolean> = signal(false);
  notificationsPage = signal(0);
  hasMoreNotifications = signal(true);

  private notificationInterval: any;

  constructor(public authService: AuthService, private notificationApi: NotificationApi, private router: Router) {
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

    // Escuta as mudanças de rota para atualizar o título
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const routeData = this.getRouteData();
      if (routeData && routeData['title']) {
        this.pageTitle.set(routeData['title']);
      } else {
        this.pageTitle.set('Xpem Mercúrio');
      }
    });

    // Define o título inicial
    const initialRouteData = this.getRouteData();
    if (initialRouteData && initialRouteData['title']) {
      this.pageTitle.set(initialRouteData['title']);
    }
  }

  private getRouteData() {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
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
    this.notificationsPage.set(0);
    this.hasMoreNotifications.set(false);
    this.isLoadingNotifications.set(true);
    this.notificationApi.getTopUnread(0)
      .pipe(map(notifications => notifications.map(n => this.mapNotification(n))))
      .subscribe({
        next: (result) => {
          this.notifications.set(result);
          this.hasMoreNotifications.set(result.length >= 5 && this.notReadNotificationsCount() > result.length);
          this.isLoadingNotifications.set(false);
        },
        error: () => this.isLoadingNotifications.set(false)
      });
  }

  loadMoreNotifications() {
    const nextPage = this.notificationsPage() + 1;
    this.notificationsPage.set(nextPage);
    this.isLoadingMore.set(true);
    this.notificationApi.getTopUnread(nextPage)
      .pipe(map(notifications => notifications.map(n => this.mapNotification(n))))
      .subscribe({
        next: (result) => {
          this.notifications.update(prev => [...prev, ...result]);
          const totalLoaded = this.notifications().length;
          this.hasMoreNotifications.set(result.length >= 5 && this.notReadNotificationsCount() > totalLoaded);
          this.isLoadingMore.set(false);
        },
        error: () => this.isLoadingMore.set(false)
      });
  }

  private mapNotification(notification: AppNotification): AppNotification {
    return notificationStyle(notification);
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


    const ids = this.notifications().map(n => n.id);
    this.notificationApi.markAllAsRead().subscribe({
      next: () => {
        this.notifications.set([]);
        this.notReadNotificationsCount.set(0);
      },
      error: (e) => {
        console.error("Erro ao marcar todas as notificações como lidas", e);
      }
    });
  }
}


// ng g c home --skip-tests
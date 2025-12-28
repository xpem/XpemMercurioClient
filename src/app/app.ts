import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toasts } from "./components/toasts/toasts";
import { Sidebar } from "./components/sidebar/sidebar";
import { AuthService } from './services/auth.service';
import { NotificationsList } from "./components/notifications-list/notifications-list";
import { AppNotification } from './models/appNotification.model';

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

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.generateMocks();
  }

  private generateMocks() {
    const mocks: AppNotification[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Notificação ${i + 1}`,
      message: `Este é o conteúdo detalhado da mensagem de teste número ${i + 1}.`,
     //mostrar a data em formado dd/MM/yyyy HH:mm
      date: new Date(Date.now() - i * 3600000).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isRead: false
    }));
    
    this.notifications.set(mocks);
    this.notReadNotificationsCount.set(mocks.length);
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
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  // ng generate component sidebar --standalone --skip-tests
  private authService = inject(AuthService);
  private router = inject(Router);

  // Função chamada pelo (click) do botão 'Sair'
  onLogout() {
    this.authService.logout(); // Remove o token

    // Redireciona para a tela de login/signin
    this.router.navigate(['/user/signin']);
  }
}

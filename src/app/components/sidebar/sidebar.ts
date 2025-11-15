import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  // ng generate component sidebar --standalone --skip-tests
  private authService = inject(AuthService);
  router = inject(Router);

    // constructor(public router: Router, private authService: AuthService) {}

  // Função chamada pelo (click) do botão 'Sair'
  onLogout() {
    this.authService.logout(); // Remove o token

    // Redireciona para a tela de login/signin
    this.router.navigate(['/user/signin']);
  }
}

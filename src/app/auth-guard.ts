import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map, Observable, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
    const router = inject(Router);

    // O Guard retorna o Observable, garantindo que o Router espere.
    return authService.checkSessionStatus().pipe(
        take(1),
        map(isLoggedIn => {
            if (isLoggedIn) {
                return true; 
            } else {
              console.log('Acesso negado - Usuário não autenticado');
                // Se falhou (a API retornou 401), redireciona
                return router.createUrlTree(['/signin'], { 
                    queryParams: { returnUrl: state.url } 
                });
            }
        })
    );
};
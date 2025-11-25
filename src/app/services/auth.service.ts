import { Injectable, inject, PLATFORM_ID, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; // <-- Novo import

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private cookieService = inject(CookieService);
    private isAuthenticatedSignal = signal<boolean>(false);

    private readonly TOKEN_KEY = 'auth_token';
    readonly apiUrlStatus = '/api/user';

    isAuthenticated = computed(() => this.isAuthenticatedSignal());

    constructor() {
        // Verifica se existe token ao inicializar
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        const token = localStorage.getItem('token'); // ou sessionStorage
        this.isAuthenticatedSignal.set(!!token);
    }


    // 1. Obtém o token (se estiver em um cookie NÃO HTTP-ONLY)
    public getToken(): string | null {
        // console.log(this.cookieService.get(this.TOKEN_KEY));
        // Verifica se o cookie existe
        return this.cookieService.get(this.TOKEN_KEY) || null;
    }

    // 2. Salva o token (se o backend retornar o token no corpo JSON)
    // Opcional: Se o backend não for HTTP-Only, você o salva manualmente aqui.
    public saveToken(token: string): void {
        // Configuração do cookie no frontend (usar apenas se não for HTTP-Only)
        this.cookieService.set(this.TOKEN_KEY, token, {
            expires: 1, // Expira em 1 dia
            secure: true, // Apenas via HTTPS
            sameSite: 'Lax'
        });

        this.isAuthenticatedSignal.set(true);
    }

    // 3. Remove o token (Logout)
    public logout(): void {
        this.cookieService.delete(this.TOKEN_KEY);
        this.isAuthenticatedSignal.set(false);
    }

    // 4. Verificação Assíncrona via API (O Guard principal)
    public checkSessionStatus(): Observable<boolean> {
        // Esta chamada de API é quem testa o Cookie (HTTP-Only ou não) no backend
        // Se o token for HTTP-Only, o navegador o anexa aqui.
        return this.http.get<any>(this.apiUrlStatus).pipe(
            map(response => {
                console.log('Resposta de status da sessão:', response);

                if (!!response?.email)
                    this.isAuthenticatedSignal.set(!!response?.email);

                return !!response?.email;
            }), // Retorna true se a sessão estiver ativa
            catchError(() => of(false)) // Retorna false em caso de erro
        );
    }
}
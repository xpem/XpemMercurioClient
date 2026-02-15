import { Injectable, inject, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; // <-- Novo import

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private cookieService = inject(CookieService);
    private platformId = inject(PLATFORM_ID);
    private isAuthenticatedSignal = signal<boolean>(false);

    private readonly TOKEN_KEY = 'auth_token';
    readonly apiUrlStatus = '/api/user';

    isAuthenticated = computed(() => this.isAuthenticatedSignal());

    constructor() {
        // Verifica se existe token ao inicializar
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        if (!isPlatformBrowser(this.platformId)) {
            this.isAuthenticatedSignal.set(false);
            return;
        }

        const token = this.cookieService.get(this.TOKEN_KEY);
        this.isAuthenticatedSignal.set(!!token);

    }


    // 1. Obtém o token (se estiver em um cookie NÃO HTTP-ONLY)
    public getToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        // Verifica se o cookie existe
        return this.cookieService.get(this.TOKEN_KEY) || null;
    }

    // 2. Salva o token (se o backend retornar o token no corpo JSON)
    // Opcional: Se o backend não for HTTP-Only, você o salva manualmente aqui.
    public saveToken(token: string): void {
        // Configuração do cookie no frontend (usar apenas se não for HTTP-Only)
        this.cookieService.set(this.TOKEN_KEY, token, {
            expires: 3, // Expira em 3 dias
            secure: true, // Apenas via HTTPS
            sameSite: 'Lax',
            path: '/'
        });

        this.isAuthenticatedSignal.set(true);
    }

    // 3. Remove o token (Logout)
    public logout(): void {
        this.cookieService.delete(this.TOKEN_KEY, '/');
        this.isAuthenticatedSignal.set(false);
    }

    // 4. Verificação Assíncrona via API (O Guard principal)
    public checkSessionStatus(): Observable<boolean> {
        // Esta chamada de API é quem testa o Cookie (HTTP-Only ou não) no backend
        // Se o token for HTTP-Only, o navegador o anexa aqui.
        return this.http.get<any>(this.apiUrlStatus).pipe(
            map(response => {
                const hasSession = !!response?.email;
                this.isAuthenticatedSignal.set(hasSession);
                return hasSession;
            }), // Retorna true se a sessão estiver ativa
            catchError((error) => {
                console.error('Erro ao verificar status da sessão:', error);
                this.isAuthenticatedSignal.set(false);
                return of(false);
            }
        ) // Retorna false em caso de erro
        );
    }
}
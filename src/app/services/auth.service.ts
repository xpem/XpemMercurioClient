import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; // <-- Novo import

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private cookieService = inject(CookieService); // <-- Injeção

    private readonly TOKEN_KEY = 'auth_token';
    readonly apiUrlStatus = '/api/user';

    // 1. Obtém o token (se estiver em um cookie NÃO HTTP-ONLY)
    public getToken(): string | null {
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
    }

    // 3. Remove o token (Logout)
    public logout(): void {
        this.cookieService.delete(this.TOKEN_KEY);
    }

    // 4. Verificação Assíncrona via API (O Guard principal)
    public checkSessionStatus(): Observable<boolean> {
        // Esta chamada de API é quem testa o Cookie (HTTP-Only ou não) no backend
        // Se o token for HTTP-Only, o navegador o anexa aqui.
        return this.http.get<any>(this.apiUrlStatus).pipe(
            map(response => {
                console.log('Resposta de status da sessão:', response);
                return !!response?.email;
            }), // Retorna true se a sessão estiver ativa
            catchError(() => of(false)) // Retorna false em caso de erro
        );
    }
}
import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se houver um token, clona a requisição e adiciona o cabeçalho "Authorization"
  if (token) {
    // Adiciona o formato Bearer Token (padrão JWT)
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` 
      }
    });
    return next(cloned);
  }

  // Se não houver token, prossegue com a requisição original (para rotas públicas, como o login)
  return next(req);
};

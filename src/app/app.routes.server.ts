import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 1. As rotas protegidas DEVE ser DYNAMIC
  {
    path: '**', // Rota protegida pelo authGuard
    renderMode: RenderMode.Client
  },
  //quando tiver rotas publicas, usar prerender
  // {
  //   path: '**',
  //   renderMode: RenderMode.Prerender
  // }
];

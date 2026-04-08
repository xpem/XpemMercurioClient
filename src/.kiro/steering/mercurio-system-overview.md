---
inclusion: always
---

# Mercurio System

**Client**: Angular 20 SPA — `src/app/` — `XpemMercurioClient`
**Server**: ASP.NET Core Web API — path base `/api` — `XpemMercurioServer`

## Server layout
- `Controllers/` — HTTP only, herdam `BaseAuthorizedController`, `Uid` vem do JWT
- `Infra/Service/` — lógica de negócio
- `Infra/Repo/` — EF Core
- `Infra/Model/` — DTOs (Req/Res)
- `Infra/BaseModel/` — enums e base classes compartilhados
- `InvoiceWorker/` — worker NF-e
- `WebhookWorker/` — worker webhooks (ML/Shopee)

## Client layout
- `services/` — um service por controller, usa `HttpClient` tipado
- `pages/` — componentes de rota
- `components/` — componentes reutilizáveis
- `models/` — interfaces TypeScript espelhando DTOs do server

## Service → Controller
| Service | Controller | Base URL |
|---|---|---|
| `ShipmentService` | `ShipmentController` | `/api/Shipment` |
| `OrderService` | `OrderController` | `/api/Order` |
| `NotificationApi` | `NotificationController` | `/api/Notification` |
| `ProductService` | `ProductController` | `/api/Product` |
| `CompanyService` | `CompanyController` | `/api/Company` |
| `InvoiceService` | `InvoiceController` | `/api/Invoice` |
| `UserService` | `UserController` | `/api/User` |

## Convenções
- Respostas do server: `BuildResponse(BaseResp)` → `200 Ok(content)` ou `400 BadRequest(error)`
- Estado no client: Angular `signal` / `computed` (não `BehaviorSubject`)
- Auth: JWT via cookie (`ngx-cookie-service`), `token-interceptor.ts` injeta em toda request
- `Marketplace` enum: `1`=MercadoLivre, `2`=Shopee

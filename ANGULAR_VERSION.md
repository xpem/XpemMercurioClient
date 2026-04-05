# Versão do Angular

## Versão Atual
**Angular 20.3.0** (LTS)

---

## Sintaxe de Controle de Fluxo Moderno

A partir do Angular 17, a aplicação utiliza a **Nova Sintaxe de Controle de Fluxo** baseada em blocos (`@`), deixando desatualizada a sintaxe anterior com `*ngIf`, `*ngFor`, etc.

### 1. **@if - Condicional**
```html
<!-- Sintaxe Moderna -->
@if (condition) {
  <p>Conteúdo exibido se condition for true</p>
}
```

### 2. **@if / @else - Condicional com Alternativa**
```html
@if (isLoggedIn) {
  <p>Bem-vindo!</p>
} @else {
  <p>Por favor, faça login</p>
}
```

### 3. **@if / @else if / @else - Múltiplas Condições**
```html
@if (status === 'loading') {
  <p>Carregando...</p>
} @else if (status === 'success') {
  <p>Sucesso!</p>
} @else {
  <p>Erro</p>
}
```

### 4. **@for - Loop (substitui *ngFor)**
```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}
```

**Importante**: O atributo `track` é obrigatório e deve referenciar um identificador único para melhor performance.

### 5. **@switch / @case - Seleção de Casos**
```html
@switch (status) {
  @case ('active') {
    <span class="badge bg-success">Ativo</span>
  }
  @case ('inactive') {
    <span class="badge bg-danger">Inativo</span>
  }
  @default {
    <span class="badge bg-secondary">Desconhecido</span>
  }
}
```

**Importante**: Não há fallthrough - cada `@case` é independente.

---

## Particularidades Importantes

### 1. **Server-Side Rendering (SSR)**
- A aplicação utiliza **Angular Universal** para SSR
- Entry points:
  - Browser: `src/main.ts`
  - Server: `src/main.server.ts`
- Servidor Express configurado em `src/server.ts`

### 2. **Standalone Components**
- Angular 20 usa componentes standalone por padrão
- Componentes podem ser importados diretamente sem necessidade de módulos

### 3. **Roteamento Baseado em Funções**
- As rotas são definidas usando `app.routes.ts` e `app.routes.server.ts`
- Utiliza funções para definir rotas, não `NgModule`

### 4. **Dependency Injection com Providers**
- Utiliza `app.config.ts` para configurar providers
- Sintaxe moderna com `provideRouter()`, `provideHttpClient()`, etc.

### 5. **TypeScript Strict Mode**
- O projeto utiliza `strict: true` no `tsconfig.json`
- Tipagem rigorosa é obrigatória

### 6. **Angular Material**
- Componentes de UI do Material estão configurados em `@angular/material`
- Usa tema customizado em `src/custom-theme.scss`

### 7. **Bootstrap 5**
- Framework CSS Bootstrap 5.3.8 é utilizado junto com Angular
- Ícones do Bootstrap Icons 1.13.1

### 8. **Performance Budgets**
Configurados em `angular.json`:
- **Bundle inicial**: ⚠️ 500kB | ❌ 1MB
- **Estilos do componente**: ⚠️ 4kB | ❌ 8kB

### 9. **Formatação de Código**
- **Prettier** com configuração customizada
- Largura de linha: 100 caracteres
- Aspas simples para strings
- Parser customizado para Angular HTML

### 10. **RxJS 7.8**
- Reactive programming com Observables
- Padrão funcional para operações assíncronas
- Interceptadores HTTP para autenticação

---

## Sintaxe Descontinuada ❌

**Não usar mais:**
- `*ngIf` → use `@if`
- `*ngFor` → use `@for`
- `*ngSwitch` → use `@switch`
- `*ngIf` com `else` → use `@if` com `@else`
- NgModules → use componentes standalone

---

## Recursos Úteis

- [Documentação Angular 20](https://angular.io/docs)
- [Control Flow Syntax](https://angular.io/guide/control-flow)
- [Angular Universal (SSR)](https://angular.io/guide/universal)
- [Standalone Components](https://angular.io/guide/standalone-components)

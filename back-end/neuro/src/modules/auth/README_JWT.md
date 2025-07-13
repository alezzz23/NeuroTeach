# JWT Auth Implementation

Este módulo ahora incluye:

- Estrategia JWT (`jwt.strategy.ts`)
- Guard de autenticación (`jwt-auth.guard.ts`)
- Login que retorna `{ access_token, user }`
- Registro de usuario
- Integración de `@nestjs/jwt` y `@nestjs/passport`
- Uso de variables de entorno: `JWT_SECRET`, `JWT_EXPIRES_IN`

## Uso

- Para proteger rutas, importa y usa `JwtAuthGuard` en los controladores o métodos.
- El token se debe enviar como `Authorization: Bearer <token>`.

## Siguientes pasos
- Proteger endpoints sensibles usando el guard.
- Añadir roles y validaciones si es necesario.

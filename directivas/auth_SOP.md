# SOP - Autenticación de Usuarios (Login & Sign Up)

## Objetivo
Implementar un sistema de autenticación básico (simulado para frontend) que permita a los usuarios crear una cuenta y acceder al portal de activación de ITERA HEALTH.

## Entradas
- Nombre completo
- Correo electrónico (validación de formato)
- Contraseña (mínimo 6 caracteres)
- Nombre de la práctica médica (solo para Sign Up)

## Lógica de Autenticación
1.  **Sign Up**: Recolectar datos del usuario, guardarlos en el estado global (o simulado en localStorage) y marcar al usuario como autenticado.
2.  **Login**: Validar las credenciales contra los datos guardados. En esta fase experimental, cualquier login exitoso redirigirá al Dashboard.
3.  **Sesión**: Mantener el estado de `currentUser` en el componente raíz (`App.tsx`) para controlar la visibilidad del Header y el Portal.

## Restricciones y Casos Borde
- No permitir el acceso al `ActivationPortal` si el usuario no ha hecho Login o Sign Up.
- El Header debe mostrar botones de "Login" y "Sign Up" solo cuando NO hay sesión activa.
- Si hay una sesión activa, el Header debe mostrar "My Portal" y "Logout".
- Al cerrar sesión, se deben limpiar los datos del usuario activo y redirigir a la landing page.

## Advertencias
- **Nota**: No intentar persistir contraseñas reales en texto plano si se llegara a conectar con un backend real. Para este demo frontend, se utilizará un estado reactivo simple.
- **Trampas conocidas**: Al abrir el Portal después del registro, asegurarse de que los datos de la práctica se pasen correctamente para no ver un Dashboard vacío.

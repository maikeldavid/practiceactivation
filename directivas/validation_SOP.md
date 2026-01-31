# SOP - Validación de Campos (Activation Portal)

## Objetivo
Asegurar que los datos ingresados en el perfil de la práctica médica y del médico principal sean válidos y sigan los estándares de la industria (NPI, formatos de contacto, etc.) antes de permitir el guardado o envío.

## Entradas y Reglas de Validación

### 1. Información de la Práctica (Organization)
- **Practice Name**: Obligatorio. No puede estar vacío y **no puede ser puramente numérico**.
- **Organization NPI (Type 2)**: Opcional, pero si se ingresa debe tener exactamente 10 dígitos numéricos.
- **Practice Website**: Opcional. Debe seguir un formato de URL válido (ej: https://example.com).

### 2. Ubicaciones (Offices)
- **Location Name**: Obligatorio.
- **Office Phone**: Obligatorio. Debe ser un número de teléfono válido (10 dígitos o formato (XXX) XXX-XXXX).
- **Office Email**: Opcional. Debe ser un formato de correo electrónico válido.
- **Office Address**: Obligatorio. Debe seguir un formato de dirección de EE. UU. (ej: 123 Main St, City, ST 12345).

### 3. Médico Principal (Individual)
- **Physician Full Name**: Obligatorio. **No puede ser puramente numérico**.
- **Individual NPI (Type 1)**: Obligatorio. Debe tener exactamente 10 dígitos numéricos.
- **Physician Email**: Opcional. Formato de correo válido.
- **Physician Phone**: Opcional. Formato de teléfono válido.

### 4. Equipo de Cuidado (Care Team)
- **Name, Role, Email, Phone**: Todos son obligatorios al intentar agregar un miembro.
- **Work Locations**: Al menos una ubicación debe estar seleccionada.

## Lógica de Interfaz de Usuario (UI)
1.  **Feedback en tiempo real**: Mostrar mensajes de error en rojo debajo del campo correspondiente inmediatamente después de que el usuario interactúe con él (onBlur) o al intentar guardar.
2.  **Estado Visual**: Cambiar el borde del input a rojo si hay un error.
3.  **Botón de Guardado**: El botón de "Save Health System Profile" debe estar deshabilitado si hay errores críticos en campos obligatorios.

## Restricciones y Casos Borde
- El NPI debe limpiarse de espacios o guiones antes de validarse contra la regla de 10 dígitos.
- Los teléfonos deben permitir formatos comunes pero normalizarse internamente si es necesario.
- Si se elimina una ubicación, se deben limpiar las referencias a esa ubicación en las asignaciones del médico y del equipo.

## Advertencias
- **Trampas conocidas**: No bloquear el flujo de auto-guardado por errores menores, pero marcar claramente qué falta para el "Final Save".

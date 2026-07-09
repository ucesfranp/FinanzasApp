# Documentación de cambios realizados

## 1. Navegación inferior

Se implementó una barra inferior tipo Bottom Navigation para que la navegación quede en la parte inferior de la app.

### ¿Qué se hizo?
- Se creó un componente reutilizable para la barra inferior.
- Se agregó a las pantallas principales: Inicio, Movimientos, Categorías y Ajustes.

### ¿Por qué?
- Mejora la experiencia de uso en dispositivos móviles.
- Hace que la navegación sea más clara y similar a las apps modernas.

## 2. Modo oscuro

La pantalla de ajustes ahora permite cambiar entre modo claro y modo oscuro.

### ¿Qué se hizo?
- Se creó un contexto de tema.
- El switch de Ajustes cambia el tema de la app.
- El tema se guarda en preferencias para que persista.

### ¿Dónde?
- En la pantalla de Ajustes.
- En el archivo de contexto de tema.
- En el servicio de preferencias.

## 3. Estilo simple y claro

Los cambios fueron pensados de forma sencilla, sin agregar complejidad innecesaria.

### Objetivo
- Mantener el proyecto fácil de entender.
- Que un alumno pueda seguir el flujo sin perderse.

## 4. Futuras funcionalidades pensadas para demostrar tests

Estas ideas son buenas para una demostración de clase, porque permiten mostrar pruebas simples y fáciles de explicar:

- Agregar una pantalla de bienvenida inicial con un mensaje de inicio para probar renderizado.
- Implementar una función de cálculo del presupuesto disponible para hacer pruebas unitarias.
- Crear un filtro simple de movimientos por tipo o descripción para mostrar pruebas de comportamiento.
- Añadir un switch de modo oscuro con estado controlado para demostrar pruebas de UI.
- Guardar preferencias como nombre y tema en almacenamiento local para mostrar pruebas de persistencia.
- Mostrar mensajes de error al ingresar datos inválidos, para demostrar pruebas de interacción.

## 5. Nota para la entrega

Estas funcionalidades futuras no modifican la app actual; solo sirven como ideas para preparar una demostración de tests de manera clara y didáctica.

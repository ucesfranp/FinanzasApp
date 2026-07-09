# Guía de tests para la app de finanzas

## 1. ¿Dónde implementar tests?

Para esta app, lo más útil es pensar en los tests como una forma de demostrar lo aprendido en clase. No hace falta implementar una suite compleja; alcanza con cubrir las funciones más claras y visibles.

### Áreas recomendadas para probar

1. Lógica de negocio
   - Ejemplos: cálculo del presupuesto disponible, filtros de movimientos, validación de datos.

2. Pantallas y UI
   - Ejemplos: mostrar mensajes de alerta, cambiar el estado del switch de modo oscuro, mostrar el nombre del usuario.

3. Persistencia
   - Ejemplos: guardar el tema oscuro, guardar el nombre, recuperar preferencias.

## 2. Dónde colocar los tests en este proyecto

### Estructura simple recomendada
- Crear una carpeta llamada tests/ en la raíz del proyecto.
- Separar por tipo de prueba:
  - tests/logic
  - tests/screens
  - tests/storage

### Ejemplo de estructura

```text
tests/
  logic/
    presupuesto.test.ts
  screens/
    ajustes.test.tsx
  storage/
    preferencias.test.ts
```

## 3. Qué funcionalidades futuras podrían usarse para demostrar tests

Estas ideas sirven muy bien para una presentación o entrega de clase, porque son sencillas y fáciles de explicar:

### A. Validar el cálculo del presupuesto disponible
- Probar que si hay ingresos y gastos, el disponible se calcula correctamente.
- Esto permite demostrar pruebas unitarias sobre lógica.

### B. Probar el cambio de modo oscuro
- Verificar que al activar el switch, el estado cambie.
- Esto sirve para mostrar pruebas de UI o de estado.

### C. Probar el guardado de preferencias
- Verificar que el nombre del usuario y el tema oscuro se guarden correctamente.
- Esto permite mostrar pruebas de persistencia.

### D. Probar filtros de movimientos
- Comprobar que al buscar por texto o filtrar por tipo, se muestran solo los resultados correctos.
- Es una buena demostración de pruebas de comportamiento.

### E. Probar mensajes de alerta
- Validar que cuando el usuario ingresa un dato inválido, se muestre un mensaje de error.
- Esto ayuda a mostrar pruebas de interacción simple.

## 4. Herramientas que podrías usar

Para una app React Native con Expo, lo más común es usar:
- Jest
- React Native Testing Library

## 5. Consejo para la clase

Lo ideal es no sobrecomplicar la demostración. Conviene elegir 3 o 4 pruebas simples y bien explicadas, por ejemplo:
- cálculo del presupuesto disponible,
- cambio de tema,
- guardado de preferencias,
- filtro de movimientos.

Así la presentación queda clara y demuestra lo aprendido sin volverse demasiado técnica.

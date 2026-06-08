# 🎯 Guía de Características - Tracker de Finanzas Personales

## 📚 Índice de Funcionalidades por Pantalla

### 🏠 TAB 1: INICIO (HomeFinanzasScreen)
**Ubicación**: Tab inferior izquierdo

#### ¿Qué ves?
- **Tarjeta Grande**: Dinero disponible del mes en grande
  - Color verde 🟢 si tienes dinero disponible
  - Color amarillo 🟡 si tienes poco disponible (<20%)
  - Color rojo 🔴 si has superado el presupuesto

- **Alerta Visual**: Notificación si gastos > presupuesto

- **Resumen del Mes**:
  - Total de Ingresos: +$XXX
  - Total de Gastos: -$XXX
  - Barra de progreso del presupuesto usado

- **Últimos 5 Movimientos**: Lista rápida de tus transacciones más recientes

#### Botones
- **Botón Flotante (+)**: Agrega un nuevo movimiento rápidamente
- **Taps en movimientos**: Ve detalles completos

---

### 📋 TAB 2: MOVIMIENTOS (MovimientosScreen)
**Ubicación**: Tab inferior, segundo desde la izquierda

#### ¿Qué ves?
- **Buscador**: Escribe descripción para buscar rápidamente
  - Busca en el nombre del movimiento

- **Filtros Horizontales**:
  - "Todos" - Muestra todo
  - "Ingresos" - Solo dinero que entra (verde)
  - "Gastos" - Solo dinero que sale (rojo)
  - Botones de categoría (si aplicas filtro)

- **Lista de Movimientos**: Cada movimiento muestra:
  - Icono de categoría con color
  - Descripción
  - Categoría + Fecha
  - Monto (+/- según tipo)

#### Funcionalidades
- **Pull-to-Refresh**: Desliza hacia abajo para sincronizar con API
- **Tap en movimiento**: Abre pantalla de detalles
- **Botón (+)**: Agregar nuevo movimiento

---

### 🏷️ TAB 3: CATEGORÍAS (CategoriasScreen)
**Ubicación**: Tab inferior, tercero desde la izquierda

#### ¿Qué ves?
- **Lista de Categorías**:
  - Pequeño cuadrado de color (color de la categoría)
  - Nombre de la categoría
  - Botones: Editar (lápiz) y Eliminar (basura)

#### Categorías Predefinidas
1. Alimentos 🔴
2. Transporte 🔵
3. Entretenimiento 🟡
4. Servicios 🟢
5. Salud 🔴
6. Otros 🟣

#### Funcionalidades CRUD
- **Crear**: Botón (+) - Nueva categoría personalizada
- **Editar**: Botón lápiz - Cambia nombre y color
- **Eliminar**: Botón basura - Con confirmación
- **12 colores disponibles**: Para personalizar

---

### ⚙️ TAB 4: AJUSTES (AjustesFinanzasScreen)
**Ubicación**: Tab inferior derecho

#### Secciones

**APARIENCIA**
- Switch "Modo Oscuro"
  - Desactivado = Tema Claro (default)
  - Activado = Tema Oscuro

**PRESUPUESTO MENSUAL**
- Muestra presupuesto actual: **$XXXX.XX**
- Botón lápiz para editar
- Guarda automáticamente
- Este monto se compara con tus gastos

**INFORMACIÓN**
- Versión de la app
- Fecha de última actualización

**DATOS**
- Info sobre privacidad
- Nota: datos guardados localmente en el dispositivo

---

## 🎬 FLUJOS DE USO PRINCIPALES

### Flujo 1: Agregar un Gasto
```
Botón (+) en Inicio
    ↓
Selecciona "Gasto"
    ↓
Ingresa descripción (ej: "Café Starbucks")
    ↓
Ingresa monto (ej: 5.50)
    ↓
Selecciona categoría (ej: "Entretenimiento")
    ↓
Presiona "Guardar"
    ↓
✅ Transacción guardada en BD local
    ↓
Se intenta sincronizar con API
```

### Flujo 2: Editar un Movimiento
```
Ve a Movimientos o Inicio
    ↓
Tap en movimiento que quieres editar
    ↓
Pantalla de detalles abre
    ↓
Presiona "Editar"
    ↓
Modifica descripción y/o monto
    ↓
Presiona "Guardar"
    ↓
✅ Cambios guardados
```

### Flujo 3: Eliminar un Movimiento
```
Ve a Movimientos o Detalles
    ↓
Tap en movimiento
    ↓
Presiona botón "Eliminar" (basura)
    ↓
Confirma en alerta
    ↓
✅ Movimiento eliminado
```

### Flujo 4: Crear Nueva Categoría
```
Ve a tab Categorías
    ↓
Presiona botón (+)
    ↓
Ingresa nombre (ej: "Ropa")
    ↓
Selecciona color de los 12 disponibles
    ↓
Presiona "Crear"
    ↓
✅ Categoría creada y disponible
```

### Flujo 5: Cambiar Presupuesto Mensual
```
Ve a tab Ajustes
    ↓
Sección "Presupuesto Mensual"
    ↓
Presiona lápiz (editar)
    ↓
Ingresa nuevo monto
    ↓
Presiona "Guardar"
    ↓
✅ Presupuesto actualizado
    ↓
Se recalcula disponible en Inicio
```

### Flujo 6: Cambiar a Tema Oscuro
```
Ve a tab Ajustes
    ↓
Sección "Apariencia"
    ↓
Switch "Modo Oscuro"
    ↓
✅ Tema cambia inmediatamente
    ↓
Se guarda preferencia
```

---

## 💡 TIPS & TRUCOS

### Búsqueda Rápida
- Ve a Movimientos y usa el buscador
- Escribe parte de la descripción
- Se filtra en tiempo real

### Filtros Combinados
- Puedes aplicar filtro de tipo (Gasto/Ingreso) Y categoría
- Presiona botón de categoría después de tipo

### Sincronización
- Pull-to-Refresh en Movimientos sincroniza con API
- Todos los cambios se guardan localmente primero
- API se sincroniza en background automáticamente

### Colores de Categorías
- Cada categoría tiene un color único
- Facilita identificar tipos de gasto de un vistazo
- Los colores se usan en:
  - Iconos en lista
  - Tarjeta de detalles
  - Tarjetas en selector de categoría

---

## 🔐 PRIVACIDAD & DATOS

✅ **Todo es LOCAL**
- Base de datos SQLite en tu dispositivo
- No se sincroniza a la nube
- Datos guardados en AsyncStorage (preferencias)
- API es solo para demostración en MockAPI

✅ **Persistencia**
- Tus datos persisten entre sesiones
- Tema se guarda
- Presupuesto se guarda
- Categorías personalizadas se guardan
- Transacciones se guardan

---

## 📊 ENTENDIENDO EL RESUMEN

### En la Tarjeta Grande del Inicio
```
Disponible = Presupuesto + Ingresos - Gastos
```

**Ejemplos:**
- Presupuesto: $1000
- Ingresos mes: +$200
- Gastos mes: -$800
- **Disponible = 1000 + 200 - 800 = $400** ✅

---

- Presupuesto: $1000
- Ingresos mes: +$0
- Gastos mes: -$1200
- **Disponible = 1000 + 0 - 1200 = -$200** ❌ (ALERTA)

---

## 🎨 PALETA DE COLORES DISPONIBLES

Para crear categorías, tienes 12 colores:

1. 🔴 Rojo (#FF6B6B) - Alimentos, Salud
2. 🔵 Cian (#4ECDC4) - Transporte
3. 🟡 Amarillo (#FFE66D) - Entretenimiento
4. 🟢 Menta (#95E1D3) - Servicios
5. 🧡 Coral (#FF8C94) - Otro rojo
6. 🟣 Lavanda (#C7CEEA) - Otros
7. 🟠 Naranja (#FDDB92) - Warm
8. 🌊 Verde agua (#A8E6CF) - Cool
9. 🍑 Melocotón (#FFD3B6) - Peach
10. 🩹 Rosa (#FFAAA5) - Pink
11. 💜 Púrpura (#AA96DA) - Purple
12. 💕 Hot Pink (#FCBAD3) - Hot

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Dónde se guardan mis datos?**
R: En la base de datos SQLite local del dispositivo. Nunca se suben a internet.

**P: ¿Puedo eliminar una categoría?**
R: Sí, pero no podrás ver transacciones asociadas claramente. Se recomienda crear nueva categoría en lugar de eliminar.

**P: ¿Qué pasa si cambio el presupuesto mensual?**
R: Se recalcula inmediatamente el disponible. Los gastos anteriores se mantienen.

**P: ¿Los datos se sincronizan entre dispositivos?**
R: No, están locales. Cada dispositivo tiene su propia BD.

**P: ¿Puedo recuperar un movimiento eliminado?**
R: No, la eliminación es permanente. Pero puedes crear uno nuevo igual.

---


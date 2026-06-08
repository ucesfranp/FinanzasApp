# 📱 Tracker de Finanzas Personales

Una aplicación móvil moderna para controlar tus gastos e ingresos personales, organizados por categoría.

## ✨ Características Implementadas

### 📊 Gestión de Transacciones (CRUD Completo)
- ✅ **Agregar movimientos**: Ingresos y gastos con descripción, monto, categoría y fecha automática
- ✅ **Editar transacciones**: Modifica cualquier transacción existente
- ✅ **Eliminar transacciones**: Con confirmación de seguridad
- ✅ **Ver detalles**: Pantalla detallada de cada movimiento
- ✅ **Buscar y filtrar**: Por descripción, categoría y tipo (gasto/ingreso)

### 💰 Gestión de Presupuesto
- ✅ **Establecer presupuesto mensual**: Editable desde Ajustes
- ✅ **Resumen mensual**: Visualiza ingresos, gastos y disponible
- ✅ **Alerta visual**: Notificación cuando superas el presupuesto
- ✅ **Barra de progreso**: Porcentaje del presupuesto utilizado

### 🏷️ Gestión de Categorías (CRUD)
- ✅ **Categorías predefinidas**: Alimentos, Transporte, Entretenimiento, Servicios, Salud, Otros
- ✅ **Crear categorías**: Agrega nuevas categorías personalizadas
- ✅ **Editar categorías**: Cambia nombre y color
- ✅ **Eliminar categorías**: Con confirmación
- ✅ **Selector de colores**: 12 colores disponibles

### 🌙 Tema Claro/Oscuro
- ✅ **Cambio de tema**: Switch en Ajustes (Claro por defecto)
- ✅ **Persistencia**: El tema se guarda en AsyncStorage
- ✅ **Colores dinámicos**: Toda la UI se adapta al tema

### 🗂️ Navegación Híbrida
- ✅ **BottomTabNavigator**: 4 tabs principales (Inicio, Movimientos, Categorías, Ajustes)
- ✅ **Stacks internos**: Cada tab puede navegar a pantallas adicionales
- ✅ **Iconos intuitivos**: Usando @expo/vector-icons

### 📱 Pantallas Implementadas

**Tab 1: Inicio (Home)**
- Resumen dinero disponible del mes
- Alerta si superas presupuesto
- Gráfico de progreso visual
- Últimos 5 movimientos
- Botón flotante para agregar rápidamente

**Tab 2: Movimientos (Histórico)**
- Lista completa de todas las transacciones
- Búsqueda por descripción
- Filtros por tipo (Todos, Ingresos, Gastos)
- Filtros por categoría
- Pull-to-refresh para sincronizar
- Tap en movimiento para ver detalles

**Tab 3: Categorías**
- Lista de todas las categorías
- Editar nombre y color
- Eliminar categorías
- Crear nuevas categorías
- Selector visual de 12 colores

**Tab 4: Ajustes**
- Toggle Modo Oscuro/Claro
- Editar presupuesto mensual
- Información de la app (versión, fecha)
- Info sobre privacidad y datos locales

### 💾 Almacenamiento

**SQLite Local:**
- `transacciones`: Todos tus gastos e ingresos
- `categorias`: Categorías con color asociado
- `preferencias`: Presupuesto mensual y configuración

**Sincronización:**
- Conexión a MockAPI: `https://6a25e93f5447714a6f83c529.mockapi.io/gastos`
- Sincronización optimista (cambios locales inmediatos, API en background)

### 🎨 Diseño

- **Minimalista y profesional**: Acorde a prácticas de desarrollo visto en clase
- **TypeScript tipado**: Todo el código está fuertemente tipado
- **Componentes reutilizables**: Contextos (TemaContext, FinanzasContext)
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🚀 Cómo Usar

### Instalación

```bash
npm install
```

### Desarrollo

```bash
# Iniciar servidor Expo
npm start

# En Android (con emulador)
npm run android

# En iOS (Mac)
npm run ios

# En Web
npm run web
```

### Estructura del Proyecto

```
├── App.tsx                    # Entry point de la app
├── navigation/
│   └── BottomTabNavigator.tsx # Navegación principal
├── screens/
│   ├── HomeFinanzasScreen.tsx
│   ├── MovimientosScreen.tsx
│   ├── AgregarTransaccionScreen.tsx
│   ├── DetalleTransaccionScreen.tsx
│   ├── CategoriasScreen.tsx
│   ├── AgregarCategoriaScreen.tsx
│   ├── EditarCategoriaScreen.tsx
│   ├── AjustesFinanzasScreen.tsx
│   └── FinanzasTypes.tsx      # Tipos compartidos
├── context/
│   ├── TemaContext.tsx        # Gestión de tema
│   └── FinanzasContext.tsx    # Estado global de finanzas
├── services/
│   ├── transaccionesApi.tsx   # API llamadas
│   └── preferencias.tsx       # AsyncStorage
├── database/
│   └── initDB.tsx             # Esquema SQLite
└── assets/                     # Imágenes y recursos

```

## 📋 Workflow Típico

1. **Agregar movimiento**:
   - Haz clic en el botón flotante `+`
   - Selecciona tipo (Gasto/Ingreso)
   - Ingresa descripción y monto
   - Selecciona categoría
   - Guarda

2. **Ver resumen mensual**:
   - Ve a la pantalla de Inicio
   - Visualiza dinero disponible en la tarjeta principal
   - Ve ingresos vs gastos
   - Observa la barra de progreso

3. **Gestionar categorías**:
   - Ve al tab de Categorías
   - Edita nombre/color o elimina categorías
   - O crea nuevas categorías

4. **Cambiar presupuesto**:
   - Ve a Ajustes
   - Presiona el lápiz en "Presupuesto Mensual"
   - Ingresa el nuevo monto
   - Guarda

## 🔧 Tecnologías

- **React Native**: Framework móvil
- **Expo**: CLI y servicios
- **TypeScript**: Tipado estático
- **React Navigation**: Navegación
- **SQLite (expo-sqlite)**: Base de datos local
- **AsyncStorage**: Almacenamiento de preferencias
- **Axios**: HTTP requests
- **@expo/vector-icons**: Iconos

## 📝 Notas

- Todos los datos se guardan **localmente** en el dispositivo
- La sincronización con MockAPI es opcional y en background
- El presupuesto es **mensual** y se reinicia cada mes
- Las categorías son compartidas entre toda la app
- El tema persiste entre sesiones

## 🎯 Funcionalidades Futuras

- Exportar datos en PDF/CSV
- Estadísticas mensuales avanzadas
- Gráficos de tendencias
- Notificaciones de alertas
- Respaldo en la nube

---

**Desarrollado como práctica de React Native + TypeScript + SQLite**

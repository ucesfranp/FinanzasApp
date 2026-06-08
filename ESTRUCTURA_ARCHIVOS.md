# 📁 Estructura de Archivos - Tracker de Finanzas

```
DApps1-Clase8-210526/
│
├── 📄 App.tsx                           ← Entry point (actualizado)
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 metro.config.js
├── 📄 app.json
│
├── 📂 navigation/
│   ├── BottomTabNavigator.tsx          ← ✨ NUEVO: Navegación híbrida con Tabs
│   ├── StackNavigator.tsx              ← (antiguo, ya no se usa)
│   └── types.tsx                       ← (antiguo, ya no se usa)
│
├── 📂 screens/ (Carpeta principal de pantallas)
│   │
│   ├── 📄 FinanzasTypes.tsx            ← ✨ NUEVO: Tipos TypeScript
│   │   ├── Transaccion
│   │   ├── Categoria
│   │   ├── ResumenMensual
│   │   └── TransaccionPorCategoria
│   │
│   ├── 🏠 PANTALLA HOME (Tab 1)
│   │   └── HomeFinanzasScreen.tsx      ← ✨ NUEVO: Resumen mensual
│   │
│   ├── 📋 PANTALLA MOVIMIENTOS (Tab 2)
│   │   ├── MovimientosScreen.tsx       ← ✨ NUEVO: Lista + Filtros
│   │   ├── AgregarTransaccionScreen.tsx ← ✨ NUEVO: Agregar gasto/ingreso
│   │   └── DetalleTransaccionScreen.tsx ← ✨ NUEVO: Ver/Editar/Eliminar
│   │
│   ├── 🏷️ PANTALLA CATEGORÍAS (Tab 3)
│   │   ├── CategoriasScreen.tsx        ← ✨ NUEVO: CRUD categorías
│   │   ├── AgregarCategoriaScreen.tsx  ← ✨ NUEVO: Crear categoría
│   │   └── EditarCategoriaScreen.tsx   ← ✨ NUEVO: Editar categoría
│   │
│   ├── ⚙️ PANTALLA AJUSTES (Tab 4)
│   │   └── AjustesFinanzasScreen.tsx   ← ✨ NUEVO: Tema + Presupuesto
│   │
│   ├── 📚 Pantallas antiguas (no se usan más pero existen)
│   │   ├── HomeScree.tsx
│   │   ├── DetalleScreen.tsx
│   │   ├── CrudScreen.tsx
│   │   ├── TareasScreen.tsx
│   │   ├── TareasLocalScreen.tsx
│   │   ├── EjerciciosScreen.tsx
│   │   ├── AjustesScreen.tsx
│   │   └── Tipos.tsx
│   │
│
├── 📂 context/
│   ├── TemaContext.tsx                 ← (existente) Tema claro/oscuro
│   └── FinanzasContext.tsx             ← ✨ NUEVO: Estado global finanzas
│       └── Provee:
│           - transacciones[]
│           - categorias[]
│           - presupuesto
│           - agregarTransaccion()
│           - editarTransaccion()
│           - eliminarTransaccion()
│           - agregarCategoria()
│           - editarCategoria()
│           - eliminarCategoria()
│           - establecerPresupuesto()
│           - obtenerResumen()
│           - sincronizar()
│
├── 📂 database/
│   └── initDB.tsx                      ← Actualizado: esquema SQLite
│       └── Tablas creadas:
│           - tareas (antiguo)
│           - categorias (✨ NUEVO)
│           - transacciones (✨ NUEVO)
│           - preferencias (✨ NUEVO)
│
├── 📂 services/
│   ├── transaccionesApi.tsx            ← ✨ NUEVO: API calls a MockAPI
│   ├── tareasApi.tsx                   ← (antiguo)
│   └── preferencias.tsx                ← (existente) AsyncStorage
│
├── 📂 assets/
│   └── (imágenes, fonts, etc)
│
├── 📂 node_modules/
│   └── (dependencias)
│
├── 📄 README_FINANZAS.md               ← ✨ NUEVO: Documentación completa
├── 📄 GUIA_FUNCIONALIDADES.md          ← ✨ NUEVO: Guía de características
└── 📄 ESTRUCTURA_ARCHIVOS.md           ← Este archivo


═══════════════════════════════════════════════════════════════════

📊 RESUMEN DE CAMBIOS

✨ NUEVOS ARCHIVOS (12 pantallas + 4 servicios/contextos)
├── Navigation
│   └── BottomTabNavigator.tsx
├── Screens
│   ├── FinanzasTypes.tsx
│   ├── HomeFinanzasScreen.tsx
│   ├── MovimientosScreen.tsx
│   ├── AgregarTransaccionScreen.tsx
│   ├── DetalleTransaccionScreen.tsx
│   ├── CategoriasScreen.tsx
│   ├── AgregarCategoriaScreen.tsx
│   ├── EditarCategoriaScreen.tsx
│   └── AjustesFinanzasScreen.tsx
├── Context
│   └── FinanzasContext.tsx
└── Services
    └── transaccionesApi.tsx

📝 ARCHIVOS MODIFICADOS (5 archivos)
├── App.tsx                     ← Simplificado, usa BottomTabNavigator
├── database/initDB.tsx         ← Agregó 3 nuevas tablas
├── package.json                ← Se agregó @expo/vector-icons
├── README_FINANZAS.md          ← NUEVO
└── GUIA_FUNCIONALIDADES.md     ← NUEVO

═══════════════════════════════════════════════════════════════════

🗂️ CONVENCIÓN DE NOMBRES

Componentes/Screens:
- PascalCase: HomeFinanzasScreen, MovimientosScreen
- Sufijo "Screen" para pantallas
- Sufijo "Context" para contextos
- Sufijo "Api" para servicios de API

Imports:
- Relativo: '../context/TemaContext'
- Absoluto: desde raíz del proyecto

Tipos:
- PascalCase: Transaccion, Categoria, ResumenMensual
- Sufijo específico: Props, ParamList

═══════════════════════════════════════════════════════════════════

🔗 DEPENDENCIAS USADAS

React Native:
- react-native (0.81.5)
- react (19.1.0)

Navigation:
- @react-navigation/native (^7.2.5)
- @react-navigation/native-stack (^7.16.0)
- @react-navigation/bottom-tabs (^7.16.2)
- react-native-safe-area-context (~5.6.0)
- react-native-screens (~4.16.0)

Storage:
- expo-sqlite (~16.0.10)
- @react-native-async-storage/async-storage (2.2.0)

HTTP:
- axios (^1.17.0)

UI:
- @expo/vector-icons (incluido en Expo)
- expo-status-bar (~3.0.9)

Expo:
- expo (~54.0.33)

═══════════════════════════════════════════════════════════════════

💾 ESTRUCTURA DE DATOS - SQLite

TABLA: transacciones
┌─────────────────────────────────────────────────┐
│ id                 INTEGER PRIMARY KEY AUTO_INC │
│ descripcion        TEXT NOT NULL               │
│ monto              REAL NOT NULL               │
│ tipo               TEXT 'gasto' | 'ingreso'   │
│ categoria_id       INTEGER FK → categorias    │
│ fecha              TEXT ISO8601               │
│ api_id             TEXT UNIQUE (sincronización)│
└─────────────────────────────────────────────────┘

TABLA: categorias
┌─────────────────────────────────────────────────┐
│ id                 INTEGER PRIMARY KEY AUTO_INC │
│ nombre             TEXT NOT NULL UNIQUE        │
│ color              TEXT HEX COLOR              │
│ api_id             TEXT UNIQUE (sincronización)│
└─────────────────────────────────────────────────┘

TABLA: preferencias (extensión)
┌─────────────────────────────────────────────────┐
│ clave              TEXT PRIMARY KEY            │
│ valor              TEXT                        │
│
│ Claves usadas:
│ - 'temaOscuro' → 'true' | 'false'
│ - 'presupuesto_mensual' → '$XXXX.XX'
│ - 'nombre' → nombre usuario (antiguo)
└─────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

🎯 FLUJO DE DATOS

App.tsx
├── TemaProvider
│   └── FinanzasProvider
│       └── SQLiteProvider
│           └── NavigationContainer
│               └── BottomTabNavigator
│                   ├── HomeFinanzasScreen (Stack)
│                   │   ├── HomeFinanzas
│                   │   ├── AgregarTransaccion
│                   │   └── DetalleTransaccion
│                   ├── MovimientosScreen (Stack)
│                   │   ├── MovimientosList
│                   │   ├── AgregarTransaccion
│                   │   └── DetalleTransaccion
│                   ├── CategoriasScreen (Stack)
│                   │   ├── CategoriasList
│                   │   ├── AgregarCategoria
│                   │   └── EditarCategoria
│                   └── AjustesScreen (Stack)
│                       └── AjustesList

═══════════════════════════════════════════════════════════════════

✅ COMPLETITUD

Total de Pantallas Nuevas: 8 ✅
Total de Contextos: 2 ✅
Total de Servicios: 1 ✅
Total de Tipos: 1 ✅

CRUD Transacciones: ✅
CRUD Categorías: ✅
Presupuesto Mensual: ✅
Tema Claro/Oscuro: ✅
Búsqueda y Filtros: ✅
API Integration: ✅
SQLite Local: ✅

Compilación: ✅ (TypeScript sin errores)
Metro Bundler: ✅ (Funcionando)

═══════════════════════════════════════════════════════════════════

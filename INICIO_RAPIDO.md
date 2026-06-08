# 🚀 GUÍA DE INICIO RÁPIDO

## 📱 Cómo Ejecutar la App

### Opción 1: Con Expo Go (Móvil - Más Fácil)

#### Requisitos
- Tener el proyecto en tu máquina
- Tener Expo Go instalado en tu celular (Play Store / App Store)
- Estar en la misma red Wi-Fi

#### Pasos

1. **Abre una terminal en la carpeta del proyecto**:
```bash
cd "C:\Users\fpoll\OneDrive - UCES\Desarrollo de Aplicaciones I\Clase9-280526-Rama\DApps1-Clase8-210526"
```

2. **Inicia el servidor Expo**:
```bash
npm start
```

3. **Espera a que aparezca el QR**
   - El terminal mostrará un código QR

4. **Abre Expo Go en tu celular**
   - Presiona "Scan QR code"
   - Apunta la cámara al QR de la terminal

5. **¡La app se abrirá en tu celular!**

---

### Opción 2: Con Emulador Android

#### Requisitos
- Android Studio instalado
- Emulador de Android Studio configurado
- Tener el proyecto

#### Pasos

1. **Inicia el emulador Android** desde Android Studio

2. **Abre terminal en carpeta del proyecto**:
```bash
npm run android
```

3. **Espera a que compile y se instale**
   - Verás logs en la terminal
   - El APK se instalará en el emulador

4. **Presiona Enter o espera a que la app abra**

---

### Opción 3: Con Emulador iOS (Mac)

```bash
npm run ios
```

---

### Opción 4: En el Navegador Web

```bash
npm run web
```

Luego abre http://localhost:8082 en tu navegador.

---

## ⌨️ Comandos Útiles Cuando el Servidor Está Corriendo

Una vez ejecutado `npm start`, en el terminal puedes:

```
a - Abrir en Android
w - Abrir en Web
i - Abrir en iOS
j - Abrir debugger
r - Recargar app
m - Toggle menu
o - Abrir proyecto en editor
? - Ver todos los comandos
```

---

## 🔥 Primera Vez: Paso a Paso

### 1. Instala dependencias (solo la primera vez)
```bash
npm install
```

### 2. Inicia servidor
```bash
npm start
```

### 3. Verás un QR (aproximadamente así):
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀█
█ █   █ ██▄▀ ██
█ █▄▄▄█ ██▀▄ █
█▄▄▄▄▄▄▄█ ▀▄█ █
...
```

### 4. Abre Expo Go en tu celular

### 5. Toca "Scan QR code"

### 6. ¡Apunta a la pantalla!

### 7. ✅ La app se abrirá en 10-30 segundos

---

## 🧪 Primera Prueba: Test Drive

Una vez que la app esté abierta en tu celular:

### 1. Ve al tab "Inicio"
- Deberías ver "Mi Dinero" con $5000 (presupuesto por defecto)
- Dice "No hay movimientos este mes"

### 2. Ve al tab "Movimientos"
- Lista vacía

### 3. Ve al tab "Categorías"
- Verás 6 categorías predefinidas

### 4. Presiona el botón (+) en rojo
- Abre pantalla "Nuevo Movimiento"
- Prueba agregar un gasto:
  - Tipo: Gasto
  - Descripción: "Café Starbucks"
  - Monto: 5.50
  - Categoría: Entretenimiento
  - Presiona "Guardar"

### 5. Vuelve a Inicio
- ¡Verás el dinero disponible cambió!
- Aparece el movimiento en últimos 5

---

## 🐛 Solución de Problemas

### Error: "Port 8081 is being used"
**Solución**: El servidor usa el puerto 8082 automáticamente. Solo presiona `y` y continúa.

---

### Error: "No Android connected device found"
**Solución**: Tienes 2 opciones:
1. Conecta un dispositivo Android con USB
2. Inicia el emulador de Android Studio primero

O usa Expo Go en tu celular (más fácil).

---

### Error: TypeScript compilation error
**Solución**: Presiona `r` en el terminal para recargar.

---

### La app no se abre en el celular
**Solución**:
1. Verifica que celular y computadora estén en la MISMA red Wi-Fi
2. Escanea el QR nuevamente
3. Espera 30 segundos (la primera vez tarda)

---

### Datos no se guardan
**Solución**: La primera transacción tarda porque se crea la BD. Intenta nuevamente.

---

## 🎮 Jugando con la App

### Test 1: Agregar un Gasto
1. Presiona (+) en Inicio
2. Ingresa "Almuerzo" - $15
3. Categoría: Alimentos
4. Presiona "Guardar"
5. ✅ Aparece en Movimientos

### Test 2: Crear Categoría
1. Ve a Categorías
2. Presiona (+)
3. Nombre: "Música"
4. Color: Morado
5. Presiona "Crear"
6. ✅ Aparece en la lista

### Test 3: Editar Categoría
1. En Categorías, presiona lápiz en una categoría
2. Cambia el nombre
3. Presiona "Actualizar"
4. ✅ Cambio guardado

### Test 4: Cambiar Presupuesto
1. Ve a Ajustes
2. Presiona lápiz en "Presupuesto Mensual"
3. Ingresa 2000
4. Presiona "Guardar"
5. Ve a Inicio - ¡Dinero disponible cambió!

### Test 5: Tema Oscuro
1. Ve a Ajustes
2. Presiona Switch "Modo Oscuro"
3. ✅ La app se vuelve negra
4. Presiona nuevamente para volver a claro

---

## 📊 Datos de Prueba (Para Experimentar)

Intenta agregar estos movimientos para ver cómo funciona:

**Ingresos:**
- Pago trabajo: $3000 (Servicios)
- Bonus: $500 (Servicios)

**Gastos:**
- Supermercado: $200 (Alimentos)
- Gasolina: $50 (Transporte)
- Película: $20 (Entretenimiento)
- Doctor: $80 (Salud)
- Internet: $45 (Servicios)

Luego ve al tab Inicio para ver:
- Disponible = Presupuesto + Ingresos - Gastos
- Barra de progreso del 40%

---

## 🎯 Resumen de Tabs

| Tab | Nombre | Función | Icono |
|-----|--------|---------|-------|
| 1️⃣ | Inicio | Ver resumen, últimos movimientos | 🏠 |
| 2️⃣ | Movimientos | Ver lista completa, buscar, filtrar | 📋 |
| 3️⃣ | Categorías | Crear/editar/eliminar categorías | 🏷️ |
| 4️⃣ | Ajustes | Tema, presupuesto, información | ⚙️ |

---

## 💡 Pro Tips

**Tip 1**: Usa el botón Pull-to-Refresh en Movimientos para sincronizar con API

**Tip 2**: Los colores de categorías ayudan a identificar tipo de gasto rápidamente

**Tip 3**: El presupuesto se calcula por mes. Úsalo para controlar gastos.

**Tip 4**: Edita presupuesto en Ajustes para diferentes meses

**Tip 5**: Todos tus datos se guardan localmente - no suben a internet

---

## 🆘 Necesitas Ayuda?

Si algo no funciona:

1. **Reinicia la app**: Cierra Expo Go y abre nuevamente
2. **Recarga**: Presiona `r` en el terminal
3. **Reinicia servidor**: Presiona Ctrl+C y vuelve a `npm start`
4. **Limpia cache**: `npm install` nuevamente

---

## ✅ Checklist para Ejecutar

- [ ] Proyecto descargado/clonado
- [ ] npm install ejecutado
- [ ] Terminal abierto en carpeta del proyecto
- [ ] npm start iniciado
- [ ] QR visible en terminal
- [ ] Expo Go instalado en celular
- [ ] Celular y PC en misma red Wi-Fi
- [ ] QR escaneado
- [ ] App abierta en celular
- [ ] ¡A jugar!

---

**¡Ya estás listo para usar el Tracker de Finanzas Personales! 🎉**

Cualquier duda, revisa los otros archivos de documentación:
- README_FINANZAS.md
- GUIA_FUNCIONALIDADES.md
- ESTRUCTURA_ARCHIVOS.md

# Ejemplo: Cómo cargar datos en MockAPI

## 1. URL de tu MockAPI
```
https://6a25e93f5447714a6f83c529.mockapi.io
```

## 2. Estructura de un movimiento/gasto

```json
{
  "id": 1,
  "descripcion": "Compra en supermercado",
  "monto": 150.50,
  "tipo": "gasto",
  "categoria_id": 1,
  "fecha": "2024-06-09T10:30:00Z",
  "api_id": "123abc"
}
```

### Campos obligatorios:
- **descripcion**: Texto describiendo el movimiento
- **monto**: Número con el monto (ej: 150.50)
- **tipo**: "gasto" o "ingreso"
- **categoria_id**: ID de la categoría (1, 2, 3, etc.)
- **fecha**: Fecha en formato ISO 8601 (ej: "2024-06-09T10:30:00Z")

## 3. Cómo cargar datos (Opción A - Por navegador)

### Paso 1: Ve a tu dashboard de MockAPI
```
https://mockapi.io
```
- Accede a tu cuenta
- Selecciona tu proyecto "6a25e93f5447714a6f83c529"

### Paso 2: Ve al endpoint "gastos"
- Click en "gastos" en la lista de endpoints

### Paso 3: Crea nuevos registros
- Click en el botón "+" o "Create"
- Completa el formulario con los datos

## 4. Cómo cargar datos (Opción B - Por terminal/Postman)

### Usando cURL:
```bash
curl -X POST https://6a25e93f5447714a6f83c529.mockapi.io/gastos \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Café en la mañana",
    "monto": 50.00,
    "tipo": "gasto",
    "categoria_id": 1,
    "fecha": "2024-06-09T08:00:00Z"
  }'
```

### Usando JavaScript (Postman o similar):
```javascript
fetch('https://6a25e93f5447714a6f83c529.mockapi.io/gastos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    descripcion: "Compra en tienda",
    monto: 200.00,
    tipo: "gasto",
    categoria_id: 2,
    fecha: new Date().toISOString()
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## 5. Ejemplos de datos para crear

### Ejemplo 1 - Gasto de alimentos
```json
{
  "descripcion": "Compra en supermercado Carrefour",
  "monto": 450.75,
  "tipo": "gasto",
  "categoria_id": 1,
  "fecha": "2024-06-09T14:30:00Z"
}
```

### Ejemplo 2 - Ingreso
```json
{
  "descripcion": "Sueldo mensual",
  "monto": 5000.00,
  "tipo": "ingreso",
  "categoria_id": 1,
  "fecha": "2024-06-01T00:00:00Z"
}
```

### Ejemplo 3 - Gasto de transporte
```json
{
  "descripcion": "Boleto de colectivo",
  "monto": 15.00,
  "tipo": "gasto",
  "categoria_id": 2,
  "fecha": "2024-06-09T08:15:00Z"
}
```

### Ejemplo 4 - Gasto de entretenimiento
```json
{
  "descripcion": "Entrada al cine",
  "monto": 250.00,
  "tipo": "gasto",
  "categoria_id": 3,
  "fecha": "2024-06-08T20:00:00Z"
}
```

## 6. Cómo ver los datos en la app

1. Abre la app de Finanzas
2. Ve a la pantalla "Home"
3. Toca el botón **"Cargar últimos movimientos"**
4. Los datos del MockAPI aparecerán en la lista

## 7. IDs de categorías predefinidas

```
1 = Alimentos (🟥 Rojo)
2 = Transporte (🟦 Azul)
3 = Entretenimiento (🟨 Amarillo)
4 = Servicios (🟩 Verde)
5 = Salud (🟪 Rosa)
6 = Otros (🟪 Morado)
```

## 8. Notas importantes

- La **fecha debe ser en formato ISO 8601** (ej: "2024-06-09T10:30:00Z")
- El **monto debe ser un número**, no texto
- El **tipo debe ser exactamente** "gasto" o "ingreso" (minúsculas)
- El **categoria_id debe existir** en el rango 1-6

## 9. Verificar que se cargaron correctamente

Después de crear los datos, puedes verificar en:
```
https://6a25e93f5447714a6f83c529.mockapi.io/gastos
```

Deberías ver todos los movimientos listados en JSON.

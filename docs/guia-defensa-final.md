# Guia de defensa final - Desarrollo de Aplicaciones 1

## Objetivo de este documento

Esta guia explica las partes agregadas o trabajadas en el proyecto final de la app de finanzas:

- La pantalla de pagos pendientes.
- Los componentes `BottomNav` y `PagoItem`.
- La carpeta `services` completa.
- Los tests unitarios con Jest.
- Los tests de componentes con React Native Testing Library.
- La integracion con SQLite, AsyncStorage, navegacion y tema oscuro.

La idea es poder explicar el proyecto con palabras propias: que hace cada parte, por que se eligio esa herramienta y como se relacionan los archivos.

---

## 1. Como presentar el proyecto en general

Una forma clara de comenzar la defensa es:

> "Mi proyecto es una aplicacion de finanzas personales desarrollada con React Native y Expo. Permite registrar ingresos y gastos, administrar categorias, consultar movimientos, configurar preferencias y manejar pagos pendientes. La aplicacion separa la interfaz en screens y components, la persistencia en database y services, y la logica reutilizable en servicios. Tambien agregue tests unitarios con Jest y tests de interfaz con React Native Testing Library."

La arquitectura se puede resumir asi:

```text
App.tsx
  |
  +-- TemaProvider              Estado global del tema
  |
  +-- SQLiteProvider            Conexion y ciclo de vida de SQLite
  |
  +-- NavigationContainer       Navegacion
        |
        +-- StackNavigator
              |
              +-- Screens       Pantallas completas
              +-- Components     Componentes reutilizables
              +-- Services       Persistencia, API y logica
              +-- Tests          Verificacion automatizada
```

### Que problema resuelve cada carpeta

| Carpeta        | Responsabilidad                                                   |
| -------------- | ----------------------------------------------------------------- |
| `screens`    | Contiene pantallas completas y maneja interaccion con el usuario. |
| `components` | Contiene piezas reutilizables de la interfaz.                     |
| `services`   | Aisla almacenamiento, API, alertas y logica de negocio.           |
| `context`    | Comparte informacion global, en este caso el tema.                |
| `database`   | Inicializa la estructura de SQLite.                               |
| `navigation` | Define las rutas y sus tipos.                                     |
| `__tests__`  | Contiene las pruebas automatizadas.                               |

La ventaja de esta separacion es que una pantalla no tiene que saber todos los detalles de como se guarda un dato. Por ejemplo, `PagosPendientesScreen` llama a `guardarPago`, pero no necesita conocer como se convierte el array a JSON ni como funciona AsyncStorage.

---

## 2. Flujo de inicio de la aplicacion

### `App.tsx`

El componente principal arma los proveedores de la aplicacion:

```tsx
<TemaProvider>
  <SQLiteProvider databaseName="finanzas.db" onInit={initDB}>
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  </SQLiteProvider>
</TemaProvider>
```

### Explicacion paso a paso

1. `TemaProvider` coloca el estado del tema oscuro en un contexto global.
2. `SQLiteProvider` abre o crea la base local `finanzas.db`.
3. `onInit={initDB}` ejecuta la funcion que crea tablas y categorias iniciales.
4. `NavigationContainer` habilita la navegacion de React Navigation.
5. `StackNavigator` decide que pantalla debe mostrarse.
6. Todas las screens hijas pueden acceder a los contextos que estan arriba.

### Respuesta posible al profesor

> "Use providers porque hay datos y servicios que varias pantallas necesitan. El tema no pertenece a una sola pantalla, SQLite debe estar disponible para las pantallas que consultan la base, y el NavigationContainer es el contexto que permite navegar entre rutas."

---

## 3. Navegacion de pagos pendientes

### `navigation/types.tsx`

En `RootStackParamList` se agrega:

```ts
PagosPendientes: undefined;
```

Esto significa que existe una ruta llamada `PagosPendientes` y que no necesita parametros para abrirse.

El tipado evita errores como navegar a un nombre de ruta inexistente o enviar parametros incorrectos.

### `navigation/StackNavigator.tsx`

La pantalla se importa y se registra:

```tsx
import PagosPendientesScreen from '../screens/PagosPendientesScreen';

<Stack.Screen name="PagosPendientes" component={PagosPendientesScreen} />
```

Importar el componente no alcanza: tambien hay que registrarlo dentro del `Stack.Navigator`. Si no se registra, React Navigation no conoce esa ruta y `navigation.navigate('PagosPendientes')` falla.

---

# 4. Pantalla `PagosPendientesScreen`

Archivo: `screens/PagosPendientesScreen.tsx`

Esta pantalla permite:

- Ver los pagos guardados.
- Agregar un pago.
- Marcarlo como pagado o pendiente.
- Actualizar el presupuesto mensual al cambiar el estado.
- Eliminar un pago.
- Mantener el tema claro u oscuro.
- Navegar desde la barra inferior.

## 4.1 Importaciones

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import PagoItem, { PagoLocal } from '../components/PagoItem';
import { getPagos, guardarPago, actualizarPago, eliminarPago } from '../services/pagos';
import { useSQLiteContext } from 'expo-sqlite';
import BottomNav from '../components/BottomNav';
import { useTema } from '../context/TemaContext';
```

### Que hace cada importacion

- `React`: permite trabajar con componentes React.
- `useState`: guarda estados locales del formulario y la lista.
- `useEffect`: ejecuta la carga de pagos cuando aparece la pantalla.
- `View`, `Text`, `TextInput`, `Pressable`, `ScrollView`: componentes visuales de React Native.
- `StyleSheet`: organiza los estilos.
- `Alert`: muestra errores de validacion en Android o iOS.
- `PagoItem`: componente encargado de mostrar un pago individual.
- `PagoLocal`: tipo TypeScript que describe la forma de un pago.
- Las funciones de `services/pagos`: abstraen la persistencia en AsyncStorage.
- `useSQLiteContext`: obtiene la base de datos que provee `SQLiteProvider`.
- `BottomNav`: barra de navegacion reutilizable.
- `useTema`: obtiene los colores del modo claro u oscuro.

## 4.2 Acceso al tema

```tsx
const { colores } = useTema();
```

`useTema` devuelve el objeto `colores`. Ese objeto contiene, entre otros:

- `fondo`: color general de la pantalla.
- `textoPrimario`: color de titulos y textos principales.
- `texto`: color de textos secundarios.
- `inputBg`: fondo de inputs y barra inferior.
- `inputBorder`: color de bordes.
- `boton`: color principal de botones y elementos activos.

Por eso la screen no usa un fondo fijo. Usa, por ejemplo:

```tsx
backgroundColor: colores.fondo
```

Cuando cambia el tema, el contexto provoca un nuevo render y la pantalla recibe los colores nuevos.

## 4.3 Conexion con SQLite

```tsx
const db = (() => {
    try {
        return useSQLiteContext();
    } catch {
        return null as any;
    }
})();
```

`useSQLiteContext()` normalmente obtiene la instancia de la base de datos creada por `SQLiteProvider`.

En esta pantalla se usa para modificar el presupuesto mensual cuando un pago cambia de estado. El `try/catch` permite que el componente no se rompa si se renderiza fuera del proveedor, algo que puede ocurrir en ciertos tests o previews.

Importante para explicar:

> "La pantalla usa AsyncStorage para la lista de pagos y SQLite para el presupuesto mensual. Son dos persistencias distintas porque la app ya tiene el presupuesto dentro de la tabla `preferencias`, mientras que los pagos fueron implementados como una coleccion local serializada."

## 4.4 Estados del formulario y de la lista

```tsx
const [pagos, setPagos] = useState<PagoLocal[]>([]);
const [descripcion, setDescripcion] = useState('');
const [monto, setMonto] = useState('');
const [fechaVto, setFechaVto] = useState('');
```

- `pagos`: array de pagos que se renderiza en la lista.
- `descripcion`: texto escrito en el primer input.
- `monto`: se guarda como string mientras se escribe porque `TextInput` trabaja con texto.
- `fechaVto`: fecha de vencimiento escrita por el usuario.

El tipo `PagoLocal[]` le indica a TypeScript que cada elemento del array debe tener la forma de un pago.

## 4.5 Carga inicial

```tsx
useEffect(() => {
    cargar();
}, []);
```

El array de dependencias vacio significa que `cargar` se ejecuta cuando el componente se monta.

```tsx
async function cargar() {
    const datos = await getPagos();
    setPagos(datos);
}
```

El flujo es:

1. La pantalla aparece.
2. `useEffect` llama a `cargar`.
3. `cargar` espera el resultado de `getPagos`.
4. `getPagos` lee AsyncStorage.
5. `setPagos` actualiza el estado.
6. React vuelve a renderizar la lista.

Se usa `async/await` porque AsyncStorage devuelve Promises.

## 4.6 Agregar un pago

La funcion `onAgregar` tiene tres etapas: validar, crear el objeto y persistirlo.

### Validacion de campos vacios

```tsx
if (!descripcion.trim() || !monto.trim() || !fechaVto.trim()) {
    Alert.alert('Error', 'Completa todos los campos');
    return;
}
```

`trim()` elimina espacios al principio y al final. El operador `!` detecta un string vacio.

El `return` corta la funcion para evitar guardar un pago incompleto.

### Validacion del monto

```tsx
const montoNum = parseFloat(monto);
if (isNaN(montoNum) || montoNum <= 0) {
    Alert.alert('Error', 'Monto invalido');
    return;
}
```

- `parseFloat` convierte el texto en numero decimal.
- `isNaN` verifica si la conversion fallo.
- `montoNum <= 0` evita montos cero o negativos.

El usuario escribe texto, pero el modelo de datos necesita un numero. Por eso se convierte antes de crear el objeto.

### Creacion del objeto temporal

```tsx
const pagoTemporal: PagoLocal = {
    id: Date.now(),
    descripcion: descripcion.trim(),
    monto: montoNum,
    fechaVencimiento: fechaVto.trim(),
    pagado: false,
    pagoFecha: null,
};
```

- `Date.now()` genera un identificador temporal basado en la fecha actual.
- La descripcion y la fecha se limpian con `trim`.
- El monto ya es numerico.
- Un pago nuevo comienza como pendiente.
- Todavia no tiene fecha de pago, por eso `pagoFecha` es `null`.

### Actualizacion inmediata de la interfaz

```tsx
setPagos(prev => [...prev, pagoTemporal]);
setDescripcion('');
setMonto('');
setFechaVto('');
```

`prev => [...prev, pagoTemporal]` crea un nuevo array con los pagos anteriores y el nuevo.

No se modifica directamente el array anterior porque en React el estado debe tratarse como inmutable. Al crear una nueva referencia, React detecta el cambio.

Los tres `set` siguientes limpian el formulario.

### Persistencia

```tsx
guardarPago({
    descripcion: pagoTemporal.descripcion,
    monto: pagoTemporal.monto,
    fechaVencimiento: pagoTemporal.fechaVencimiento,
    pagado: pagoTemporal.pagado,
    pagoFecha: pagoTemporal.pagoFecha,
}).catch((error) => {
    console.log('Error al guardar pago:', error);
});
```

La screen actualiza primero la UI para que el usuario vea el pago enseguida y luego llama al servicio para persistirlo.

Se usa `.catch` para registrar el error de almacenamiento sin provocar un cierre inesperado de la pantalla.

### Pregunta posible: ¿por que no se espera `guardarPago` con `await`?

Respuesta:

> "En esta implementacion se actualiza la interfaz de forma optimista: el pago aparece inmediatamente y la persistencia se intenta en segundo plano. Si quisiera garantizar que solo aparezca cuando se guarde correctamente, podria usar `await` antes de actualizar el estado y manejar un estado de error para revertir la UI."

## 4.7 Marcar o desmarcar un pago

```tsx
async function onTogglePaid(p: PagoLocal) {
    const pagadoAhora = !p.pagado;
    const pagoFecha = pagadoAhora ? new Date().toISOString() : null;
    const actualizado: PagoLocal = { ...p, pagado: pagadoAhora, pagoFecha };
```

Paso a paso:

1. `!p.pagado` invierte el estado actual.
2. Si ahora queda pagado, se registra la fecha y hora en formato ISO.
3. Si vuelve a pendiente, la fecha se elimina con `null`.
4. `{ ...p }` copia el objeto original.
5. Luego se reemplazan solo `pagado` y `pagoFecha`.

El formato ISO es adecuado para guardar fechas porque es estandar y luego se puede convertir para mostrarla al usuario.

### Persistencia y estado local

```tsx
await actualizarPago(actualizado);
setPagos(prev => prev.map(x => (
    x.id === actualizado.id ? actualizado : x
)));
```

- Primero se actualiza el pago persistido.
- Luego se recorre el array local con `map`.
- El pago cuyo `id` coincide se reemplaza.
- Los demas quedan iguales.

`map` es apropiado porque devuelve un nuevo array sin mutar el original.

## 4.8 Actualizacion del presupuesto

Cuando se marca como pagado:

```tsx
const pref = await db.getFirstAsync(
    "select valor from preferencias where clave = 'presupuesto_mensual'"
);
const actual = parseFloat(pref.valor) || 0;
const nuevoPresupuesto = actual - actualizado.monto;
await db.runAsync(
    "insert or replace into preferencias (clave, valor) values ('presupuesto_mensual', ?)",
    [nuevoPresupuesto.toString()]
);
```

El proceso es:

1. Buscar la preferencia `presupuesto_mensual`.
2. Leer el valor que SQLite guarda como texto.
3. Convertirlo a numero.
4. Restar el monto del pago.
5. Guardar el nuevo valor con `INSERT OR REPLACE`.

El signo `?` es un parametro de la consulta. El valor se envia en el array separado. Esto evita construir la consulta concatenando strings.

Cuando se desmarca:

```tsx
const nuevoPresupuesto = actual + actualizado.monto;
```

Se suma nuevamente el monto porque el pago deja de considerarse realizado.

Los bloques `try/catch` impiden que un error de SQLite rompa toda la interaccion y permiten registrar el problema.

### Observacion tecnica para la defensa

La pantalla actualiza el presupuesto solo si existe `db` y si existe `db.runAsync`:

```tsx
if (pagadoAhora && db && db.runAsync) {
```

Esto hace que el codigo sea mas tolerante en tests, donde muchas veces se usa una base mockeada o el componente se monta sin toda la infraestructura real.

## 4.9 Eliminar un pago

```tsx
async function onEliminar(id: number) {
    await eliminarPago(id);
    setPagos(prev => prev.filter(x => x.id !== id));
}
```

- El servicio elimina el registro persistido.
- `filter` crea una lista nueva excluyendo el `id` elegido.
- La UI se actualiza inmediatamente despues de la persistencia.

## 4.10 Render de la pantalla

```tsx
<View style={{ flex: 1, paddingTop: 50, backgroundColor: colores.fondo }}>
```

`flex: 1` ocupa el espacio disponible. `colores.fondo` permite que el fondo responda al tema.

Cada `TextInput` tiene:

```tsx
placeholderTextColor={colores.texto}
style={[styles.input, {
    backgroundColor: colores.inputBg,
    borderColor: colores.inputBorder,
    color: colores.texto,
}]}
```

Esto es importante para modo oscuro porque no alcanza con cambiar el fondo general. Tambien hay que cambiar:

- El fondo del campo.
- El borde.
- El texto escrito.
- El texto de ayuda del placeholder.

El boton usa:

```tsx
style={[styles.btn, { backgroundColor: colores.boton }]}
```

El mensaje vacio usa `colores.texto`, de modo que tambien sea legible en ambos temas.

### Render condicional de la lista

```tsx
{pagos.length === 0 ? (
    <Text>No hay pagos pendientes</Text>
) : (
    pagos.map(p => (
        <PagoItem
            key={p.id}
            pago={p}
            colores={colores}
            onTogglePaid={onTogglePaid}
            onEliminar={onEliminar}
        />
    ))
)}
```

- Si el array esta vacio, se muestra un mensaje.
- Si hay elementos, `map` genera un `PagoItem` por cada pago.
- `key={p.id}` permite que React identifique cada elemento de la lista.
- Se pasan los datos y callbacks al componente hijo.

La pantalla conserva la logica y `PagoItem` conserva la presentacion de cada fila. Esa separacion mejora la reutilizacion y la lectura del codigo.

---

# 5. Componente `PagoItem`

Archivo: `components/PagoItem.tsx`

`PagoItem` representa una fila individual de un pago.

## 5.1 Tipo `PagoLocal`

```tsx
export interface PagoLocal {
    id: number;
    descripcion: string;
    monto: number;
    fechaVencimiento: string;
    pagado?: boolean;
    pagoFecha?: string | null;
}
```

- `id`: identifica el pago.
- `descripcion`: por ejemplo, `Internet` o `Luz`.
- `monto`: numero decimal.
- `fechaVencimiento`: fecha ingresada.
- `pagado?`: opcional, porque puede faltar en datos antiguos.
- `pagoFecha?`: opcional y puede ser `null` si aun no se pago.

Los signos `?` permiten que esos campos no existan obligatoriamente en todos los datos.

## 5.2 Props y callbacks

```tsx
interface Props {
    pago: PagoLocal;
    onTogglePaid: (pago: PagoLocal) => void;
    onEliminar: (id: number) => void;
    colores?: {
        textoPrimario: string;
        texto: string;
        inputBorder: string;
        boton: string;
    };
}
```

El componente recibe:

- El pago que debe mostrar.
- Una funcion para marcar o desmarcar.
- Una funcion para eliminar.
- Los colores del tema, opcionales para que el componente tambien pueda probarse de forma aislada.

Los callbacks se ejecutan en el hijo, pero la logica real vive en la pantalla padre. Esto es un patron comun: el padre mantiene el estado y el hijo emite eventos.

## 5.3 Formateo de la fecha de pago

```tsx
const mostrarPagoFecha = pago.pagoFecha
    ? new Date(pago.pagoFecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
    : null;
```

Si existe `pagoFecha`, se convierte de ISO a una fecha legible para Argentina. Si no existe, se deja `null` y no se muestra el texto de pago.

## 5.4 Check y eliminar

```tsx
<Pressable
    accessibilityLabel={`toggle-paid-${pago.id}`}
    onPress={() => onTogglePaid(pago)}
>
    <Text style={...}>{pago.pagado ? '✅' : '❌'}</Text>
</Pressable>
```

`Pressable` detecta la pulsacion. La expresion ternaria muestra un icono diferente segun el estado.

`accessibilityLabel` da un nombre accesible al control y tambien permite localizarlo de forma estable desde un test.

El boton de borrar sigue el mismo principio:

```tsx
<Pressable
    accessibilityLabel={`delete-${pago.id}`}
    onPress={() => onEliminar(pago.id)}
>
    <Text>🗑️</Text>
</Pressable>
```

## 5.5 Informacion visual del pago

La descripcion usa el color principal y, si esta pagada, se tacha:

```tsx
<Text style={[
    styles.descripcion,
    { color: colores?.textoPrimario },
    pago.pagado && styles.tachada,
    pago.pagado && colores && { color: colores.texto },
]}>
    {pago.descripcion}
</Text>
```

El operador `&&` agrega un estilo solo cuando la condicion es verdadera.

El monto y el vencimiento se muestran juntos:

```tsx
<Text style={[styles.meta, { color: colores?.texto }]}>
    ${pago.monto.toFixed(2)} • Vence: {pago.fechaVencimiento}
</Text>
```

`toFixed(2)` asegura dos decimales.

Cuando el pago esta realizado:

```tsx
{pago.pagado && mostrarPagoFecha && (
    <Text style={styles.pagoFecha}>
        Pagado: {mostrarPagoFecha}hs
    </Text>
)}
```

La fecha se muestra solamente si el pago esta marcado y hay una fecha disponible. El color verde representa semanticamente un estado exitoso.

## 5.6 Por que `colores` es opcional

El componente se utiliza desde la pantalla con los colores reales del tema, pero en el test unitario se monta directamente sin `TemaProvider`.

Por eso se definio:

```tsx
colores?: { ... }
```

Y se usan accesos opcionales como:

```tsx
colores?.texto
colores?.boton
```

Esto evita que el componente falle cuando se prueba de manera aislada.

---

# 6. Componente `BottomNav`

Archivo: `components/BottomNav.tsx`

Es la barra de navegacion inferior reutilizable. Se muestra en las pantallas principales y evita repetir cinco botones de navegacion en cada screen.

## 6.1 Props y rutas

```tsx
interface BottomNavProps {
    current: 'Home' | 'Movimientos' | 'Categorias' | 'Ajustes' | 'PagosPendientes';
}
```

`current` indica cual pestaña esta activa. Al usar un union type de TypeScript, solo se aceptan esos cinco valores.

Ejemplo:

```tsx
<BottomNav current="PagosPendientes" />
```

## 6.2 Hooks usados

```tsx
const { colores } = useTema();
const navigation = useNavigation<NavigationProp>();
```

- `useTema` adapta la barra al modo claro u oscuro.
- `useNavigation` permite navegar al presionar una opcion.
- `NavigationProp` aporta tipado a la navegacion.

## 6.3 Configuracion de items

```tsx
const items = [
    { name: 'Home', icon: 'home-outline', label: 'Inicio' },
    { name: 'Movimientos', icon: 'swap-horizontal-outline', label: 'Movs.' },
    { name: 'PagosPendientes', icon: 'checkmark-circle-outline', label: 'Pagos' },
    { name: 'Categorias', icon: 'pricetag-outline', label: 'Cat.' },
    { name: 'Ajustes', icon: 'settings-outline', label: 'Ajustes' },
];
```

La lista permite renderizar todos los botones con un unico `map`, en lugar de copiar y pegar el mismo JSX cinco veces.

Los iconos vienen de `@expo/vector-icons`, usando `Ionicons`.

## 6.4 Deteccion del item activo

```tsx
const active = current === item.name;
```

Si el nombre del item coincide con `current`, la opcion esta activa.

```tsx
color={active ? colores.boton : colores.texto}
```

La opcion activa usa el color principal y las restantes usan el color secundario. Esto mejora la orientacion del usuario.

## 6.5 Navegacion

```tsx
onPress={() => navigation.navigate(item.name as ...)}
```

Al presionar un item se navega a la ruta correspondiente.

El `as` aparece porque el array de items contiene tambien `PagosPendientes`, mientras que la expresion de navegacion del componente fue escrita con una union que no incluye esa ruta. Para una mejora futura, se podria tipar el array directamente con `keyof RootStackParamList` y eliminar ese casteo.

### Respuesta posible al profesor

> "Con BottomNav evito duplicar la misma navegacion en todas las pantallas. Los items se definen en un array y se renderizan con map. La prop current permite distinguir la pantalla activa, y el contexto de tema cambia los colores de la barra."

---

# 7. Contexto de tema oscuro

Archivo: `context/TemaContext.tsx`

Aunque el tema no esta dentro de `services`, es necesario entenderlo para explicar por que `PagosPendientesScreen`, `PagoItem` y `BottomNav` reciben colores.

## 7.1 Modelo de colores

```tsx
interface ColoresTema {
    fondo: string;
    textoPrimario: string;
    texto: string;
    inputBg: string;
    inputBorder: string;
    boton: string;
}
```

Este tipo define el contrato de colores que cualquier pantalla puede consumir.

Hay dos objetos:

- `coloresClaro`.
- `coloresOscuro`.

El proveedor expone uno u otro segun el valor de `oscuro`.

## 7.2 Estado y carga inicial

```tsx
const [oscuro, setOscuro] = useState(false);
```

La app comienza en modo claro mientras se leen las preferencias persistidas.

```tsx
useEffect(() => {
    const cargarTema = async () => {
        const prefs = await leerPrefs();
        setOscuro(Boolean(prefs?.temaOscuro));
    };

    cargarTema();
}, []);
```

Al iniciar:

1. Se leen las preferencias.
2. Se obtiene `temaOscuro`.
3. `Boolean` transforma el valor a verdadero o falso.
4. Se actualiza el estado global.
5. Todas las pantallas consumidoras se vuelven a renderizar.

## 7.3 Cambio y persistencia

```tsx
const cambiarTema = async (valor: boolean) => {
    const prefsActuales = await leerPrefs();
    await guardarPrefs({
        nombre: prefsActuales?.nombre ?? '',
        temaOscuro: valor,
    });
    setOscuro(valor);
};
```

Se conserva el nombre actual y se guarda el nuevo valor del tema. El operador `??` usa string vacio si no existe nombre.

## 7.4 Contexto

```tsx
const TemaContext = createContext<TemaContextType | undefined>(undefined);
```

El contexto permite compartir el tema sin pasar props manualmente por todas las pantallas.

`useTema` verifica que se use dentro de `TemaProvider`. Si no, lanza un error explicito.

### Respuesta posible al profesor

> "Use Context API porque el tema es una configuracion global. Sin contexto tendria que pasar los colores manualmente por muchos componentes. El proveedor centraliza el estado y cada consumidor se actualiza cuando cambia."

---

# 8. Carpeta `services`

Los servicios separan operaciones externas o logica reutilizable de la interfaz. Una screen no deberia mezclar todos los detalles de AsyncStorage, Axios, alertas y calculos.

---

## 8.1 `services/alertUtils.ts`

Este archivo unifica la forma de mostrar alertas en web y en Android/iOS.

```tsx
import { Alert, Platform } from 'react-native';
```

- `Alert` es la alerta nativa de React Native.
- `Platform` permite saber si se esta ejecutando en web.

La funcion recibe:

```tsx
showAlert(
    title: string,
    message: string,
    buttons?: Array<{
        text: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive'
    }>
)
```

El tercer parametro es opcional y representa botones de accion.

### Funcionamiento en web

```tsx
if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        if (confirmed) {
            const botonConfirmacion = buttons[buttons.length - 1];
            botonConfirmacion?.onPress?.();
        }
    } else {
        window.alert(`${title}\n${message}`);
    }
}
```

En web se usan `window.alert` y `window.confirm` porque las alertas nativas no se comportan igual que en mobile.

Si hay varios botones, se interpreta el ultimo como confirmacion. Si el usuario confirma, se ejecuta su callback.

### Funcionamiento en mobile

```tsx
else {
    Alert.alert(title, message, buttons);
}
```

En Android o iOS se usa la API nativa de React Native.

### Por que existe este servicio

Sin este archivo, cada pantalla tendria que preguntar por la plataforma y repetir la misma logica. El servicio centraliza esa diferencia.

---

## 8.2 `services/pagos.tsx`

Este servicio implementa un CRUD local de pagos usando AsyncStorage.

CRUD significa:

- Create: crear.
- Read: leer.
- Update: actualizar.
- Delete: eliminar.

### Tipo de datos

```tsx
export interface PagoLocal {
    id: number;
    descripcion: string;
    monto: number;
    fechaVencimiento: string;
    pagado?: boolean;
    pagoFecha?: string | null;
}
```

El mismo modelo se usa en la pantalla y en el servicio para mantener consistencia.

### Clave de almacenamiento

```tsx
const KEY = 'pagos_pendientes';
```

AsyncStorage trabaja con claves string. Esta es la clave bajo la cual se guarda todo el array.

### Leer todos

```tsx
async function readAll(): Promise<PagoLocal[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PagoLocal[]) : [];
}
```

Paso a paso:

1. Se consulta la clave.
2. Si hay texto guardado, se convierte desde JSON a array.
3. Si no hay nada, se devuelve array vacio.

AsyncStorage solo almacena strings. Por eso se necesita `JSON.parse` al leer.

### Escribir todos

```tsx
async function writeAll(items: PagoLocal[]) {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
}
```

El array se convierte a string JSON antes de guardarlo.

### Obtener pagos

```tsx
export async function getPagos(): Promise<PagoLocal[]> {
    return readAll();
}
```

Es una funcion publica que oculta el nombre de la funcion interna. La screen usa una API clara: `getPagos()`.

### Guardar pago

```tsx
export async function guardarPago(
    p: Omit<PagoLocal, 'id'>
): Promise<PagoLocal> {
    const current = await readAll();
    const id = current.length > 0
        ? Math.max(...current.map(x => x.id)) + 1
        : 1;
    const nuevo: PagoLocal = { id, ...p };
    current.push(nuevo);
    await writeAll(current);
    return nuevo;
}
```

- `Omit<PagoLocal, 'id'>` indica que el llamador no debe enviar el id.
- Se leen los pagos actuales.
- Se calcula un id mayor al maximo existente.
- Se crea el nuevo objeto.
- Se agrega al array.
- Se reescribe todo el array.
- Se devuelve el pago completo.

### Actualizar pago

```tsx
export async function actualizarPago(updated: PagoLocal): Promise<PagoLocal> {
    const current = await readAll();
    const idx = current.findIndex(x => x.id === updated.id);
    if (idx === -1) throw new Error('Pago no encontrado');
    current[idx] = updated;
    await writeAll(current);
    return updated;
}
```

`findIndex` devuelve la posicion del pago. Si devuelve `-1`, no existe y se lanza un error. Si existe, se reemplaza y se guarda nuevamente el array.

### Eliminar pago

```tsx
export async function eliminarPago(id: number): Promise<void> {
    const current = await readAll();
    const filtered = current.filter(x => x.id !== id);
    await writeAll(filtered);
}
```

`filter` conserva todos los pagos excepto el que tiene el id indicado.

### Pregunta posible: ¿por que se reescribe todo el array?

Respuesta:

> "AsyncStorage no funciona como una tabla con update por registro. En este caso se guarda una coleccion JSON, por eso se lee el array, se modifica en memoria y se vuelve a serializar completo. Para muchos datos seria mejor una tabla SQLite."

---

## 8.3 `services/preferencias.tsx`

Este servicio guarda preferencias del usuario en AsyncStorage.

### Tipo

```tsx
interface Preferencias {
    nombre: string;
    temaOscuro?: boolean;
}
```

Contiene el nombre del usuario y si el tema oscuro esta activo.

### Guardar

```tsx
export async function guardarPrefs(prefs: Preferencias): Promise<void> {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(prefs));
}
```

El objeto se convierte a JSON porque AsyncStorage solo almacena strings.

### Leer

```tsx
export async function leerPrefs(): Promise<Preferencias | null> {
    const raw = await AsyncStorage.getItem(CLAVE);
    return raw ? JSON.parse(raw) : null;
}
```

Si no hay preferencias, devuelve `null`. Si hay, convierte el JSON a objeto.

### Relacion con el modo oscuro

`TemaContext` usa `leerPrefs` al iniciar y `guardarPrefs` al cambiar el switch. Asi la eleccion del usuario no se pierde al cerrar la app.

---

## 8.4 `services/presupuestoUtils.ts`

Este es un servicio de logica pura. No depende de React Native, SQLite ni AsyncStorage. Por eso es muy sencillo de testear.

### Tipos

```ts
export type TipoTransaccion = 'ingreso' | 'gasto';
```

Solo permite esos dos valores.

```ts
export interface TransaccionPresupuesto {
    tipo: TipoTransaccion;
    monto: number;
}
```

Cada transaccion tiene tipo y monto.

```ts
export interface ResumenPresupuesto {
    totalIngresos: number;
    totalGastos: number;
    presupuesto: number;
    disponible: number;
}
```

Es la respuesta calculada por la funcion.

### Calculo

```ts
const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);
```

- `filter` toma solo ingresos.
- `reduce` los suma.
- `0` es el valor inicial.

Para gastos se repite el mismo patron:

```ts
const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);
```

El disponible se calcula asi:

```ts
const disponible = presupuesto + totalIngresos - totalGastos;
```

La funcion devuelve todas las partes del resumen.

### Por que es buena logica para un test unitario

La misma entrada siempre produce la misma salida. No hay UI ni almacenamiento externo. Es una funcion pura y determinista.

---

## 8.5 `services/transaccionesApi.tsx`

Este servicio encapsula las llamadas HTTP a MockAPI usando Axios.

### Cliente Axios

```tsx
const api = axios.create({
    baseURL: 'https://6a25e93f5447714a6f83c529.mockapi.io',
});
```

Crear una instancia evita repetir la URL base en cada llamada.

### Obtener todas

```tsx
getAll: () => api.get<Transaccion[]>('/gastos')
```

Hace un `GET` y espera una lista de transacciones.

### Crear

```tsx
create: (
    transaccion: Omit<Transaccion, 'id' | 'api_id'>
) => api.post<Transaccion>('/gastos', transaccion)
```

El usuario no debe enviar `id` ni `api_id` porque los genera el servidor. `Omit` expresa esa regla en TypeScript.

### Actualizar

```tsx
update: (id: string, transaccion: Omit<Transaccion, 'id'>) =>
    api.put<Transaccion>(`/gastos/${id}`, transaccion)
```

Construye la ruta del recurso especifico e informa el tipo de respuesta.

### Eliminar

```tsx
remove: (id: string) => api.delete(`/gastos/${id}`)
```

El servicio evita que las pantallas tengan que conocer rutas HTTP o usar Axios directamente.

### Respuesta posible al profesor

> "Encapsule Axios en un servicio para separar la infraestructura de red de la interfaz. Las screens llaman metodos como getAll o create, y no tienen que conocer la URL ni los detalles del verbo HTTP."

---

# 9. Inicializacion de SQLite

Archivo: `database/initDB.tsx`

La funcion `initDB` recibe la base y ejecuta un script SQL con `execAsync`.

Crea tablas para:

- `tareas`.
- `categorias`.
- `transacciones`.
- `preferencias`.

Tambien inserta categorias iniciales con `INSERT OR IGNORE`, por lo que no duplica las categorias si la inicializacion ocurre mas de una vez.

La tabla `preferencias` tiene:

```sql
clave TEXT PRIMARY KEY,
valor TEXT
```

Por eso el presupuesto se consulta con la clave `presupuesto_mensual` y se actualiza con `INSERT OR REPLACE`.

---

# 10. Tests con Jest

## 10.1 Que es Jest

Jest es el test runner. Se encarga de:

- Encontrar archivos de test.
- Ejecutarlos.
- Proveer `describe`, `it`, `test`, `expect` y `beforeEach`.
- Crear mocks con `jest.fn` y `jest.mock`.
- Informar que pruebas pasaron o fallaron.

En el `package.json`:

```json
"test": "jest"
```

Por eso se pueden ejecutar con:

```powershell
npm run test
npx jest
```

Para ejecutar sin paralelismo:

```powershell
npx jest --runInBand
```

## 10.2 Configuracion de Jest

El `package.json` usa:

```json
"jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"]
}
```

- `jest-expo` adapta Jest al entorno Expo.
- `setupFilesAfterEnv` carga configuraciones antes de los tests.

En `jest.setup.js`:

```js
require('@testing-library/jest-native/extend-expect');
```

Esto agrega matchers utiles para componentes React Native.

Tambien se mockea AsyncStorage globalmente:

```js
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

Asi los tests no intentan usar almacenamiento real.

## 10.3 Estructura AAA

Los tests siguen el patron:

- Arrange: preparar datos y mocks.
- Act: ejecutar la funcion o interaccion.
- Assert: verificar el resultado.

Ejemplo conceptual:

```ts
const input = prepararDatos();
const result = ejecutarFuncion(input);
expect(result).toBe(esperado);
```

---

# 11. Test `preferencias.test.ts`

Este test comprueba la persistencia de preferencias sin acceder al almacenamiento real.

## Mock de AsyncStorage

```ts
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
    },
}));
```

- `jest.mock` reemplaza el modulo.
- `jest.fn()` crea funciones espia.
- `__esModule: true` ayuda a simular correctamente un import default.

## Limpieza

```ts
beforeEach(() => {
    jest.clearAllMocks();
});
```

Cada test comienza sin llamadas acumuladas de la prueba anterior.

## Guardar preferencias

```ts
await guardarPrefs(prefs);
expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    'preferencias_usuario',
    JSON.stringify(prefs)
);
```

Se comprueba:

1. Que la funcion se pueda ejecutar.
2. Que llame una vez a `setItem`.
3. Que use la clave correcta.
4. Que guarde el JSON correcto.

## Leer cuando no hay datos

```ts
(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
const result = await leerPrefs();
expect(result).toBeNull();
```

`mockResolvedValueOnce` simula una Promise que devuelve `null` una sola vez.

## Leer datos existentes

```ts
(AsyncStorage.getItem as jest.Mock)
    .mockResolvedValueOnce(JSON.stringify(prefs));

const result = await leerPrefs();
expect(result).toEqual(prefs);
```

Se usa `toEqual` porque compara el contenido de objetos. `toBe` compararia identidad o referencia.

---

# 12. Test `presupuesto.test.ts`

Este test comprueba una funcion pura.

## Caso con ingresos y gastos

Se preparan:

```ts
[
    { tipo: 'ingreso', monto: 2000 },
    { tipo: 'gasto', monto: 500 },
    { tipo: 'gasto', monto: 300 },
]
```

Con un presupuesto de `5000`:

```text
Ingresos = 2000
Gastos = 500 + 300 = 800
Disponible = 5000 + 2000 - 800 = 6200
```

Se usa `toBe` porque se comparan numeros.

## Caso sin transacciones

Se verifica que:

- Ingresos sea `0`.
- Gastos sea `0`.
- Disponible conserve el presupuesto inicial.

Esto prueba el caso limite de array vacio.

## Caso de disponible negativo

Se verifica que la funcion no fuerce el resultado a cero cuando los gastos superan el dinero disponible:

```text
1000 + 500 - 6000 = -4500
```

Este test demuestra que el calculo mantiene informacion real de deuda o exceso de gastos.

---

# 13. Tests de React Native Testing Library

## 13.1 Que es RTL

React Native Testing Library renderiza componentes y permite interactuar con ellos como un usuario:

- Buscar texto.
- Buscar placeholders.
- Buscar roles.
- Escribir en inputs.
- Presionar botones.
- Esperar resultados asincronos.

La idea no es probar detalles internos de React, sino el comportamiento visible.

Funciones importantes:

- `render`: monta el componente.
- `screen.getByText`: busca texto visible.
- `screen.getByPlaceholderText`: busca por placeholder.
- `screen.getByLabelText`: busca por accessibility label.
- `fireEvent.changeText`: simula escritura.
- `fireEvent.press`: simula una pulsacion.
- `waitFor`: espera una condicion asincrona.
- `findBy...`: busca esperando a que aparezca.

---

## 13.2 `AgregarTransaccionScreen.test.tsx`

Este test verifica el flujo de completar y guardar una transaccion.

### Mocks utilizados

Se mockean:

- SQLite.
- Navegacion.
- Tema.
- `showAlert`.
- API de transacciones.

Esto permite probar la screen sin depender de una base real ni de internet.

Por ejemplo:

```ts
const mockDB = {
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
};
```

La base simulada devuelve categorias y registra las consultas que la screen hace.

```ts
mockDB.getAllAsync.mockResolvedValue([
    { id: 1, nombre: 'Alimentos', color: '#f59e0b' }
]);
```

Se prepara una categoria para que el formulario tenga datos disponibles.

### Render y carga inicial

```ts
await render(<AgregarTransaccionScreen navigation={mockNavigation} />);
await waitFor(() => {
    expect(mockDB.getAllAsync).toHaveBeenCalledTimes(1);
});
```

Se espera porque la screen carga categorias en un `useEffect`.

### Buscar controles

```ts
const descripcionInput = screen.getByPlaceholderText(
    'Ej: Compra en supermercado'
);
const montoInput = screen.getByPlaceholderText('0.00');
const fechaInput = screen.getByPlaceholderText('Ej: 2024-06-10');
const guardarButton = screen.getByLabelText('guardar-transaccion');
```

Se usan identificadores visibles o accesibles en vez de depender de la estructura interna.

### Simular ingreso

```ts
await fireEvent.changeText(descripcionInput, 'Compra en supermercado');
await fireEvent.changeText(montoInput, '250');
await fireEvent.changeText(fechaInput, '2024-06-10');
```

Se verifica que los valores realmente hayan llegado a los inputs.

### Guardar

```ts
await fireEvent.press(guardarButton);
```

Luego se espera que:

- Se ejecute `runAsync`.
- La navegacion vuelva atras.
- La API reciba el objeto esperado.
- Se llame a `showAlert` con mensaje de exito.

La asercion mas importante es:

```ts
expect(mockCreate).toHaveBeenCalledWith({
    descripcion: 'Compra en supermercado',
    monto: 250,
    tipo: 'gasto',
    categoria_id: 1,
    fecha: '2024-06-10',
});
```

Se comprueba el contrato completo entre la pantalla y el servicio.

---

## 13.3 `AjustesFinanzasScreen.test.tsx`

Este test verifica que la pantalla de ajustes muestre el modo oscuro y que el switch llame al callback correcto.

### Preparacion

Se mockean:

- Base SQLite.
- Preferencias.
- Alertas.
- Tema.
- BottomNav.

El mock del tema expone `cambiarTema: mockChangeTheme`.

### Render

```ts
await render(<AjustesFinanzasScreen navigation={mockNavigation} />);
expect(screen.getByText('Ajustes')).toBeTruthy();
expect(screen.getByText('Modo oscuro')).toBeTruthy();
```

Se prueba que elementos visibles importantes existan.

### Interaccion con switch

```ts
const switchElement = screen.getByRole('switch');
await fireEvent(switchElement, 'valueChange', true);
```

Se simula el evento especifico de un `Switch`.

```ts
await waitFor(() => {
    expect(mockChangeTheme).toHaveBeenCalledWith(true);
});
```

La prueba demuestra que activar el switch produce el cambio de tema esperado.

---

## 13.4 `PagosPendientesScreen.test.tsx`

Este test comprueba que el usuario pueda agregar un pago y verlo en la lista.

### Mock del servicio

```ts
jest.mock('../../services/pagos', () => ({
    __esModule: true,
    getPagos: jest.fn(),
    guardarPago: jest.fn(),
    actualizarPago: jest.fn(),
    eliminarPago: jest.fn(),
}));
```

La screen no usa AsyncStorage real. Se controlan las respuestas desde el test.

### Estado inicial

```ts
mockGetPagos.mockResolvedValue([]);
mockGuardarPago.mockImplementation(async p => ({ id: 1, ...p }));
```

Se simula que inicialmente no hay pagos y que guardar devuelve el nuevo pago con id.

### Flujo probado

1. Renderizar la screen.
2. Esperar el texto `No hay pagos pendientes`.
3. Comprobar que `getPagos` fue llamado.
4. Escribir `Internet`.
5. Escribir `2000`.
6. Escribir `2026-07-20`.
7. Presionar `Agregar pago`.
8. Verificar que `guardarPago` fue llamado.
9. Verificar que `Internet` aparece en pantalla.

El test prueba un flujo real de usuario, no solo una funcion aislada.

### Por que se usan `waitFor` y `findBy`

La carga de datos y el guardado son asincronos. El test no debe asumir que todo ocurre en el mismo instante del render. `waitFor` espera hasta que una condicion se cumpla o se agote el tiempo.

---

## 13.5 `PagoItem.test.tsx`

Este test comprueba un componente aislado.

### Datos y callbacks

```ts
const pago: PagoLocal = {
    id: 1,
    descripcion: 'Luz',
    monto: 1500,
    fechaVencimiento: '2026-07-18',
    pagado: false,
    pagoFecha: null,
};
```

Se crean callbacks espia:

```ts
const mockToggle = jest.fn();
const mockEliminar = jest.fn();
```

### Casos cubiertos

1. Muestra descripcion y monto.
2. Al presionar el control de pago llama `onTogglePaid` con el pago.
3. Al presionar eliminar llama `onEliminar` con el id.
4. Muestra el indicador de pago cuando el pago esta pagado.

### Importante antes de presentar

El archivo actual del componente renderiza estos iconos:

```tsx
pago.pagado ? '✅' : '❌'
```

Y para eliminar:

```tsx
'🗑️'
```

Sin embargo, el test actual busca:

```ts
getByText('[ ]')
getByText('❌')
getByText('[X]')
```

Eso significa que hay una diferencia entre el componente actual y las expectativas del test. Si se ejecuta la suite completa, esos casos pueden fallar.

Hay dos soluciones coherentes:

### Opcion A: actualizar el test

Cambiar las expectativas para buscar `✅` y `🗑️`, manteniendo el componente actual.

### Opcion B: actualizar el componente

Volver a renderizar `[ ]`, `[X]` y `❌`, manteniendo el test actual.

Para una defensa, la explicacion correcta es:

> "El test debe representar el contrato visual actual del componente. Si cambio los iconos, tambien debo actualizar las queries del test. No conviene que el test busque una interfaz vieja."

No se debe afirmar que todos los tests pasan sin ejecutar `npx jest` despues de resolver esta diferencia.

---

# 14. Mocks: por que son necesarios

Un mock reemplaza temporalmente una dependencia real por una version controlada.

## Beneficios

- El test es rapido.
- No depende de internet.
- No modifica la base real.
- Permite probar errores y respuestas especificas.
- Permite verificar si una funcion fue llamada.

Ejemplos del proyecto:

- AsyncStorage mockeado en preferencias.
- SQLite mockeado en las screens.
- Axios/API mockeado en agregar transaccion.
- `showAlert` mockeado para comprobar mensajes.
- Navegacion mockeada para comprobar `goBack` o `navigate`.
- Tema mockeado para no necesitar montar todo el `TemaProvider`.

### Respuesta posible al profesor

> "No quiero que un test de una pantalla dependa de servicios externos. Por eso reemplazo las dependencias con mocks y pruebo el contrato: que la pantalla llame al servicio con los datos correctos y reaccione correctamente a la respuesta."

---

# 15. Comandos para instalar y ejecutar tests

Desde la raiz del proyecto:

```powershell
npm install
npx expo install jest-expo jest @types/jest --dev
npx expo install @testing-library/react-native @testing-library/jest-native react-test-renderer --dev
```

Ejecutar todos los tests:

```powershell
npx jest
```

Ejecutar sin paralelismo:

```powershell
npx jest --runInBand
```

Ejecutar un archivo especifico:

```powershell
npx jest --runInBand __tests__/Jest/presupuesto.test.ts
```

```powershell
npx jest --runInBand __tests__/Jest/preferencias.test.ts
```

```powershell
npx jest --runInBand __tests__/React_Testing_Library/PagosPendientesScreen.test.tsx
```

```powershell
npx jest --runInBand __tests__/React_Testing_Library/PagoItem.test.tsx
```

Ejecutar el script configurado en `package.json`:

```powershell
npm run test
```

Modo observacion:

```powershell
npm run test:watch
```

---

# 16. Preguntas que puede hacer el profesor

## ¿Por que usaste `useState`?

> "Para guardar datos que cambian durante la vida de la pantalla, como los inputs y la lista de pagos. Cada cambio de estado provoca el render necesario para actualizar la interfaz."

## ¿Por que usaste `useEffect`?

> "Para ejecutar la carga inicial de pagos cuando la pantalla se monta. El array de dependencias vacio evita repetir esa carga en cada render."

## ¿Por que `AsyncStorage`?

> "Para persistir datos simples localmente como preferencias y pagos. Como solo guarda strings, convierto objetos y arrays a JSON al escribir y los parseo al leer."

## ¿Por que SQLite?

> "La aplicacion ya usa SQLite para informacion estructurada como transacciones, categorias y preferencias. En la pantalla de pagos lo uso para actualizar el presupuesto mensual."

## ¿Por que Axios?

> "Para encapsular las llamadas HTTP a la API de transacciones. La instancia tiene una URL base y el servicio expone metodos getAll, create, update y remove."

## ¿Por que separar services de screens?

> "Para separar responsabilidades. La screen maneja UI e interaccion, mientras que el service maneja almacenamiento, API o logica. Esto facilita mantenimiento y testing."

## ¿Que diferencia hay entre un test unitario y uno de UI?

> "El unitario prueba una funcion aislada, como el calculo del presupuesto. El de UI monta un componente y simula acciones del usuario, como escribir y presionar un boton."

## ¿Por que usaste `jest.mock`?

> "Para reemplazar dependencias externas por funciones controladas. Asi el test no depende de una API, una base real o el almacenamiento del dispositivo."

## ¿Que diferencia hay entre `toBe` y `toEqual`?

> "`toBe` compara igualdad estricta y es apropiado para numeros o valores simples. `toEqual` compara recursivamente el contenido de objetos y arrays."

## ¿Por que usaste `waitFor`?

> "Porque la carga de datos, SQLite y AsyncStorage son asincronos. Espero a que se cumpla una condicion antes de afirmar el resultado."

## ¿Por que usaste `accessibilityLabel`?

> "Para que los controles tengan un nombre accesible y para poder localizarlos de manera estable en los tests sin depender del estilo o de la estructura interna."

## ¿Que pasa si no hay pagos?

> "Se muestra un mensaje indicando que no hay pagos pendientes. Si hay pagos, se renderiza un `PagoItem` por cada elemento del array."

## ¿Que pasa al marcar un pago?

> "Se invierte el estado, se registra o elimina la fecha de pago, se actualiza AsyncStorage y se descuenta o reintegra el monto en el presupuesto mensual de SQLite."

## ¿Como funciona el modo oscuro?

> "El `TemaProvider` guarda el estado global y lee la preferencia persistida. Las pantallas consumen `colores` y aplican esos valores a fondos, textos, bordes, inputs, botones y navegacion."

---

# 17. Recorrido practico para mostrar en la defensa

1. Abrir la app en Home.
2. Mostrar la barra inferior y explicar que `BottomNav` es reutilizable.
3. Entrar en Pagos.
4. Mostrar el mensaje cuando no hay pagos.
5. Completar descripcion, monto y fecha.
6. Presionar agregar y mostrar que el pago aparece.
7. Marcarlo como pagado.
8. Mostrar el check, el texto tachado y la fecha verde.
9. Explicar que el presupuesto se actualiza en SQLite.
10. Desmarcarlo y explicar que el monto se reintegra.
11. Eliminarlo y explicar el uso de `filter`.
12. Ir a Ajustes y activar modo oscuro.
13. Volver a Pagos y mostrar que fondo, inputs, boton, fila y navegacion se adaptan.
14. Ejecutar `npx jest`.
15. Si falla `PagoItem.test.tsx`, explicar la diferencia de iconos y corregir el test o el componente antes de la presentacion.

---

# 18. Resumen final para memorizar

> "La app esta separada por responsabilidades. Las screens manejan la interfaz y los eventos. Los components reutilizan partes visuales como la navegacion inferior y cada pago. Los services encapsulan persistencia local, API, alertas y logica de negocio. AsyncStorage guarda preferencias y pagos como JSON; SQLite maneja la informacion estructurada y el presupuesto; Axios comunica con la API. El tema se comparte mediante Context API. Para comprobar el funcionamiento use Jest en funciones puras y React Native Testing Library en pantallas y componentes, mockeando las dependencias externas."

La idea mas importante es poder seguir el recorrido completo:

```text
Usuario interactua
  -> Screen recibe el evento
  -> Screen valida y actualiza estado
  -> Service persiste o consulta datos
  -> Screen actualiza la UI
  -> Test verifica el resultado visible y las llamadas realizadas
```

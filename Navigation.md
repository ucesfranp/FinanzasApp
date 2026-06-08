# DESARROLLO DE

# APLICACIONES MOVILES I

#### Apuntes de Clase

#### Introducción a React Native

##### Profesor: Lic. Adrian Caceres

### Contenidos de la clase

###### Parte 1 – Setup y Primeros Pasos

- ¿Qué es React Native?
- ¿Qué es Expo?
- Instalación y primer proyecto
- Ejecutar con Expo Go
- Estructura del proyecto
- Hola Mundo – App.js
- JSX
- View, Text, StyleSheet
- Image, Button, TextInput
- Props y useState
- Ejercicios

###### Parte 2 – Componentes y Navegación

- useEffect
- FlatList
- TouchableOpacity y Pressable
- StyleSheet y Flexbox
- React Navigation
- Stack Navigator
- Pasar parámetros entre pantallas
- RN vs Android Nativo
- Ejercicios

## Parte 1

#### Setup y Primeros Pasos

### ¿Qué es React Native?

###### React Native es un framework creado por Facebook (2015) para desarrollar aplicaciones móviles con JavaScript. A

###### diferencia de las apps híbridas (WebView), React Native compila a componentes nativos reales de Android e iOS.

```
Característica Android / Kotlin React Native
```

```
Lenguaje Kotlin JavaScript (con JSX)
```

```
UI Jetpack Compose Componentes RN (View, Text...)
```

```
Plataforma Solo Android Android + iOS + Web
```

```
Compilación Bytecode JVM JS Bridge → nativo
```

```
Herramientas Android Studio VS Code + Expo
```

```
Aprendizaje Moderado Más accesible (ya saben JS)
```

### ¿Qué es Expo?

###### Expo es una plataforma sobre React Native que simplifica el desarrollo. Permite empezar sin configurar Android

###### Studio, emuladores ni SDKs.

```
Expo CLI
```

```
Herramienta de línea de comandos para crear y ejecutar proyectos.
```

```
Expo Go
```

```
App para celular (Android/iOS) que ejecuta tu app escaneando un QR.
```

```
Hot Reload
```

```
Los cambios en el código se ven en el celular al instante, sin recompilar.
```

```
APIs listas
```

```
Cámara, GPS, notificaciones, sensores — sin configuración nativa adicional.
```

```
EAS Build
```

```
Genera los .apk / .ipa listos para publicar cuando estés listo.
```

### Instalación

**1. Verificar Node.js (ya instalado)**

```
node --version # debe ser v18 o superior
npm --version
```

**2. Instalar Expo Go en el celular**

Buscar 'Expo Go' en Google Play (Android) o App Store (iOS) e instalarlo.

**3. Crear el primer proyecto**

```
# Crear el proyecto (no hace falta instalar nada más previamente)
npx create-expo-app MiAppSimple --template blank
```

```
# Entrar al directorio
cd MiAppsimple
npx expo install react-dom react-native-web
# Iniciar el servidor de desarrollo
npx expo start
```

### Ejecutar con Expo Go

Al ejecutar npx expo start aparece esto en la terminal:

```
› Metro waiting on exp://192.168.x.x:
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

```
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
```

**¿Cómo conectarse?**

```
1 El celular y la PC deben estar en la misma red WiFi.
```

```
2 Abrir Expo Go en el celular → 'Scan QR code' → apuntar a la terminal.
```

```
3 La app se carga en segundos. Cualquier cambio en el código se refleja al guardar.
```

```
4 Si hay problemas de red: usar tecla s para cambiar a Tunnel mode.
```

### Estructura del proyecto

Al crear el proyecto con npx create-expo-app, se genera esta estructura:

```
MiPrimeraApp/
├── App.js ← punto de entrada: componente raíz de la app
├── assets/ ← imágenes, íconos, fuentes
│ ├── icon.png
│ └── splash.png
├── node_modules/ ← dependencias instaladas (auto-generado, no tocar)
├── package.json ← lista de dependencias y scripts npm
├── app.json ← configuración de la app (nombre, versión, ícono)
└── babel.config.js ← configuración del compilador JS
```

**Los archivos que vas a editar en clase:**

```
App.js Componente principal. Acá empieza todo.
```

```
package.json Cuando necesités instalar una nueva dependencia (npm install).
```

```
app.json Para cambiar el nombre, ícono o splash screen de la app.
```

### Hola Mundo – App.js

**El App.js generado por Expo:**

```
import { StyleSheet, Text, View }
from 'react-native';
```

```
export default function App() {
return (
<View style={styles.container}>
<Text>Hola Mundo!</Text>
</View>
);
}
```

```
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'center',
},
});
```

```
Comparación con Kotlin/Compose:
```

```
// Kotlin / Jetpack Compose
@Composable
fun HolaMundo() {
Box(
modifier = Modifier.fillMaxSize(),
contentAlignment = Alignment.Center
) {
Text("Hola Mundo!")
}
}
```

```
// Equivalencias:
// View → Box / Column / Row
// Text → Text
// StyleSheet → Modifier
// export default function → @Composable fun
```

### JSX – JavaScript + XML

JSX permite escribir código que parece HTML dentro de JavaScript. React Native lo transforma en llamadas a componentes

nativos.

```
// JSX → parece HTML pero no lo es
function Tarjeta() {
const nombre = 'Ana';
const edad = 25;
```

```
return (
<View style={{ padding: 10 }}>
<Text style={{ fontSize: 18 }}>
Nombre: {nombre} {/* { } para expresiones JS */}
</Text>
<Text>Edad: {edad}</Text>
<Text>Mayor? {edad >= 18? 'Sí' : 'No'}</Text>
</View>
);
}
```

```
// Reglas importantes:
// - Todo debe tener un único elemento raíz (<View> o <>...</>)
// - Los componentes propios van en MAYÚSCULA: <Tarjeta />
// - Los atributos estilo van con camelCase: fontSize (no font-size)
// - Los comentarios van dentro de { /* */ }
```

### Equivalencias rápidas que te van a servir

###### HTML (web) React Native

<div> <View>

<p>, <span>, <h1>...<h6> <Text>

`<img>` `<Image>`

```
<button> <Button> o <Pressable> /
<TouchableOpacity>
```

`<input>` `<TextInput>`

```
<a> <Text onPress={...}> o <Link> (expo-
router)
```

```
Regla de oro en React Native: todo el texto va siempre dentro de un <Text>. Si pontés un string suelto adentro de un <View>, también te
tira error.
```

### Componentes básicos: View, Text, StyleSheet

**View**

```
// View = contenedor (como div en HTML)
// Equivale a Column/Row/Box en Compose
<View style={styles.caja}>
<Text>Contenido</Text>
</View>
```

**Text**

```
// En RN, TODO el texto va dentro de <Text>
// No se puede poner texto suelto como en HTML
<Text style={{ fontSize: 20, color: 'blue' }}>
Hola!
</Text>
```

**StyleSheet**

```
// Definir estilos fuera del componente
const styles = StyleSheet.create({
caja: {
backgroundColor: '#f0f0f0',
padding: 16,
borderRadius: 8,
marginTop: 10,
},
titulo: {
fontSize: 24,
fontWeight: 'bold',
color: '#1B3A6B',
},
});
```

```
// Aplicar: style={styles.titulo}
```

### Componentes básicos: Image, Button, TextInput

```
import { View, Text, Image, Button, TextInput, StyleSheet }
from 'react-native';
```

```
// Image → imagen local o remota
<Image
source={{ uri: 'https://reactnative.dev/img/logo-og.png' }}
style={{ width: 100, height: 100 }}
/>
```

```
// Button → botón básico (limitado en estilo, usar Pressable para más control)
<Button
title='Guardar'
onPress={() => console.log('Botón presionado')}
/>
```

```
// TextInput → campo de texto (como TextField en Compose)
<TextInput
style={styles.input}
placeholder='Escribe aquí...'
value={texto}
onChangeText={(valor) => setTexto(valor)}
/>
```

### Props (propiedades)

Las props son parámetros que se pasan a un componente para personalizarlo. Equivalen a los parámetros de una función

@Composable en Kotlin.

**React Native**

```
// Definir componente con props
function Tarjeta({ nombre, nota }) {
return (
<View style={styles.tarjeta}>
<Text style={styles.titulo}>{nombre}</Text>
<Text>Nota: {nota}</Text>
</View>
);
}
```

```
// Usar el componente pasando props
<Tarjeta nombre='Ana' nota={85} />
<Tarjeta nombre='Luis' nota={70} />
```

```
Kotlin / Jetpack Compose
```

```
// Equivalente en Compose
@Composable
fun Tarjeta(nombre: String,
nota: Int) {
Column {
Text(text = nombre,
style = MaterialTheme
.typography.titleLarge)
Text(text = "Nota: $nota")
}
}
```

```
// Usar:
Tarjeta(nombre = "Ana", nota = 85)
```

### useState – manejo de estado

El estado guarda datos que pueden cambiar y provocan un re-render del componente.

**React Native (useState)**

```
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
```

```
export default function Contador() {
const [cuenta, setCuenta] = useState(0);
```

```
return (
<View>
<Text>Contador: {cuenta}</Text>
<Button
title='Sumar'
onPress={() => setCuenta(cuenta + 1)}
/>
</View>
);
}
```

```
Kotlin / Compose
```

```
@Composable
fun Contador() {
var cuenta by remember {
mutableStateOf(0)
}
```

```
Column {
Text("Contador: $cuenta")
Button(
onClick = { cuenta++ }
) {
Text("Sumar")
}
}
}
```

**useState(valorInicial) devuelve [valorActual, funcionParaCambiar]**

### Ejercicios – Parte 1

###### 1

```
Crear un proyecto con Expo, ejecutarlo y modificar el texto de 'Hola Mundo'.
```

###### 2

```
Crear un componente <Perfil> que reciba como props: nombre, edad y ciudad, y los muestre en pantalla.
```

###### 3

```
Hacer una pantalla con un TextInput y un Text que muestre en tiempo real lo que el usuario escribe (usando useState).
```

###### 4

```
Crear un contador con dos botones: 'Sumar' y 'Restar'. No permitir que el contador baje de 0.
```

###### 5

```
Mostrar una imagen desde una URL remota junto con un título y una descripción usando View, Image y Text.
```

## Parte 2

#### Componentes Avanzados y Navegación

### useEffect – efectos secundarios

Se ejecuta después de que el componente se renderiza. Sirve para cargar datos, suscribirse a eventos, etc.

```
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
```

```
export default function Reloj() {
const [hora, setHora] = useState('');
```

```
// [ ] vacío → se ejecuta solo al montar el componente
useEffect(() => {
const intervalo = setInterval(() => {
setHora(new Date().toLocaleTimeString());
}, 1000);
```

```
// Cleanup: se ejecuta al desmontar el componente
return () => clearInterval(intervalo);
}, []);
```

```
return <Text style={{ fontSize: 36 }}>{hora}</Text>;
}
```

```
// useEffect(() => { ... }, [variable]) → re-corre cuando 'variable' cambia
// useEffect(() => { ... }) → corre en cada render (cuidado!)
```

### FlatList – listas eficientes

FlatList renderiza solo los elementos visibles. Equivale a LazyColumn en Jetpack Compose.

**React Native (FlatList)**

```
import {FlatList,Text,View} from 'react-native';
const alumnos = [
{ id: '1', nombre: 'Ana', nota: 85 },
{ id: '2', nombre: 'Luis', nota: 70 },
{ id: '3', nombre: 'Eva', nota: 92 },
];
export default function Lista() {
return (
<FlatList
data={alumnos}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View>
<Text>{item.nombre}: {item.nota}</Text>
</View>
)}
/>
);
}
```

```
Kotlin / Compose (LazyColumn)
```

```
val alumnos = listOf(
Alumno("1", "Ana", 85),
Alumno("2", "Luis", 70),
)
```

```
@Composable
fun Lista(alumnos: List<Alumno>) {
LazyColumn {
items(alumnos) { alumno ->
Column {
Text(alumno.nombre)
Text("${alumno.nota}")
}
}
}
}
```

### TouchableOpacity y Pressable

Para botones personalizados con estilo propio. Button es básico y poco personalizable.

**TouchableOpacity**

```
import { TouchableOpacity, Text, StyleSheet }
from 'react-native';
```

```
// Reduce la opacidad al presionar
function MiBoton({ titulo, onPress }) {
return (
<TouchableOpacity
style={styles.boton}
onPress={onPress}
>
<Text style={styles.texto}>{titulo}</Text>
</TouchableOpacity>
);
}
```

```
const styles = StyleSheet.create({
boton: { backgroundColor: '#1B3A6B',
padding: 12, borderRadius: 8 },
texto: { color: '#fff', fontWeight: 'bold' },
});
```

```
Pressable (más moderno)
```

```
import { Pressable, Text } from 'react-native';
```

```
// Más flexible: detecta pressed, hovered, focused
<Pressable
onPress={() => console.log('presionado')}
style={({ pressed }) => ({
backgroundColor: pressed
? '#0A2A50'
: '#1B3A6B',
padding: 12,
borderRadius: 8,
})}
>
<Text style={{ color: 'white' }}>
Presioname
</Text>
</Pressable>
```

### StyleSheet y Flexbox

React Native usa Flexbox para el layout (igual que en CSS). Por defecto, flexDirection es 'column'.

**Propiedades de layout más usadas**

```
const styles = StyleSheet.create({
// Equivale a Column en Compose
columna: {
flex: 1,
flexDirection: 'column', // default
justifyContent: 'center', // eje principal
alignItems: 'center', // eje secundario
padding: 16,
},
// Equivale a Row en Compose
fila: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
// Texto
titulo: {
fontSize: 24, fontWeight: 'bold',
color: '#1B3A6B', marginBottom: 8,
},
});
```

```
Equivalencias con Compose
```

```
React Native Jetpack Compose
```

```
flexDirection: 'column' Column { }
```

```
flexDirection: 'row' Row { }
```

```
flex: 1 Modifier.fillMaxSize()
```

```
justifyContent: 'center' verticalArrangement = Center
```

```
alignItems: 'center' horizontalAlignment = Center
```

```
padding: 16 Modifier.padding(16.dp)
```

```
marginTop: 8 Modifier.padding(top=8.dp)
```

### React Navigation – navegación entre pantallas

React Navigation es la librería estándar para navegar entre pantallas en React Native. Equivale a NavHost + NavController

en Jetpack Compose.

**1. Instalación**

```
npm install @react-navigation/native
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

**2. Configuración en App.js**

```
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaHome from './screens/Home';
import PantallaDetalle from './screens/Detalle';
const Stack = createNativeStackNavigator();
export default function App() {
return (
<NavigationContainer>
<Stack.Navigator initialRouteName='Home'>
<Stack.Screen name='Home' component={PantallaHome} />
<Stack.Screen name='Detalle' component={PantallaDetalle} />
</Stack.Navigator>
</NavigationContainer>
);
}
```

### Navegar entre pantallas y pasar parámetros

**Pantalla de origen (Home.js)**

```
function PantallaHome({ navigation }) {
```

```
return (
<View>
<Text>Pantalla Home</Text>
<Button title='Ir a Detalle'
onPress={() => navigation.navigate('Detalle')} />
</View>
```

```
)
}
```

```
Pantalla de destino (Detalle.js)
```

```
function PantallaDetalle() {
return (
<View>
<Text>Detalle</Text>
</View>
);
}
```

**navigation.goBack() → volver a la pantalla anterior**

### React Native vs Android Nativo – ¿cuándo usar cada uno?

```
React Native + Expo Android Nativo (Kotlin)
```

```
Plataforma Android + iOS + Web Solo Android
```

```
Lenguaje JavaScript / TypeScript Kotlin / Java
```

```
Rendimiento Muy bueno (casi nativo) Máximo
```

```
Setup inicial Rápido (solo Node.js) Pesado (Android Studio, SDK)
```

```
Acceso hardware Bueno (con Expo SDK) Completo y directo
```

```
Publicar app Expo EAS Build Android Studio + Google Play
```

```
Cuándo usarlo Proyectos multiplataforma,
startups, prototipos rápidos
```

```
Apps que necesitan máximo
rendimiento o APIs muy específicas
```

**En esta materia usamos React Native con Expo por su simplicidad y porque funciona en Android e iOS.**

### Ejercicios – Parte 2

###### 1

```
Crear una pantalla con un FlatList que muestre una lista de 5 productos con nombre y precio.
```

###### 2

```
Agregar un useEffect que simule la carga de datos: mostrar 'Cargando...' por 2 segundos y luego la lista.
```

###### 3

```
Crear dos pantallas con React Navigation: Home con una lista y Detalle que reciba y muestre los datos de un ítem.
```

###### 4

```
Crear un formulario (nombre + email + botón Enviar) con TextInput y useState. Al presionar Enviar, mostrar los datos en
pantalla.
```

###### 5

```
Crear un componente <Tarjeta> reutilizable con StyleSheet y usarlo 3 veces con diferentes props.
```

### Recursos para practicar

```
Documentación oficial React Native
reactnative.dev/docs/getting-started
```

```
Documentación Expo
docs.expo.dev
```

```
React Navigation
reactnavigation.org/docs/getting-started
```

```
Playground online (Snack)
snack.expo.dev – probar sin instalar nada
```

```
Tutorial interactivo
reactnative.dev/docs/tutorial
```

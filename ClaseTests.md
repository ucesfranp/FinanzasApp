
# Contexto de la Clase: Testing con Jest y React Testing Library en React Native (Expo)

Este documento resume los conceptos teóricos, la sintaxis trabajada, las comparaciones conceptuales y los ejercicios prácticos abordados durante la clase de testing. El objetivo es que utilices este marco conceptual para asistir en el desarrollo, corrección o generación de nuevos tests unitarios y de componentes.

---

## 1. Contenidos Vistos y Reglas Prácticas

### Parte 1: Jest (Unit Testing & Lógica Pura)

* **Definición:** Framework de testing para JavaScript/TypeScript incluido por defecto en Expo. Funciona como el *test runner*. Es el equivalente conceptual a **JUnit** en el ecosistema Android/Kotlin.
* **Cuándo usar Jest solo:** Para funciones puras (utils, formatters), lógica de negocio sin interfaz de usuario (UI), testing de custom hooks y para mockear APIs o módulos externos.
* **Regla de Oro:** **No** usar Jest para probar navegación real entre pantallas ni para testing de apariencia visual estricta (usar snapshots con cautela).

### Parte 2: React Testing Library (RTL - Component Testing)

* **Definición:** Librería para probar componentes de React renderizándolos de la misma forma en que lo haría un usuario real, sin depender de la implementación interna ni acceder al estado. Es el equivalente conceptual a **Espresso** en Android.
* **Cuándo usar RTL:** Para verificar que un componente renderiza correctamente, comprobar el comportamiento al interactuar con elementos (botones, formularios), y validar estados de la UI (`loading`, `error`, `success`).

---

## 2. Equivalencias Conceptuales (Kotlin/JUnit/Espresso vs. JS/Jest/RTL)

Para facilitar la transición y estructuración lógica, se establecieron las siguientes equivalencias directas:

| Concepto / Herramienta         | Entorno Android (Kotlin)          | Entorno React Native (JS/TS)        |
| :----------------------------- | :-------------------------------- | :---------------------------------- |
| **Estructura de Test**   | `class Test` + `@Test`        | `describe()` / `it()`           |
| **Aserciones**           | `assertEquals()`                | `expect().toBe()` / `toEqual()` |
| **Mocks de funciones**   | `@Mock` / Mockito               | `jest.fn()`                       |
| **Mocks de módulos**    | `@MockBean` / mockStatic        | `jest.mock('módulo')`            |
| **Ciclo de vida**        | `@Before` / `@After`          | `beforeEach()` / `afterEach()`  |
| **Lanzar tests**         | `./gradlew test`                | `npx jest` / `npm run test`     |
| **Montar Componente/UI** | `ActivityScenario.launch()`     | `render(<Componente />)`          |
| **Buscar Elemento**      | `onView(withText('...'))`       | `screen.getByText('...')`         |
| **Simular Acción**      | `perform(click())`              | `fireEvent.press(btn)`            |
| **Aserción de UI**      | `check(matches(isDisplayed()))` | `expect(el).toBeTruthy()`         |

---

## 3. Implementación y Aplicación Técnica

### Patrón AAA (Arrange, Act, Assert)

Todos los bloques de prueba deben estructurarse bajo este patrón dentro de funciones lambda sin clases, permitiendo nombres descriptivos con espacios en los métodos `it()` o `test()`:

* **Arrange:** Preparar los datos o el entorno (ej. `const input = 'hola'`).
* **Act:** Ejecutar la función o componente a probar (ej. `const result = procesar(input)`).
* **Assert:** Verificar el resultado esperado (ej. `expect(result).toBe('HOLA')`).

### Matchers Principales en Jest

* **Igualdad:** `toBe()` para igualdad estricta (`===`, misma referencia); `toEqual()` para comparación estructural profunda (obligatorio para objetos y arrays).
* **Veracidad:** `toBeTruthy()`, `toBeFalsy()`, `toBeNull()`, `toBeUndefined()`.
* **Colecciones y Strings:** `toContain()`, `toHaveLength()`.
* **Mocks y Errores:** `toHaveBeenCalled()`, `toHaveBeenCalledWith(arg)`, `toThrow()`.

### Manejo de Mocks

* **`jest.fn()`**: Crea una función simulada (mock) para controlar el comportamiento de callbacks, definir retornos específicos (`mockReturnValue`) o respuestas asíncronas (`mockResolvedValue`).
* **`jest.mock()`**: Reemplaza módulos completos (ej. `AsyncStorage`, `expo-sqlite`, `fetch`). Deben declararse obligatoriamente **al inicio del archivo**, antes del bloque `describe()`.
* **Limpieza:** Se debe incluir `beforeEach(() => jest.clearAllMocks())` para garantizar que los tests sean independientes entre sí.

### Consultas (Queries) y Eventos en RTL

* **Prioridad de Queries:** 1. Por rol semántico: `screen.getByRole('button', { name: 'Guardar' })`
  2. Por texto visible: `screen.getByText('Texto')`
  3. Por placeholder: `screen.getByPlaceholderText('Buscar...')`
  4. Por testID (último recurso): `screen.getByTestId('id')`
* **`getBy*` vs `queryBy*`:** Usar `getBy*` cuando el elemento **debe** existir (lanza excepción si no lo encuentra). Usar `queryBy*` combinado con `.toBeNull()` para verificar que un elemento **no** está renderizado en la pantalla.
* **Testing Asíncrono (`waitFor` / `findBy*`):** Para operaciones que involucran bases de datos o red. `findBy*` funciona como un atajo que combina `waitFor` + `getBy*`. Es obligatorio usar la sintaxis `async/await`.

---

## 4. Ejercicios Brindados como Ejemplo / Práctica

### Ejercicios de la Parte 1 (Jest)

1. **Prueba de Utilidades:** Crear un archivo de pruebas para una función `formatearFecha(fecha: Date): string` utilizando un bloque `describe` y tres casos `it()`.
2. **Filtrado de Colecciones:** Desarrollar un test para la función `filtrarTareas(tareas, completada)` aplicando las aserciones `expect().toHaveLength()` y `toContainEqual()`.
3. **Validación de Callbacks:** Utilizar `jest.fn()` para mockear un callback `onGuardar` y verificar mediante `toHaveBeenCalledWith()` que es invocado con los argumentos correctos.
4. **Mock de Módulos Externos:** Mockear el almacenamiento local `AsyncStorage` con `jest.mock()` y escribir un test para `guardarPrefs()` que verifique que `setItem` se ejecuta con el string JSON adecuado.
5. **Aislamiento de Entorno:** Implementar la limpieza de mocks en un bloque `beforeEach()` y correr la suite con `npx jest` para asegurar la total independencia de los tests.

### Ejercicios de la Parte 2 (React Testing Library)

1. **Renderizado Básico:** Crear la suite para un componente `<TareaItem />`, renderizarlo con datos de prueba simulados y validar su visibilidad con `screen.getByText()`.
2. **Variaciones de Estado en UI:** Probar el comportamiento visual del componente según sus props: verificar que muestra un indicador `'[X]'` cuando `completada: 1` y un indicador `'[ ]'` cuando `completada: 0`.
3. **Simulación de Interacciones:** Simular un click usando `fireEvent.press()` sobre el elemento de check `'[ ]'` y verificar que el callback `onCompletar` se ejecute pasando la tarea correspondiente como parámetro.
4. **Testing de Formularios:** Testear un formulario `<AgregarTareaForm />` simulando la inserción de texto con `fireEvent.changeText()`, presionando el botón de envío `'+'` y comprobando finalmente que el campo de entrada (`input`) quede completamente vacío.
5. **Resolución Asíncrona:** Diseñar un test asíncrono utilizando `findByText()` que simule el comportamiento de una base de datos mockeando la función `getAllAsync`, esperando a que la pantalla `<TareasLocalScreen />` pinte correctamente la lista cargada.

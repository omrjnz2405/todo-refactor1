# ToDo Refactor Starter

Proyecto inicial para **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

La primera prueba está preparada para fallar: es el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: interfaz inicial; en la Misión 9 deberá delegar la lógica a `taskService.js`.
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.

## Misión 0 · Antes de modificar código

Responde aquí:

1. ¿Dónde almacenarías ahora el estado `completada` de una tarea?
Con el modelo actual no existe un lugar natural: un string solo guarda texto. Tendríamos que usar un arreglo paralelo (completadas[i]) o marcar el texto, y ambas opciones son frágiles. El estado debe ser una propiedad de la propia tarea, por lo que la tarea debe convertirse en un objeto: { id, titulo, completada }
2. ¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?
Habría que mantener un arreglo paralelo por cada atributo (prioridades[], fechas[], responsables[]), sincronizados por índice. Al eliminar o reordenar una tarea es fácil que se desalineen y se asigne un dato a la tarea equivocada. Con objetos solo se agrega una propiedad (prioridad: "alta") y el resto de las funciones no necesita enterarse.
3. ¿Qué parte del código representa datos y qué parte representa interfaz?
Datos (dominio)	Interfaz (DOM)
let tareas = [...]	lista.innerHTML = ""
El recorrido for sobre las tareas	lista.innerHTML += \<li>...</li>``
mostrarTareas() mezcla ambas responsabilidades en una sola función, por lo que no se puede probar el recorrido de datos sin tener un DOM con un elemento lista.
4. ¿Qué comportamiento debemos conservar durante el refactor?
Estos comportamientos son la base de las pruebas de regresión:
Al cargar la página se muestran las tareas iniciales ("Revisar requisitos", "Diseñar pruebas", "Refactorizar código") en ese orden.
Cada tarea se muestra como un elemento <li> dentro de la lista.
Al volver a mostrar la lista no se duplican elementos (por eso se limpia con lista.innerHTML = "" antes de recorrer).
El orden de las tareas se respeta: la primera aparece primero.


## Registro RED → GREEN → REFACTOR

Documenta al menos una iteración:

### Iteración documentada: Misión 6 (`cambiarEstado`)

* **RED: ¿qué prueba escribiste y por qué falló?**  
  Escribimos tres pruebas unitarias en `tests/taskService.test.js` bajo el patrón Arrange-Act-Assert: una para alternar el valor booleano de `completada` de una tarea específica, otra para asegurar que no se alteraran las demás tareas de la colección, y una tercera para verificar que un `id` inexistente devolviera la lista intacta[cite: 8, 10]. La suite falló en Vitest (`3 failed`) porque la función `cambiarEstado` aún no estaba implementada en el módulo de dominio y devolvía un error de stub pendiente[cite: 9, 10].

* **GREEN: ¿cuál fue el cambio mínimo que la hizo pasar?**  
  En `src/taskService.js`, implementamos `cambiarEstado(tareas, id)` utilizando el método inmutable `.map()` junto con un operador ternario y el operador spread (`{ ...tarea, completada: !tarea.completada }`)[cite: 10]. Esto genera y retorna una nueva colección donde solo el elemento coincidente actualiza su estado, pasando inmediatamente las 3 pruebas a verde (`passed`)[cite: 9, 10].

* **REFACTOR: ¿qué mejoraste sin cambiar el comportamiento?**  
  Se verificó la inmutabilidad estricta para evitar efectos secundarios sobre el arreglo original recibido[cite: 8, 10]. Además, se limpió la estructura sintáctica de la función flecha dentro de `.map()` para maximizar su legibilidad declarativa, asegurando que los nombres de los parámetros expresen con claridad la intención del dominio antes de integrarla con la interfaz[cite: 8, 10].

## Pair Programming

Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.

| Misión | Driver | Navigator | 
|---|---|---|
| 0. Comprender antes de cambiar | Omar | Natalia |
| 1. Cambiar el modelo | Natalia | Omar | 
| 2. crearTarea + primera prueba | Omar | Natalia |
| 3. agregarTarea sin acoplarse al DOM | Natalia | Omar |
| 4. buscarTarea | Omar | Natalia |
| 5. filter: seleccionar subconjuntos | Natalia | Omar |
| 6. cambiar estado | Omar | Natalia |
| 7. Eliminar y probar casos frontera | Natalia | Omar |
| 8. implementar obtenerResumen con composicion | Omar | Natalia |
| 9. Integrar con la interfaz | Natalia | Omar |


## Reflexión final de pareja

El desarrollo de esta práctica transformó por completo nuestra comprensión sobre la calidad del software. El cambio arquitectónico que aportó mayor mantenibilidad fue aislar la lógica de dominio en funciones puras dentro de `taskService.js`, desacoplándola de la manipulación directa del DOM. Evolucionar el modelo de simples cadenas hacia objetos con identidad y aplicar métodos declarativos e inmutables evitó efectos secundarios y simplificó la extensión de nuevos requisitos.

Por otra parte, la prueba que nos brindó mayor confianza fue la verificación de inmutabilidad estricta en `cambiarEstado`, asegurando que no se mutara la referencia del objeto original mediante el operador spread. Esta prueba garantizó que futuras refactorizaciones no introduzcan fallos silenciosos en la colección.

La dinámica de Pair Programming bajo el esquema Driver y Navigator resultó determinante para el éxito del proyecto. Mientras el Driver se concentraba en la implementación sintáctica y en hacer pasar las pruebas en verde, el Navigator cuestionaba decisiones de diseño, detectaba casos frontera y anticipaba escenarios antes de escribir el código de producción. Trabajar con Git mediante ramas por misión, resolución controlada de conflictos e integración continua demostró que construir software mantenible no consiste únicamente en hacer que funcione, sino en diseñar con estructura, pruebas automatizadas y disciplina colaborativa.

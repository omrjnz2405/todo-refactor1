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
Con el modelo actual no existe un lugar natural: un string solo guarda texto. Tendríamos que usar un arreglo paralelo (completadas[i]) o marcar el texto (por ejemplo, anteponer "✔"), y ambas opciones son frágiles. El estado debe ser una propiedad de la propia tarea, por lo que la tarea debe convertirse en un objeto: { id, titulo, completada }
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

- **RED:** ¿qué prueba escribiste y por qué falló?
- **GREEN:** ¿cuál fue el cambio mínimo que la hizo pasar?
- **REFACTOR:** ¿qué mejoraste sin cambiar el comportamiento?

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
# ToDo Refactor Starter

Integrantes: Natalia Jaquelin Sánchez Morales · Omar Velazquez Jinez
Docente: José Guillermo Fierro Mendoza
Agosto – Diciembre 2026

## Inicio

bash
npm install
npm test


Durante el desarrollo:

bash
npm run test:watch


Para ver la aplicación, abrir index.html con Live Server. Usa módulos ES, por lo que no funciona abriendo el archivo directamente.

## Estructura

- src/legacy.js: código funcional original, conservado como punto de comparación.
- src/taskService.js: lógica de dominio. Funciones puras que reciben datos y devuelven datos nuevos, sin acceder al DOM.
- src/app.js: adaptador de interfaz. Lee eventos, delega las reglas al servicio y renderiza el resultado.
- tests/taskService.test.js: suite de 33 pruebas unitarias con Vitest.

## Misión 0 · Antes de modificar código

*1. ¿Dónde almacenarías ahora el estado completada de una tarea?*
Con el modelo original no existe un lugar natural: un string sólo guarda texto. Tendríamos que usar un arreglo paralelo (completadas[i]) o marcar el propio texto, y ambas opciones son frágiles. El estado debe ser una propiedad de la tarea, por lo que la tarea debe convertirse en un objeto: { id, titulo, completada }.

*2. ¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?*
Habría que mantener un arreglo paralelo por cada atributo (prioridades[], fechas[], responsables[]), sincronizados por índice. Al eliminar o reordenar una tarea es fácil que se desalineen y se asigne un dato a la tarea equivocada. Con objetos sólo se agrega una propiedad y el resto de las funciones no necesita enterarse.

*3. ¿Qué parte del código representa datos y qué parte representa interfaz?*

| Datos (dominio) | Interfaz (DOM) |
|---|---|
| let tareas = [...] | lista.innerHTML = "" |
| El recorrido for sobre las tareas | lista.innerHTML += "<li>...</li>" |

En legacy.js, mostrarTareas() mezcla ambas responsabilidades en una sola función, por lo que no se puede probar el recorrido de datos sin tener un DOM con un elemento lista.

*4. ¿Qué comportamiento debemos conservar durante el refactor?*
Estos comportamientos son la base de las pruebas de regresión:

1. Al cargar la página se muestran las tareas iniciales ("Revisar requisitos", "Diseñar pruebas", "Refactorizar código") en ese orden.
2. Cada tarea se muestra como un elemento de la lista.
3. Al volver a renderizar no se duplican elementos.
4. El orden de las tareas se respeta: la primera aparece primero.

## Registro RED → GREEN → REFACTOR

### Iteración documentada: Misión 6 · cambiarEstado

*RED.* Escribimos las pruebas en tests/taskService.test.js bajo el patrón Arrange–Act–Assert: alternar el valor de completada de una tarea específica, comprobar que no se alteraran las demás tareas de la colección y verificar que un id inexistente devolviera la lista intacta. La suite falló en Vitest porque cambiarEstado aún no estaba implementada y lanzaba el error de la función pendiente.

*GREEN.* En src/taskService.js implementamos cambiarEstado(tareas, id) con map(), un operador ternario y el operador spread: { ...tarea, completada: !tarea.completada }. Esto devuelve una colección nueva donde sólo el elemento coincidente actualiza su estado, y las pruebas pasaron a verde.

*REFACTOR.* Durante la revisión del pull request se detectó que las tres pruebas pasarían igual si el spread se sustituyera por una mutación directa (tarea.completada = !tarea.completada), es decir, no protegían lo central de la misión. Se agregó una cuarta prueba que verifica que el objeto original no se modifique. Esa prueba es la que da confianza de que futuros refactores no introduzcan mutaciones silenciosas.

### Otras iteraciones

Cada misión siguió el mismo ciclo, con un commit separado para RED y otro para GREEN. El historial de Git conserva ambos pasos por misión, incluida la Misión 11, donde las 5 pruebas de buscarPorTexto fallaron con buscarPorTexto is not a function antes de implementar la función.

## Decisiones de refactor

| Decisión | Justificación |
|---|---|
| Tarea como objeto { id, titulo, completada } | Un string no puede guardar estado ni identidad. Con objetos se agregan propiedades sin mantener arrays paralelos sincronizados por índice. |
| Funciones puras en taskService.js: reciben datos y devuelven datos nuevos | Se prueban sin navegador y sin efectos secundarios, así que las pruebas son deterministas. |
| agregarTarea con spread [...tareas, nueva] | No muta el array recibido. Hay una prueba que lo verifica. |
| buscarTarea con find() | La intención es "encontrar uno". Devuelve undefined si no existe, no un array. |
| obtenerPendientes / obtenerTerminadas con filter() | Seleccionan un subconjunto sin transformar los elementos. Sin coincidencias devuelven []. |
| cambiarEstado con map() + { ...tarea } | map() produce una colección del mismo tamaño y el spread crea un objeto nuevo sólo para la tarea cambiada, sin tocar la original. |
| eliminarTarea con filter() | Eliminar se expresa como "conservar todos excepto el id". map() no cambia el tamaño y find() devuelve un solo elemento, así que ninguno comunica la intención. |
| obtenerResumen reutiliza obtenerPendientes y obtenerTerminadas | No duplica la condición completada y comunica mejor la intención. Recorre la lista dos veces, pero con pocas tareas el costo es irrelevante frente a la mantenibilidad. |
| Misión 10: mover el if/if de filtros a filtrarTareas(tareas, filtro) | Elegir qué tareas mostrar es una regla de dominio, no de interfaz. Al moverla al servicio quedó cubierta por pruebas. |
| Misión 10: mover el cálculo del id a siguienteId(tareas) | Estaba dentro del evento submit, mezclado con la interfaz. Ahora es una función probada, incluido el caso de colección vacía. |
| Misión 10: render con createElement y textContent en vez de innerHTML | Corrige un fallo real de interpretación de HTML en los títulos y separa el armado del DOM del contenido. |
| Misión 11: la búsqueda se compone con el filtro, buscarPorTexto(filtrarTareas(...)) | Dos reglas independientes y probadas por separado se combinan sin modificar ninguna de las dos. |

## Casos de prueba

| Función | Casos | Pruebas |
|---|---|---|
| crearTarea | Crea tarea pendiente con id y título | 1 |
| agregarTarea | Agrega al final; un elemento más; no muta el original; colección vacía | 4 |
| buscarTarea | Id existente; id inexistente devuelve undefined | 2 |
| obtenerPendientes / obtenerTerminadas | Colección mixta; sin coincidencias devuelve []; colección vacía; no altera la original | 4 |
| cambiarEstado | Cambia la tarea indicada; no altera otra tarea; id inexistente conserva el contenido; no muta el objeto original | 4 |
| eliminarTarea | Elimina existente conservando el orden; id inexistente; colección vacía; no muta el original | 4 |
| obtenerResumen | Lista mixta; lista vacía en ceros; todas terminadas | 3 |
| filtrarTareas | todas; pendientes; terminadas; filtro desconocido devuelve todas | 4 |
| siguienteId | Id mayor + 1; colección vacía empieza en 1 | 2 |
| buscarPorTexto | Contiene el texto; ignora mayúsculas; ignora espacios; texto vacío devuelve todas; sin coincidencias devuelve [] | 5 |
| *Total* | | *33* |

Respuestas a las preguntas del caso de estudio:

- *Misión 3:* si agregarTarea modificara el array recibido, la prueba "no modifica el array original" lo detecta, porque después de llamarla el array original debe conservar su longitud.
- *Misión 5:* cuando no hay coincidencias, filter() devuelve un array vacío [], nunca undefined. Hay una prueba que lo comprueba.
- *Misión 7:* filter() es el método que mejor expresa eliminar, porque la operación es "conservar todos excepto el id indicado".

## Extensión elegida (Misión 11): opción B · Buscar por texto

- *Decisión de diseño:* la búsqueda ignora mayúsculas y minúsculas y los espacios al inicio y al final del texto. Un texto vacío muestra todas las tareas.
- Se escribieron primero las 5 pruebas, que fallaron con buscarPorTexto is not a function, y después la función.
- *¿El refactor facilitó el cambio?* Sí. Sólo hubo que agregar una función al dominio, un <input> al HTML y una línea en render(). No se modificó ninguna función existente ni ninguna prueba anterior, y la búsqueda se compone con el filtro ya probado. Ese es el indicio de que las responsabilidades quedaron bien separadas.

## Pruebas de integración manual

| Escenario | Acción | Resultado esperado | Resultado observado |
|---|---|---|---|
| Alta válida | Escribir un título y Agregar | Aparece una tarea pendiente nueva y cambia el resumen | Correcto |
| Alta inválida | Enviar el título vacío | No se agrega y se muestra un mensaje | Correcto: "Escribe un título antes de agregar." |
| Cambio de estado | Marcar una tarea | Cambia el estilo y los contadores | Correcto: se tacha y bajan los pendientes |
| Filtro | Elegir Pendientes | Sólo se muestran las pendientes | Correcto |
| Eliminar | Eliminar una tarea | Desaparece y se actualiza el resumen | Correcto |
| Búsqueda | Escribir "pruebas" | Sólo las tareas que contienen ese texto, sin importar mayúsculas | Correcto |

*Fallo encontrado durante el refactor:* entrada <b>hola</b> como título → resultado observado: se mostraba en negritas, porque el render usaba innerHTML → resultado esperado: el texto literal → corrección: armar el elemento con createElement y asignar el título con textContent (Misión 10).

## Pair Programming

Trabajamos con el esquema Driver y Navigator, intercambiando roles en cada misión. No se hizo commit hasta que ambos pudieran explicar el código y la prueba. El historial tiene una rama y un pull request por misión, revisado por quien no fue Driver.

| Misión | Driver | Navigator |
|---|---|---|
| 0. Comprender antes de cambiar | Omar | Natalia |
| 1. Cambiar el modelo: de string a objeto | Natalia | Omar |
| 2. crearTarea + primera prueba | Omar | Natalia |
| 3. agregarTarea sin acoplarse al DOM | Natalia | Omar |
| 4. buscarTarea con find() | Omar | Natalia |
| 5. filter: seleccionar subconjuntos | Natalia | Omar |
| 6. cambiarEstado con map() + spread | Omar | Natalia |
| 7. Eliminar y probar casos frontera | Natalia | Omar |
| 8. obtenerResumen con composición | Omar | Natalia |
| 9. Integrar con la interfaz | Natalia | Omar |
| 10. Refactor final protegido por pruebas | Omar | Natalia |
| 11. Nuevo requerimiento: buscar por texto | Natalia | Omar |

## Evidencia

En la carpeta evidencia/:

- Suite completa en verde (33 passed).
- Estado RED de la Misión 11: 5 pruebas fallando antes de implementar buscarPorTexto.
- Aplicación funcionando, con la búsqueda filtrando por texto.

## Reflexión final de pareja

El desarrollo de esta práctica transformó por completo nuestra comprensión sobre la calidad del software. El cambio arquitectónico que aportó mayor mantenibilidad fue aislar la lógica de dominio en funciones puras dentro de taskService.js, desacoplándola de la manipulación directa del DOM. Evolucionar el modelo de simples cadenas hacia objetos con identidad y aplicar métodos declarativos e inmutables evitó efectos secundarios y simplificó la extensión de nuevos requisitos. La Misión 11 lo confirmó: agregar la búsqueda por texto no obligó a modificar ninguna función ni prueba existente.

Por otra parte, la prueba que nos brindó mayor confianza fue la verificación de inmutabilidad estricta en cambiarEstado, asegurando que no se mutara la referencia del objeto original mediante el operador spread. Esa prueba no estaba en la primera versión: surgió de la revisión del pull request, cuando el Navigator notó que las pruebas existentes pasarían igual con una mutación directa. Garantiza que futuras refactorizaciones no introduzcan fallos silenciosos en la colección.

La dinámica de Pair Programming bajo el esquema Driver y Navigator resultó determinante. Mientras el Driver se concentraba en la implementación y en hacer pasar las pruebas en verde, el Navigator cuestionaba decisiones de diseño, detectaba casos frontera y proponía casos de prueba antes de escribir el código de producción. Trabajar con Git mediante ramas por misión, revisión cruzada de pull requests e integración continua demostró que construir software mantenible no consiste únicamente en hacer que funcione, sino en diseñar con estructura, pruebas automatizadas y disciplina colaborativa.

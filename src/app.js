/*
 * MISIÓN 11 · ADAPTADOR DE INTERFAZ CON BÚSQUEDA
 *
 * El DOM ya no contiene reglas de negocio. Sólo lee eventos, delega en
 * taskService.js y renderiza el resultado:
 *
 * evento → app.js → taskService.js → nuevo estado → render() → DOM
 */
import {
  crearTarea,
  agregarTarea,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen,
  filtrarTareas,
  siguienteId,
  buscarPorTexto
} from "./taskService.js";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const search = document.querySelector("#search-input");
const filters = [...document.querySelectorAll("[data-filter]")];

let tareas = [
  crearTarea(1, "Revisar requisitos"),
  crearTarea(2, "Diseñar pruebas"),
  crearTarea(3, "Refactorizar código")
];
let filtro = "todas";
let busqueda = "";

function render() {
  // Las dos reglas se componen: primero filtra por estado, luego por texto
  const visibles = buscarPorTexto(filtrarTareas(tareas, filtro), busqueda);

  list.innerHTML = "";

  // Renderizado seguro con createElement y textContent (soluciona inyección de HTML en títulos)
  visibles.forEach(tarea => {
    const li = document.createElement("li");
    li.className = tarea.completada ? "task done" : "task";

    // Contenedor principal de la tarea
    const spanMain = document.createElement("span");
    spanMain.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.toggle = tarea.id;
    checkbox.checked = tarea.completada;

    const spanTitle = document.createElement("span");
    spanTitle.className = "title";
    spanTitle.textContent = tarea.titulo; // Seguro: no interpreta etiquetas HTML como <b>

    spanMain.appendChild(checkbox);
    spanMain.appendChild(spanTitle);

    // Acciones de la tarea
    const spanActions = document.createElement("span");
    spanActions.className = "task-actions";

    const btnDelete = document.createElement("button");
    btnDelete.dataset.delete = tarea.id;
    btnDelete.textContent = "Eliminar";

    spanActions.appendChild(btnDelete);

    li.appendChild(spanMain);
    li.appendChild(spanActions);
    list.appendChild(li);
  });

  const resumen = obtenerResumen(tareas);
  summary.textContent = `Total: ${resumen.total} · Pendientes: ${resumen.pendientes} · Terminadas: ${resumen.terminadas}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }

  // Delegar la generación de identificador a taskService.js
  const id = siguienteId(tareas);
  tareas = agregarTarea(tareas, crearTarea(id, titulo));
  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const idToggle = event.target.dataset.toggle;
  const idEliminar = event.target.dataset.delete;
  if (idToggle !== undefined) tareas = cambiarEstado(tareas, Number(idToggle));
  if (idEliminar !== undefined) tareas = eliminarTarea(tareas, Number(idEliminar));
  render();
});

filters.forEach(button => button.addEventListener("click", () => {
  filtro = button.dataset.filter;
  filters.forEach(b => b.classList.toggle("active", b === button));
  message.textContent = "";
  render();
}));

search.addEventListener("input", () => {
  busqueda = search.value;
  render();
});

render();
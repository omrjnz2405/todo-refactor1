/*
 * MISIÓN 1 · MODELO DE TAREA COMO OBJETO
 *
 * Una tarea deja de ser un string: ahora es un objeto con identidad (id) y
 * estado (completada). Esto permite agregar propiedades más adelante sin
 * arrays paralelos. La separación del DOM llega hasta la Misión 9.
 */

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

let tareas = [
  { id: 1, titulo: "Revisar requisitos", completada: false },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];
let filtro = "todas";

function render() {
  list.innerHTML = "";
  tareas.forEach(tarea => {
    const li = document.createElement("li");
    li.className = "task";
    li.innerHTML = `<span class="title">${tarea.titulo}</span>
      <span class="task-actions"><button data-delete="${tarea.id}">Eliminar</button></span>`;
    list.appendChild(li);
  });
  summary.textContent = `Total: ${tareas.length}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  const id = tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1;
  tareas.push({ id, titulo, completada: false }); // aún mutable: se refactoriza en la Misión 9
  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const id = event.target.dataset.delete;
  if (id === undefined) return;
  tareas = tareas.filter(t => t.id !== Number(id)); // ahora se elimina por id, no por posición
  render();
});

filters.forEach(button => button.addEventListener("click", () => {
  filtro = button.dataset.filter;
  filters.forEach(b => b.classList.toggle("active", b === button));
  message.textContent = `Filtro '${filtro}' pendiente de integrar durante el refactor.`;
}));

render();
/*
 * TODO REFACTOR LAB · LÓGICA DE DOMINIO
 *
 * Completa estas funciones misión por misión. Favorece funciones que reciben
 * datos y devuelven datos, sin acceder al DOM. Ejecuta la suite después de
 * cada cambio.
 */

// MISIÓN 2
export function crearTarea(id, titulo) {
  return { id, titulo, completada: false };
}

// MISIÓN 3
export function agregarTarea(tareas, nuevaTarea) {
  return [...tareas, nuevaTarea];
}

// MISIÓN 4
export function buscarTarea(tareas, id) {
  return tareas.find(t => t.id === id);
}

// MISIÓN 5
export function obtenerPendientes(tareas) {
  return tareas.filter(t => !t.completada);
}

export function obtenerTerminadas(tareas) {
  return tareas.filter(t => t.completada);
}

// MISIÓN 6
export function cambiarEstado(tareas, id) {
  return tareas.map(tarea =>
    tarea.id === id
      ? { ...tarea, completada: !tarea.completada }
      : tarea
  );
}

// MISIÓN 7
export function eliminarTarea(tareas, id) {
  return tareas.filter(t => t.id !== id);
}

// MISIÓN 8
export function obtenerResumen(tareas) {
  const pendientes = obtenerPendientes(tareas).length;
  const terminadas = obtenerTerminadas(tareas).length;

  return {
    total: tareas.length,
    pendientes,
    terminadas
  };
}

// MISIÓN 10 (Refactor de Dominio)
export function filtrarTareas(tareas, filtro) {
  if (filtro === "pendientes") {
    return obtenerPendientes(tareas);
  }
  if (filtro === "terminadas") {
    return obtenerTerminadas(tareas);
  }
  return tareas;
}

export function siguienteId(tareas) {
  if (!tareas || tareas.length === 0) {
    return 1;
  }
  return Math.max(...tareas.map(t => t.id)) + 1;
}
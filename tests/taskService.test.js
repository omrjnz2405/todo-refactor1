import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen
} from "../src/taskService.js";


/*
 * TODO REFACTOR LAB · SUITE STARTER
 *
 * Activa/crea pruebas misión por misión. No escribas todas las soluciones de
 * una vez. Para cada comportamiento sigue RED → GREEN → REFACTOR.
 */

describe("crearTarea", () => {
  it("crea una tarea pendiente con id y título", () => {
    // Arrange
    const id = 10;
    const titulo = "Diseñar pruebas";

    // Act
    const tarea = crearTarea(id, titulo);

    // Assert
    expect(tarea).toEqual({ 
      id: 10, 
      titulo: "Diseñar pruebas", 
      completada: false });
  });
});
describe("agregarTarea", () => {
  it("devuelve una colección que incluye la nueva tarea al final", () => {
    // Arrange
    const tareas = [crearTarea(1, "Revisar requisitos")];
    const nueva = crearTarea(2, "Diseñar pruebas");

    // Act
    const resultado = agregarTarea(tareas, nueva);

    // Assert
    expect(resultado.at(-1)).toEqual(nueva);
  });

  it("el resultado contiene exactamente un elemento más", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    const resultado = agregarTarea(tareas, crearTarea(3, "C"));

    expect(resultado).toHaveLength(tareas.length + 1);
  });

  it("no modifica el array original", () => {
    const tareas = [crearTarea(1, "A")];

    agregarTarea(tareas, crearTarea(2, "B"));

    expect(tareas).toHaveLength(1);
  });

  it("funciona con una colección vacía", () => {
    const resultado = agregarTarea([], crearTarea(1, "A"));

    expect(resultado).toEqual([{ id: 1, titulo: "A", completada: false }]);
  });
});


describe("buscarTarea", () => {
  it("encuentra y retorna la tarea cuando el id existe", () => {
   
    const tareas = [
      { id: 1, titulo: "Revisar requisitos", completada: false },
      { id: 2, titulo: "Diseñar pruebas", completada: true }
    ];
    const idBuscado = 2;

    
    const resultado = buscarTarea(tareas, idBuscado);

   
    expect(resultado).toEqual({
      id: 2,
      titulo: "Diseñar pruebas",
      completada: true
    });
  });

  it("retorna undefined cuando el id no existe en la colección", () => {
    
    const tareas = [{ id: 1, titulo: "Revisar requisitos", completada: false }];

    const resultado = buscarTarea(tareas, 99);

    expect(resultado).toBeUndefined();
  });
});
describe("obtenerPendientes / obtenerTerminadas", () => {
  const mixta = [
    { id: 1, titulo: "A", completada: false },
    { id: 2, titulo: "B", completada: true },
    { id: 3, titulo: "C", completada: false }
  ];

  it("colección mixta: separa pendientes y terminadas", () => {
    // Arrange y Act
    const pendientes = obtenerPendientes(mixta);
    const terminadas = obtenerTerminadas(mixta);

    // Assert
    expect(pendientes.map(t => t.id)).toEqual([1, 3]);
    expect(terminadas.map(t => t.id)).toEqual([2]);
  });

  it("sin coincidencias devuelve un array vacío, no undefined", () => {
    const todasTerminadas = [{ id: 1, titulo: "A", completada: true }];

    expect(obtenerPendientes(todasTerminadas)).toEqual([]);
  });

  it("colección vacía devuelve un array vacío", () => {
    expect(obtenerPendientes([])).toEqual([]);
    expect(obtenerTerminadas([])).toEqual([]);
  });

  it("no altera la colección original", () => {
    const copia = structuredClone(mixta);

    obtenerPendientes(mixta);
    obtenerTerminadas(mixta);

    expect(mixta).toEqual(copia);
  });
});
// MISIÓN 3: agrega al menos dos pruebas para agregarTarea().
// MISIÓN 4: prueba id existente e inexistente para buscarTarea().
// MISIÓN 5: prueba colección mixta, sin coincidencias y vacía.
// MISIÓN 6: prueba cambio correcto, otra tarea intacta e id inexistente.
// MISIÓN 7: prueba eliminar existente, inexistente y colección vacía.
// MISIÓN 8: prueba obtenerResumen(), incluyendo colección vacía.

// Los imports anteriores quedan preparados para que construyas la suite de forma incremental.
void buscarTarea;
void cambiarEstado;
void eliminarTarea;
void obtenerResumen;



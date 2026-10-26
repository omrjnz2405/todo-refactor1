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

describe("cambiarEstado", () => {
  it("alterna el estado 'completada' de la tarea indicada", () => {
    
    const tareas = [
      { id: 1, titulo: "Tarea 1", completada: false },
      { id: 2, titulo: "Tarea 2", completada: false }
    ];

    
    const resultado = cambiarEstado(tareas, 1);

  
    expect(resultado[0].completada).toBe(true);
  });

  it("no altera el estado ni datos de las otras tareas", () => {
  
    const tareas = [
      { id: 1, titulo: "Tarea 1", completada: false },
      { id: 2, titulo: "Tarea 2", completada: false }
    ];

   
    const resultado = cambiarEstado(tareas, 1);

   
    expect(resultado[1]).toEqual({ id: 2, titulo: "Tarea 2", completada: false });
  });

  it("conserva la colección intacta si el id no existe", () => {
   
    const tareas = [{ id: 1, titulo: "Tarea 1", completada: false }];

  
    const resultado = cambiarEstado(tareas, 999);

    expect(resultado).toEqual(tareas);
  });

  it("no muta el objeto original", () => {
   
    const original = { id: 1, titulo: "Tarea 1", completada: false };

   
    cambiarEstado([original], 1);

    expect(original.completada).toBe(false);
  });
});
describe("eliminarTarea", () => {
  it("elimina la tarea con un id existente y conserva el orden", () => {
    // Arrange
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B"), crearTarea(3, "C")];

    // Act
    const resultado = eliminarTarea(tareas, 2);

    // Assert
    expect(resultado.map(t => t.id)).toEqual([1, 3]);
  });

  it("un id inexistente no elimina nada", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    expect(eliminarTarea(tareas, 99)).toEqual(tareas);
  });

  it("colección vacía devuelve un array vacío", () => {
    expect(eliminarTarea([], 1)).toEqual([]);
  });

  it("no modifica el array original", () => {
    const tareas = [crearTarea(1, "A")];

    eliminarTarea(tareas, 1);

    expect(tareas).toHaveLength(1);
  });
});


describe("obtenerResumen", () => {
  it("calcula correctamente el total, pendientes y terminadas en una lista mixta", () => {
    const tareas = [
      { id: 1, titulo: "Tarea 1", completada: false },
      { id: 2, titulo: "Tarea 2", completada: true },
      { id: 3, titulo: "Tarea 3", completada: false }
    ];

    const resumen = obtenerResumen(tareas);

    expect(resumen).toEqual({
      total: 3,
      pendientes: 2,
      terminadas: 1
    });
  });

  it("maneja una lista vacía retornando ceros (caso frontera)", () => {
    const tareas = [];

    const resumen = obtenerResumen(tareas);

    expect(resumen).toEqual({
      total: 0,
      pendientes: 0,
      terminadas: 0
    });
  });

  it("calcula adecuadamente cuando todas las tareas están terminadas", () => {
    const tareas = [
      { id: 1, titulo: "Tarea 1", completada: true },
      { id: 2, titulo: "Tarea 2", completada: true }
    ];

    const resumen = obtenerResumen(tareas);

      expect(resumen).toEqual({
      total: 2,
      pendientes: 0,
      terminadas: 2
    });
  });
});




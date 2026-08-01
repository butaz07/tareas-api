const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../data/db.json');

function leerTareas() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

function guardarTareas(tareas) {
  fs.writeFileSync(dbPath, JSON.stringify(tareas, null, 2));
}

// Crear tarea
router.post('/', (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const tareas = leerTareas();
  const nuevaTarea = {
    id: Date.now(),
    titulo,
    descripcion: descripcion || '',
    completada: false,
    fechaCreacion: new Date().toLocaleDateString('es-ES')
  };

  tareas.push(nuevaTarea);
  guardarTareas(tareas);

  res.status(201).json(nuevaTarea);
});

// Listar todas las tareas
router.get('/', (req, res) => {
  const tareas = leerTareas();
  res.json(tareas);
});

// Obtener una tarea por id
router.get('/:id', (req, res) => {
  const tareas = leerTareas();
  const tarea = tareas.find(t => t.id === Number(req.params.id));

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.json(tarea);
});

// Actualizar tarea
router.put('/:id', (req, res) => {
  const tareas = leerTareas();
  const index = tareas.findIndex(t => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { titulo, descripcion, completada } = req.body;
  tareas[index] = {
    ...tareas[index],
    titulo: titulo ?? tareas[index].titulo,
    descripcion: descripcion ?? tareas[index].descripcion,
    completada: completada ?? tareas[index].completada
  };

  guardarTareas(tareas);
  res.json(tareas[index]);
});

// Eliminar tarea
router.delete('/:id', (req, res) => {
  const tareas = leerTareas();
  const index = tareas.findIndex(t => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const eliminada = tareas.splice(index, 1);
  guardarTareas(tareas);

  res.json({ mensaje: 'Tarea eliminada', tarea: eliminada[0] });
});

module.exports = router;

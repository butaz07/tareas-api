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
    fechaCreacion: new Date().toISOString()
  };

  tareas.push(nuevaTarea);
  guardarTareas(tareas);

  res.status(201).json(nuevaTarea);
});

module.exports = router;

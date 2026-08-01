const express = require('express');
const tareasRouter = require('./routes/tareas');

const app = express();
app.use(express.json());
app.use('/tareas', tareasRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

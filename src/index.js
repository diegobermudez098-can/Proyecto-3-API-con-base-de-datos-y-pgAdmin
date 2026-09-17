const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Configuración de la conexión a PostgreSQL usando las variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'sena_db',
  port: process.env.DB_PORT || 5432,
});

// Ruta de prueba inicial / salud
app.get('/', (req, res) => {
  res.json({ message: 'API REST funcionando correctamente con Docker y PostgreSQL' });
});

// ==========================================
// CRUD DE USUARIOS
// ==========================================

// 1. GET: Obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor al consultar los usuarios' });
  }
});

// 2. GET: Obtener un usuario por ID (Manejo de error 404 si no existe)
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 3. POST: Crear un nuevo usuario (Manejo de error 400 por datos incompletos o inválidos)
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  // Validación básica (Error 400)
  if (!name || !email) {
    return res.status(400).json({ error: 'Los campos "name" y "email" son obligatorios' });
  }

  // Validación sencilla de formato de correo
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'El formato del correo electrónico no es válido' });
  }

  try {
    const newušer = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(newušer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al registrar el usuario en la base de datos' });
  }
});

// 4. PUT: Actualizar un usuario existente
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Los campos "name" y "email" son obligatorios para actualizar' });
  }

  try {
    const updateResult = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: `No se pudo actualizar, usuario con ID ${id} no encontrado` });
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor al actualizar' });
  }
});

// 5. DELETE: Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: `No se pudo eliminar, usuario con ID ${id} no encontrado` });
    }

    res.json({ message: `Usuario con ID ${id} eliminado correctamente`, user: deleteResult.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor al eliminar' });
  }
});

// Puerto de ejecución del servidor interno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const { Pool } = require("pg");
require("dotenv").config();

// Un "Pool" es un conjunto de conexiones reutilizables a la base de datos,
// en vez de abrir y cerrar una conexión nueva cada vez (más eficiente).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
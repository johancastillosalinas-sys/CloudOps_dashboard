const express = require("express");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware); // TODAS las rutas de este archivo requieren estar autenticado

// Convierte una fila de la base de datos al formato que ya usa tu frontend
function mapCosto(row) {
  return {
    id: String(row.id),
    servicio: row.servicio,
    cantidad: row.cantidad,
    horasEstimadas: row.horas_estimadas,
    costoUnitario: Number(row.costo_unitario),
    costoEstimado: Number(row.costo_mensual),
    costoMensual: Number(row.costo_mensual),
    costoAnual: Number(row.costo_anual),
  };
}

// GET /api/costos — lista solo los costos del usuario autenticado
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM costos WHERE usuario_id = $1 ORDER BY creado_en DESC",
      [req.usuario.id]
    );
    res.json(resultado.rows.map(mapCosto));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los costos." });
  }
});

// POST /api/costos — crea un costo nuevo, atado al usuario autenticado
router.post("/", async (req, res) => {
  const { servicio, cantidad, horasEstimadas, costoUnitario, costoMensual, costoAnual } = req.body;

  if (!servicio || !cantidad || !horasEstimadas || costoUnitario == null) {
    return res.status(400).json({ error: "Datos incompletos para crear el costo." });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO costos (usuario_id, servicio, cantidad, horas_estimadas, costo_unitario, costo_mensual, costo_anual)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.usuario.id, servicio, cantidad, horasEstimadas, costoUnitario, costoMensual, costoAnual]
    );
    res.status(201).json(mapCosto(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el costo." });
  }
});

// DELETE /api/costos/:id — elimina, solo si le pertenece al usuario autenticado
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM costos WHERE id = $1 AND usuario_id = $2", [req.params.id, req.usuario.id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el costo." });
  }
});

module.exports = router;
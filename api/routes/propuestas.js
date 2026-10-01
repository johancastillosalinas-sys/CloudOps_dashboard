const express = require("express");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

function mapPropuesta(row) {
  return {
    id: String(row.id),
    nombreSolucion: row.nombre_solucion,
    tipoAplicacion: row.tipo_aplicacion,
    descripcion: row.descripcion,
    region: row.region,
    numeroUsuarios: row.numero_usuarios,
    nivelDisponibilidad: row.nivel_disponibilidad,
    serviciosSeleccionados: row.servicios_seleccionados || [],
    objetivoMigracion: row.objetivo_migracion,
    estado: row.estado,
    estadoCosto: row.estado_costo || "pendiente",
    costoMensualEstimado: Number(row.costo_mensual_estimado),
    fecha: new Date(row.creado_en).toLocaleDateString("es-PE"),
  };
}

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM propuestas WHERE usuario_id = $1 ORDER BY creado_en DESC",
      [req.usuario.id]
    );
    res.json(resultado.rows.map(mapPropuesta));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las propuestas." });
  }
});

router.post("/", async (req, res) => {
  const {
    nombreSolucion, tipoAplicacion, descripcion, region, numeroUsuarios,
    nivelDisponibilidad, serviciosSeleccionados, objetivoMigracion,
    estado, costoMensualEstimado,
  } = req.body;

  if (!nombreSolucion || !tipoAplicacion || !region) {
    return res.status(400).json({ error: "Datos incompletos para crear la propuesta." });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO propuestas
        (usuario_id, nombre_solucion, tipo_aplicacion, descripcion, region, numero_usuarios,
         nivel_disponibilidad, servicios_seleccionados, objetivo_migracion, estado, costo_mensual_estimado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        req.usuario.id, nombreSolucion, tipoAplicacion, descripcion, region, numeroUsuarios,
        nivelDisponibilidad, serviciosSeleccionados, objetivoMigracion,
        estado || "borrador", costoMensualEstimado,
      ]
    );
    res.status(201).json(mapPropuesta(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la propuesta." });
  }
});

router.patch("/:id/estado", async (req, res) => {
  const { estado } = req.body;
  try {
    const resultado = await pool.query(
      "UPDATE propuestas SET estado = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *",
      [estado, req.params.id, req.usuario.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Propuesta no encontrada." });
    }
    res.json(mapPropuesta(resultado.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el estado." });
  }
});

// PATCH /api/propuestas/:id/costo — Aceptar o descartar una propuesta pendiente
router.patch("/:id/costo", async (req, res) => {
  const { accion } = req.body; // "aceptar" | "descartar"

  if (!["aceptar", "descartar"].includes(accion)) {
    return res.status(400).json({ error: "Acción inválida. Usa 'aceptar' o 'descartar'." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const propuestaResult = await client.query(
      "SELECT * FROM propuestas WHERE id = $1 AND usuario_id = $2",
      [req.params.id, req.usuario.id]
    );
    const propuesta = propuestaResult.rows[0];

    if (!propuesta) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Propuesta no encontrada." });
    }

    if (propuesta.estado_costo !== "pendiente") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Esta propuesta ya fue procesada." });
    }

    if (accion === "aceptar") {
      const costoMensual = Number(propuesta.costo_mensual_estimado) || 0;
      const costoUnitario = costoMensual / 730;

      await client.query(
        `INSERT INTO costos (usuario_id, servicio, cantidad, horas_estimadas, costo_unitario, costo_mensual, costo_anual)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [req.usuario.id, propuesta.nombre_solucion, 1, 730, costoUnitario, costoMensual, costoMensual * 12]
      );

      await client.query(
        "UPDATE propuestas SET estado_costo = 'aceptado', estado = 'aprobada' WHERE id = $1",
        [propuesta.id]
      );
    } else {
      await client.query("UPDATE propuestas SET estado_costo = 'descartado' WHERE id = $1", [propuesta.id]);
    }

    await client.query("COMMIT");

    const actualizada = await pool.query("SELECT * FROM propuestas WHERE id = $1", [propuesta.id]);
    res.json(mapPropuesta(actualizada.rows[0]));
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Error al procesar la propuesta." });
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM propuestas WHERE id = $1 AND usuario_id = $2", [req.params.id, req.usuario.id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la propuesta." });
  }
});

module.exports = router;
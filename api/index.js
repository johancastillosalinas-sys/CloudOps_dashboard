const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Ajustamos las rutas para importar desde cloudops-backend
const pool = require("../cloudops-backend/db/pool");
const authRoutes = require("../cloudops-backend/routes/auth");
const costosRoutes = require("../cloudops-backend/routes/costos");
const propuestasRoutes = require("../cloudops-backend/routes/propuestas");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/costos", costosRoutes);
app.use("/api/propuestas", propuestasRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mensaje: "El backend de CloudOps está funcionando 🎉" });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW() as hora_actual");
    res.json({ status: "ok", conectado: true, horaServidorDB: resultado.rows[0].hora_actual });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", conectado: false, mensaje: error.message });
  }
});

// En Vercel Serverless se exporta la app en lugar de app.listen()
module.exports = app;
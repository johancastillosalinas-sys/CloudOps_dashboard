import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import pool from "./db/pool.js";
import authRoutes from "./routes/auth.js";
import costosRoutes from "./routes/costos.js";
import propuestasRoutes from "./routes/propuestas.js";

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

export default app;
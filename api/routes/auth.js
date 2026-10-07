import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: "Correo y contraseña (mínimo 6 caracteres) son requeridos." });
  }

  try {
    const existente = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      "INSERT INTO usuarios (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    const usuario = resultado.rows[0];
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, email: usuario.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el usuario." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos." });
  }

  try {
    const resultado = await pool.query("SELECT id, email, password_hash FROM usuarios WHERE email = $1", [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, email: usuario.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

export default router;
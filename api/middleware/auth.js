const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado. Falta el token de sesión." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, email } — quedan disponibles en cualquier ruta protegida
    next(); // "deja pasar" la petición hacia la ruta real
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado. Inicia sesión de nuevo." });
  }
}

module.exports = authMiddleware;
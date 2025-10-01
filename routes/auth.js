const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = "secreto123"; // ⚠️ en producción usa variables de entorno

// Registro
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Faltan datos" });

  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO ankicards (username, password) VALUES (?, ?)`;
  db.run(query, [username, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }
    res.json({ message: "Usuario registrado con éxito" });
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM ankicards WHERE username = ?`,
    [username],
    (err, user) => {
      if (err || !user)
        return res.status(400).json({ error: "Credenciales inválidas" });

      const passwordValid = bcrypt.compareSync(password, user.password);
      if (!passwordValid)
        return res.status(400).json({ error: "Credenciales inválidas" });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

      res.json({ message: "Login exitoso", token });
    }
  );
});

module.exports = router;

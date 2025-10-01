const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(express.static("frontend")); // Servir archivos estáticos

// Rutas
app.use("/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);

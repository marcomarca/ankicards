const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./ankicards.db", (err) => {
  if (err) {
    console.error("Error al abrir la base de datos", err.message);
  } else {
    console.log("Conectado a SQLite3");

    db.run(
      `CREATE TABLE IF NOT EXISTS ankicards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )`
    );
  }
});

module.exports = db;

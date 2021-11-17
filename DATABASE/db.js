const mysql = require("mysql");
const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
});

connection.connect((error) => {
  if (error) {
    console.log("No se ha podido conectar a la base de datos " + error);
    return;
  }
  console.log("se ha conectado a la base de datos con exito!");
});
module.exports = connection;

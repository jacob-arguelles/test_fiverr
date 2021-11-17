require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const bcryptjs = require("bcryptjs");
const session = require("express-session");
const connection = require("./DATABASE/db");

app.use("/public", express.static("public"));
app.use("/public", express.static(__dirname + "public"));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "12345678",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (req.session.logeado === true) {
    res.render("index", { iniciado: true, name: req.session.name });
  } else {
    res.render("index", {
      iniciado: false,
      name: "",
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { msgLogin: "" });
});
app.get("/register", (req, res) => {
  res.render("register", { msgLogin: "" });
});

app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const edad = req.body.edad;
  const pass = req.body.password;
  let password = await bcryptjs.hash(pass, 8);
  connection.query(
    "INSERT INTO users set ?",
    {
      user,
      name,
      edad,
      password,
    },
    async (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.render("register", { alerta: true });
      }
    }
  );
});

app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.password;

  let password = await bcryptjs.hash(pass, 8);

  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (errror, result) => {
        if (
          result.length == 0 ||
          !(await bcryptjs.compare(pass, result[0].password))
        ) {
          res.render("login", {
            alerta: true,
            msgAlert: "User/password is false",
            iconAlert: "error",
            titleAlert: "Error",
            ruta: "login",
          });
        } else {
          req.session.logeado = true;
          req.session.name = result[0].user;
          res.render("login", {
            alerta: true,
            msgAlert: "Welcome",
            iconAlert: "success",
            titleAlert: "Login",
            ruta: "",
          });
        }
      }
    );
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("El servidor se esta ejecutando en el puerto:" + PORT);
});

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const routes = require("./routes");

const app = express();

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/monvieuxgrimoire", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée : ", error));

app.use(bodyParser.json());

// Autorise les requêtes cross-origin (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Gestion des fichiers statiques
app.use("/images", express.static("images"));

// Utilisation des routes
app.use("/", routes);

module.exports = app;

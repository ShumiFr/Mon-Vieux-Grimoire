const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/books");

const app = express();

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://Shumi:P6WvuBEy48Vwcmfl@cluster0.zzdxtzt.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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

// Utilisation des routes pour les utilisateurs et les livres
app.use("/api/auth", userRoutes); // Routes pour les utilisateurs avec le préfixe "/api/auth"
app.use("/api/books", bookRoutes); // Routes pour les livres avec le préfixe "/api/books"

module.exports = app;

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/books");
const cors = require("cors");

require("dotenv").config();
const password = process.env.MONGODBPASSWORD;
const urlMGDB = process.env.MONGODBURL;

const app = express();

// Connexion à MongoDB
mongoose
  .connect(`mongodb+srv://Shumi:${password}@${urlMGDB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée : ", error));

// Configurer les options CORS pour autoriser toutes les origines
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

// Activer CORS pour toutes les routes
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gestion des fichiers statiques
app.use("/images", express.static("images"));

// Utilisation des routes pour les utilisateurs et les livres
app.use("/api/auth", userRoutes); // Routes pour les utilisateurs avec le préfixe "/api/auth"
app.use("/api/books", bookRoutes); // Routes pour les livres avec le préfixe "/api/books"

module.exports = app;

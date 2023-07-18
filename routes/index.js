const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const bookRoutes = require("./books");

// Utilisation des routes pour les utilisateurs et les livres
router.use("/api/auth", userRoutes); // Routes pour les utilisateurs avec le préfixe "/api/auth"
router.use("/api/books", bookRoutes); // Routes pour les livres avec le préfixe "/api/books"

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

router.get("/", auth, booksCtrl.getAllBooks); // Obtient tous les livres
router.post("/", auth, multer, booksCtrl.createBook); // Crée un nouveau livre
router.get("/:id", auth, booksCtrl.getOneBook); // Obtient les informations d'un livre spécifique
router.put("/:id", auth, multer, booksCtrl.modifyBook); // Modifie un livre existant
router.delete("/:id", auth, booksCtrl.deleteBook); // Supprime un livre existant

module.exports = router;

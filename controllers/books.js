const Book = require("../models/book");
const fs = require("fs");

// Crée un nouveau livre
exports.createBook = (req, res, next) => {
  const { title, author, year, genre } = JSON.parse(req.body.book); // Récupère les informations du livre depuis la requête
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`; // Construit l'URL de l'image du livre
  const userId = req.auth.userId; // Récupère l'ID de l'utilisateur connecté

  const book = new Book({
    title: title,
    author: author,
    year: year,
    genre: genre,
    imageUrl: imageUrl,
    userId: userId,
    ratings: [],
  });

  book
    .save() // Sauvegarde le livre dans la base de données
    .then(() => {
      res.status(201).json({ message: "Livre enregistré avec succès !" }); // Renvoie une réponse de succès
    })
    .catch((error) => {
      res.status(400).json({ error: error.message }); // Renvoie une réponse d'erreur avec le message d'erreur
    });
};

// Récupère un livre spécifique par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id, // Récupère l'ID du livre depuis les paramètres de la requête
  })
    .then((book) => {
      res.status(200).json(book); // Renvoie le livre trouvé en tant que réponse
    })
    .catch((error) => {
      res.status(404).json({
        error: error, // Renvoie une réponse d'erreur si le livre n'a pas été trouvé
      });
    });
};

// Modifie un livre existant
exports.modifyBook = (req, res, next) => {
  const { title, author, year, genre } = req.body; // Récupère les nouvelles informations du livre depuis la requête
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : null; // Met à jour l'URL de l'image du livre si une nouvelle image est fournie

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" }); // Vérifie si l'utilisateur est autorisé à modifier le livre
      } else {
        book.title = title;
        book.author = author;
        book.year = year;
        book.genre = genre;
        if (imageUrl) {
          book.imageUrl = imageUrl;
        }

        book
          .save() // Sauvegarde les modifications du livre dans la base de données
          .then(() => {
            res.status(200).json({ message: "Livre modifié avec succès !" }); // Renvoie une réponse de succès
          })
          .catch((error) => {
            res.status(400).json({ error: error.message }); // Renvoie une réponse d'erreur avec le message d'erreur
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message }); // Renvoie une réponse d'erreur avec le message d'erreur
    });
};

// Supprime un livre existant
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" }); // Vérifie si l'utilisateur est autorisé à supprimer le livre
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          book
            .deleteOne() // Supprime le livre de la base de données
            .then(() => {
              res.status(200).json({ message: "Livre supprimé avec succès !" }); // Renvoie une réponse de succès
            })
            .catch((error) => {
              res.status(400).json({ error: error.message }); // Renvoie une réponse d'erreur avec le message d'erreur
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message }); // Renvoie une réponse d'erreur avec le message d'erreur
    });
};

// Récupère tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books); // Renvoie tous les livres trouvés en tant que réponse
    })
    .catch((error) => {
      res.status(400).json({
        error: error, // Renvoie une réponse d'erreur avec le message d'erreur
      });
    });
};

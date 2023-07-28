const Book = require("../models/book");
const fs = require("fs");

// Crée un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : null,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre créé !" });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.addRating = (req, res, next) => {
  const bookId = req.params.id; // Récupère l'ID du livre depuis les paramètres de la requête

  if (!bookId) {
      return res
          .status(400)
          .json({message: "Il manque l'identifiant du livre."});
  }

  Book.findOne({_id: bookId, "ratings.userId": req.auth.userId})
      .then((book) => {
          if (book) {
              return res
                  .status(400)
                  .json({message: "Vous avez déjà noté ce livre."});
          }
      })

      .then(() => {
          Book.findByIdAndUpdate(
              bookId,
              {
                  $push: {
                      ratings: {
                          userId: req.auth.userId,
                          grade: req.body.rating,
                      },
                  },
              },
              {new: true}
          ).then((book) => {
              if (!book) {
                  return res.status(404).json({message: "Le livre n'existe pas."});
              }
              const totalRatings = book.ratings.length;
              const sumOfRates = book.ratings.reduce(
                  (total, rating) => total + rating.grade,
                  0
              );

              book.averageRating = parseInt(sumOfRates / totalRatings, 10);
              book.save()
                  .then((book) => {
                      res.status(200).json(book);
                  })
                  .catch((error) => res.status(400).json({error}));
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

exports.getBestRating = (req, res, next) => {
  Book.find() //Cherche tous les livres
    .sort({ averageRating: -1 }) //Trie par ordre décroissant ( -1 = décroissant / 1 pour croissant)
    .limit(3) //Garder uniquement les 3 premiers
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Récupère un livre spécifique par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id, // Récupère l'ID du livre depuis les paramètres de la requête
  })
    .then((book) => {
      console.log("saucisse :", book.ratings);
      res.status(200).json(book); // Renvoie le livre trouvé en tant que réponse
    })
    .catch((error) => {
      res.status(404).json({
        error: error, // Renvoie une réponse d'erreur si le livre n'a pas été trouvé
      });
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

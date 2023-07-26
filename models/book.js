const mongoose = require("mongoose");

// Définition du schéma pour les livres
const bookSchema = mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  title: { type: String, required: true }, // Champ titre requis
  author: { type: String, required: true }, // Champ auteur requis
  imageUrl: { type: String, required: true }, // Champ URL de l'image requis
  genre: { type: String, required: true }, // Champ genre requis
  year: { type: Number, required: true }, // Champ année requis
  userId: { type: String },
  ratings: [
    {
      // Tableau des notes
      userId: { type: String }, // ID de l'utilisateur ayant donné la note
      grade: { type: Number }, // Note donnée à un livre
    },
  ],
  averageRatings: { type: Number},
});

// Création du modèle Book à partir du schéma
module.exports = mongoose.model("Book", bookSchema);

const mongoose = require("mongoose");

// Définition du schéma pour les livres
const bookSchema = mongoose.Schema({
  title: { type: String, required: true }, // Champ titre requis
  author: { type: String, required: true }, // Champ auteur requis
  imageUrl: { type: String, required: true }, // Champ URL de l'image requis
  genre: { type: String, required: true }, // Champ genre requis
  year: { type: Number, required: true }, // Champ année requis
  ratings: [
    {
      // Tableau des notes
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID de l'utilisateur ayant donné la note
      grade: { type: Number }, // Note donnée à un livre
    },
  ],
});

// Création du modèle Book à partir du schéma
module.exports = mongoose.model("Book", bookSchema);

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Définition du schéma de l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Champ email requis et unique
  password: { type: String, required: true }, // Champ mot de passe requis
});

// Ajout du plugin uniqueValidator pour la validation d'unicité sur l'attribut "email"
userSchema.plugin(uniqueValidator);

// Création du modèle User à partir du schéma
module.exports = mongoose.model("User", userSchema);

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // Hachage du mot de passe fourni par l'utilisateur
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save() // Sauvegarde de l'utilisateur dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Renvoie une réponse de succès
        .catch((error) => res.status(400).json({ error })); // Renvoie une réponse d'erreur avec le message d'erreur
    })
    .catch((error) => res.status(500).json({ error })); // Renvoie une réponse d'erreur avec le message d'erreur
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche de l'utilisateur dans la base de données en utilisant son adresse e-mail
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" }); // Renvoie une réponse d'erreur si l'utilisateur n'est pas trouvé
      }
      bcrypt
        .compare(req.body.password, user.password) // Comparaison du mot de passe fourni avec le mot de passe haché enregistré
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" }); // Renvoie une réponse d'erreur si le mot de passe est incorrect
          }
          const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }); // Génération d'un jeton d'authentification JWT
          res.status(200).json({
            userId: user._id,
            token: token, // Renvoie le jeton d'authentification avec l'ID de l'utilisateur
          });
        })
        .catch((error) => res.status(500).json({ error })); // Renvoie une réponse d'erreur avec le message d'erreur
    })
    .catch((error) => res.status(500).json({ error })); // Renvoie une réponse d'erreur avec le message d'erreur
};

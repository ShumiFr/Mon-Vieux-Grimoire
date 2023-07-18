const express = require('express');
const mongoose = require('mongoose');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://Shumi:2cXOTpI3AYcdp8Ne@cluster0.zzdxtzt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté à la base de données MongoDB');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données MongoDB', error);
    process.exit(1);
  });

// Schéma du modèle utilisateur
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Modèle utilisateur
const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

// Route pour l'inscription
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'L\'utilisateur existe déjà' });
    }

    // Ajouter l'utilisateur à la base de données
    const newUser = new User({ email, password });
    await newUser.save();

    // Répondre avec un message de succès
    res.json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Route pour la connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    if (user.password !== password) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Répondre avec un message de succès
    res.json({ message: 'Connexion réussie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
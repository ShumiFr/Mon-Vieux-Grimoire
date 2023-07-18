const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extraction du token du header Authorization
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Vérification et décodage du token
    const userId = decodedToken.userId; // Récupération de l'ID de l'utilisateur à partir du token décodé
    req.auth = { userId: userId }; // Ajout de l'ID de l'utilisateur à l'objet "auth" de la requête
    next(); // Appel de la fonction suivante dans la chaîne des middlewares
  } catch (error) {
    res.status(401).json({ error }); // Gestion des erreurs lors de la vérification du token
  }
};

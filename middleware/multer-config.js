const multer = require("multer");

// Configuration de multer pour la gestion des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Destination des fichiers téléchargés dans le dossier "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Renommage du fichier pour éviter les espaces
    callback(null, name + Date.now() + "." + ".webp"); // Construction du nom de fichier unique
  },
});

// Configuration de multer avec la gestion du stockage
module.exports = multer({ storage: storage }).single("image");

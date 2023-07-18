const multer = require("multer");

// Types de fichiers acceptés et leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration de multer pour la gestion des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Destination des fichiers téléchargés dans le dossier "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Renommage du fichier pour éviter les espaces
    const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension du fichier à partir du type MIME
    callback(null, name + Date.now() + "." + extension); // Construction du nom de fichier unique
  },
});

// Configuration de multer avec la gestion du stockage
module.exports = multer({ storage: storage }).single("image");

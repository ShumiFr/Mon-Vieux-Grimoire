// Import des dépendances nécessaires
const http = require("http");
const app = require("./app");

// La fonction normalizePort est définie pour normaliser le port fourni en tant qu'argument de ligne de commande. Elle convertit le port en un entier et gère les cas où le port est invalide.
// Si le port est valide, il est renvoyé, sinon la valeur false est renvoyée.
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Le port est récupéré à partir de la variable d'environnement process.env.PORT ou, si non défini, il est défini sur 3000 par défaut.
// Ensuite, le port est configuré dans l'application Express en utilisant app.set().
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// La fonction errorHandler est définie pour gérer les erreurs de démarrage du serveur. Elle vérifie le type d'erreur et affiche un message d'erreur approprié en fonction de la nature de l'erreur.
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Un serveur HTTP est créé en utilisant http.createServer() en passant l'application Express app en tant que gestionnaire de requêtes.
const server = http.createServer(app);

// Les événements d'erreur ("error") et d'écoute ("listening") sont attachés au serveur. L'événement d'erreur appelle la fonction errorHandler pour gérer les erreurs de démarrage du serveur. L'événement d'écoute affiche un message indiquant sur quel port le serveur écoute.
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Le serveur est démarré en appelant server.listen() en utilisant le port configuré. Le serveur commence à écouter les requêtes entrantes.
server.listen(port);

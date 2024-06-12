// Obtient l'élément du canvas par son ID
const canvas = document.getElementById("gameCanvas");
// Obtient le contexte de dessin 2D du canvas
const ctx = canvas.getContext("2d");

// Définit la largeur et la hauteur du canvas
canvas.width = 400;
canvas.height = 600;

// Définit les propriétés du joueur
let player = {
  x: 200,
  y: 500,
  width: 50,
  height: 50,
  dx: 0,
  dy: 0,
  gravity: 0.1,
  jumpPower: -6,
  score: 0,
  direction: "right",
  speed: 0,
  maxSpeed: 2.5,
  acceleration: 0.1,
  friction: 0.05,
  moveLeft: false,
  moveRight: false,
  isJumping: false, // Ajout de l'indicateur de saut
};

// Initialisation des plateformes et des images
let platforms = [];
const platformCount = 5;
let lastPlatform = null;

const doodleImage = new Image();
doodleImage.src = "doodle.png";

const backgroundImage = new Image();
backgroundImage.src = "background.png";

const platformImage = new Image();
platformImage.src = "platform.png";

// Charge l'image de fond et initialise le jeu puis démarre la mise à jour
backgroundImage.onload = () => {
  initGame();
  update();
};

// Crée les plateformes à des positions aléatoires
function createPlatforms() {
  platforms = [];
  for (let i = 0; i < platformCount; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - 100),
      y: canvas.height - (i + 1) * 90,
      width: 100,
      height: 20,
    });
  }
}

// Réinitialise la position du joueur sur la première plateforme
function resetPlayer() {
  if (platforms.length > 0) {
    player.x = platforms[0].x + platforms[0].width / 2 - player.width / 2;
    player.y = platforms[0].y - player.height;
    player.dy = 0;
    player.dx = 0;
    lastPlatform = platforms[0];
  } else {
    console.error("No platforms available to position the player."); // Aucune plateforme disponible pour positionner le joueur.
  }
}

// Initialise le jeu en créant les plateformes et en réinitialisant le joueur
function initGame() {
  createPlatforms();
  resetPlayer();
}

// Dessine l'image de fond sur le canvas
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Dessine le joueur sur le canvas
function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  if (player.direction === "left") {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    doodleImage,
    -player.width / 2,
    -player.height / 2,
    player.width,
    player.height
  );
  ctx.restore();
}

// Dessine une plateforme sur le canvas
function drawPlatform(platform) {
  ctx.drawImage(
    platformImage,
    platform.x,
    platform.y,
    platform.width,
    platform.height
  );
}

// Dessine toutes les plateformes sur le canvas
function drawPlatforms() {
  platforms.forEach((platform) => {
    drawPlatform(platform);
  });
}

// Met à jour la position et les états du joueur
function updatePlayer() {
  player.dy += player.gravity;
  player.y += player.dy;

  if (player.moveLeft) {
    player.dx -= player.acceleration;
    player.direction = "left";
  } else if (player.moveRight) {
    player.dx += player.acceleration;
    player.direction = "right";
  } else {
    // Applique la friction
    if (player.dx > 0) {
      player.dx -= player.friction;
      if (player.dx < 0) player.dx = 0;
    } else if (player.dx < 0) {
      player.dx += player.friction;
      if (player.dx > 0) player.dx = 0;
    }
  }

  // Limite la vitesse du joueur
  if (player.dx > player.maxSpeed) {
    player.dx = player.maxSpeed;
  } else if (player.dx < -player.maxSpeed) {
    player.dx = -player.maxSpeed;
  }

  player.x += player.dx;

  // Téléporte le joueur de l'autre côté de l'écran s'il sort des limites
  if (player.x < -player.width) {
    player.x = canvas.width;
  } else if (player.x > canvas.width) {
    player.x = -player.width;
  }

  if (player.y > canvas.height) {
    gameOver();
  }

  // Gère la collision avec les plateformes
  platforms.forEach((platform) => {
    if (
      player.dy > 0 &&
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height
    ) {
      if (!player.isJumping) {
        player.dy = player.jumpPower; // Réinitialise la vitesse verticale à chaque collision
        player.isJumping = true; // Définit que le joueur est en train de sauter
        console.log("Jump! Collision detected with platform at y:", platform.y); // Log de détection de collision
        console.log("Player's vertical speed (dy) after jump:", player.dy); // Log de la vitesse verticale du joueur après le saut
        if (lastPlatform !== platform) {
          player.score++;
          lastPlatform = platform;
        }
      }
    } else if (
      player.dy > 0 &&
      player.y + player.height >= platform.y + platform.height
    ) {
      player.isJumping = false; // Réinitialise l'indicateur de saut lorsque le joueur commence à descendre après un saut
    }
  });
}

// Met à jour la position des plateformes
function updatePlatforms() {
  platforms.forEach((platform, index) => {
    // Déplacez les plateformes uniquement lorsque le joueur descend
    if (player.y < canvas.height / 2 && player.dy < 0) {
      platform.y -= player.dy;
      // Empêcher les plateformes de se chevaucher en bas de l'écran
      if (platform.y > canvas.height) {
        platform.x = Math.random() * (canvas.width - platform.width);
        platform.y = 0;
        console.log(`Platform ${index} repositioned to y: 0`);
      }
    }
  });
}

// Affiche le score sur le canvas
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${player.score}`, 10, 20);
}

// Gère la fin de la partie
function gameOver() {
  alert(`Game Over! Your score: ${player.score}`);
  player.score = 0;
  lastPlatform = null;
  initGame();
}

// Fonction principale de mise à jour du jeu
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlatforms();
  drawPlayer();
  updatePlayer();
  updatePlatforms();
  drawScore();
  requestAnimationFrame(update);
}

// Écoute les événements de pression des touches
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    player.moveLeft = true;
  } else if (e.code === "ArrowRight") {
    player.moveRight = true;
  }
});

// Écoute les événements de relâchement des touches
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") {
    player.moveLeft = false;
  } else if (e.code === "ArrowRight") {
    player.moveRight = false;
  }
});

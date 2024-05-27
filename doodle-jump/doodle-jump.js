const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let player = {
  x: 200,
  y: 500,
  width: 50,
  height: 50,
  dx: 0,
  dy: 0,
  gravity: 0.4,
  jumpPower: -12,
  score: 0,
};

let platforms = [];
const platformCount = 5;
let lastPlatform = null; // Ajout d'une variable pour suivre la dernière plateforme touchée

function createPlatforms() {
  platforms = [];
  for (let i = 0; i < platformCount; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - 100), // Ensure the platform fits within the canvas
      y: canvas.height - (i + 1) * 120, // Adjust the spacing of platforms
      width: 100,
      height: 20,
    });
  }
}

function resetPlayer() {
  // Ensure the player starts on the first platform
  if (platforms.length > 0) {
    player.x = platforms[0].x + platforms[0].width / 2 - player.width / 2;
    player.y = platforms[0].y - player.height;
    player.dy = 0;
    player.dx = 0;
    lastPlatform = platforms[0]; // Initialiser la dernière plateforme
  } else {
    // If no platforms exist, log an error
    console.error("No platforms available to position the player.");
  }
}

function initGame() {
  createPlatforms();
  resetPlayer();
}

function drawPlayer() {
  ctx.fillStyle = "gold"; // Use CSS color or change to use an image
  ctx.beginPath();
  ctx.arc(
    player.x + player.width / 2,
    player.y + player.height / 2,
    player.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Fonction pour dessiner des rectangles avec des coins arrondis
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawPlatforms() {
  ctx.fillStyle = "green"; // Utilisez la couleur que vous préférez ou une image de fond
  platforms.forEach((platform) => {
    drawRoundedRect(
      ctx,
      platform.x,
      platform.y,
      platform.width,
      platform.height,
      10
    );
  });
}

function updatePlayer() {
  player.dy += player.gravity;
  player.y += player.dy;

  // Update player position based on left/right movement
  player.x += player.dx;

  // Teleport player to the other side if they move off the screen
  if (player.x < -player.width) {
    player.x = canvas.width;
  } else if (player.x > canvas.width) {
    player.x = -player.width;
  }

  // If player falls below the canvas, reset position and score
  if (player.y > canvas.height) {
    gameOver();
  }

  // Check for collision with platforms and make the player jump
  platforms.forEach((platform) => {
    if (
      player.dy > 0 &&
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height
    ) {
      player.dy = player.jumpPower;
      if (lastPlatform !== platform) {
        // Vérifier si c'est une nouvelle plateforme
        player.score++;
        lastPlatform = platform; // Mettre à jour la dernière plateforme
      }
    }
  });
}

function updatePlatforms() {
  platforms.forEach((platform) => {
    // Move platforms down if the player is rising and is above the middle of the canvas
    if (player.y < canvas.height / 2 && player.dy < 0) {
      platform.y -= player.dy;
    }

    // Recycle platforms that move off the bottom of the canvas
    if (platform.y > canvas.height) {
      platform.x = Math.random() * (canvas.width - 100);
      platform.y = 0;
    }
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${player.score}`, 10, 20);
}

function gameOver() {
  alert(`Game Over! Your score: ${player.score}`);
  player.score = 0;
  lastPlatform = null; // Réinitialiser la dernière plateforme
  initGame();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawPlatforms();
  updatePlayer();
  updatePlatforms();
  drawScore();
  requestAnimationFrame(update);
}

// Event listeners for player movement
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    player.dx = -5;
  } else if (e.code === "ArrowRight") {
    player.dx = 5;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    player.dx = 0;
  }
});

// Initialize game
initGame();
update();

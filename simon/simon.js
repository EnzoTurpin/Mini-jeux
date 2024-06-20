// Initialisation des variables du jeu
const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let userSequence = [];
let level = 0;
let isUserTurn = false;

// Récupération des boutons
const buttons = {
  green: document.getElementById("green"),
  red: document.getElementById("red"),
  yellow: document.getElementById("yellow"),
  blue: document.getElementById("blue"),
};

// Récupération du bouton de démarrage et de l'élément de statut
const startButton = document.getElementById("start-btn");
const statusText = document.getElementById("status");

// Fonction pour faire clignoter un bouton
function flashButton(color) {
  buttons[color].classList.add("active");
  setTimeout(() => {
    buttons[color].classList.remove("active");
  }, 500);
}

// Fonction pour jouer la séquence actuelle
function playSequence() {
  let i = 0;
  isUserTurn = false;
  statusText.textContent = "Watch the sequence";

  const interval = setInterval(() => {
    if (i < sequence.length) {
      flashButton(sequence[i]);
      i++;
    } else {
      clearInterval(interval);
      isUserTurn = true;
      userSequence = [];
      statusText.textContent = "Your turn";
    }
  }, 1000);
}

// Fonction pour ajouter une couleur aléatoire à la séquence
function addColorToSequence() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
}

// Fonction pour démarrer le jeu
function startGame() {
  level = 0;
  sequence = [];
  statusText.textContent = "Level " + (level + 1);
  addColorToSequence();
  setTimeout(playSequence, 1000);
}

// Fonction pour vérifier la séquence de l'utilisateur
function checkUserSequence() {
  for (let i = 0; i < userSequence.length; i++) {
    if (userSequence[i] !== sequence[i]) {
      statusText.textContent = "Game Over! You reached level " + level;
      isUserTurn = false;
      return;
    }
  }

  if (userSequence.length === sequence.length) {
    level++;
    statusText.textContent = "Level " + (level + 1);
    addColorToSequence();
    setTimeout(playSequence, 1000);
  }
}

// Ajout d'un écouteur d'événement pour le bouton de démarrage
startButton.addEventListener("click", startGame);

// Ajout d'écouteurs d'événement pour chaque bouton de couleur
for (const color in buttons) {
  buttons[color].addEventListener("click", () => {
    if (isUserTurn) {
      flashButton(color);
      userSequence.push(color);
      checkUserSequence();
    }
  });
}

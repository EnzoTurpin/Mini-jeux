document.addEventListener("DOMContentLoaded", () => {
  // Initialisation des éléments du DOM et des variables de jeu
  const board = document.getElementById("memory-board");
  const resetButton = document.getElementById("reset-button");
  const cards = [
    "🍎",
    "🍎",
    "🍌",
    "🍌",
    "🍇",
    "🍇",
    "🍉",
    "🍉",
    "🍓",
    "🍓",
    "🍒",
    "🍒",
  ];
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let matches = 0;

  // Fonction pour mélanger les cartes
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Fonction pour créer le plateau de jeu
  function createBoard() {
    shuffle(cards);
    board.innerHTML = "";
    cards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.dataset.value = card;
      cardElement.addEventListener("click", () => flipCard(cardElement));
      board.appendChild(cardElement);
    });
  }

  // Fonction pour retourner une carte
  function flipCard(cardElement) {
    if (locked) return;
    if (cardElement === firstCard) return;
    cardElement.innerText = cardElement.dataset.value;
    cardElement.classList.add("flipped");
    if (!firstCard) {
      firstCard = cardElement;
      return;
    }
    secondCard = cardElement;
    checkMatch();
  }

  // Fonction pour vérifier si deux cartes forment une paire
  function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      matches++;
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      resetCards();
      if (matches === cards.length / 2) {
        setTimeout(() => {
          alert("Vous avez gagné!");
          updateHighScore();
        }, 100);
      }
    } else {
      locked = true;
      setTimeout(() => {
        firstCard.innerText = "";
        secondCard.innerText = "";
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetCards();
      }, 1000);
    }
  }

  // Fonction pour réinitialiser les cartes sélectionnées
  function resetCards() {
    [firstCard, secondCard, locked] = [null, null, false];
  }

  // Fonction pour mettre à jour le meilleur score
  function updateHighScore() {
    let highScore = localStorage.getItem("memoryHighScore") || 0;
    highScore++;
    localStorage.setItem("memoryHighScore", highScore);
  }

  // Fonction pour réinitialiser le jeu
  function resetGame() {
    matches = 0;
    resetCards();
    createBoard();
  }

  // Ajout d'un écouteur d'événement pour le bouton de réinitialisation
  resetButton.addEventListener("click", resetGame);

  // Création initiale du plateau de jeu
  createBoard();
});

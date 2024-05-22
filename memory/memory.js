document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("memory-board");
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

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

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

  function flipCard(cardElement) {
    if (locked) return;
    if (cardElement === firstCard) return;
    cardElement.innerText = cardElement.dataset.value;
    if (!firstCard) {
      firstCard = cardElement;
      return;
    }
    secondCard = cardElement;
    checkMatch();
  }

  function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      matches++;
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
        resetCards();
      }, 1000);
    }
  }

  function resetCards() {
    [firstCard, secondCard, locked] = [null, null, false];
  }

  function updateHighScore() {
    let highScore = localStorage.getItem("memoryHighScore") || 0;
    highScore++;
    localStorage.setItem("memoryHighScore", highScore);
  }

  createBoard();
});

const flipSound = new Audio("path/to/flip-sound.mp3");
const matchSound = new Audio("path/to/match-sound.mp3");

function flipCard(cardElement) {
  if (locked) return;
  if (cardElement === firstCard) return;
  cardElement.innerText = cardElement.dataset.value;
  cardElement.classList.add("flipped");
  flipSound.play(); // Jouer le son lors du retournement
  if (!firstCard) {
    firstCard = cardElement;
    return;
  }
  secondCard = cardElement;
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.value === secondCard.dataset.value) {
    matches++;
    matchSound.play(); // Jouer le son lors d'un match
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

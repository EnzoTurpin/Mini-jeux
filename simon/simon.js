const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let userSequence = [];
let level = 0;
let isUserTurn = false;

const buttons = {
  green: document.getElementById("green"),
  red: document.getElementById("red"),
  yellow: document.getElementById("yellow"),
  blue: document.getElementById("blue"),
};

const sounds = {
  green: new Audio("green.mp3"),
  red: new Audio("red.mp3"),
  yellow: new Audio("yellow.mp3"),
  blue: new Audio("blue.mp3"),
};

const startButton = document.getElementById("start-btn");
const statusText = document.getElementById("status");

function flashButton(color) {
  buttons[color].classList.add("active");
  sounds[color].play();
  setTimeout(() => {
    buttons[color].classList.remove("active");
  }, 500);
}

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

function addColorToSequence() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
}

function startGame() {
  level = 0;
  sequence = [];
  statusText.textContent = "Level " + (level + 1);
  addColorToSequence();
  setTimeout(playSequence, 1000);
}

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

startButton.addEventListener("click", startGame);

for (const color in buttons) {
  buttons[color].addEventListener("click", () => {
    if (isUserTurn) {
      flashButton(color);
      userSequence.push(color);
      checkUserSequence();
    }
  });
}
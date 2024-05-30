document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("tic-tac-toe-board");
  const winsElement = document.getElementById("wins");
  const lossesElement = document.getElementById("losses");
  const drawsElement = document.getElementById("draws");
  const difficultyDisplay = document.getElementById("difficulty-display");
  const difficultySelection = document.getElementById("difficulty-selection");
  const gameContainer = document.getElementById("game-container");
  const stats = document.getElementById("stats");

  let cells = Array(9).fill(null);
  let currentPlayer = "X";
  let gameOver = false;
  let difficulty = "medium"; // Set the initial difficulty level

  function createBoard() {
    board.innerHTML = "";
    cells.forEach((_, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.addEventListener("click", () => makeMove(i));
      board.appendChild(cell);
    });
  }

  function makeMove(index) {
    if (!cells[index] && !gameOver) {
      cells[index] = currentPlayer;
      renderBoard();
      if (checkWinner()) {
        gameOver = true;
        setTimeout(() => {
          alert(`${currentPlayer} a gagné !`);
          updateStats(currentPlayer === "X" ? "win" : "loss");
          updateHighScore(currentPlayer);
        }, 100);
      } else if (cells.every((cell) => cell)) {
        gameOver = true;
        setTimeout(() => {
          alert("Match nul !");
          updateStats("draw");
        }, 100);
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (currentPlayer === "O") {
          setTimeout(computerMove, 500); // Délai pour simuler la réflexion de l'ordinateur
        }
      }
    }
  }

  function computerMove() {
    if (!gameOver) {
      let move;
      switch (difficulty) {
        case "easy":
          move = chooseRandomMove();
          break;
        case "medium":
          move = Math.random() < 0.5 ? chooseOptimalMove() : chooseRandomMove();
          break;
        case "hard":
          move = chooseOptimalMove();
          break;
      }
      makeMove(move);
    }
  }

  function chooseRandomMove() {
    let availableCells = cells
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  function chooseOptimalMove() {
    // Try to win
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) {
        cells[i] = "O";
        if (checkWinner()) {
          cells[i] = null;
          return i;
        }
        cells[i] = null;
      }
    }

    // Block opponent's win
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) {
        cells[i] = "X";
        if (checkWinner()) {
          cells[i] = null;
          return i;
        }
        cells[i] = null;
      }
    }

    // Play center if available
    if (!cells[4]) {
      return 4;
    }

    // Play a corner if available
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
      if (!cells[corner]) {
        return corner;
      }
    }

    // Play a random move if no strategic move is found
    return chooseRandomMove();
  }

  function renderBoard() {
    const cellElements = board.querySelectorAll(".cell");
    cells.forEach((value, index) => {
      cellElements[index].innerText = value;
      cellElements[index].classList.remove("X", "O");
      if (value) {
        cellElements[index].classList.add(value);
      }
    });
  }

  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
    });
  }

  function updateHighScore(player) {
    let highScore = localStorage.getItem("ticTacToeHighScore") || 0;
    highScore++;
    localStorage.setItem("ticTacToeHighScore", highScore);
  }

  function updateStats(result) {
    let wins = parseInt(localStorage.getItem("ticTacToeWins")) || 0;
    let losses = parseInt(localStorage.getItem("ticTacToeLosses")) || 0;
    let draws = parseInt(localStorage.getItem("ticTacToeDraws")) || 0;

    if (result === "win") {
      wins++;
      localStorage.setItem("ticTacToeWins", wins);
    } else if (result === "loss") {
      losses++;
      localStorage.setItem("ticTacToeLosses", losses);
    } else if (result === "draw") {
      draws++;
      localStorage.setItem("ticTacToeDraws", draws);
    }

    winsElement.innerText = wins;
    lossesElement.innerText = losses;
    drawsElement.innerText = draws;
  }

  function loadStats() {
    let wins = parseInt(localStorage.getItem("ticTacToeWins")) || 0;
    let losses = parseInt(localStorage.getItem("ticTacToeLosses")) || 0;
    let draws = parseInt(localStorage.getItem("ticTacToeDraws")) || 0;

    winsElement.innerText = wins;
    lossesElement.innerText = losses;
    drawsElement.innerText = draws;
  }

  window.restartGame = function () {
    difficultySelection.style.display = "block";
    gameContainer.style.display = "none";
    stats.style.display = "none";
  };

  window.setDifficultyAndStart = function (level) {
    difficulty = level;
    difficultySelection.style.display = "none";
    gameContainer.style.display = "block";
    stats.style.display = "block";
    updateDifficultyDisplay();
    cells = Array(9).fill(null);
    currentPlayer = "X";
    gameOver = false;
    createBoard();
    renderBoard();
    loadStats();
  };

  function updateDifficultyDisplay() {
    let difficultyText, difficultyColor;
    switch (difficulty) {
      case "easy":
        difficultyText = "Facile";
        difficultyColor = "green";
        break;
      case "medium":
        difficultyText = "Moyen";
        difficultyColor = "orange";
        break;
      case "hard":
        difficultyText = "Difficile";
        difficultyColor = "red";
        break;
    }
    difficultyDisplay.innerText = difficultyText;
    difficultyDisplay.style.color = difficultyColor;
  }

  // Initial call to display difficulty selection
  difficultySelection.style.display = "block";
  gameContainer.style.display = "none";
  stats.style.display = "none";
});

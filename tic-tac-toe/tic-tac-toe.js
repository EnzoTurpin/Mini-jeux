document.addEventListener("DOMContentLoaded", () => {
  // Initialisation des éléments du DOM et des variables du jeu
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
  let difficulty = "medium";

  // Création du plateau de jeu
  function createBoard() {
    board.innerHTML = "";
    cells.forEach((_, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.addEventListener("click", () => makeMove(i));
      board.appendChild(cell);
    });
    clearWinningLine();
  }

  // Gestion des coups des joueurs
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
          setTimeout(computerMove, 500);
        }
      }
    }
  }

  // Gestion des coups de l'ordinateur selon le niveau de difficulté
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

  // Choisir un coup aléatoire
  function chooseRandomMove() {
    let availableCells = cells
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  // Choisir un coup optimal pour l'ordinateur
  function chooseOptimalMove() {
    console.log("Choosing optimal move");

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) {
        cells[i] = "O";
        if (checkWinner()) {
          cells[i] = null;
          console.log(`Winning move found at ${i}`);
          return i;
        }
        cells[i] = null;
      }
    }

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) {
        cells[i] = "X";
        if (checkIfBlocksOpponent()) {
          cells[i] = null;
          console.log(`Blocking move found at ${i}`);
          return i;
        }
        cells[i] = null;
      }
    }

    if (!cells[4]) {
      console.log("Center move chosen");
      return 4;
    }

    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
      if (!cells[corner]) {
        console.log(`Corner move chosen at ${corner}`);
        return corner;
      }
    }

    const randomMove = chooseRandomMove();
    console.log(`Random move chosen at ${randomMove}`);
    return randomMove;
  }

  // Rendre le plateau de jeu
  function renderBoard() {
    const cellElements = board.querySelectorAll(".cell");
    cells.forEach((value, index) => {
      cellElements[index].innerText = value;
      cellElements[index].classList.remove("X", "O", "winner");
      if (value) {
        cellElements[index].classList.add(value);
      }
    });
  }

  // Vérifier si un joueur a gagné
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

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        console.log(`Winning combination: ${combination}`);
        highlightWinningCells(combination);
        drawWinningLine(combination);
        return true;
      }
    }
    return false;
  }

  // Vérifier si un coup bloque l'adversaire
  function checkIfBlocksOpponent() {
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

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        console.log(`Blocking combination: ${combination}`);
        return true;
      }
    }
    return false;
  }

  // Mettre en évidence les cellules gagnantes
  function highlightWinningCells(combination) {
    const cellElements = board.querySelectorAll(".cell");
    combination.forEach((index) => {
      cellElements[index].classList.add("winner");
    });
  }

  // Dessiner une ligne gagnante
  function drawWinningLine(combination) {
    clearWinningLine();

    const startCell = document.querySelectorAll(".cell")[combination[0]];
    const endCell = document.querySelectorAll(".cell")[combination[2]];

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2 - boardRect.left;
    const startY = startRect.top + startRect.height / 2 - boardRect.top;
    const endX = endRect.left + endRect.width / 2 - boardRect.left;
    const endY = endRect.top + endRect.height / 2 - boardRect.top;

    console.log(
      `Drawing line from (${startX}, ${startY}) to (${endX}, ${endY})`
    );

    const line = document.createElement("div");
    line.classList.add("line");

    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

    line.style.width = `${length}px`;
    line.style.height = "5px";
    line.style.backgroundColor = "#00ff00";
    line.style.position = "absolute";
    line.style.top = `${startY - 2.5}px`;
    line.style.left = `${startX}px`;
    line.style.transform = `rotate(${angle}rad)`;
    line.style.transformOrigin = "0 50%";

    board.appendChild(line);
  }

  // Effacer la ligne gagnante existante
  function clearWinningLine() {
    const existingLine = board.querySelector(".line");
    if (existingLine) {
      existingLine.remove();
    }
  }

  // Mettre à jour le meilleur score
  function updateHighScore(player) {
    let highScore = localStorage.getItem("ticTacToeHighScore") || 0;
    highScore++;
    localStorage.setItem("ticTacToeHighScore", highScore);
  }

  // Mettre à jour les statistiques du jeu
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

  // Charger les statistiques du jeu depuis le stockage local
  function loadStats() {
    let wins = parseInt(localStorage.getItem("ticTacToeWins")) || 0;
    let losses = parseInt(localStorage.getItem("ticTacToeLosses")) || 0;
    let draws = parseInt(localStorage.getItem("ticTacToeDraws")) || 0;

    winsElement.innerText = wins;
    lossesElement.innerText = losses;
    drawsElement.innerText = draws;
  }

  // Redémarrer le jeu
  window.restartGame = function () {
    difficultySelection.style.display = "block";
    gameContainer.style.display = "none";
    stats.style.display = "none";
    cells = Array(9).fill(null);
    currentPlayer = "X";
    gameOver = false;
    createBoard();
  };

  // Définir la difficulté et démarrer le jeu
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

  // Mettre à jour l'affichage de la difficulté
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

  // Afficher le menu de sélection de la difficulté au chargement de la page
  difficultySelection.style.display = "block";
  gameContainer.style.display = "none";
  stats.style.display = "none";
});

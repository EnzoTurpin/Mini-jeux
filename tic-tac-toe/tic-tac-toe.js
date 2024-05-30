document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("tic-tac-toe-board");
  const cells = Array(9).fill(null);
  let currentPlayer = "X";
  let gameOver = false;

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
          updateHighScore(currentPlayer);
        }, 100);
      } else if (cells.every((cell) => cell)) {
        gameOver = true;
        setTimeout(() => {
          alert("Match nul !");
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
      let availableCells = cells
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null);
      if (availableCells.length > 0) {
        let randomIndex =
          availableCells[Math.floor(Math.random() * availableCells.length)];
        makeMove(randomIndex);
      }
    }
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

  createBoard();
  renderBoard();
});

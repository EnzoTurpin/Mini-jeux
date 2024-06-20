// Écoute l'événement DOMContentLoaded pour s'assurer que le DOM est entièrement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  // Initialisation des variables et récupération des éléments du DOM
  const board = document.getElementById("game-2048-board");
  const size = 4;
  let grid = Array.from({ length: size }, () => Array(size).fill(0));
  let highestTile = 0;
  let highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerText = highScore;

  // Crée le plateau de jeu
  function createBoard() {
    board.innerHTML = "";
    grid = Array.from({ length: size }, () => Array(size).fill(0));
    highestTile = 0;
    document.getElementById("score").innerText = highestTile;
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      board.appendChild(cell);
    }
    addRandomTile();
    renderBoard();
  }

  // Ajoute une tuile aléatoire (2 ou 4) à une cellule vide de la grille
  function addRandomTile() {
    const emptyCells = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) emptyCells.push({ row: rowIndex, col: colIndex });
      });
    });
    if (emptyCells.length === 0) return;
    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    highestTile = Math.max(highestTile, grid[row][col]);
    console.log(`Added tile ${grid[row][col]} at position (${row}, ${col})`);
  }

  // Déplace les tuiles dans une direction donnée
  function moveTiles(direction) {
    let moved = false;
    if (direction === "up" || direction === "down") {
      // Gérer les mouvements verticaux
      for (let col = 0; col < size; col++) {
        let column = [];
        for (let row = 0; row < size; row++) {
          column.push(grid[row][col]);
        }
        if (direction === "down") column.reverse();
        const newColumn = compress(column);
        if (direction === "down") newColumn.reverse();
        for (let row = 0; row < size; row++) {
          if (grid[row][col] !== newColumn[row]) moved = true;
          grid[row][col] = newColumn[row];
        }
      }
    } else {
      // Gérer les mouvements horizontaux
      for (let row = 0; row < size; row++) {
        let line = [];
        for (let col = 0; col < size; col++) {
          line.push(grid[row][col]);
        }
        if (direction === "right") line.reverse();
        const newLine = compress(line);
        if (direction === "right") newLine.reverse();
        for (let col = 0; col < size; col++) {
          if (grid[row][col] !== newLine[col]) moved = true;
          grid[row][col] = newLine[col];
        }
      }
    }
    if (moved) {
      addRandomTile();
      renderBoard();
      if (isGameOver()) {
        renderBoard();
        setTimeout(() => {
          alert("Game Over!");
          if (highestTile > highScore) {
            highScore = highestTile;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = highScore;
          }
          createBoard();
        }, 100);
      }
    }
  }

  // Compresse les tuiles en les fusionnant si elles sont égales
  function compress(array) {
    console.log("Original array:", array);
    array = array.filter((value) => value !== 0);
    console.log("Filtered array:", array);

    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] === array[i + 1]) {
        newArray.push(array[i] * 2);
        highestTile = Math.max(highestTile, array[i] * 2);
        i++;
      } else {
        newArray.push(array[i]);
      }
    }
    while (newArray.length < size) {
      newArray.push(0);
    }
    console.log("Compressed array:", newArray);
    return newArray;
  }

  // Rend le plateau de jeu en fonction de la grille
  function renderBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
      const value = grid[Math.floor(i / size)][i % size];
      cell.innerText = value === 0 ? "" : value;
      cell.className = "cell";
      if (value) cell.classList.add("tile-" + value);
    });
    console.log("Rendered grid:", grid);
    document.getElementById("score").innerText = highestTile;
  }

  // Vérifie si le jeu est terminé
  function isGameOver() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) return false;
        if (i < size - 1 && grid[i][j] === grid[i + 1][j]) return false;
        if (j < size - 1 && grid[i][j] === grid[i][j + 1]) return false;
      }
    }
    return true;
  }

  // Écoute les événements de pression des touches
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        moveTiles("up");
        break;
      case "ArrowDown":
        moveTiles("down");
        break;
      case "ArrowLeft":
        moveTiles("left");
        break;
      case "ArrowRight":
        moveTiles("right");
        break;
    }
  });

  createBoard();
});

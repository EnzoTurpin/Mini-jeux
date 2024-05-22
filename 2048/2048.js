document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-2048-board");
  const size = 4;
  let grid = Array.from({ length: size }, () => Array(size).fill(0));

  function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      board.appendChild(cell);
    }
    addRandomTile();
    addRandomTile();
    renderBoard();
  }

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
    console.log(`Added tile ${grid[row][col]} at position (${row}, ${col})`);
  }

  function moveTiles(direction) {
    let moved = false;
    if (direction === "up" || direction === "down") {
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
      if (isGameOver()) alert("Game Over!");
    }
  }

  function compress(array) {
    console.log("Original array:", array);
    array = array.filter((value) => value !== 0);
    console.log("Filtered array:", array);

    // Nouvelle variable pour le tableau compressé
    let newArray = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i] === array[i + 1]) {
        newArray.push(array[i] * 2);
        i++; // Skip the next element
      } else {
        newArray.push(array[i]);
      }
    }

    // Compléter avec des zéros jusqu'à la taille correcte
    while (newArray.length < size) {
      newArray.push(0);
    }

    console.log("Compressed array:", newArray);
    return newArray;
  }

  function renderBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
      const value = grid[Math.floor(i / size)][i % size];
      cell.innerText = value === 0 ? "" : value;
      cell.className = "cell";
      if (value) cell.classList.add("tile-" + value);
    });
    console.log("Rendered grid:", grid);
  }

  function isGameOver() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) return false; // Si une cellule est vide, le jeu n'est pas terminé
        if (i < size - 1 && grid[i][j] === grid[i + 1][j]) return false; // Si une cellule peut fusionner avec celle en dessous
        if (j < size - 1 && grid[i][j] === grid[i][j + 1]) return false; // Si une cellule peut fusionner avec celle à droite
      }
    }
    return true;
  }

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

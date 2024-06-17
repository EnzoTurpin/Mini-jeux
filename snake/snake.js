// Attend que le document soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments du DOM nécessaires pour le jeu
  const board = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  const retryBtn = document.getElementById("retry-btn");
  const menuBtn = document.getElementById("menu-btn");

  // Définition des constantes et des variables pour le plateau de jeu et le serpent
  const boardSize = 400;
  const tileSize = 20;
  let snake = [{ x: 200, y: 200 }];
  let fruit = getNewFruitPosition();
  let direction = { x: 0, y: 0 };
  let nextDirection = { x: 0, y: 0 };
  let speed = 200;
  let score = 0;
  let lastTime = 0;
  let gameOver = false;
  let gameStarted = false;

  // Fonction pour obtenir une coordonnée aléatoire sur le plateau
  function getRandomCoord() {
    return Math.floor(Math.random() * (boardSize / tileSize)) * tileSize;
  }

  // Fonction pour obtenir une nouvelle position pour le fruit
  function getNewFruitPosition() {
    let newFruitPosition;
    do {
      newFruitPosition = { x: getRandomCoord(), y: getRandomCoord() };
    } while (isOnSnake(newFruitPosition));
    return newFruitPosition;
  }

  // Fonction pour vérifier si une position est sur le serpent
  function isOnSnake(position) {
    return snake.some(
      (segment) => segment.x === position.x && segment.y === position.y
    );
  }

  // Fonction pour dessiner le serpent et le fruit sur le plateau
  function draw() {
    board.innerHTML = ""; // Effacer le plateau de jeu

    snake.forEach((segment, index) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.left = `${segment.x}px`;
      snakeElement.style.top = `${segment.y}px`;
      snakeElement.classList.add("snake");

      // Ajouter des classes supplémentaires pour la tête et la queue du serpent
      if (index === 0) {
        snakeElement.classList.add("snake-head");
        if (direction.x === 0 && direction.y === -1)
          snakeElement.classList.add("up");
        if (direction.x === 1 && direction.y === 0)
          snakeElement.classList.add("right");
        if (direction.x === 0 && direction.y === 1)
          snakeElement.classList.add("down");
        if (direction.x === -1 && direction.y === 0)
          snakeElement.classList.add("left");
      } else if (index === snake.length - 1) {
        snakeElement.classList.add("snake-tail");
        const tailDirection = getTailDirection(index);
        if (tailDirection.x === 0 && tailDirection.y === -1)
          snakeElement.classList.add("up");
        if (tailDirection.x === 1 && tailDirection.y === 0)
          snakeElement.classList.add("right");
        if (tailDirection.x === 0 && tailDirection.y === 1)
          snakeElement.classList.add("down");
        if (tailDirection.x === -1 && tailDirection.y === 0)
          snakeElement.classList.add("left");
      } else {
        snakeElement.classList.add("snake-body");
      }

      board.appendChild(snakeElement);
    });

    const fruitElement = document.createElement("div");
    fruitElement.style.left = `${fruit.x}px`;
    fruitElement.style.top = `${fruit.y}px`;
    fruitElement.classList.add("fruit");
    board.appendChild(fruitElement);
  }

  // Fonction pour déplacer le serpent
  function moveSnake() {
    if (gameOver) return;

    direction = nextDirection;
    const head = {
      x: snake[0].x + direction.x * tileSize,
      y: snake[0].y + direction.y * tileSize,
    };

    if (checkCollision(head)) {
      gameOver = true;
      alert("Game Over!");
      return;
    }

    snake.unshift(head);

    if (head.x === fruit.x && head.y === fruit.y) {
      fruit = getNewFruitPosition();
      score++;
      speed = Math.max(50, speed - 10);
      scoreDisplay.textContent = `Score: ${score}`;
    } else {
      snake.pop();
    }
  }

  // Fonction pour obtenir la direction de la queue du serpent
  function getTailDirection(index) {
    const tail = snake[index];
    const prevSegment = snake[index - 1];
    if (prevSegment.x > tail.x) return { x: 1, y: 0 };
    if (prevSegment.x < tail.x) return { x: -1, y: 0 };
    if (prevSegment.y > tail.y) return { x: 0, y: 1 };
    if (prevSegment.y < tail.y) return { x: 0, y: -1 };
  }

  // Fonction pour vérifier les collisions
  function checkCollision(head) {
    if (
      head.x < 0 ||
      head.x >= boardSize ||
      head.y < 0 ||
      head.y >= boardSize
    ) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  }

  // Fonction pour changer la direction du serpent en fonction des touches pressées
  function changeDirection(event) {
    if (gameOver) return;

    switch (event.key) {
      case "ArrowUp":
        if (direction.y === 0) {
          nextDirection = { x: 0, y: -1 };
          if (!gameStarted) startGame();
        }
        break;
      case "ArrowDown":
        if (direction.y === 0) {
          nextDirection = { x: 0, y: 1 };
          if (!gameStarted) startGame();
        }
        break;
      case "ArrowLeft":
        if (direction.x === 0) {
          nextDirection = { x: -1, y: 0 };
          if (!gameStarted) startGame();
        }
        break;
      case "ArrowRight":
        if (direction.x === 0) {
          nextDirection = { x: 1, y: 0 };
          if (!gameStarted) startGame();
        }
        break;
    }
  }

  // Fonction pour démarrer le jeu
  function startGame() {
    gameStarted = true;
    requestAnimationFrame(gameLoop);
  }

  // Ajouter un écouteur d'événements pour les touches pressées
  document.addEventListener("keydown", changeDirection);

  // Fonction principale du jeu qui gère le déplacement et le dessin du serpent
  function gameLoop(currentTime) {
    if (!lastTime) {
      lastTime = currentTime;
      requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = currentTime - lastTime;

    if (deltaTime >= speed) {
      moveSnake();
      draw();
      lastTime = currentTime;
    }

    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }

  // Fonction pour recommencer le jeu
  window.retryGame = function retryGame() {
    snake = [{ x: 200, y: 200 }];
    fruit = getNewFruitPosition();
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };
    speed = 200;
    score = 0;
    gameOver = false;
    gameStarted = false;
    scoreDisplay.textContent = `Score: ${score}`;
    lastTime = 0;
    draw();
  };

  // Fonction pour retourner au menu
  window.goToMenu = function goToMenu() {
    window.location.href = "../index.html";
  };

  // Initialiser le jeu en appelant la fonction retryGame
  retryGame();
});

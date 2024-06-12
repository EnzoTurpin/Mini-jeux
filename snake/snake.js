document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  const retryBtn = document.getElementById("retry-btn");
  const menuBtn = document.getElementById("menu-btn");
  const boardSize = 400;
  const tileSize = 20;
  let snake = [{ x: 200, y: 200 }];
  let fruit = getNewFruitPosition();
  let direction = { x: 0, y: 1 }; // Initial direction is down
  let speed = 200; // en ms
  let score = 0;
  let gameInterval;
  let gameOver = false;

  function getRandomCoord() {
    return Math.floor(Math.random() * (boardSize / tileSize)) * tileSize;
  }

  function getNewFruitPosition() {
    let newFruitPosition;
    do {
      newFruitPosition = { x: getRandomCoord(), y: getRandomCoord() };
    } while (isOnSnake(newFruitPosition));
    return newFruitPosition;
  }

  function isOnSnake(position) {
    return snake.some(
      (segment) => segment.x === position.x && segment.y === position.y
    );
  }

  function draw() {
    board.innerHTML = ""; // Effacer le plateau de jeu

    snake.forEach((segment, index) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.left = `${segment.x}px`;
      snakeElement.style.top = `${segment.y}px`;
      snakeElement.classList.add("snake");

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
        // Apply the same direction to the tail as to the head
        if (direction.x === 0 && direction.y === -1)
          snakeElement.classList.add("up");
        if (direction.x === 1 && direction.y === 0)
          snakeElement.classList.add("right");
        if (direction.x === 0 && direction.y === 1)
          snakeElement.classList.add("down");
        if (direction.x === -1 && direction.y === 0)
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

  function moveSnake() {
    if (gameOver) return;

    const head = {
      x: snake[0].x + direction.x * tileSize,
      y: snake[0].y + direction.y * tileSize,
    };

    if (checkCollision(head)) {
      clearInterval(gameInterval);
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
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    } else {
      snake.pop();
    }
  }

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

  function changeDirection(event) {
    if (gameOver) return;

    switch (event.key) {
      case "ArrowUp":
        if (direction.y === 0) direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (direction.y === 0) direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (direction.x === 0) direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (direction.x === 0) direction = { x: 1, y: 0 };
        break;
    }
  }

  document.addEventListener("keydown", changeDirection);

  function gameLoop() {
    moveSnake();
    draw();
  }

  window.retryGame = function retryGame() {
    clearInterval(gameInterval);
    snake = [{ x: 200, y: 200 }];
    fruit = getNewFruitPosition();
    direction = { x: 0, y: 1 }; // Initial direction is down
    speed = 200;
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = `Score: ${score}`;
    gameInterval = setInterval(gameLoop, speed);
  };

  window.goToMenu = function goToMenu() {
    window.location.href = "../index.html";
  };

  retryGame();
});

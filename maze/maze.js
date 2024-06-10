const mazeWidth = 21;
const mazeHeight = 21;
const cellSize = 1;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const minimapScene = new THREE.Scene();
const minimapCamera = new THREE.OrthographicCamera(
  (-mazeWidth * cellSize) / 2 - cellSize / 2, // left
  (mazeWidth * cellSize) / 2 + cellSize / 2, // right
  (mazeHeight * cellSize) / 2 + cellSize / 2, // top
  (-mazeHeight * cellSize) / 2 - cellSize / 2, // bottom
  0.1,
  100
);
minimapCamera.position.set(
  (mazeWidth * cellSize) / 2 - cellSize / 2, // centrer la caméra sur l'axe X
  50, // hauteur au-dessus du labyrinthe pour une vue de dessus
  (mazeHeight * cellSize) / 2 - cellSize / 2 // centrer la caméra sur l'axe Z
);
minimapCamera.lookAt(
  (mazeWidth * cellSize) / 2 - cellSize / 2, // centrer la vue sur l'axe X
  0, // centrer la vue sur l'axe Y
  (mazeHeight * cellSize) / 2 - cellSize / 2 // centrer la vue sur l'axe Z
);

const minimapRenderer = new THREE.WebGLRenderer();
minimapRenderer.setSize(200, 200);
document.getElementById("minimap").appendChild(minimapRenderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
minimapScene.add(ambientLight.clone());

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 10, 0).normalize();
scene.add(directionalLight);
minimapScene.add(directionalLight.clone());

const controls = new THREE.PointerLockControls(camera, document.body);
controls.pointerSpeed = 0.1;

const blocker = document.getElementById("blocker");
const instructions = document.getElementById("instructions");
const victoryMessage = document.getElementById("victoryMessage");
const pauseMenu = document.getElementById("pauseMenu");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");
const restartButtonVictory = document.getElementById("restartButtonVictory");
const menuButtonVictory = document.getElementById("menuButtonVictory");
const toggleMapButton = document.getElementById("toggleMapButton");
let mapVisible = true; // État de visibilité de la carte

toggleMapButton.addEventListener("click", () => {
  mapVisible = !mapVisible;
  document.getElementById("minimap").style.display = mapVisible
    ? "block"
    : "none";
});

let gameWon = false;
let gamePaused = false;

instructions.addEventListener("click", function () {
  controls.lock();
});

controls.addEventListener("lock", function () {
  instructions.style.display = "none";
  blocker.style.display = "none";
  pauseMenu.style.display = "none";
  gamePaused = false;
});

controls.addEventListener("unlock", function () {
  if (!gameWon) {
    pauseMenu.style.display = "flex";
    gamePaused = true;
  } else {
    pauseMenu.style.display = "none";
  }
  blocker.style.display = "none";
  instructions.style.display = "none";
});

resumeButton.addEventListener("click", () => {
  controls.lock();
});

restartButton.addEventListener("click", () => {
  location.reload();
});

menuButton.addEventListener("click", () => {
  window.location.href = "../index.html";
});

restartButtonVictory.addEventListener("click", () => {
  location.reload();
});

menuButtonVictory.addEventListener("click", () => {
  window.location.href = "../index.html";
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    if (controls.isLocked) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
});

function pauseGame() {
  controls.unlock();
  pauseMenu.style.display = "flex";
  gamePaused = true;
}

function resumeGame() {
  if (!gameWon) {
    controls.lock();
  }
}

scene.add(controls.getObject());

const maze = [];
for (let z = 0; z < mazeHeight; z++) {
  maze[z] = [];
  for (let x = 0; x < mazeWidth; x++) {
    maze[z][x] = 1;
  }
}

function generateMazePrim(x, z) {
  const walls = [];
  const directions = [
    { x: 0, z: -2 },
    { x: 2, z: 0 },
    { x: 0, z: 2 },
    { x: -2, z: 0 },
  ];

  function addWalls(cell) {
    for (const dir of directions) {
      const nx = cell.x + dir.x;
      const nz = cell.z + dir.z;
      if (
        nx > 0 &&
        nx < mazeWidth &&
        nz > 0 &&
        nz < mazeHeight &&
        maze[nz][nx] === 1
      ) {
        walls.push({ x: nx, z: nz, px: cell.x, pz: cell.z });
      }
    }
  }

  maze[z][x] = 0;
  addWalls({ x, z });

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const wall = walls.splice(randomIndex, 1)[0];

    const cellX = wall.x;
    const cellZ = wall.z;
    const parentX = wall.px;
    const parentZ = wall.pz;

    if (maze[cellZ][cellX] === 1) {
      maze[cellZ][cellX] = 0;
      maze[(cellZ + parentZ) / 2][(cellX + parentX) / 2] = 0;
      addWalls({ x: cellX, z: cellZ });
    }
  }
}

generateMazePrim(1, 1);

const walls = [];
const wallBoxes = [];

const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load(
  "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
);
const floorTexture = textureLoader.load(
  "https://threejsfundamentals.org/threejs/resources/images/floor.jpg"
);

function createWall(x, z) {
  const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
  const material = new THREE.MeshStandardMaterial({ map: wallTexture });
  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(x * cellSize, cellSize / 2, z * cellSize);
  scene.add(wall);
  const wallClone = wall.clone();
  wallClone.position.set(x * cellSize, cellSize / 2, z * cellSize);
  minimapScene.add(wallClone);
  walls.push(wall);

  // Adjust hitbox size to be slightly smaller than the wall
  const boxSize = cellSize * 0.8;
  wallBoxes.push(
    new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(wall.position.x, wall.position.y, wall.position.z),
      new THREE.Vector3(boxSize, cellSize, boxSize)
    )
  );
}

for (let z = 0; z < mazeHeight; z++) {
  for (let x = 0; x < mazeWidth; x++) {
    if (maze[z][x] === 1) {
      createWall(x, z);
    }
  }
}

const floorGeometry = new THREE.PlaneGeometry(
  mazeWidth * cellSize,
  mazeHeight * cellSize
);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(
  (mazeWidth * cellSize) / 2 - cellSize / 2,
  0,
  (mazeHeight * cellSize) / 2 - cellSize / 2
); // Center the floor
scene.add(floor);

// Use the same texture for the minimap floor
const miniFloor = new THREE.Mesh(floorGeometry, floorMaterial.clone());
miniFloor.rotation.x = -Math.PI / 2;
miniFloor.position.set(
  (mazeWidth * cellSize) / 2 - cellSize / 2,
  0,
  (mazeHeight * cellSize) / 2 - cellSize / 2
); // Center the minimap floor
minimapScene.add(miniFloor);

const cameraHeight = cellSize / 2;

// Function to find a free cell in the maze
function findFreeCell() {
  for (let z = 0; z < mazeHeight; z++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[z][x] === 0) {
        return { x, z };
      }
    }
  }
  return null;
}

// Function to orient the camera away from walls
function orientCamera(position) {
  const directions = [
    { x: 1, z: 0 }, // right
    { x: -1, z: 0 }, // left
    { x: 0, z: 1 }, // down
    { x: 0, z: -1 }, // up
  ];

  for (const dir of directions) {
    const nx = position.x + dir.x;
    const nz = position.z + dir.z;
    if (
      nx >= 0 &&
      nx < mazeWidth &&
      nz >= 0 &&
      nz < mazeHeight &&
      maze[nz][nx] === 0
    ) {
      // Set camera direction based on free adjacent cell
      camera.lookAt(
        new THREE.Vector3(nx * cellSize, cameraHeight, nz * cellSize)
      );
      return;
    }
  }
}

// Find a free cell for initial spawn
const startCell = findFreeCell();
if (startCell) {
  camera.position.set(
    startCell.x * cellSize,
    cameraHeight,
    startCell.z * cellSize
  );
  orientCamera(startCell);
}

const arrivalGeometry = new THREE.BoxGeometry(cellSize, cellSize / 4, cellSize);
const arrivalMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});
const arrival = new THREE.Mesh(arrivalGeometry, arrivalMaterial);
arrival.position.set(
  (mazeWidth - 2) * cellSize,
  cellSize / 8,
  (mazeHeight - 2) * cellSize
);
scene.add(arrival);
const arrivalClone = arrival.clone();
arrivalClone.position.set(
  (mazeWidth - 2) * cellSize,
  cellSize / 8,
  (mazeHeight - 2) * cellSize
);
minimapScene.add(arrivalClone);

const arrivalBox = new THREE.Box3().setFromObject(arrival);

const playerIndicatorGeometry = new THREE.ConeGeometry(
  cellSize / 2,
  cellSize,
  8
);
const playerIndicatorMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff, // Changer la couleur en jaune vif
});

const playerIndicator = new THREE.Mesh(
  playerIndicatorGeometry,
  playerIndicatorMaterial
);
playerIndicator.rotation.x = Math.PI / 2; // Align the cone horizontally
minimapScene.add(playerIndicator);

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 2.0;
let prevTime = performance.now();

const onKeyDown = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
    case "KeyZ":
      moveForward = true;
      break;
    case "ArrowLeft":
    case "KeyA":
    case "KeyQ":
      moveLeft = true;
      break;
    case "ArrowDown":
    case "KeyS":
      moveBackward = true;
      break;
    case "ArrowRight":
    case "KeyD":
      moveRight = true;
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
    case "KeyZ":
      moveForward = false;
      break;
    case "ArrowLeft":
    case "KeyA":
    case "KeyQ":
      moveLeft = false;
      break;
    case "ArrowDown":
    case "KeyS":
      moveBackward = false;
      break;
    case "ArrowRight":
    case "KeyD":
      moveRight = false;
      break;
  }
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function checkCollision(position) {
  const box = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(position.x, cameraHeight, position.z),
    new THREE.Vector3(cellSize * 0.5, cameraHeight, cellSize * 0.5) // Smaller hitbox for player
  );
  for (const wallBox of wallBoxes) {
    if (box.intersectsBox(wallBox)) {
      return true;
    }
  }
  return false;
}

function checkArrival(position) {
  const box = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(position.x, cameraHeight, position.z),
    new THREE.Vector3(0.5, cameraHeight, 0.5)
  );
  if (box.intersectsBox(arrivalBox)) {
    gameWon = true;
    return true;
  }
  return false;
}

const playerIconSize = cellSize / 2;

function checkIconCollision(position) {
  const box = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(position.x, cameraHeight / 2, position.z),
    new THREE.Vector3(playerIconSize, playerIconSize, playerIconSize)
  );
  for (const wallBox of wallBoxes) {
    if (box.intersectsBox(wallBox)) {
      return true;
    }
  }
  return false;
}

function handleMovement(delta, forward, right) {
  const moveDistance = speed * delta;
  const currentPosition = controls.getObject().position.clone();

  let nextPosition = currentPosition.clone();
  let adjustedForward = forward.clone().multiplyScalar(moveDistance);
  let adjustedRight = right.clone().multiplyScalar(moveDistance);

  if (moveForward) {
    nextPosition.add(adjustedForward);
    if (checkCollision(nextPosition)) {
      nextPosition = currentPosition.clone();
      nextPosition.add(new THREE.Vector3(adjustedForward.x, 0, 0));
      if (!checkCollision(nextPosition)) {
        controls.getObject().position.copy(nextPosition);
      } else {
        nextPosition = currentPosition.clone();
        nextPosition.add(new THREE.Vector3(0, 0, adjustedForward.z));
        if (!checkCollision(nextPosition)) {
          controls.getObject().position.copy(nextPosition);
        }
      }
    } else {
      controls.getObject().position.copy(nextPosition);
    }
  }

  if (moveBackward) {
    nextPosition = currentPosition.clone();
    nextPosition.add(adjustedForward.negate());
    if (checkCollision(nextPosition)) {
      nextPosition = currentPosition.clone();
      nextPosition.add(new THREE.Vector3(-adjustedForward.x, 0, 0));
      if (!checkCollision(nextPosition)) {
        controls.getObject().position.copy(nextPosition);
      } else {
        nextPosition = currentPosition.clone();
        nextPosition.add(new THREE.Vector3(0, 0, -adjustedForward.z));
        if (!checkCollision(nextPosition)) {
          controls.getObject().position.copy(nextPosition);
        }
      }
    } else {
      controls.getObject().position.copy(nextPosition);
    }
  }

  if (moveLeft) {
    nextPosition = currentPosition.clone();
    nextPosition.add(adjustedRight);
    if (checkCollision(nextPosition)) {
      nextPosition = currentPosition.clone();
      nextPosition.add(new THREE.Vector3(adjustedRight.x, 0, 0));
      if (!checkCollision(nextPosition)) {
        controls.getObject().position.copy(nextPosition);
      } else {
        nextPosition = currentPosition.clone();
        nextPosition.add(new THREE.Vector3(0, 0, adjustedRight.z));
        if (!checkCollision(nextPosition)) {
          controls.getObject().position.copy(nextPosition);
        }
      }
    } else {
      controls.getObject().position.copy(nextPosition);
    }
  }

  if (moveRight) {
    nextPosition = currentPosition.clone();
    nextPosition.add(adjustedRight.negate());
    if (checkCollision(nextPosition)) {
      nextPosition = currentPosition.clone();
      nextPosition.add(new THREE.Vector3(-adjustedRight.x, 0, 0));
      if (!checkCollision(nextPosition)) {
        controls.getObject().position.copy(nextPosition);
      } else {
        nextPosition = currentPosition.clone();
        nextPosition.add(new THREE.Vector3(0, 0, -adjustedRight.z));
        if (!checkCollision(nextPosition)) {
          controls.getObject().position.copy(nextPosition);
        }
      }
    } else {
      controls.getObject().position.copy(nextPosition);
    }
  }

  controls.getObject().position.y = cameraHeight;

  if (checkArrival(controls.getObject().position)) {
    victoryMessage.style.display = "block";
    controls.unlock();
  }

  // Mise à jour de la position de l'icône du joueur sur la minimap
  let iconPosition = controls.getObject().position.clone();
  if (checkIconCollision(iconPosition)) {
    // Revenir à la position précédente si collision détectée
    iconPosition = playerIndicator.position.clone();
  }

  playerIndicator.position.set(
    iconPosition.x,
    cameraHeight / 2,
    iconPosition.z
  );

  const playerDirection = new THREE.Vector3();
  camera.getWorldDirection(playerDirection);
  const angle = Math.atan2(playerDirection.z, playerDirection.x);
  playerIndicator.rotation.z = angle - Math.PI / 2; // Rotation de l'icône du joueur sur la minimap avec compensation initiale
}

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    handleMovement(delta, forward, right);

    prevTime = time;
  }

  renderer.render(scene, camera);
  minimapRenderer.render(minimapScene, minimapCamera);
}

animate();

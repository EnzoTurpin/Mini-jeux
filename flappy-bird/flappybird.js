const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Définir les dimensions du canvas
canvas.width = 320;
canvas.height = 480;

// Définir les variables de jeu
let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -15, velocity: 0 };
let pipes = [];
let frameCount = 0;
let score = 0;
let isGameOver = false;

// Fonction pour dessiner l'oiseau
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Fonction pour dessiner les tuyaux
function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        ctx.fillRect(pipe.x, pipe.y + pipe.height + 80, pipe.width, canvas.height - pipe.y - pipe.height - 80);
    });
}

// Fonction pour mettre à jour les positions
function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        isGameOver = true;
    }

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x === bird.x) {
            score++;
        }

        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y + pipe.height || bird.y + bird.height > pipe.y + pipe.height + 80)) {
            isGameOver = true;
        }
    });

    if (frameCount % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - 160));
        pipes.push({ x: canvas.width, y: 0, width: 20, height: pipeHeight });
    }
}

// Fonction pour redémarrer le jeu
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    isGameOver = false;
}

// Boucle de jeu
function gameLoop() {
    if (!isGameOver) {
        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        update();
        requestAnimationFrame(gameLoop);
    } else {
        alert('Game Over! Your score: ' + score);
        resetGame();
        requestAnimationFrame(gameLoop);
    }
}

// Événement de saut
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

gameLoop();

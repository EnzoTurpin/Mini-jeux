document.addEventListener('DOMContentLoaded', () => {
    const colors = ['green', 'red', 'yellow', 'blue'];
    let sequence = [];
    let playerSequence = [];
    let level = 0;

    const status = document.getElementById('status');
    const startButton = document.getElementById('start-btn');
    const buttons = document.querySelectorAll('.color-btn');

    startButton.addEventListener('click', startGame);

    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const color = event.target.id;
            playerSequence.push(color);
            activateButton(color); // Ajouter un retour visuel immédiat
            checkPlayerMove(color);
        });
    });

    function startGame() {
        level = 0;
        sequence = [];
        playerSequence = [];
        status.textContent = 'Suivez la séquence';
        nextRound();
    }

    function nextRound() {
        level++;
        playerSequence = [];
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(nextColor);

        status.textContent = `Niveau ${level}`;

        playSequence();
    }

    function playSequence() {
        let delay = 1000;

        sequence.forEach((color, index) => {
            setTimeout(() => {
                activateButton(color);
            }, delay * (index + 1));
        });
    }

    function activateButton(color) {
        const button = document.getElementById(color);
        button.style.opacity = 0.7;
        setTimeout(() => {
            button.style.opacity = 1;
        }, 500);
    }

    function checkPlayerMove(color) {
        const index = playerSequence.length - 1;

        if (playerSequence[index] !== sequence[index]) {
            status.textContent = 'Game Over! Cliquez sur Start pour recommencer';
            saveHighScore("simonHighScore", level - 1);
            return;
        }

        if (playerSequence.length === sequence.length) {
            setTimeout(nextRound, 1000);
        }
    }

    function saveHighScore(game, score) {
        let highScores = JSON.parse(localStorage.getItem(game)) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores = highScores.slice(0, 5); // Garder uniquement les 5 meilleurs scores
        localStorage.setItem(game, JSON.stringify(highScores));
    }
});

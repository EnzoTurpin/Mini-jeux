document.addEventListener("DOMContentLoaded", () => {
  loadHighScores();
});

function loadHighScores() {
  const ticTacToeScores = localStorage.getItem("ticTacToeHighScore") || 0;
  const memoryScores = localStorage.getItem("memoryHighScore") || 0;
  const game2048Scores = localStorage.getItem("2048HighScore") || 0;

  document.getElementById("tic-tac-toe-scores").innerText += ticTacToeScores;
  document.getElementById("memory-scores").innerText += memoryScores;
  document.getElementById("2048-scores").innerText += game2048Scores;
}

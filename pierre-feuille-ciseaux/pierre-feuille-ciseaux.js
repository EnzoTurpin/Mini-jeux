document.addEventListener("DOMContentLoaded", () => {
  const choices = ["🪨", "📄", "✂️"];
  const buttons = document.querySelectorAll("button");
  const resultDiv = document.getElementById("result");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const playerChoice = button.textContent;
      const computerChoice =
        choices[Math.floor(Math.random() * choices.length)];
      const result = getResult(playerChoice, computerChoice);
      resultDiv.textContent = `Vous avez choisi ${playerChoice}, l'ordinateur a choisi ${computerChoice}. ${result}`;
    });
  });

  function getResult(player, computer) {
    if (player === computer) {
      return "C'est une égalité !";
    } else if (
      (player === "🪨" && computer === "✂️") ||
      (player === "📄" && computer === "🪨") ||
      (player === "✂️" && computer === "📄")
    ) {
      return "Vous gagnez !";
    } else {
      return "Vous perdez !";
    }
  }
});

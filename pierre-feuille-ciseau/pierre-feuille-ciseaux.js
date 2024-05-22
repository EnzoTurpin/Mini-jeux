document.addEventListener("DOMContentLoaded", () => {
  const choices = ["Pierre", "Feuille", "Ciseaux"];
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
      (player === "Pierre" && computer === "Ciseaux") ||
      (player === "Feuille" && computer === "Pierre") ||
      (player === "Ciseaux" && computer === "Feuille")
    ) {
      return "Vous gagnez !";
    } else {
      return "Vous perdez !";
    }
  }
});

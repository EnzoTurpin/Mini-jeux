document.addEventListener("DOMContentLoaded", () => {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "#fff";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  popup.style.zIndex = "1000";

  const instructions = document.createElement("div");
  instructions.innerHTML = `
      <h2>Comment Jouer</h2>
      <div id="gameInstructions"></div>
      <button id="closePopup">Commencer le jeu</button>
    `;

  popup.appendChild(instructions);
  document.body.appendChild(popup);

  document.getElementById("closePopup").addEventListener("click", () => {
    popup.style.display = "none";
  });

  const gameInstructions = {
    "maze-game": `
        <p>Utilisez les touches suivantes pour naviguer dans le labyrinthe :</p>
        <ul>
          <li><strong>Z / Flèche Haut :</strong> Avancer</li>
          <li><strong>S / Flèche Bas :</strong> Reculer</li>
          <li><strong>Q / Flèche Gauche :</strong> Aller à gauche</li>
          <li><strong>D / Flèche Droite :</strong> Aller à droite</li>
        </ul>
      `,
    "2048-game": `
        <p>Utilisez les touches fléchées pour déplacer les tuiles :</p>
        <ul>
          <li><strong>Flèche Haut :</strong> Déplacer les tuiles vers le haut</li>
          <li><strong>Flèche Bas :</strong> Déplacer les tuiles vers le bas</li>
          <li><strong>Flèche Gauche :</strong> Déplacer les tuiles vers la gauche</li>
          <li><strong>Flèche Droite :</strong> Déplacer les tuiles vers la droite</li>
        </ul>
        <p>Lorsque deux tuiles avec le même numéro se touchent, elles fusionnent en une seule !</p>
      `,
    "doodle-jump-game": `
        <p>Utilisez les touches fléchées gauche et droite pour déplacer le joueur :</p>
        <ul>
          <li><strong>Flèche Gauche :</strong> Aller à gauche</li>
          <li><strong>Flèche Droite :</strong> Aller à droite</li>
        </ul>
        <p>Sauter sur les plateformes pour atteindre de nouvelles hauteurs et éviter de tomber.</p>
      `,
    "memory-game": `
        <p>Cliquez sur les cartes pour les retourner et trouver les paires correspondantes :</p>
        <ul>
          <li>Trouvez toutes les paires pour gagner le jeu !</li>
        </ul>
      `,
    "pierre-feuille-ciseaux-game": `
        <p>Cliquez sur le bouton pierre, feuille ou ciseaux pour faire votre choix :</p>
        <ul>
          <li><strong>🪨 bat ✂️</strong> (Pierre bat Ciseaux)</li>
          <li><strong>📄 bat 🪨</strong> (Feuille bat Pierre)</li>
          <li><strong>✂️ bat 📄</strong> (Ciseaux bat Feuille)</li>
        </ul>
        <p>Essayez de battre l'ordinateur !</p>
      `,
    "simon-game": `
        <p>Regardez la séquence de couleurs et répétez-la :</p>
        <ul>
          <li>Cliquez sur les boutons dans le même ordre que la séquence.</li>
          <li>Chaque tour ajoute une nouvelle couleur à la séquence.</li>
        </ul>
        <p>Voyez combien de tours vous pouvez mémoriser !</p>
      `,
    "tic-tac-toe-game": `
        <p>Cliquez sur une case pour placer votre marque (X ou O) :</p>
        <ul>
          <li>Le premier joueur à aligner trois marques gagne !</li>
        </ul>
      `,
  };

  const gameName = document.body.getAttribute("data-game");
  document.getElementById("gameInstructions").innerHTML =
    gameInstructions[gameName] || "Pas d'instructions disponibles pour ce jeu.";
});

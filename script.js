let userScore = 0;
let computerScore = 0;
let tieScore = 0;

function generateComputerChoice() {
  const choices = ['Bat', 'Ball', 'Stump'];
  return choices[Math.floor(Math.random() * 3)];
}

function getResult(user, computer) {
  if (user === computer) return "tie";
  if (
    (user === 'Bat' && computer === 'Ball') ||
    (user === 'Ball' && computer === 'Stump') ||
    (user === 'Stump' && computer === 'Bat')
  ) return "user";
  return "computer";
}

function playGame(userChoice) {
  const computerChoice = generateComputerChoice();
  const winner = getResult(userChoice, computerChoice);

  let resultText = "";

  if (winner === "tie") {
    tieScore++;
    resultText = "It's a tie! ⚖️";
  } else if (winner === "user") {
    userScore++;
    resultText = "You won! 🎉";
  } else {
    computerScore++;
    resultText = "Computer won! 🤖";
  }

  document.getElementById('userChoice').innerText = `You chose: ${addEmoji(userChoice)} ${userChoice}`;
  document.getElementById('computerChoice').innerText = `Computer chose: ${addEmoji(computerChoice)} ${computerChoice}`;
  document.getElementById('resultMsg').innerText = `Result: ${resultText}`;

  updateScoreboard();

  const resultBox = document.getElementById('resultBox');
  resultBox.classList.remove("show");
  void resultBox.offsetWidth; // Reset animation
  resultBox.classList.add("show");
}

function updateScoreboard() {
  document.getElementById('userScore').innerText = userScore;
  document.getElementById('computerScore').innerText = computerScore;
  document.getElementById('tieScore').innerText = tieScore;
}

function resetScore() {
  userScore = 0;
  computerScore = 0;
  tieScore = 0;
  updateScoreboard();

  document.getElementById('userChoice').innerText = '';
  document.getElementById('computerChoice').innerText = '';
  document.getElementById('resultMsg').innerText = '';
  document.getElementById('resultBox').classList.remove("show");
}

function addEmoji(choice) {
  if (choice === "Bat") return "🏏";
  if (choice === "Ball") return "🏐";
  if (choice === "Stump") return "🧱";
}

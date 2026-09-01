import {
  OUTCOMES,
  careerStats,
  createMatch,
  playRound,
  progressPercent,
  sanitiseMatchHistory,
} from "./engine.js";

const HISTORY_KEY = "crease-clash-match-history-v2";
const LABELS = Object.freeze({ bat: "Bat", ball: "Ball", stump: "Stump" });
const DESCRIPTIONS = Object.freeze({ bat: "Bat beats Ball", ball: "Ball beats Stump", stump: "Stump beats Bat" });

const state = {
  history: loadHistory(),
  match: createMatch(),
  recorded: false,
};

const elements = {
  choiceButtons: [...document.querySelectorAll("[data-choice]")],
  computerChoice: document.querySelector("#computer-choice"),
  computerProgress: document.querySelector("#computer-progress"),
  computerScore: document.querySelector("#computer-score"),
  difficulty: document.querySelector("#difficulty"),
  history: document.querySelector("#match-history"),
  matchMessage: document.querySelector("#match-message"),
  newMatch: document.querySelector("#new-match"),
  playerChoice: document.querySelector("#player-choice"),
  playerProgress: document.querySelector("#player-progress"),
  playerScore: document.querySelector("#player-score"),
  roundMessage: document.querySelector("#round-message"),
  roundNumber: document.querySelector("#round-number"),
  rulesDialog: document.querySelector("#rules-dialog"),
  openRules: document.querySelector("#open-rules"),
  closeRules: document.querySelector("#close-rules"),
  statsLost: document.querySelector("#stats-lost"),
  statsPlayed: document.querySelector("#stats-played"),
  statsWon: document.querySelector("#stats-won"),
  target: document.querySelector("#target"),
  ties: document.querySelector("#ties"),
};

function loadHistory() {
  try {
    return sanitiseMatchHistory(JSON.parse(localStorage.getItem(HISTORY_KEY)));
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
}

function startNewMatch() {
  state.match = createMatch({
    target: Number(elements.target.value),
    difficulty: elements.difficulty.value,
  });
  state.recorded = false;
  elements.playerChoice.textContent = "—";
  elements.computerChoice.textContent = "—";
  elements.roundMessage.textContent = "Choose your play to begin.";
  elements.matchMessage.textContent = `First to ${state.match.target} points wins.`;
  renderMatch();
}

function outcomeMessage(round) {
  if (round.outcome === OUTCOMES.TIE) return `Both chose ${LABELS[round.playerChoice]} — replay the point.`;
  if (round.outcome === OUTCOMES.PLAYER) return `${DESCRIPTIONS[round.playerChoice]}. Point to you.`;
  return `${DESCRIPTIONS[round.computerChoice]}. Point to the computer.`;
}

function play(choice) {
  if (state.match.winner) return;
  state.match = playRound(state.match, choice);
  const round = state.match.rounds.at(-1);
  elements.playerChoice.textContent = LABELS[round.playerChoice];
  elements.computerChoice.textContent = LABELS[round.computerChoice];
  elements.roundMessage.textContent = outcomeMessage(round);

  if (state.match.winner && !state.recorded) {
    state.history = [
      {
        winner: state.match.winner,
        playerScore: state.match.playerScore,
        computerScore: state.match.computerScore,
        target: state.match.target,
        difficulty: state.match.difficulty,
        playedAt: new Date().toISOString(),
      },
      ...state.history,
    ].slice(0, 8);
    state.recorded = true;
    saveHistory();
    renderHistory();
  }
  renderMatch();
}

function renderMatch() {
  elements.playerScore.textContent = state.match.playerScore;
  elements.computerScore.textContent = state.match.computerScore;
  elements.ties.textContent = state.match.ties;
  elements.roundNumber.textContent = state.match.rounds.length + 1;
  elements.playerProgress.style.width = `${progressPercent(state.match.playerScore, state.match.target)}%`;
  elements.computerProgress.style.width = `${progressPercent(state.match.computerScore, state.match.target)}%`;
  elements.choiceButtons.forEach((button) => { button.disabled = Boolean(state.match.winner); });

  if (state.match.winner) {
    const playerWon = state.match.winner === OUTCOMES.PLAYER;
    elements.matchMessage.textContent = playerWon
      ? `You won the match ${state.match.playerScore}–${state.match.computerScore}.`
      : `Computer won ${state.match.computerScore}–${state.match.playerScore}. Try a new strategy.`;
    elements.newMatch.focus();
  }
}

function renderHistory() {
  const stats = careerStats(state.history);
  elements.statsPlayed.textContent = stats.played;
  elements.statsWon.textContent = stats.won;
  elements.statsLost.textContent = stats.lost;
  elements.history.replaceChildren();

  if (!state.history.length) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "Finish a match to record it here.";
    elements.history.append(empty);
    return;
  }

  state.history.forEach((match) => {
    const item = document.createElement("li");
    const result = document.createElement("strong");
    result.textContent = match.winner === OUTCOMES.PLAYER ? "Won" : "Lost";
    result.className = match.winner === OUTCOMES.PLAYER ? "won" : "lost";
    const score = document.createElement("span");
    score.textContent = `${match.playerScore}–${match.computerScore} · ${match.target}-point match`;
    const date = document.createElement("time");
    date.dateTime = match.playedAt;
    date.textContent = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(match.playedAt));
    item.append(result, score, date);
    elements.history.append(item);
  });
}

elements.choiceButtons.forEach((button) => {
  button.addEventListener("click", () => play(button.dataset.choice));
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("select, button")) return;
  const keyChoices = { "1": "bat", "2": "ball", "3": "stump" };
  if (keyChoices[event.key]) {
    event.preventDefault();
    play(keyChoices[event.key]);
  }
});

elements.newMatch.addEventListener("click", startNewMatch);
elements.target.addEventListener("change", startNewMatch);
elements.difficulty.addEventListener("change", startNewMatch);
elements.openRules.addEventListener("click", () => elements.rulesDialog.showModal());
elements.closeRules.addEventListener("click", () => elements.rulesDialog.close());
elements.rulesDialog.addEventListener("click", (event) => {
  if (event.target === elements.rulesDialog) elements.rulesDialog.close();
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderHistory();
startNewMatch();


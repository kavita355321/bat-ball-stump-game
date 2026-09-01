export const CHOICES = Object.freeze(["bat", "ball", "stump"]);
export const OUTCOMES = Object.freeze({ PLAYER: "player", COMPUTER: "computer", TIE: "tie" });

const BEATS = Object.freeze({ bat: "ball", ball: "stump", stump: "bat" });
const COUNTER = Object.freeze({ bat: "stump", ball: "bat", stump: "ball" });

export function isChoice(value) {
  return CHOICES.includes(value);
}

export function roundOutcome(playerChoice, computerChoice) {
  if (!isChoice(playerChoice) || !isChoice(computerChoice)) {
    throw new TypeError("Unknown game choice");
  }
  if (playerChoice === computerChoice) return OUTCOMES.TIE;
  return BEATS[playerChoice] === computerChoice ? OUTCOMES.PLAYER : OUTCOMES.COMPUTER;
}

export function mostFrequentChoice(history) {
  const validHistory = history.filter(isChoice);
  if (!validHistory.length) return null;
  const counts = Object.fromEntries(CHOICES.map((choice) => [choice, 0]));
  validHistory.forEach((choice) => { counts[choice] += 1; });
  return CHOICES.reduce((leader, choice) => counts[choice] > counts[leader] ? choice : leader);
}

export function chooseComputerChoice(history = [], difficulty = "balanced", randomValue = Math.random()) {
  const safeRandom = Number.isFinite(randomValue) ? Math.min(0.999999, Math.max(0, randomValue)) : 0.5;
  if (difficulty === "adaptive" && history.length >= 3 && safeRandom < 0.65) {
    const predicted = mostFrequentChoice(history);
    if (predicted) return COUNTER[predicted];
  }
  const shiftedRandom = difficulty === "adaptive" ? (safeRandom + 0.35) % 1 : safeRandom;
  return CHOICES[Math.floor(shiftedRandom * CHOICES.length)];
}

export function createMatch({ target = 3, difficulty = "balanced" } = {}) {
  if (![3, 5].includes(target)) throw new RangeError("Target must be 3 or 5");
  if (!["balanced", "adaptive"].includes(difficulty)) throw new RangeError("Unknown difficulty");
  return {
    target,
    difficulty,
    playerScore: 0,
    computerScore: 0,
    ties: 0,
    rounds: [],
    playerChoices: [],
    winner: null,
  };
}

export function playRound(match, playerChoice, randomValue = Math.random()) {
  if (match.winner) return match;
  if (!isChoice(playerChoice)) throw new TypeError("Unknown player choice");

  const computerChoice = chooseComputerChoice(match.playerChoices, match.difficulty, randomValue);
  const outcome = roundOutcome(playerChoice, computerChoice);
  const next = {
    ...match,
    playerScore: match.playerScore + (outcome === OUTCOMES.PLAYER ? 1 : 0),
    computerScore: match.computerScore + (outcome === OUTCOMES.COMPUTER ? 1 : 0),
    ties: match.ties + (outcome === OUTCOMES.TIE ? 1 : 0),
    playerChoices: [...match.playerChoices, playerChoice],
    rounds: [...match.rounds, { number: match.rounds.length + 1, playerChoice, computerChoice, outcome }],
  };

  if (next.playerScore >= next.target) next.winner = OUTCOMES.PLAYER;
  if (next.computerScore >= next.target) next.winner = OUTCOMES.COMPUTER;
  return next;
}

export function progressPercent(score, target) {
  if (!Number.isFinite(score) || !Number.isFinite(target) || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((score / target) * 100)));
}

export function sanitiseMatchHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry) =>
      entry &&
      [OUTCOMES.PLAYER, OUTCOMES.COMPUTER].includes(entry.winner) &&
      Number.isInteger(entry.playerScore) &&
      Number.isInteger(entry.computerScore) &&
      [3, 5].includes(entry.target) &&
      typeof entry.playedAt === "string",
  ).slice(0, 8);
}

export function careerStats(history) {
  return history.reduce(
    (stats, match) => {
      stats.played += 1;
      if (match.winner === OUTCOMES.PLAYER) stats.won += 1;
      else stats.lost += 1;
      return stats;
    },
    { played: 0, won: 0, lost: 0 },
  );
}


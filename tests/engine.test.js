import test from "node:test";
import assert from "node:assert/strict";

import {
  CHOICES,
  OUTCOMES,
  careerStats,
  chooseComputerChoice,
  createMatch,
  mostFrequentChoice,
  playRound,
  progressPercent,
  roundOutcome,
  sanitiseMatchHistory,
} from "../js/engine.js";

test("each choice beats exactly one other choice", () => {
  assert.equal(roundOutcome("bat", "ball"), OUTCOMES.PLAYER);
  assert.equal(roundOutcome("ball", "stump"), OUTCOMES.PLAYER);
  assert.equal(roundOutcome("stump", "bat"), OUTCOMES.PLAYER);
});

test("matching choices result in a tie", () => {
  CHOICES.forEach((choice) => assert.equal(roundOutcome(choice, choice), OUTCOMES.TIE));
});

test("invalid choices are rejected", () => {
  assert.throws(() => roundOutcome("rock", "bat"), /Unknown game choice/);
});

test("balanced computer selection follows supplied random value", () => {
  assert.equal(chooseComputerChoice([], "balanced", 0), "bat");
  assert.equal(chooseComputerChoice([], "balanced", 0.5), "ball");
  assert.equal(chooseComputerChoice([], "balanced", 0.99), "stump");
});

test("adaptive mode counters the player's most frequent choice", () => {
  assert.equal(mostFrequentChoice(["bat", "bat", "ball"]), "bat");
  assert.equal(chooseComputerChoice(["bat", "bat", "ball"], "adaptive", 0.2), "stump");
});

test("a round updates an immutable match score", () => {
  const match = createMatch();
  const next = playRound(match, "bat", 0.5);
  assert.equal(next.playerScore, 1);
  assert.equal(match.playerScore, 0);
  assert.equal(next.rounds.length, 1);
});

test("match ends when either side reaches the target", () => {
  let match = createMatch({ target: 3 });
  match = playRound(match, "bat", 0.5);
  match = playRound(match, "bat", 0.5);
  match = playRound(match, "bat", 0.5);
  assert.equal(match.winner, OUTCOMES.PLAYER);
  assert.equal(playRound(match, "ball", 0.99), match);
});

test("match configuration rejects unsupported values", () => {
  assert.throws(() => createMatch({ target: 4 }), /Target/);
  assert.throws(() => createMatch({ difficulty: "impossible" }), /difficulty/);
});

test("progress is clamped between zero and one hundred", () => {
  assert.equal(progressPercent(2, 5), 40);
  assert.equal(progressPercent(8, 5), 100);
  assert.equal(progressPercent(-1, 5), 0);
});

test("stored history is sanitised and summarised", () => {
  const history = sanitiseMatchHistory([
    { winner: "player", playerScore: 3, computerScore: 1, target: 3, playedAt: "2026-09-01" },
    { winner: "unknown", playerScore: 1, computerScore: 1, target: 3, playedAt: "bad" },
  ]);
  assert.equal(history.length, 1);
  assert.deepEqual(careerStats(history), { played: 1, won: 1, lost: 0 });
});


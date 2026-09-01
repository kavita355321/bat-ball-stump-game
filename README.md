# Crease Clash — cricket decision game

[![Quality checks](https://github.com/kavita355321/bat-ball-stump-game/actions/workflows/quality.yml/badge.svg)](https://github.com/kavita355321/bat-ball-stump-game/actions/workflows/quality.yml)

Crease Clash is an accessible browser strategy game built with semantic HTML, modern CSS and vanilla JavaScript. It evolves the original Bat–Ball–Stump exercise into a complete match experience with score targets, balanced and adaptive computer modes, keyboard controls, persistent records and independently tested game logic.

## Rules

- **Bat beats Ball** by scoring the delivery
- **Ball beats Stump** by breaking the wicket
- **Stump beats Bat** through a dismissal
- Matching choices are a tie and award no point
- The first player to three or five points wins the match

## Features

- First-to-three and first-to-five match modes
- Balanced random computer or adaptive strategy
- Live score, round count, tie count and progress indicators
- Complete match ending and restart flow
- Local win/loss history and career summary
- Keyboard shortcuts: `1` for Bat, `2` for Ball and `3` for Stump
- Accessible rules dialog and live commentary
- Responsive pitch-inspired interface with reduced-motion support
- Immutable game state and deterministic random injection for testing
- Automated GitHub Actions quality checks

## Technical decisions

| Decision | Reason |
|---|---|
| Pure game engine separated from DOM code | Makes every rule and state transition independently testable |
| Immutable match updates | Prevents hidden side effects between rounds |
| Injected random value | Allows deterministic computer-choice tests |
| Local storage for completed results only | Saves useful progress without accounts or personal data |
| Adaptive strategy based on in-match choices | Demonstrates simple behavioural logic while keeping the game explainable |

## Project structure

```text
.
├── .github/workflows/quality.yml
├── css/styles.css
├── js/
│   ├── app.js
│   └── engine.js
├── tests/engine.test.js
├── .gitignore
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## Run locally

Use a local server because the project uses JavaScript modules:

```bash
git clone https://github.com/kavita355321/bat-ball-stump-game.git
cd bat-ball-stump-game
npx serve .
```

## Run tests

Node.js 20 or newer is required.

```bash
npm ci
npm test
```

## Security and privacy

- No API keys, credentials, accounts, analytics or tracking
- No personal information is collected or transmitted
- Only completed fictional match scores are stored on the current device
- Stored history is validated before it is used

## Future improvements

- Add optional two-player local mode
- Add an explainable post-match strategy summary
- Add browser-level accessibility testing

## Author

Built by [Kavita](https://github.com/kavita355321) as a JavaScript portfolio project.


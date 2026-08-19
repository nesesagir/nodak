# Nodak

Mobile number-logic puzzle game built with Expo and React Native.

Status: in development

<p align="center">
  <img src="./assets/screenshots/feature-graphic.png" width="100%" alt="Nodak feature graphic" />
</p>

Nodak is a minimalist mobile puzzle game focused on spatial reasoning. Each board asks the player to place digits by interpreting distance-based clues and solving the grid with logic, not guesswork.

## Game idea

Fill a 6×6 or 8×8 board with digits `1` to `4`. Each digit must sit exactly that many empty cells away from its matching digit in the same row or column.

## Highlights

- Two board formats: `6×6` and `8×8`
- Progressive level structure with increasing challenge
- Clean, touch-friendly interface designed for mobile play
- Built-in timer and puzzle flow for short gameplay sessions
- `300+` levels currently available

## Screenshots

<p align="center">
  <img src="./assets/screenshots/home.png" width="220" alt="Nodak home screen" />
  <img src="./assets/screenshots/gameplay-6x6.png" width="220" alt="Nodak 6x6 gameplay screen" />
  <img src="./assets/screenshots/gameplay-8x8.png" width="220" alt="Nodak 8x8 gameplay screen" />
  <img src="./assets/screenshots/levels.png" width="220" alt="Nodak levels screen" />
</p>

## Setup

```bash
npm install
npm start
```

```bash
npm run core:smoke
npm run levels:generate
```

## Stack

Expo · React Native · TypeScript · React Navigation · Reanimated

## License

MIT

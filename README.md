# Bubbles von Teefs

`Bubbles von Teefs` is an Aha! extension for teams who believe checking off a to-do should feel less like admin and more like summoning a tiny underwater opera.

When someone completes a to-do in Aha!, an ensemble of pufferfish bursts onto the screen in sequence while bubbles scatter around them. It is whimsical, unnecessary, and exactly the point.

## What It Does

- Watches for completed to-dos in Aha!
- Launches a playful fish-and-bubbles celebration near the completed checkbox
- Uses bundled image assets, so the animation works without external hosting

## Install Locally For Development

Install the Aha! CLI:

```sh
npm install
```

Then install and watch the extension:

```sh
npx aha extension:install
npx aha extension:watch
```

## Build For Distribution

```sh
npx aha extension:build
```

This creates a `.gz` package you can publish for others to install.

## Files

- `src/fish-celebration.js`: animation logic and Aha! event wiring
- `src/fish-data.js`: embedded fish asset used by the celebration
- `src/fish.png`: original source image

## License

MIT

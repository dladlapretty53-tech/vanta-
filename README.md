# VANTA/NULL

VANTA/NULL is a cinematic, anonymous digital archive presented as a recovered computer interface. The project explores a fictional operator with no clear identity, turning a small static site into an atmospheric artifact with interactive fragments, a terminal, and a custom canvas-based signal experiment.

## Concept

The experience is designed to feel like an abandoned archive that has partially reconstructed itself. Visitors are greeted by a boot sequence, then enter a recovered workspace containing:

- Signal: a generative canvas experiment that responds to mouse and touch input.
- Memory: a set of fictional records and hidden clue fragments.
- The Exit: a final codeword challenge revealing a hidden message once the traces align.

The identity remains intentionally anonymous. No real biography, personal details, or actual system credentials are included.

## Project structure

- `index.html` — page markup and layout
- `styles.css` — visual system, responsive layout, and interface styling
- `src/main.js` — app lifecycle and boot flow
- `src/archive.js` — archive navigation, log updates, and session state
- `src/terminal.js` — terminal command registry and render logic
- `src/puzzle.js` — clue discovery and final exit puzzle logic
- `src/experiments/signal.js` — canvas particle experiment

## Prerequisites

This project is intentionally lightweight and does not require a framework or package installation.

You only need:

- A modern browser
- A local static file server or direct file opening in the browser

## How to run locally

Because this project is plain HTML, CSS, and JavaScript, the simplest options are:

1. Open `index.html` directly in a browser.
2. Or serve the folder from a local static server, for example:

   python -m http.server 8000

Then open:

   http://localhost:8000

If Python is unavailable, use any equivalent local static web server on the machine.

## Interactive features

### Opening sequence

The initial boot screen displays a stylized identifier, signal indicator, emblem, and a recovery prompt. Press Enter or click the prompt to initialize the archive.

### Terminal

The in-page terminal supports these commands:

- `help`
- `whoami`
- `trace`
- `projects`
- `status`
- `secret`
- `clear`

Commands are matched case-insensitively and rendered as text only. No arbitrary code execution is performed.

### Signal experiment

The canvas experiment creates a particle field that moves continuously, responds to pointer and touch movement, and emits pulses when clicked. It includes reduced-motion handling and gracefully falls back if the canvas is unavailable.

### Hidden puzzle

Three clues are spread across the archive interface. After all are discovered, a hidden exit sequence becomes available. The final codeword is deterministic and intentionally fictional: `retrace`.

## How to modify content and theme

- Update the color palette in `:root` inside `styles.css`.
- Adjust typography by editing the font imports in `index.html` and the CSS variables.
- Change the archive copy in `index.html`.
- Update terminal responses in `src/terminal.js`.
- Tune particle behavior in `src/experiments/signal.js`.

## Deploy to Render

The repository includes a Render Blueprint in `render.yaml` for a static site. Its small build command copies the HTML, CSS, and JavaScript files into a publish directory; no packages or framework are required.

To create the Render service:

1. Sign in to [Render](https://dashboard.render.com/) and connect GitHub if prompted.
2. Select **New** → **Blueprint**.
3. Choose the `dladlapretty53-tech/vanta-` repository and deploy the `main` branch.
4. Render reads `render.yaml` and publishes the site at its assigned `onrender.com` address.

Automatic deploys are enabled, so later commits pushed to `main` will redeploy the site.

## Known limitations

- This is a front-end-only project without a backend.
- The archive is fictional and intentionally not tied to a real identity or system.
- No external APIs or user tracking are used.
- The project is designed to work as a static experience and is not configured for a server-side app framework.

## Design intent

The goal is to feel less like a developer portfolio and more like a recovered digital artifact: restrained, atmospheric, and intentional. The project uses subtle motion, typography, a dark palette, and a small set of strong interactions rather than overwhelming the visitor with dashboard-like layouts or generic neon effects.

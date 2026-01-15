# Codebase Context: Smash 26 Table Tennis Tournament

## Project Overview
This project is a web-based system for managing and registering for "Smash 26", a corporate Table Tennis tournament for "Tesla Outsourcing Services". It consists of a public registration page and a tournament dashboard.

## File Structure

- **root**
  - `index.html`: The main registration page.
  - `tournament.html`: A dashboard for viewing the tournament schedule, brackets, and rules.
  - `logo.svg`, `logo-2.svg`, `ping-pong.svg`: Image assets.
  - `smash-26-rulebook.pdf`: The official rulebook for the tournament.
  - `tos-tt-main.zip`: Likely a backup or source archive of the project.
  - `easter-egg.webp`: Asset for the easter egg feature.

## Key Files Detail

### `index.html` (Registration Page)
- **Purpose**: Allows players to register for the tournament.
- **Features**:
  - **Form**: Collects name, department, and skill level (Pro vs Dilettante).
  - **Countdown Timer**: Counts down to the registration deadline (Jan 14, 2026).
  - **Live Player Count**: Fetches and displays the number of registered players from a Google Script backend.
  - **Easter Egg**: A hidden feature triggered by clicking the logo multiple times.
  - **Backend Integration**: Submits form data to a Google Apps Script Web App.
  - **Styling**: Custom CSS with some Tailwind-like utility classes defined in `<style>`. Uses specific animations like `popIn`, `spin`, `float`.

### `tournament.html` (Tournament Dashboard)
- **Purpose**: Manages and displays the tournament progression for 13 teams.
- **Features**:
  - **Tabs**: Switch between Schedule, Brackets, and Rules.
  - **Schedule**: detailed order of play with 4 phases (The Openers, Qualifiers, Semi-Finals, Finals). It handles a complex flow including Main Draw and Plate (consolation) brackets.
  - **Brackets**: A visual representation of the tournament tree, drawn using CSS.
  - **Rules**: A section outlining the "On-Deck" system, match formats, and scoring rules.
  - **Styling**: Uses Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`).

## Technologies
- **Frontend**: HTML5, CSS3.
  - `index.html` uses custom CSS.
  - `tournament.html` uses Tailwind CSS.
- **Scripting**: Vanilla JavaScript.
- **Backend/Data**: Google Apps Script (Web App) for storage and interaction (likely Google Sheets).
- **Assets**: SVGs for logos and icons. FontAwesome for icons in the dashboard.

## Observations
- The project relies on external CDNs for fonts (Google Fonts), icons (FontAwesome), and libraries (Tailwind, canvas-confetti).
- The "Backend" is a serverless Google Script, making the frontend a static site that communicates with it.
- The design is "Dark Mode" based for the registration page (`index.html`) and "Light Mode" (clean dashboard style) for the tournament page (`tournament.html`).

# ReFlow
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple addiction recovery tracker. Weekly circle tracker, clean days counter, AI companion for support, and an impulse button for when the urge hits. All data stays on your device.

## Features

- **Weekly Circle Tracker** – Seven circles, each clean day fills one
- **AI Companion** – Talk to a supportive AI powered by DeepSeek API
- **Impulse Button** – When the urge hits, one button gives you a moment to breathe
- **Clean Days Counter** – Days, hours, and minutes since your last slip
- **Onboarding** – Name your addiction and set your reason for quitting
- **Input Sanitization** – Basic protection against XSS attacks

## Pages

- **Home** – Main page with feature overview
![Home Page](screenshots/index.png)

- **Track** – Main dashboard with day counter and weekly circles
![Track Page](screenshots/track.png)

- **Companion** – AI chat interface for support
![Companion Page](screenshots/companion.png)

- **About** – Project mission and QoL improvements
![About Page](screenshots/about.png)

## Tech Stack

- HTML5, CSS3, JavaScript
- DeepSeek API (AI)
- Vercel (hosting + serverless functions)
- localStorage (data persistence)

## Live Demo

[https://re-flow-ashen.vercel.app](https://re-flow-ashen.vercel.app)

## How It Works

1. Name your addiction and your reason for quitting
2. Each clean day fills one circle on your weekly tracker
3. If you slip, the counter resets but your progress stays visible
4. Talk to the AI companion anytime you need support
5. Use the Impulse button when cravings hit hard

## Why I Built This

I know what addiction feels like. Most recovery tools punish you for slipping. ReFlow doesn't.

## License
MIT

## Author
Aeriss: https://github.com/aerissdev-dotcom
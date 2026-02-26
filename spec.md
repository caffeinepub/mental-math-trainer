# Specification

## Summary
**Goal:** Build MathSprint, a fast-paced mental math training game where players solve as many arithmetic problems as possible within 2 minutes.

**Planned changes:**
- Backend actor that generates random arithmetic problems for all four operations (+, -, ×, ÷), with division always yielding whole-number answers
- Backend functions to submit and retrieve top-10 high scores (name, correct count, timestamp), persisted across calls
- Start screen with game name, brief rules, and a "Start Game" button
- Game screen with a 2-minute countdown timer, one problem displayed at a time, numeric input submitted via Enter or button, score increments on correct answers, new problem loads instantly on any answer
- Results screen showing final score, name entry + score submission, top-10 leaderboard, and a "Play Again" button
- Bold, energetic dark-themed UI with neon green/vivid orange accents, large problem typography, and snappy (<150ms) problem transitions

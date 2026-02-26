# Specification

## Summary
**Goal:** Fix the math question not displaying on the game screen during active gameplay.

**Planned changes:**
- Ensure the arithmetic problem from `useGameState` / `useQueries generateProblem` is correctly read and passed to the rendered JSX in `GameScreen.tsx`
- Make the problem text visible immediately when the game starts, with sufficient contrast against the dark background
- Ensure the problem display is not hidden, blocked by a loading state, or showing undefined/null during an active game session
- Display a new problem immediately after each answer submission

**User-visible outcome:** Players can see the arithmetic problem (e.g., "7 × 8 = ?") displayed prominently and legibly on the game screen throughout the entire game session.

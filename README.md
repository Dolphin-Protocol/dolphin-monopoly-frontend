# Monopoly Game Frontend (Single Player)

## Overview
This is the frontend for a single-player Monopoly-style game built using **Next.js**. The main features include:
- **Dice Rolling**: Simulates rolling a six-sided die.
- **Player Movement**: Moves the player token across a fixed game board.
- **Game Board UI**: Displays the Monopoly board and player position.

## Tech Stack
- **Framework**: Next.js (React)
- **State Management**: React useState
- **Styling**: Tailwind CSS
- **Rendering**: HTML & CSS (Canvas not required at this stage)

## Features
### **1. Dice Rolling**
- Clicking the **"Roll Dice"** button randomly selects a number between 1-6.
- Displays the corresponding dice image.

### **2. Player Movement**
- Player starts at position **0**.
- Moves forward based on dice roll.
- Loops back to the beginning if reaching the board's end.

### **3. Game Board Display**
- The game board is a static **image**.
- The player token is positioned dynamically on the board.

## How to Run
1. **Install dependencies**
   ```sh
   yarn install
   ```
2. **Run the development server**
   ```sh
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
# 🎯 Scrabster Pro

Scrabster Pro - das lustige Buchstaben-Salat Spiel

A unique word puzzle game where you win by finding the **fewest words possible**! Challenge yourself to use all randomly generated letters efficiently, or land a "Scrabster" by using all letters in a single word for an instant win!

## 🎮 Game Rules

- **Objective**: Use all available letters by forming the fewest words possible
- **Scrabster Bonus**: Win instantly by using all letters in ONE word! 🏆
- **Time Limit**: 2 minutes to complete each challenge
- **Scoring**: The player with the fewest valid words wins
- **Innovation**: Unique reverse-scoring system rewards lexical efficiency

## ✨ Features

### Core Gameplay
- 🎲 Random letter generation using weighted frequency distribution
- ⏱️ Real-time countdown timer with visual warnings
- ✅ Dictionary-based word validation
- 🏆 Instant win detection for "Scrabster" moves
- 📊 Live statistics and score tracking

### Technology Stack
- **Frontend**: Vue 3 with modern reactive composition
- **Backend**: Node.js with Express
- **Real-time Communication**: WebSocket for instant gameplay updates
- **Build Tool**: Vite for fast development and optimized production builds

### Experimental Features
- 🎤 **Voice Input**: Use the Web Speech API to speak your words instead of typing
- 🔊 Automatic speech recognition for hands-free gameplay
- 🌐 Cross-browser support (Chrome, Edge, Safari)

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/deepsoul/scrabster-pro.git
cd scrabster-pro
```

2. Install dependencies for both frontend and backend:
```bash
npm run install:all
```

### Running the Application

#### Development Mode
Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend (port 3001)
npm run dev:backend

# Terminal 2 - Frontend (port 3000)
npm run dev:frontend
```

#### Production Build
Build the frontend for production:
```bash
npm run build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend WebSocket: ws://localhost:3001

## 🎯 How to Play

1. Click **"Start Game"** to begin
2. You'll receive 9 random letters
3. Form words using the available letters
4. Type your word or use the **🎤 Voice Input** button
5. Submit valid words to use up letters
6. Try to use all letters in the fewest words possible
7. Land a "Scrabster" by using all letters in one word for an instant win!

### Voice Input (Experimental)
1. Click the **🎤 Voice Input** button
2. Speak your word clearly
3. The word will be automatically recognized and submitted
4. Note: Voice input requires a compatible browser (Chrome, Edge, Safari)

## 🏗️ Project Structure

```
scrabster-pro/
├── backend/
│   ├── server.js           # WebSocket server and Express app
│   ├── gameManager.js      # Core game logic and state management
│   ├── letterGenerator.js  # Random letter generation with frequencies
│   └── dictionary.js       # Word validation dictionary
├── frontend/
│   ├── src/
│   │   ├── App.vue        # Main game component
│   │   ├── main.js        # Vue application entry point
│   │   └── style.css      # Global styles and animations
│   ├── index.html         # HTML entry point
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── package.json           # Root package with scripts
└── README.md             # This file
```

## 🎨 Game Design

### Unique Gameplay Mechanics
- **Fewest-Words-Wins**: Unlike traditional word games, Scrabster Pro rewards efficiency over volume
- **Scrabster Achievement**: The ultimate goal - use all letters in a single word
- **Time Pressure**: 2-minute rounds create exciting, fast-paced gameplay
- **Strategic Depth**: Players must balance word length with letter coverage

### User Interface
- Clean, modern design with gradient backgrounds
- Animated letter tiles with hover effects
- Real-time timer with color-coded warnings
- Visual feedback for word submissions
- Responsive layout for various screen sizes

## 🔧 Technical Details

### WebSocket Protocol
Messages exchanged between client and server:

**Client → Server:**
- `join`: Connect to the game
- `startGame`: Initialize a new game
- `submitWord`: Submit a word for validation
- `getState`: Request current game state

**Server → Client:**
- `joined`: Confirmation with player ID
- `gameStarted`: New game initialized with letters
- `wordResult`: Word validation result
- `gameOver`: Game end with statistics
- `error`: Error messages

### Letter Generation
Uses weighted frequency distribution based on English letter frequencies:
- Common letters (E, A, I, O) appear more frequently
- Rare letters (Q, X, Z) appear less frequently
- Ensures playable combinations while maintaining challenge

### Word Validation
- Dictionary contains common English words (extensible)
- Validates word can be formed from available letters
- Checks for duplicate submissions
- Tracks letter usage across multiple words

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Expand the dictionary with more words
- Add multiplayer support
- Implement difficulty levels
- Create mobile app version
- Enhance voice recognition accuracy
- Add sound effects and music

## 📝 License

This project is open source and available under the MIT License.

## 🎉 Credits

Created with ❤️ for word game enthusiasts who appreciate quality over quantity!

---

**Enjoy the game and may you achieve many Scrabsters! 🏆**

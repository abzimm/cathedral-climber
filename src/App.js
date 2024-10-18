import React, { useState } from "react";
import Game from "./components/Game";

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelComplete = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
    } else {
      alert("Congratulations! You've completed all levels!");
      setCurrentLevel(1); // Restart the game
    }
  };

  return (
    <div className="App">
      <h1>My Game</h1>
      <Game levelNumber={currentLevel} onLevelComplete={handleLevelComplete} />
    </div>
  );
}

export default App;

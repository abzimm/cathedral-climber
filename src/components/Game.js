import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "../hooks/useGameLoop";
import { useKeyPress } from "../hooks/useKeyPress";
import { createLevel, drawLevel } from "../utils/levelUtils";
import { createPlayer, updatePlayer, drawPlayer, loadPlayerSprite } from "../utils/playerUtils";
import { setupCanvas, clearCanvas, getCameraOffset } from "../utils/canvasUtils";
import { createEnemy, updateEnemy, drawEnemy } from "../utils/enemyUtils";
import { updateObstacles, drawObstacles } from "../utils/obstacleUtils";
import { CANVAS_WIDTH, CANVAS_HEIGHT, LEVEL_WIDTH, LEVEL_HEIGHT, FIXED_TIME_STEP } from "../constants/gameConstants";

const Game = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const keys = useKeyPress();

  useEffect(() => {
    const loadGame = async () => {
      try {
        await loadPlayerSprite();
        const newLevel = createLevel(currentLevel, LEVEL_WIDTH, LEVEL_HEIGHT);
        setLevel(newLevel);
        const bottomPlatform = newLevel.platforms[0];
        setPlayer(createPlayer(50, bottomPlatform.y - 32 * 2));
        setEnemy(createEnemy(newLevel.enemy));
        setObstacles([]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading game:", err);
        setError("Error loading game: " + err.message);
      }
    };
    setIsLoading(true);
    loadGame();
  }, [currentLevel]);

  const updateGame = useCallback((deltaTime) => {
    if (!player || !level || !enemy) return;

    const updatedPlayer = updatePlayer(player, keys, LEVEL_WIDTH, LEVEL_HEIGHT, level.platforms, level.ladders, deltaTime);
    setPlayer(updatedPlayer);

    const { updatedEnemy, newObstacle } = updateEnemy(enemy, gameTime);
    setEnemy(updatedEnemy);

    if (newObstacle) {
      setObstacles(prevObstacles => [...prevObstacles, newObstacle]);
    }

    setObstacles(prevObstacles => updateObstacles(prevObstacles, LEVEL_HEIGHT));

    // Check for player-obstacle collisions
    const isColliding = obstacles.some(obstacle =>
      updatedPlayer.x < obstacle.x + obstacle.width &&
      updatedPlayer.x + updatedPlayer.width > obstacle.x &&
      updatedPlayer.y < obstacle.y + obstacle.height &&
      updatedPlayer.y + updatedPlayer.height > obstacle.y
    );

    if (isColliding) {
      console.log("Player hit an obstacle!");
      // Here you can add game over logic, reset the level, etc.
    }

    if (updatedPlayer.y < 50) {
      if (currentLevel < 3) {
        setCurrentLevel(prevLevel => prevLevel + 1);
      } else {
        alert("Congratulations! You've completed all levels!");
        setCurrentLevel(1);
      }
    }
  }, [player, level, enemy, keys, gameTime, currentLevel]);

  const drawGame = useCallback((ctx) => {
    if (!ctx || !player || !level || !enemy) return;

    clearCanvas(ctx);

    const { x: cameraX, y: cameraY } = getCameraOffset(player.x, player.y, LEVEL_WIDTH, LEVEL_HEIGHT);

    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    drawLevel(ctx, level);
    drawPlayer(ctx, player);
    drawEnemy(ctx, enemy);
    drawObstacles(ctx, obstacles);

    ctx.restore();
  }, [player, level, enemy, obstacles]);

  useGameLoop(canvasRef, updateGame, drawGame, setGameTime, FIXED_TIME_STEP);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading level {currentLevel}...</div>;

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid black" }}
      />
      <div>Level: {currentLevel}</div>
      <div>Game Time: {Math.floor(gameTime / 1000)} seconds</div>
    </div>
  );
};

export default Game;
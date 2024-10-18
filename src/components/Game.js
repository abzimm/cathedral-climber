import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "./useGameLoop";
import { useKeyPress } from "./useKeyPress";
import { createLevel, drawLevel } from "./levelUtils";
import {
  createPlayer,
  updatePlayer,
  drawPlayer,
  loadPlayerSprite,
} from "./playerUtils";
import {
  setupCanvas,
  clearCanvas,
  getCameraOffset,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./canvasUtils";
import { createEnemy, updateEnemy, drawEnemy } from "./enemyUtils";
import { updateObstacles, drawObstacles } from "./obstacleUtils";
import {
  createAdvancedEnemy,
  updateAdvancedEnemy,
  drawAdvancedEnemy,
} from "./advancedEnemyUtils";
import {
  updateAdvancedObstacles,
  drawAdvancedObstacles,
} from "./advancedObstacleUtils";

const LEVEL_WIDTH = 800;
const LEVEL_HEIGHT = 1200;
const FIXED_TIME_STEP = 1000 / 30; // 60 FPS

const Game = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [advancedEnemy, setAdvancedEnemy] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [advancedObstacles, setAdvancedObstacles] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);

  const keys = useKeyPress();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Loading game...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    const preventDefault = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventDefault);
    return () => window.removeEventListener("keydown", preventDefault);
  }, []);

  useEffect(() => {
    const loadGame = async () => {
      try {
        if (!spritesLoaded) {
          await loadPlayerSprite();
          setSpritesLoaded(true);
        }
        const newLevel = createLevel(currentLevel, LEVEL_WIDTH, LEVEL_HEIGHT);
        setLevel(newLevel);
        const bottomPlatform = newLevel.platforms[0];
        setPlayer(createPlayer(50, bottomPlatform.y - 32 * 2));
        setEnemy(createEnemy(newLevel.enemy));
        setAdvancedEnemy(createAdvancedEnemy(newLevel.advancedEnemy));
        setObstacles([]);
        setAdvancedObstacles([]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading game:", err);
        setError("Error loading game: " + err.message);
      }
    };
    setIsLoading(true);
    loadGame();
  }, [currentLevel, spritesLoaded]);

  const updateGame = useCallback(
    (deltaTime) => {
      if (!player || !level || !enemy || !advancedEnemy) return;

      try {
        const updatedPlayer = updatePlayer(
          player,
          keys,
          LEVEL_WIDTH,
          LEVEL_HEIGHT,
          level.platforms,
          level.ladders,
          deltaTime
        );
        setPlayer(updatedPlayer);

        const { updatedEnemy, newObstacle } = updateEnemy(enemy, gameTime);
        setEnemy(updatedEnemy);

        if (newObstacle) {
          setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
        }

        const {
          updatedEnemy: updatedAdvancedEnemy,
          newObstacle: newAdvancedObstacle,
        } = updateAdvancedEnemy(advancedEnemy, gameTime, level.platforms);
        setAdvancedEnemy(updatedAdvancedEnemy);

        if (newAdvancedObstacle) {
          setAdvancedObstacles((prevObstacles) => [
            ...prevObstacles,
            newAdvancedObstacle,
          ]);
        }

        setObstacles((prevObstacles) =>
          updateObstacles(prevObstacles, LEVEL_HEIGHT)
        );
        setAdvancedObstacles((prevObstacles) =>
          updateAdvancedObstacles(prevObstacles, LEVEL_WIDTH, LEVEL_HEIGHT)
        );
        // Check for player-obstacle collisions
        const isColliding =
          obstacles.some(
            (obstacle) =>
              player.x < obstacle.x + obstacle.width &&
              player.x + player.width > obstacle.x &&
              player.y < obstacle.y + obstacle.height &&
              player.y + player.height > obstacle.y
          ) ||
          advancedObstacles.some(
            (obstacle) =>
              player.x < obstacle.x + obstacle.width &&
              player.x + player.width > obstacle.x &&
              player.y < obstacle.y + obstacle.height &&
              player.y + player.height > obstacle.y
          );

        if (isColliding) {
          console.log("Player hit an obstacle!");
          // Here you can add game over logic, reset the level, etc.
        }

        if (updatedPlayer.y < 50) {
          if (currentLevel < 3) {
            setCurrentLevel((prevLevel) => prevLevel + 1);
          } else {
            alert("Congratulations! You've completed all levels!");
            setCurrentLevel(1);
          }
        }
      } catch (err) {
        console.error("Error updating game:", err);
        setError("Error updating game: " + err.message);
      }
    },
    [player, level, enemy, advancedEnemy, keys, gameTime, currentLevel]
  );

  const drawGame = useCallback(
    (ctx) => {
      if (!ctx || !player || !level || !enemy || !advancedEnemy) return;

      try {
        clearCanvas(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

        const { x: cameraX, y: cameraY } = getCameraOffset(
          player.x,
          player.y,
          LEVEL_WIDTH,
          LEVEL_HEIGHT,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );

        ctx.save();
        ctx.translate(-cameraX, -cameraY);

        drawLevel(ctx, level);
        drawPlayer(ctx, player);
        drawEnemy(ctx, enemy);
        drawAdvancedEnemy(ctx, advancedEnemy);
        drawObstacles(ctx, obstacles);
        drawAdvancedObstacles(ctx, advancedObstacles);

        ctx.restore();
      } catch (err) {
        console.error("Error drawing game:", err);
        setError("Error drawing game: " + err.message);
      }
    },
    [player, level, enemy, advancedEnemy, obstacles, advancedObstacles]
  );

  useGameLoop(canvasRef, updateGame, drawGame, setGameTime, FIXED_TIME_STEP);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading level {currentLevel}...</div>;
  }

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

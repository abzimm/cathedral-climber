import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameConstants';

export const setupCanvas = (canvas) => {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.border = "3px solid black";
};

export const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

export const getCameraOffset = (playerX, playerY, levelWidth, levelHeight) => {
  const x = Math.max(0, Math.min(playerX - CANVAS_WIDTH / 2, levelWidth - CANVAS_WIDTH));
  const y = Math.max(0, Math.min(playerY - CANVAS_HEIGHT / 2, levelHeight - CANVAS_HEIGHT));
  return { x, y };
};
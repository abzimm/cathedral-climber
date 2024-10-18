export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const setupCanvas = (canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "3px solid black";
};

export const clearCanvas = (ctx, width, height) => {
  ctx.clearRect(0, 0, width, height);
};

export const getCameraOffset = (
  playerX,
  playerY,
  levelWidth,
  levelHeight,
  canvasWidth,
  canvasHeight
) => {
  let x = playerX - canvasWidth / 2;
  let y = playerY - canvasHeight / 2;

  x = Math.max(0, Math.min(x, levelWidth - canvasWidth));
  y = Math.max(0, Math.min(y, levelHeight - canvasHeight));

  return { x, y };
};

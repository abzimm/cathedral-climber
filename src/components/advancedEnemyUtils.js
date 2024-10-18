import { createAdvancedObstacle } from './advancedObstacleUtils';

export const createAdvancedEnemy = (levelEnemy) => ({
  ...levelEnemy,
  lastSpawnTime: 0,
  spawnInterval: 4000, // Spawn an obstacle every 2 seconds
});

export const updateAdvancedEnemy = (enemy, gameTime, platforms) => {
  let newObstacle = null;

  // Spawn new obstacle
  if (gameTime - enemy.lastSpawnTime > enemy.spawnInterval) {
    const direction = Math.random() < 0.5 ? -1 : 1; // Randomly choose left (-1) or right (1)
    const spawnX = enemy.x + (direction * (enemy.width / 2 + 10)); // Spawn slightly to the left or right
    newObstacle = createAdvancedObstacle(spawnX, enemy.y + enemy.height, direction, platforms);
    enemy.lastSpawnTime = gameTime;
  }

  return { updatedEnemy: enemy, newObstacle };
};

export const drawAdvancedEnemy = (ctx, enemy) => {
  ctx.fillStyle = '#00FF00'; // Green color for advanced enemy
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
};
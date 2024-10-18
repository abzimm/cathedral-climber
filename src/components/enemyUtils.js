import { createObstacle } from './obstacleUtils';

export const createEnemy = (levelEnemy) => ({
  ...levelEnemy,
  speed: 1.2,
  direction: 1, // 1 for right, -1 for left
  movementRange: 200, // The range of movement in pixels
  startX: levelEnemy.x,
  lastSpawnTime: 0,
  spawnInterval: 4000, // Spawn an obstacle every 3 seconds
});

export const updateEnemy = (enemy, gameTime) => {
  // Move the enemy
  enemy.x += enemy.speed * enemy.direction;

  // Check if the enemy has reached the end of its movement range
  if (
    enemy.x > enemy.startX + enemy.movementRange ||
    enemy.x < enemy.startX - enemy.movementRange
  ) {
    // Reverse direction
    enemy.direction *= -1;
  }

  let newObstacle = null;

  // Spawn new obstacle
  if (gameTime - enemy.lastSpawnTime > enemy.spawnInterval) {
    newObstacle = createObstacle(enemy.x + enemy.width / 2, enemy.y + enemy.height);
    enemy.lastSpawnTime = gameTime;
  }

  return { updatedEnemy: enemy, newObstacle };
};

export const drawEnemy = (ctx, enemy) => {
  ctx.fillStyle = '#FF00FF'; // Magenta color for enemy
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
};
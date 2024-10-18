const GRAVITY = 0.5;
const BOUNCE_FACTOR = -0.6;

export const createAdvancedObstacle = (x, y, direction, platforms) => ({
  x,
  y,
  width: 16,
  height: 16,
  velocityX: direction * 2, // Initial horizontal velocity
  velocityY: 0,
  platforms
});

export const updateAdvancedObstacles = (obstacles, levelWidth, levelHeight) => {
  return obstacles.filter(obstacle => {
    // Apply gravity
    obstacle.velocityY += GRAVITY;

    // Update position
    obstacle.x += obstacle.velocityX;
    obstacle.y += obstacle.velocityY;

    let onPlatform = false;
    for (let platform of obstacle.platforms) {
      if (obstacle.y + obstacle.height > platform.y && 
          obstacle.y < platform.y + platform.height &&
          obstacle.x + obstacle.width > platform.x &&
          obstacle.x < platform.x + platform.width) {
        // Collision with platform
        if (obstacle.velocityY > 0) {
          // Only bounce if not on the bottom platform
          if (platform.y < levelHeight - platform.height) {
            obstacle.y = platform.y - obstacle.height;
            obstacle.velocityY *= BOUNCE_FACTOR;
            onPlatform = true;
          } else {
            // On bottom platform, just place on top and stop vertical movement
            obstacle.y = platform.y - obstacle.height;
            obstacle.velocityY = 0;
          }
        }
      }
    }

    // Bounce off sides
    if (obstacle.x < 0 || obstacle.x + obstacle.width > levelWidth) {
      obstacle.velocityX *= -1;
    }

    // Remove if fallen below the screen
    if (obstacle.y > levelHeight) {
      return false;
    }

    return true;
  });
};

export const drawAdvancedObstacles = (ctx, obstacles) => {
  ctx.fillStyle = '#FFA500'; // Orange color for advanced obstacles
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
};
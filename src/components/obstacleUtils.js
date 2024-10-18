export const createObstacle = (x, y) => ({
    x,
    y,
    width: 16,
    height: 16,
    speed: 2,
  });
  
  export const updateObstacles = (obstacles, levelHeight) => {
    return obstacles.filter(obstacle => {
      // Move obstacle down
      obstacle.y += obstacle.speed;
  
      // Remove obstacle if it's off-screen
      return obstacle.y < levelHeight;
    });
  };
  
  export const drawObstacles = (ctx, obstacles) => {
    ctx.fillStyle = '#00FFFF'; // Cyan color for obstacles
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  };
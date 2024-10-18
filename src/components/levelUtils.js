import { CANVAS_HEIGHT } from './canvasUtils';

const PLATFORM_HEIGHT = 12;
export const LEVEL_HEIGHT = CANVAS_HEIGHT * 2;

const LEVELS = [
  {
    platforms: [
      { x: 0, y: 580, width: 800, height: PLATFORM_HEIGHT },
      { x: 100, y: 460, width: 600, height: PLATFORM_HEIGHT },
      { x: 0, y: 340, width: 700, height: PLATFORM_HEIGHT },
      { x: 300, y: 220, width: 500, height: PLATFORM_HEIGHT },
      { x: 100, y: 100, width: 600, height: PLATFORM_HEIGHT },
    ],
    ladders: [
      { x: 150, y: 460, height: 120 },
      { x: 650, y: 340, height: 120 },
      { x: 350, y: 220, height: 120 },
      { x: 150, y: 100, height: 120 },
    ],
    enemy: { x: 350, y: 68, width: 32, height: 32 },
    advancedEnemy: { x: 500, y: 68, width: 32, height: 32 }
  },
  {
    platforms: [
      { x: 0, y: 580, width: 800, height: PLATFORM_HEIGHT },
      { x: 0, y: 460, width: 300, height: PLATFORM_HEIGHT },
      { x: 500, y: 460, width: 300, height: PLATFORM_HEIGHT },
      { x: 200, y: 340, width: 400, height: PLATFORM_HEIGHT },
      { x: 0, y: 220, width: 300, height: PLATFORM_HEIGHT },
      { x: 500, y: 220, width: 300, height: PLATFORM_HEIGHT },
      { x: 200, y: 100, width: 400, height: PLATFORM_HEIGHT },
    ],
    ladders: [
      { x: 250, y: 460, height: 120 },
      { x: 550, y: 460, height: 120 },
      { x: 350, y: 340, height: 120 },
      { x: 250, y: 220, height: 120 },
      { x: 550, y: 220, height: 120 },
    ],
    enemy: { x: 380, y: 68, width: 32, height: 32 },
    advancedEnemy: { x: 250, y: 68, width: 32, height: 32 }
  },
  {
    platforms: [
      { x: 0, y: 580, width: 800, height: PLATFORM_HEIGHT },
      { x: 100, y: 500, width: 200, height: PLATFORM_HEIGHT },
      { x: 500, y: 500, width: 200, height: PLATFORM_HEIGHT },
      { x: 300, y: 420, width: 200, height: PLATFORM_HEIGHT },
      { x: 100, y: 340, width: 200, height: PLATFORM_HEIGHT },
      { x: 500, y: 340, width: 200, height: PLATFORM_HEIGHT },
      { x: 300, y: 260, width: 200, height: PLATFORM_HEIGHT },
      { x: 100, y: 180, width: 200, height: PLATFORM_HEIGHT },
      { x: 500, y: 180, width: 200, height: PLATFORM_HEIGHT },
      { x: 300, y: 100, width: 200, height: PLATFORM_HEIGHT },
    ],
    ladders: [
      { x: 150, y: 500, height: 80 },
      { x: 550, y: 500, height: 80 },
      { x: 350, y: 420, height: 80 },
      { x: 150, y: 340, height: 80 },
      { x: 550, y: 340, height: 80 },
      { x: 350, y: 260, height: 80 },
      { x: 150, y: 180, height: 80 },
      { x: 550, y: 180, height: 80 },
    ],
    enemy: { x: 380, y: 68, width: 32, height: 32 },
    advancedEnemy: { x: 180, y: 68, width: 32, height: 32 }
  },
];

export const createLevel = (levelNumber, levelWidth, levelHeight) => {
  const validLevelNumber = Math.max(1, Math.min(levelNumber, LEVELS.length));
  const levelIndex = validLevelNumber - 1;
  const level = LEVELS[levelIndex];
  
  console.log(`Creating level: ${validLevelNumber}, index: ${levelIndex}`);
  
  if (!level) {
    console.error(`Level ${validLevelNumber} not found`);
    // Return a default level if the requested level doesn't exist
    return {
      platforms: [{ x: 0, y: levelHeight - PLATFORM_HEIGHT, width: levelWidth, height: PLATFORM_HEIGHT }],
      ladders: [],
      enemy: { x: levelWidth / 2, y: levelHeight - PLATFORM_HEIGHT - 32, width: 32, height: 32 },
      advancedEnemy: { x: levelWidth / 4, y: levelHeight - PLATFORM_HEIGHT - 32, width: 32, height: 32 }
    };
  }
  
  return level;
};

export const drawLevel = (ctx, level) => {
  if (!level || !level.platforms) {
    console.error('Invalid level structure:', level);
    return;
  }

  // Draw platforms
  ctx.fillStyle = '#8B4513'; // Brown color for platforms
  level.platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw ladders
  if (level.ladders) {
    ctx.fillStyle = '#FF0000'; // Red color for ladders
    level.ladders.forEach(ladder => {
      ctx.fillRect(ladder.x, ladder.y, 20, ladder.height);
      // Draw rungs
      for (let y = ladder.y; y < ladder.y + ladder.height; y += 20) {
        ctx.fillRect(ladder.x - 5, y, 30, 5);
      }
    });
  }

  // Note: Enemy drawing has been removed as requested
};
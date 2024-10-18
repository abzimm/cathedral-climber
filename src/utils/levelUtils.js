import { CANVAS_HEIGHT, PLATFORM_HEIGHT } from '../constants/gameConstants';

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
  // Add more levels here...
];

export const createLevel = (levelNumber, levelWidth, levelHeight) => {
  const validLevelNumber = Math.max(1, Math.min(levelNumber, LEVELS.length));
  const levelIndex = validLevelNumber - 1;
  const level = LEVELS[levelIndex];
  
  if (!level) {
    console.error(`Level ${validLevelNumber} not found`);
    return createDefaultLevel(levelWidth, levelHeight);
  }
  
  return level;
};

const createDefaultLevel = (levelWidth, levelHeight) => ({
  platforms: [{ x: 0, y: levelHeight - PLATFORM_HEIGHT, width: levelWidth, height: PLATFORM_HEIGHT }],
  ladders: [],
  enemy: { x: levelWidth / 2, y: levelHeight - PLATFORM_HEIGHT - 32, width: 32, height: 32 },
  advancedEnemy: { x: levelWidth / 4, y: levelHeight - PLATFORM_HEIGHT - 32, width: 32, height: 32 }
});

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
};
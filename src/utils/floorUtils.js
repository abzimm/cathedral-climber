import { CANVAS_WIDTH, CANVAS_HEIGHT } from './canvasUtils';

export const LEVEL_HEIGHT = CANVAS_HEIGHT * 2;

export const createFloors = (levelNumber, levelWidth) => {
  const baseFloors = [
    { x: 0, y: LEVEL_HEIGHT - 20, width: levelWidth, height: 20 },
  ];

  switch (levelNumber) {
    case 1:
      return [
        ...baseFloors,
        { x: 100, y: LEVEL_HEIGHT - 140, width: levelWidth - 200, height: 20 },
        { x: 200, y: LEVEL_HEIGHT - 260, width: levelWidth - 400, height: 20 },
        { x: 100, y: LEVEL_HEIGHT - 380, width: levelWidth - 200, height: 20 },
        { x: 0, y: LEVEL_HEIGHT - 500, width: levelWidth, height: 20 },
      ];
    case 2:
      return [
        ...baseFloors,
        { x: 0, y: LEVEL_HEIGHT - 150, width: levelWidth / 2 - 50, height: 20 },
        { x: levelWidth / 2 + 50, y: LEVEL_HEIGHT - 150, width: levelWidth / 2 - 50, height: 20 },
        { x: levelWidth / 4, y: LEVEL_HEIGHT - 300, width: levelWidth / 2, height: 20 },
        { x: 0, y: LEVEL_HEIGHT - 450, width: levelWidth / 3, height: 20 },
        { x: levelWidth * 2 / 3, y: LEVEL_HEIGHT - 450, width: levelWidth / 3, height: 20 },
      ];
    case 3:
      return [
        ...baseFloors,
        { x: 0, y: LEVEL_HEIGHT - 120, width: levelWidth / 3, height: 20 },
        { x: levelWidth * 2 / 3, y: LEVEL_HEIGHT - 240, width: levelWidth / 3, height: 20 },
        { x: 0, y: LEVEL_HEIGHT - 360, width: levelWidth / 3, height: 20 },
        { x: levelWidth / 2 - 50, y: LEVEL_HEIGHT - 480, width: 100, height: 20 },
      ];
    default:
      return baseFloors;
  }
};

export const drawFloors = (ctx, floors) => {
  if (!Array.isArray(floors)) {
    console.error('Floors is not an array:', floors);
    return;
  }
  ctx.fillStyle = '#8B4513'; // Brown color for floors
  floors.forEach(floor => {
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
  });
};

export const checkFloorCollision = (player, floors) => {
  if (!Array.isArray(floors)) {
    console.error('Floors is not an array:', floors);
    return null;
  }
  for (let floor of floors) {
    if (player.x < floor.x + floor.width &&
        player.x + player.width > floor.x &&
        player.y + player.height > floor.y &&
        player.y < floor.y + floor.height) {
      
      if (player.yVelocity > 0) {
        return floor.y - player.height;
      }
    }
  }
  return null;
};

export const getBottomFloor = (floors) => {
  if (!Array.isArray(floors) || floors.length === 0) {
    console.error('Invalid floors array:', floors);
    return null;
  }
  return floors.reduce((bottom, floor) => floor.y > bottom.y ? floor : bottom);
};
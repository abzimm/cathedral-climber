import { Sprite } from "../components/Sprite";
import { loadImage } from './imageUtils';

import { PLAYER_SPRITE_PATH } from "../constants/gameConstants";

let playerSprite = null;

export const loadPlayerSprite = async () => {
  try {
    const image = await loadImage(PLAYER_SPRITE_PATH);
    playerSprite = new Sprite(image, 2.25);
    return playerSprite;
  } catch (error) {
    console.error("Failed to load player sprite:", error);
    throw error;
  }
};

export const createPlayer = (x, y) => ({
  x,
  y,
  width: 32 * 2.25,
  height: 32 * 2.25,
  speed: 5.15,
  climbSpeed: 4.2,
  jumpStrength: -12,
  yVelocity: 0,
  isJumping: false,
  jumpHoldTime: 0,
  maxJumpHoldTime: 12,
  isOnLadder: false,
  direction: 1,
  sprite: playerSprite,
});

export const updatePlayer = (
  player,
  keys,
  levelWidth,
  levelHeight,
  floors,
  ladders,
  deltaTime
) => {
  let newPlayer = { ...player };
  let isMoving = false;

  // Horizontal movement
  if (keys.ArrowLeft) {
    newPlayer.x -= player.speed;
    newPlayer.direction = -1;
    isMoving = true;
  } else if (keys.ArrowRight) {
    newPlayer.x += player.speed;
    newPlayer.direction = 1;
    isMoving = true;
  }

  // Check if player is on a ladder
  const onLadder = checkLadderCollision(newPlayer, ladders);

  // Vertical movement
  if (onLadder && (keys.ArrowUp || keys.ArrowDown)) {
    newPlayer.isOnLadder = true;
    newPlayer.yVelocity = 0;
    newPlayer.y += keys.ArrowUp ? -player.climbSpeed : player.climbSpeed;
    isMoving = true;
  } else {
    newPlayer.isOnLadder = false;
    newPlayer.yVelocity += 0.8;

    if (keys.Space) {
      if (!newPlayer.isJumping && isOnGround(newPlayer, floors)) {
        newPlayer.yVelocity = player.jumpStrength;
        newPlayer.isJumping = true;
        newPlayer.jumpHoldTime = 0;
      } else if (newPlayer.jumpHoldTime < newPlayer.maxJumpHoldTime) {
        newPlayer.yVelocity -= 0.5;
        newPlayer.jumpHoldTime++;
      }
    } else {
      newPlayer.jumpHoldTime = newPlayer.maxJumpHoldTime;
    }

    newPlayer.y += newPlayer.yVelocity;
  }

  // Apply collisions and constraints
  applyCollisionsAndConstraints(newPlayer, floors, levelWidth, levelHeight);

  // Update sprite animation
  if (newPlayer.sprite) {
    newPlayer.sprite.setAnimation(isMoving ? "run" : "idle");
    newPlayer.sprite.update(deltaTime);
  }

  return newPlayer;
};

export const drawPlayer = (ctx, player) => {
  if (player.sprite) {
    player.sprite.draw(
      ctx,
      Math.round(player.x),
      Math.round(player.y),
      player.direction
    );
  } else {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
};

const checkLadderCollision = (player, ladders) => {
  return ladders.some(
    (ladder) =>
      player.x + player.width / 2 > ladder.x &&
      player.x + player.width / 2 < ladder.x + 20 &&
      player.y + player.height > ladder.y &&
      player.y < ladder.y + ladder.height
  );
};

const applyCollisionsAndConstraints = (
  player,
  floors,
  levelWidth,
  levelHeight
) => {
  // Floor collision
  const floorCollision = checkFloorCollision(player, floors);
  if (floorCollision && !player.isOnLadder) {
    player.y = floorCollision.y - player.height;
    player.yVelocity = 0;
    player.isJumping = false;
  }

  // Ceiling collision
  const ceilingCollision = checkCeilingCollision(player, floors);
  if (ceilingCollision && !player.isOnLadder) {
    player.y = ceilingCollision.y + ceilingCollision.height;
    player.yVelocity = 0;
  }

  // Constrain player to level bounds
  player.x = Math.max(0, Math.min(player.x, levelWidth - player.width));
  player.y = Math.max(0, Math.min(player.y, levelHeight - player.height));
};

const checkFloorCollision = (player, floors) => {
  return floors.find(
    (floor) =>
      player.x < floor.x + floor.width &&
      player.x + player.width > floor.x &&
      player.y + player.height > floor.y &&
      player.y + player.height < floor.y + floor.height + player.yVelocity
  );
};

const checkCeilingCollision = (player, floors) => {
  return floors.find(
    (floor) =>
      player.x < floor.x + floor.width &&
      player.x + player.width > floor.x &&
      player.y < floor.y + floor.height &&
      player.y > floor.y
  );
};

const isOnGround = (player, floors) => {
  return floors.some(
    (floor) =>
      player.x < floor.x + floor.width &&
      player.x + player.width > floor.x &&
      Math.abs(player.y + player.height - floor.y) < 1
  );
};

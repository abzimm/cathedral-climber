import { Sprite, loadImage } from "./Sprite";

const PLAYER_SPRITE_PATH = "/player_.png";
let playerSprite = null;

export const loadPlayerSprite = async () => {
  try {
    console.log("Attempting to load image from:", PLAYER_SPRITE_PATH);
    const image = await loadImage(PLAYER_SPRITE_PATH);
    console.log(
      "Image loaded successfully. Dimensions:",
      image.width,
      "x",
      image.height
    );
    playerSprite = new Sprite(image, 2.25);
    console.log("Player sprite created successfully");
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
    // Climbing ladder
    newPlayer.isOnLadder = true;
    newPlayer.yVelocity = 0;
    if (keys.ArrowUp) {
      newPlayer.y -= player.climbSpeed;
    } else if (keys.ArrowDown) {
      newPlayer.y += player.climbSpeed;
    }
    isMoving = true;
  } else {
    // Not climbing, apply gravity and handle jumping
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

  // Floor collision
  const floorCollision = checkFloorCollision(newPlayer, floors);
  if (floorCollision && !newPlayer.isOnLadder) {
    newPlayer.y = floorCollision.y - newPlayer.height;
    newPlayer.yVelocity = 0;
    newPlayer.isJumping = false;
  }

  // Ceiling collision
  const ceilingCollision = checkCeilingCollision(newPlayer, floors);
  if (ceilingCollision && !newPlayer.isOnLadder) {
    newPlayer.y = ceilingCollision.y + ceilingCollision.height;
    newPlayer.yVelocity = 0;
  }

  // Constrain player to level bounds
  newPlayer.x = Math.max(0, Math.min(newPlayer.x, levelWidth - newPlayer.width));
  newPlayer.y = Math.max(0, Math.min(newPlayer.y, levelHeight - newPlayer.height));

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

const checkFloorCollision = (player, floors) => {
  for (let floor of floors) {
    if (
      player.x < floor.x + floor.width &&
      player.x + player.width > floor.x &&
      player.y + player.height > floor.y &&
      player.y + player.height < floor.y + floor.height + player.yVelocity
    ) {
      return floor;
    }
  }
  return null;
};

const checkCeilingCollision = (player, floors) => {
  for (let floor of floors) {
    if (
      player.x < floor.x + floor.width &&
      player.x + player.width > floor.x &&
      player.y < floor.y + floor.height &&
      player.y > floor.y
    ) {
      return floor;
    }
  }
  return null;
};

const isOnGround = (player, floors) => {
  return floors.some(
    (floor) =>
      player.x < floor.x + floor.width &&
      player.x + player.width > floor.x &&
      Math.abs(player.y + player.height - floor.y) < 1
  );
};
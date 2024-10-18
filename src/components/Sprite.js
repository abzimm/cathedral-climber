export const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Image loaded successfully: ${src}`);
        console.log(`Image dimensions: ${img.width}x${img.height}`);
        resolve(img);
      };
      img.onerror = (event) => {
        console.error("Image load error:", event);
        console.error(`Failed to load image from ${src}`);
        console.error("Make sure the file exists and the path is correct.");
        reject(new Error(`Failed to load image from ${src}`));
      };
      img.src = src;
      console.log(`Attempting to load image from: ${src}`);
    });
  };
  
  export class Sprite {
    constructor(image, scale = 2.25) {
      this.image = image;
      this.frameWidth = 32;
      this.frameHeight = 32;
      this.columns = 2;
      this.rows = 3;
      this.scale = scale;
      this.animations = {
        run: { startFrame: 0, endFrame: 2, frameDuration: 200 },
        idle: { startFrame: 3, endFrame: 4, frameDuration: 1000 },
      };
      this.currentAnimation = "idle";
      this.currentFrame = this.animations.idle.startFrame;
      this.elapsedTime = 0;
    }
  
    setAnimation(animationName) {
      if (
        this.animations[animationName] &&
        this.currentAnimation !== animationName
      ) {
        this.currentAnimation = animationName;
        this.currentFrame = this.animations[animationName].startFrame;
        this.elapsedTime = 0;
      }
    }
  
    update(deltaTime) {
      const animation = this.animations[this.currentAnimation];
      this.elapsedTime += deltaTime;
      if (this.elapsedTime >= animation.frameDuration) {
        this.currentFrame++;
        if (this.currentFrame > animation.endFrame) {
          this.currentFrame = animation.startFrame;
        }
        this.elapsedTime = 0;
      }
    }
  
    draw(ctx, x, y, direction = 1) {
      const col = this.currentFrame % this.columns;
      const row = Math.floor(this.currentFrame / this.columns);
  
      ctx.save();
      ctx.imageSmoothingEnabled = false; // Disable anti-aliasing for crisp pixels
      if (direction === -1) {
        ctx.scale(-1, 1);
        x = -x - this.frameWidth * this.scale;
      }
  
      ctx.drawImage(
        this.image,
        col * this.frameWidth,
        row * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        Math.round(x),
        Math.round(y),
        this.frameWidth * this.scale,
        this.frameHeight * this.scale
      );
  
      ctx.restore();
    }
  }
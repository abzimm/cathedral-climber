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
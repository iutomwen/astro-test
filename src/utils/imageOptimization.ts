// src/utils/imageOptimization.ts
export const getOptimizedImageUrl = (
  width: number,
  height: number,
  category: string = "business"
) => {
  // Use WebP format with optimization parameters
  return `https://picsum.photos/${width}/${height}.webp?random=${category}&blur=0&grayscale=0`;
};

export const getResponsiveImageUrls = (
  baseWidth: number,
  baseHeight: number,
  category: string = "business"
) => {
  return {
    mobile: getOptimizedImageUrl(
      Math.floor(baseWidth * 0.5),
      Math.floor(baseHeight * 0.5),
      category
    ),
    tablet: getOptimizedImageUrl(
      Math.floor(baseWidth * 0.75),
      Math.floor(baseHeight * 0.75),
      category
    ),
    desktop: getOptimizedImageUrl(baseWidth, baseHeight, category),
    large: getOptimizedImageUrl(
      Math.floor(baseWidth * 1.25),
      Math.floor(baseHeight * 1.25),
      category
    ),
  };
};

// Image preload utility
export const preloadImage = (src: string) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
};

import { useState, useEffect } from 'react';
import { ImageAsset, getImageWithFallback, createImageAsset } from '../types/images';

// Hook for managing image loading states
export const useImageLoader = (src: string, fallback?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      setImageSrc(src);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      if (fallback) {
        setImageSrc(fallback);
      }
    };
    
    img.src = src;
  }, [src, fallback]);

  return {
    src: imageSrc,
    isLoading,
    hasError,
    fallback: fallback || '/images/icons/placeholder.svg'
  };
};

// Hook for preloading multiple images
export const useImagePreloader = (imagePaths: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadImage = (src: string) => {
      setLoadingImages(prev => new Set(prev).add(src));
      
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
      };
      
      img.onerror = () => {
        setFailedImages(prev => new Set(prev).add(src));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
      };
      
      img.src = src;
    };

    imagePaths.forEach(loadImage);
  }, [imagePaths]);

  return {
    loadedImages: Array.from(loadedImages),
    loadingImages: Array.from(loadingImages),
    failedImages: Array.from(failedImages),
    isAllLoaded: loadedImages.size === imagePaths.length,
    isLoading: loadingImages.size > 0
  };
};

// Hook for responsive images
export const useResponsiveImage = (
  basePath: string,
  sizes: { [key: string]: string } = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }
) => {
  const [currentSize, setCurrentSize] = useState('medium');

  const getImagePath = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      small: basePath.replace('.', '-small.'),
      medium: basePath,
      large: basePath.replace('.', '-large.')
    };
    return sizeMap[size] || basePath;
  };

  const getImageAsset = (size: string): ImageAsset => {
    const path = getImagePath(size);
    const sizeClasses = sizes[size] || sizes.medium;
    const [width, height] = sizeClasses.split(' ')[0].replace('w-', '').replace('h-', '').split('x');
    
    return createImageAsset(
      path,
      `Image ${size}`,
      parseInt(width) * 4, // Convert Tailwind units to pixels
      parseInt(height) * 4
    );
  };

  return {
    getImagePath,
    getImageAsset,
    currentSize,
    setCurrentSize,
    sizes: Object.keys(sizes)
  };
};

// Hook for lazy loading images
export const useLazyImage = (src: string, options: IntersectionObserverInit = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useState<HTMLImageElement | null>(null)[0];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      options
    );

    if (imgRef) {
      observer.observe(imgRef);
    }

    return () => observer.disconnect();
  }, [imgRef, options]);

  useEffect(() => {
    if (isInView && !hasLoaded) {
      const img = new Image();
      img.onload = () => setHasLoaded(true);
      img.src = src;
    }
  }, [isInView, src, hasLoaded]);

  return {
    imgRef,
    isInView,
    hasLoaded,
    shouldLoad: isInView
  };
};

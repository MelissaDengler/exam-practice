import React, { useState } from 'react';
import { ImageAsset, getImageWithFallback } from '../types/images';
import { useImageLoader, useLazyImage } from '../hooks/useImages';

interface ImageProps {
  src: string;
  alt: string;
  fallback?: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

interface LazyImageProps extends ImageProps {
  lazy: true;
  threshold?: number;
  rootMargin?: string;
}

interface EagerImageProps extends ImageProps {
  lazy?: false;
}

type ImageComponentProps = LazyImageProps | EagerImageProps;

export default function Image(props: ImageComponentProps) {
  const {
    src,
    alt,
    fallback = '/images/icons/placeholder.svg',
    width,
    height,
    className = '',
    onLoad,
    onError,
    lazy = false
  } = props;

  const [imageError, setImageError] = useState(false);
  
  const { src: imageSrc, isLoading, hasError } = useImageLoader(
    imageError ? fallback : src,
    fallback
  );

  const { imgRef, shouldLoad } = useLazyImage(src, {
    threshold: props.lazy ? (props.threshold || 0.1) : 1,
    rootMargin: props.lazy ? (props.rootMargin || '50px') : '0px'
  });

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  const imageProps = {
    src: lazy ? (shouldLoad ? imageSrc : '') : imageSrc,
    alt,
    width,
    height,
    className: `${className} ${isLoading ? 'opacity-50' : ''} ${hasError ? 'opacity-30' : ''}`,
    onLoad: handleLoad,
    onError: handleError,
    loading: lazy ? 'lazy' : 'eager'
  };

  if (lazy) {
    return (
      <img
        ref={imgRef}
        {...imageProps}
      />
    );
  }

  return <img {...imageProps} />;
}

// Specialized image components for common use cases
export function Icon({ src, alt, size = 24, className = '', ...props }: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
} & Omit<ImageProps, 'width' | 'height'>) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      {...props}
    />
  );
}

export function Avatar({ src, alt, size = 40, className = '', ...props }: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
} & Omit<ImageProps, 'width' | 'height'>) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      {...props}
    />
  );
}

export function BackgroundImage({ 
  src, 
  alt, 
  className = '', 
  children,
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
} & Omit<ImageProps, 'width' | 'height'>) {
  return (
    <div 
      className={`relative bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${src})` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  ...props 
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
} & Omit<ImageProps, 'width' | 'height'>) {
  return (
    <Image
      src={src}
      alt={alt}
      className={`w-full h-auto ${className}`}
      {...props}
    />
  );
}

// Utility function to create image asset
export function createImage(src: string, alt: string, width?: number, height?: number): ImageAsset {
  return {
    src: getImageWithFallback(src),
    alt,
    width,
    height
  };
}

import React from 'react';
import Image, { Icon, Avatar, BackgroundImage, ResponsiveImage } from '../components/Image';
import { ICON_PATHS, LOGO_PATHS, AVATAR_PATHS, BACKGROUND_PATHS, COMMON_IMAGES } from '../types/images';
import { useImagePreloader } from '../hooks/useImages';

// Example component showing how to use the image library
export default function ImageLibraryExample() {
  // Preload common images
  const commonImagePaths = [
    ICON_PATHS.checkmark,
    ICON_PATHS.send,
    LOGO_PATHS.ruby,
    AVATAR_PATHS.default
  ];
  
  const { isAllLoaded, isLoading } = useImagePreloader(commonImagePaths);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Image Library Examples</h1>
      
      {/* Basic Image Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Basic Images</h2>
        <div className="flex gap-4 items-center">
          <Image
            src={LOGO_PATHS.ruby}
            alt="Ruby Logo"
            width={100}
            height={50}
            className="border rounded"
          />
          <Image
            src={AVATAR_PATHS.default}
            alt="Default Avatar"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
      </section>

      {/* Icon Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Icons</h2>
        <div className="flex gap-4 items-center">
          <Icon src={ICON_PATHS.checkmark} alt="Checkmark" size={24} />
          <Icon src={ICON_PATHS.send} alt="Send" size={20} />
          <Icon src={ICON_PATHS.arrowLeft} alt="Back" size={16} />
        </div>
      </section>

      {/* Avatar Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Avatars</h2>
        <div className="flex gap-4 items-center">
          <Avatar src={AVATAR_PATHS.default} alt="User" size={40} />
          <Avatar src={AVATAR_PATHS.ruby} alt="Ruby" size={50} />
          <Avatar src={AVATAR_PATHS.student} alt="Student" size={60} />
        </div>
      </section>

      {/* Background Image Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Background Images</h2>
        <BackgroundImage
          src={BACKGROUND_PATHS.hero}
          alt="Hero Background"
          className="h-48 rounded-lg"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold">Content over background</h3>
          </div>
        </BackgroundImage>
      </section>

      {/* Responsive Image Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Responsive Images</h2>
        <ResponsiveImage
          src={BACKGROUND_PATHS.blueGradient}
          alt="Responsive Background"
          className="rounded-lg"
        />
      </section>

      {/* Lazy Loading Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Lazy Loading</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Image
              key={i}
              src={`/images/backgrounds/sample-${i + 1}.jpg`}
              alt={`Sample image ${i + 1}`}
              lazy
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Loading State</h2>
        <div className="text-white">
          {isLoading && <p>Loading images...</p>}
          {isAllLoaded && <p className="text-green-400">All images loaded!</p>}
        </div>
      </section>

      {/* Using Common Images */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Common Images</h2>
        <div className="flex gap-4 items-center">
          <img
            src={COMMON_IMAGES.checkmark.src}
            alt={COMMON_IMAGES.checkmark.alt}
            width={COMMON_IMAGES.checkmark.width}
            height={COMMON_IMAGES.checkmark.height}
            className="border rounded"
          />
          <img
            src={COMMON_IMAGES.rubyLogo.src}
            alt={COMMON_IMAGES.rubyLogo.alt}
            className="border rounded"
          />
        </div>
      </section>
    </div>
  );
}

// Example of using images in a component
export function PaperCard({ title, imagePath }: { title: string; imagePath: string }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <ResponsiveImage
        src={imagePath}
        alt={`${title} paper`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Icon src={ICON_PATHS.checkmark} alt="Available" size={16} />
          <span className="text-sm text-gray-600">Available</span>
        </div>
      </div>
    </div>
  );
}

// Example of using images with error handling
export function SafeImage({ src, alt, fallback }: { src: string; alt: string; fallback?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fallback={fallback || '/images/icons/placeholder.svg'}
      className="w-full h-auto"
      onError={() => console.log('Image failed to load:', src)}
      onLoad={() => console.log('Image loaded successfully:', src)}
    />
  );
}

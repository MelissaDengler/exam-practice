// Image library type definitions and utilities

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// Icon categories
export const ICON_PATHS = {
  // UI Icons
  checkmark: '/images/icons/checkmark.svg',
  cross: '/images/icons/cross.svg',
  arrowLeft: '/images/icons/arrow-left.svg',
  arrowRight: '/images/icons/arrow-right.svg',
  arrowUp: '/images/icons/arrow-up.svg',
  arrowDown: '/images/icons/arrow-down.svg',
  
  // Action Icons
  send: '/images/icons/send.svg',
  skip: '/images/icons/skip.svg',
  back: '/images/icons/back.svg',
  submit: '/images/icons/submit.svg',
  
  // Status Icons
  success: '/images/icons/success.svg',
  error: '/images/icons/error.svg',
  warning: '/images/icons/warning.svg',
  info: '/images/icons/info.svg',
  
  // Navigation Icons
  home: '/images/icons/home.svg',
  menu: '/images/icons/menu.svg',
  close: '/images/icons/close.svg',
  search: '/images/icons/search.svg',
} as const;

// Logo paths
export const LOGO_PATHS = {
  ruby: '/images/logos/ruby-logo.svg',
  rubyWhite: '/images/logos/ruby-logo-white.svg',
  rubyIcon: '/images/logos/ruby-icon.svg',
} as const;

// Background paths
export const BACKGROUND_PATHS = {
  hero: '/images/backgrounds/hero-pattern.jpg',
  blueGradient: '/images/backgrounds/blue-gradient.jpg',
  paperTexture: '/images/backgrounds/paper-texture.jpg',
  dots: '/images/backgrounds/dots-pattern.svg',
} as const;

// Avatar paths
export const AVATAR_PATHS = {
  default: '/images/avatars/user-default.png',
  ruby: '/images/avatars/ruby-avatar.png',
  student: '/images/avatars/student-avatar.png',
  teacher: '/images/avatars/teacher-avatar.png',
} as const;

// Utility function to get image with fallback
export const getImageWithFallback = (
  primaryPath: string,
  fallbackPath: string = '/images/icons/placeholder.svg'
): string => {
  return primaryPath || fallbackPath;
};

// Utility function to create image asset object
export const createImageAsset = (
  src: string,
  alt: string,
  width?: number,
  height?: number
): ImageAsset => ({
  src,
  alt,
  width,
  height,
});

// Predefined image assets for common use cases
export const COMMON_IMAGES = {
  // Icons
  checkmark: createImageAsset(ICON_PATHS.checkmark, 'Checkmark', 24, 24),
  cross: createImageAsset(ICON_PATHS.cross, 'Cross', 24, 24),
  send: createImageAsset(ICON_PATHS.send, 'Send', 20, 20),
  skip: createImageAsset(ICON_PATHS.skip, 'Skip', 20, 20),
  
  // Logos
  rubyLogo: createImageAsset(LOGO_PATHS.ruby, 'Ruby Logo'),
  rubyIcon: createImageAsset(LOGO_PATHS.rubyIcon, 'Ruby Icon', 32, 32),
  
  // Avatars
  defaultAvatar: createImageAsset(AVATAR_PATHS.default, 'Default Avatar', 40, 40),
  rubyAvatar: createImageAsset(AVATAR_PATHS.ruby, 'Ruby Avatar', 40, 40),
} as const;

// Type for all available image paths
export type ImagePath = 
  | typeof ICON_PATHS[keyof typeof ICON_PATHS]
  | typeof LOGO_PATHS[keyof typeof LOGO_PATHS]
  | typeof BACKGROUND_PATHS[keyof typeof BACKGROUND_PATHS]
  | typeof AVATAR_PATHS[keyof typeof AVATAR_PATHS];

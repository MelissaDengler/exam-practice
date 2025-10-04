# Image Library

This directory contains all public images for the Exam Practice Ruby application.

## Directory Structure

```
public/images/
├── icons/           # UI icons, buttons, and interface elements
├── backgrounds/     # Background images and patterns
├── logos/          # Brand logos and company images
├── avatars/        # User avatars and profile pictures
└── README.md       # This documentation file
```

## Usage in React Components

### Import Images
```typescript
// For static imports (recommended for small images)
import logo from '/images/logos/ruby-logo.png';
import background from '/images/backgrounds/blue-pattern.jpg';

// For dynamic imports (recommended for large images)
const imagePath = '/images/icons/checkmark.svg';
```

### Using Images in Components
```tsx
// Static import
<img src={logo} alt="Ruby Logo" className="w-8 h-8" />

// Dynamic path
<img src="/images/avatars/user-default.png" alt="User Avatar" className="w-12 h-12 rounded-full" />

// Background image
<div 
  className="bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/backgrounds/hero-pattern.jpg)' }}
>
  Content here
</div>
```

## Image Guidelines

### File Formats
- **Icons**: SVG (preferred) or PNG
- **Logos**: SVG (preferred) or PNG
- **Backgrounds**: JPG or PNG
- **Avatars**: PNG or JPG

### Naming Convention
- Use kebab-case: `user-avatar.png`
- Be descriptive: `checkmark-icon.svg`
- Include size if multiple versions: `logo-small.png`, `logo-large.png`

### Optimization
- Compress images before adding
- Use appropriate dimensions for web
- Consider using WebP format for better compression

## Adding New Images

1. Place images in the appropriate subdirectory
2. Use descriptive filenames
3. Optimize for web use
4. Update this README if adding new categories

## Categories

### Icons (`/icons/`)
- UI elements (buttons, arrows, checkmarks)
- Navigation icons
- Status indicators
- Action buttons

### Backgrounds (`/backgrounds/`)
- Hero section backgrounds
- Pattern overlays
- Decorative elements
- Texture images

### Logos (`/logos/`)
- Company logos
- Brand assets
- Application icons
- Partner logos

### Avatars (`/avatars/`)
- User profile pictures
- Default avatars
- Character images
- Placeholder images

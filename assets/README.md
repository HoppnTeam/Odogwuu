# Hoppn Mobile App - Assets Documentation

This folder contains all visual assets for the Hoppn African Food Discovery mobile application.

## 📁 Folder Structure

### `/images/logos`
Brand logos and logomarks in various formats and orientations
- **hoppn-logo-main.svg** - Primary brand logo
- **hoppn-logo-horizontal.svg** - Horizontal layout for headers
- **hoppn-logo-vertical.svg** - Vertical layout for splash screens
- **hoppn-logomark.svg** - Icon-only version
- **hoppn-logo-white.svg** - White version for dark backgrounds
- **hoppn-logo-black.svg** - Black version for light backgrounds

### `/images/icons`
Application icons and country flags

#### `/app-icons`
- **icon-1024.png** - iOS App Store icon (1024x1024)
- **icon-512.png** - Android Play Store icon (512x512)
- **favicon-16.png** - Web favicon 16x16
- **favicon-32.png** - Web favicon 32x32
- **favicon-48.png** - Web favicon 48x48

#### `/country-flags`
SVG flags for all African countries featured in the app
- High-quality vector flags for consistent display
- Named by country for easy identification

### `/images/onboarding`
Onboarding screen illustrations and graphics
- **welcome-screen.png** - Main welcome illustration
- **discover-flavors.png** - Flavor discovery illustration
- **support-restaurants.png** - Restaurant support illustration
- **cultural-knowledge.png** - Cultural learning illustration

### `/images/splash`
Splash screen and loading assets
- **splash-screen.png** - Main splash screen background
- **loading-animation.gif** - Loading animation

### `/images/patterns`
African-inspired patterns and textures
- **african-pattern-1.svg** - Traditional geometric pattern
- **african-pattern-2.svg** - Cultural textile pattern
- **african-texture.png** - Subtle background texture

### `/images/placeholders`
Placeholder images for development and fallbacks
- **dish-placeholder.png** - Default dish image
- **restaurant-placeholder.png** - Default restaurant image
- **user-avatar-placeholder.png** - Default user avatar

## 🎨 Design Guidelines

### Color Palette
- **Primary Orange**: #F15029
- **Secondary Blue**: #4C8BF5
- **Accent Gold**: #FFBF00
- **Success Green**: #10B981
- **Error Red**: #EF4444

### Logo Usage
- Maintain minimum clear space around logos
- Use appropriate contrast versions for backgrounds
- Preserve aspect ratios when scaling

### File Formats
- **SVG**: Preferred for logos, icons, and patterns (scalable)
- **PNG**: Used for complex illustrations and photos
- **GIF**: Used for animations only

## 📱 Platform Specifications

### iOS
- App Icon: 1024x1024px PNG (no transparency)
- Splash Screen: 1242x2688px PNG

### Android
- App Icon: 512x512px PNG
- Adaptive Icon: 108x108dp with 72x72dp safe zone

### Web
- Favicon: Multiple sizes (16, 32, 48px)
- Open Graph: 1200x630px

## 🔄 Asset Management

### Naming Convention
- Use kebab-case for file names
- Include size/variant in name when applicable
- Use descriptive names for easy identification

### Version Control
- All assets should be committed to version control
- Use Git LFS for large binary files if needed
- Document any asset updates in commit messages

### Optimization
- Compress images without quality loss
- Use appropriate formats for each use case
- Consider multiple resolutions for different screen densities

## 🚀 Usage in Code

Import assets using the centralized index file:

```typescript
import { Assets } from '@/assets';

// Usage examples
<Image source={Assets.logos.main} />
<Image source={Assets.flags.nigeria} />
<Image source={Assets.placeholders.dish} />
```

## 📞 Contact

For questions about assets or design guidelines, contact the design team.

---

*Last updated: December 2024*
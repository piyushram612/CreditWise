// Simple script to create placeholder PWA icons
// You should replace these with your actual app icons

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon as placeholder
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="20"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/8}" fill="white" text-anchor="middle" dy=".3em">CW</text>
</svg>
`;

// Create Apple touch icons (iOS specific sizes)
const createAppleTouchIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="${size/10}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/6}" fill="white" text-anchor="middle" dy=".3em">CW</text>
</svg>
`;

// Standard PWA icon sizes
const iconSizes = [16, 32, 192, 512];
// iOS specific sizes
const appleSizes = [152, 167, 180];

iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  fs.writeFileSync(path.join(__dirname, '..', 'public', `icon-${size}x${size}.svg`), svgContent);
});

appleSizes.forEach(size => {
  const svgContent = createAppleTouchIcon(size);
  fs.writeFileSync(path.join(__dirname, '..', 'public', `apple-touch-icon-${size}x${size}.svg`), svgContent);
});

// Create a favicon
const faviconSVG = createSVGIcon(32);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), faviconSVG);

console.log('Placeholder icons created for both Android and iOS. Replace with actual PNG icons for production.');
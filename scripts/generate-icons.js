// Simple script to create placeholder PWA icons
// You should replace these with your actual app icons

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon as placeholder
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/8}" fill="white" text-anchor="middle" dy=".3em">CW</text>
</svg>
`;

// For now, we'll create simple placeholder files
// In production, you should use proper PNG icons
const iconSizes = [16, 32, 192, 512];

iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  fs.writeFileSync(path.join(__dirname, '..', 'public', `icon-${size}x${size}.svg`), svgContent);
});

console.log('Placeholder icons created. Replace with actual PNG icons for production.');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source image
const sourceImage = path.join(__dirname, '../public/images/ShifaAILogo.png');
const outputDir = path.join(__dirname, '../public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate favicon.ico (multi-size ICO file)
const generateIco = async () => {
  try {
    // Generate 16x16 PNG
    await sharp(sourceImage)
      .resize(16, 16)
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    
    // Generate 32x32 PNG
    await sharp(sourceImage)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    
    // Generate 48x48 PNG for favicon.ico
    await sharp(sourceImage)
      .resize(48, 48)
      .toFile(path.join(outputDir, 'favicon-48x48.png'));
    
    console.log('Generated favicon PNGs');
    
    // Note: sharp can't create .ico files directly
    // We'll need to use the PNG files with a tool like https://www.favicon-generator.org/
    console.log('Please convert the PNG files to favicon.ico manually');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
};

// Generate Apple Touch Icon (180x180)
const generateAppleTouchIcon = async () => {
  try {
    await sharp(sourceImage)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('Generated Apple Touch Icon');
  } catch (error) {
    console.error('Error generating Apple Touch Icon:', error);
  }
};

// Generate site.webmanifest
const generateWebManifest = () => {
  const manifest = {
    name: 'ShifaAI',
    short_name: 'ShifaAI',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone'
  };

  fs.writeFileSync(
    path.join(outputDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Generated site.webmanifest');
};

// Create favicon.ico placeholder
const createFaviconPlaceholder = () => {
  // This is just a reminder to create the actual favicon.ico
  const placeholder = '# Please create favicon.ico from the generated PNG files\n';
  fs.writeFileSync(path.join(outputDir, 'favicon.ico.txt'), placeholder);
  console.log('Created favicon.ico reminder file');
};

// Run all generation functions
const generateAll = async () => {
  await generateIco();
  await generateAppleTouchIcon();
  generateWebManifest();
  createFaviconPlaceholder();
  console.log('All favicon files generated successfully');
};

generateAll(); 
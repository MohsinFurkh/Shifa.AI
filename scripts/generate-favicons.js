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

// Extract a square portion of the logo (focusing on the icon part) for favicon
const extractIconPortion = async () => {
  try {
    // Get image metadata
    const metadata = await sharp(sourceImage).metadata();
    
    // Create a larger square version first (we'll extract from this)
    // This creates a temporary square image that includes the most recognizable part of the logo
    await sharp(sourceImage)
      .extract({ 
        left: Math.floor(metadata.width * 0.1),  // Focus on left part of logo
        top: 0,
        width: Math.min(metadata.height, Math.floor(metadata.width * 0.8)),
        height: Math.min(metadata.height, Math.floor(metadata.width * 0.8))
      })
      .toFile(path.join(outputDir, 'temp-square-logo.png'));
      
    console.log('Created temporary square logo for favicon');
    return path.join(outputDir, 'temp-square-logo.png');
  } catch (error) {
    console.error('Error extracting icon portion:', error);
    return sourceImage; // Fallback to original image
  }
};

// Generate favicon.ico (multi-size ICO file)
const generateIco = async (squareLogoPath) => {
  try {
    // Generate 16x16 PNG
    await sharp(squareLogoPath)
      .resize(16, 16)
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    
    // Generate 32x32 PNG
    await sharp(squareLogoPath)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    
    // Generate 48x48 PNG for favicon.ico
    await sharp(squareLogoPath)
      .resize(48, 48)
      .toFile(path.join(outputDir, 'favicon-48x48.png'));

    // Generate 64x64 PNG for favicon.ico
    await sharp(squareLogoPath)
      .resize(64, 64)
      .toFile(path.join(outputDir, 'favicon-64x64.png'));
    
    console.log('Generated favicon PNGs');
    
    // Note: sharp can't create .ico files directly
    // Simple copy of the 32x32 image to favicon.ico as a workaround
    fs.copyFileSync(
      path.join(outputDir, 'favicon-32x32.png'),
      path.join(outputDir, 'favicon.ico')
    );
    console.log('Created basic favicon.ico from 32x32 PNG');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
};

// Generate Apple Touch Icon (180x180)
const generateAppleTouchIcon = async (squareLogoPath) => {
  try {
    await sharp(squareLogoPath)
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
        src: '/favicon-64x64.png',
        sizes: '64x64',
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

// Clean up temporary files
const cleanUp = () => {
  try {
    if (fs.existsSync(path.join(outputDir, 'temp-square-logo.png'))) {
      fs.unlinkSync(path.join(outputDir, 'temp-square-logo.png'));
    }
    if (fs.existsSync(path.join(outputDir, 'favicon.ico.txt'))) {
      fs.unlinkSync(path.join(outputDir, 'favicon.ico.txt'));
    }
    console.log('Cleaned up temporary files');
  } catch (error) {
    console.error('Error cleaning up:', error);
  }
};

// Run all generation functions
const generateAll = async () => {
  const squareLogoPath = await extractIconPortion();
  await generateIco(squareLogoPath);
  await generateAppleTouchIcon(squareLogoPath);
  generateWebManifest();
  cleanUp();
  console.log('All favicon files generated successfully');
};

generateAll(); 
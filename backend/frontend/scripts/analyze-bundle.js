/**
 * Bundle analysis script
 * Run with: node scripts/analyze-bundle.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Analyzing bundle size...\n');

try {
  // Build the project
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Analyze bundle
  console.log('\n📊 Bundle Analysis:');
  
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (fs.existsSync(staticDir)) {
    const chunks = fs.readdirSync(staticDir).filter(dir => dir.startsWith('chunks'));
    
    chunks.forEach(chunkDir => {
      const chunkPath = path.join(staticDir, chunkDir);
      const files = fs.readdirSync(chunkPath);
      
      const jsFiles = files.filter(f => f.endsWith('.js'));
      const cssFiles = files.filter(f => f.endsWith('.css'));
      
      console.log(`\n${chunkDir}:`);
      
      jsFiles.forEach(file => {
        const filePath = path.join(chunkPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  📄 ${file}: ${sizeKB} KB`);
      });
      
      cssFiles.forEach(file => {
        const filePath = path.join(chunkPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  🎨 ${file}: ${sizeKB} KB`);
      });
    });
  }

  console.log('\n✅ Bundle analysis complete!');
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}


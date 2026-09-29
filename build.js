const fs = require('fs');
const path = require('path');

const files = ['index.html', 'presentation.css', 'presentation.js', 'README.md', 'vercel.json'];
const targetDirs = ['public', 'dist'];

function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

targetDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  files.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(dirPath, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} -> ${dir}/${file}`);
    }
  });

  // Copy images directory
  const imagesSrc = path.join(__dirname, 'images');
  const imagesDest = path.join(dirPath, 'images');
  copyFolderRecursive(imagesSrc, imagesDest);
  console.log(`Copied images/ -> ${dir}/images/`);
});

console.log('Build completed successfully!');


const fs = require('fs');
const path = require('path');

const files = ['index.html', 'presentation.css', 'presentation.js', 'README.md'];
const targetDirs = ['public', 'dist'];

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
});

console.log('Build completed successfully!');

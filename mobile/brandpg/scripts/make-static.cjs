const fs = require('fs');
const path = require('path');

(function(){
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const targetDir = path.join(projectRoot, 'brnd_static');

    if (!fs.existsSync(distDir)) {
      console.error('Build output not found. Run `npm run build` first.');
      process.exit(1);
    }

    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    if (fs.cp) {
      fs.cpSync(distDir, targetDir, { recursive: true });
    } else {
      copyRecursiveSync(distDir, targetDir);
    }

    console.log('Static build copied to:', targetDir);
    console.log('You can open:', path.join(targetDir, 'index.html'));
  } catch (err) {
    console.error('Error creating static build:', err);
    process.exit(1);
  }

  function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(function(childItemName) {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
})();

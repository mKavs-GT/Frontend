const fs = require('fs');
const path = require('path');

const targets = {
  '/Home': 'index.html',
  '/About': 'about/index.html',
  '/Works': 'works-build/index.dev.html',
  '/Branding': 'branding/index.html',
  '/Pricing': 'pricingpage/index.html',
  '/BookUs': 'loginpg/index.html',
  '/Consult': 'consult/index.html',
  '/Support': 'support/index.html',
  '/Login': 'loginpg/index.html'
};

const baseDir = path.resolve('frontend');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [route, targetRelative] of Object.entries(targets)) {
        const targetAbsolute = path.join(baseDir, targetRelative);
        let relPath = path.relative(path.dirname(fullPath), targetAbsolute).replace(/\\/g, '/');
        
        if (!relPath.startsWith('.')) {
          relPath = './' + relPath;
        }

        // Replace href="/Route"
        const regex1 = new RegExp('href="' + route + '"', 'g');
        content = content.replace(regex1, 'href="' + relPath + '"');

        const regex2 = new RegExp("href='" + route + "'", 'g');
        content = content.replace(regex2, "href='" + relPath + "'");

        // Replace in JS for window.location (e.g. '/Route')
        const regex3 = new RegExp("['\"]" + route + "['\"]", 'g');
        content = content.replace(regex3, "'" + relPath + "'");
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir(baseDir);

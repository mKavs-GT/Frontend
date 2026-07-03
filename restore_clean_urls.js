const fs = require('fs');
const path = require('path');

const targets = {
  '/Home': 'index.html',
  '/About': 'about/index.html',
  '/Works': 'works/dist/index.html', // Note: vercel.json uses works/dist/index.html
  '/Branding': 'branding/index.html',
  '/Pricing': 'pricingpage/index.html',
  '/BookUs': 'loginpg/index.html',
  '/Consult': 'consult/index.html',
  '/Support': 'support/index.html',
  '/Login': 'loginpg/index.html'
};

// Also account for the old target from their script which was 'works-build/index.dev.html'
const oldTargets = {
    '/Works': 'works-build/index.dev.html'
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
      
      const allTargets = {...targets, ...oldTargets};

      for (const [route, targetRelative] of Object.entries(allTargets)) {
        const targetAbsolute = path.join(baseDir, targetRelative);
        let relPath = path.relative(path.dirname(fullPath), targetAbsolute).replace(/\\/g, '/');
        
        if (!relPath.startsWith('.')) {
          relPath = './' + relPath;
        }

        // Replace href="./about/index.html" with href="/About"
        // Need to escape the dot in the regex
        const escapedRelPath = relPath.replace(/\./g, '\\.');
        
        const regex1 = new RegExp('href="' + escapedRelPath + '"', 'g');
        content = content.replace(regex1, 'href="' + route + '"');

        const regex2 = new RegExp("href='" + escapedRelPath + "'", 'g');
        content = content.replace(regex2, "href='" + route + "'");

        const regex3 = new RegExp("= '" + escapedRelPath + "'", 'g');
        content = content.replace(regex3, "= '" + route + "'");

        const regex4 = new RegExp('window.location.href="' + escapedRelPath + '"', 'g');
        content = content.replace(regex4, 'window.location.href="' + route + '"');
        
        const regex5 = new RegExp("window.location.href='" + escapedRelPath + "'", 'g');
        content = content.replace(regex5, "window.location.href='" + route + "'");
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Restored clean URL for ' + fullPath);
      }
    }
  }
}

processDir(baseDir);

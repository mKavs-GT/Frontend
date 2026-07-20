const fs = require('fs');
const path = require('path');

const root = path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/Portfolio/E-Commerce');
const sites = ['hush', 'slick', 'wegrow'];

sites.forEach(site => {
  const siteDir = path.join(root, site);
  if (!fs.existsSync(siteDir)) return;
  
  const basePath = `/Portfolio/E-Commerce/${site}/`;

  function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!['node_modules', '.git'].includes(file)) processDir(fullPath);
      } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;

        // Fix href="something"
        content = content.replace(/href=["'](?!\/|http|mailto|tel|#|data:)(?:\.\/)?([^"']+)["']/gi, (match, p1) => {
          return `href="${basePath}${p1}"`;
        });

        // Fix src="something"
        content = content.replace(/src=["'](?!\/|http|data:)(?:\.\/)?([^"']+)["']/gi, (match, p1) => {
          return `src="${basePath}${p1}"`;
        });

        // Fix url("something") or url('something')
        content = content.replace(/url\(['"]?(?!\/|http|data:)(?:\.\/)?([^'"\)]+)['"]?\)/gi, (match, p1) => {
          return `url("${basePath}${p1}")`;
        });

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content);
          console.log(`Updated paths in: ${fullPath.replace(root, '')}`);
        }
      }
    }
  }

  processDir(siteDir);
});

console.log('Static site path replacement complete.');


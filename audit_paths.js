const fs = require('fs');
const path = require('path');

const root = path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/Portfolio/E-Commerce');
let report = '';

function findPaths(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git'].includes(file)) findPaths(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        const regex = /(?:href|src|url)\s*[=:]\s*["'`]?([^\s"'`)]+)/gi;
        let match;
        while ((match = regex.exec(line)) !== null) {
          const p = match[1];
          if (p.startsWith('../') || p.startsWith('./') || p.includes('Portfolio/Ecommerce') || (!p.startsWith('http') && !p.startsWith('/') && !p.startsWith('#') && !p.startsWith('data:'))) {
            report += fullPath.replace(root, '').replace(/\\/g, '/') + ':' + (i+1) + ' -> ' + p + '\n';
          }
        }
      });
    }
  }
}

findPaths(root);
fs.writeFileSync('path_audit.txt', report);
console.log('Audit complete.');

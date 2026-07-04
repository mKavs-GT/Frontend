const fs = require('fs');
const path = require('path');

const replacements = [
  // Any link to about.html or ../about/about.html -> /About
  { regex: /href:?\s*["']\.\.\/about\/about\.html["']/g, replacement: 'href:"/About"' },
  { regex: /href:?\s*["']about\.html["']/g, replacement: 'href:"/About"' },
  { regex: /href:?\s*["']\.\.\/about\.html["']/g, replacement: 'href:"/About"' },
  { regex: /href:?\s*["']\.\.\/\.\.\/about\.html["']/g, replacement: 'href:"/About"' },
  { regex: /(["'])\.\.\/about\/about\.html\1/g, replacement: '"/About"' },
  
  // Works
  { regex: /(["'])\.\.\/works-build\/index\.dev\.html\1/g, replacement: '"/Works"' },
  
  // Branding
  { regex: /(["'])\.\.\/branding\/branding\.html\1/g, replacement: '"/Branding"' },
  { regex: /(["'])branding\.html\1/g, replacement: '"/Branding"' },
  
  // Pricing
  { regex: /(["'])\.\.\/pricingpage\/pricing\.html\1/g, replacement: '"/Pricing"' },
  { regex: /(["'])pricing\.html\1/g, replacement: '"/Pricing"' },
  
  // Login / BookUs
  { regex: /(["'])\.\.\/loginpg\/login\.html\1/g, replacement: '"/BookUs"' },
  { regex: /(["'])login\.html\1/g, replacement: '"/BookUs"' },
  
  // Support
  { regex: /(["'])\.\.\/support\/support\.html\1/g, replacement: '"/Support"' },
  
  // Consult
  { regex: /(["'])\.\.\/consult\/consult\.html\1/g, replacement: '"/Consult"' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed links in: ' + fullPath);
      }
    }
  }
}

processDir(path.resolve('frontend'));

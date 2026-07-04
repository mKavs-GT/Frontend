const fs = require('fs');
const path = require('path');

const replacements = [
  // Home
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*index\.html[`"']/gi, replacement: 'href:"/Home"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*index\.html[`"']/gi, replacement: 'href="/Home"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*index\.html[`"']/gi, replacement: '"/Home"' },
  
  // Works
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*works-build\/index\.dev\.html[`"']/gi, replacement: 'href:"/Works"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*works-build\/index\.dev\.html[`"']/gi, replacement: 'href="/Works"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*works-build\/index\.dev\.html[`"']/gi, replacement: '"/Works"' },

  // About
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*about\/(?:about|index)\.html[`"']/gi, replacement: 'href:"/About"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*about\/(?:about|index)\.html[`"']/gi, replacement: 'href="/About"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*about\.html[`"']/gi, replacement: 'href:"/About"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*about\.html[`"']/gi, replacement: 'href="/About"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*about\/(?:about|index)\.html[`"']/gi, replacement: '"/About"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*about\.html[`"']/gi, replacement: '"/About"' },

  // Branding
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*branding\/(?:branding|index)\.html[`"']/gi, replacement: 'href:"/Branding"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*branding\/(?:branding|index)\.html[`"']/gi, replacement: 'href="/Branding"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*branding\.html[`"']/gi, replacement: 'href:"/Branding"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*branding\.html[`"']/gi, replacement: 'href="/Branding"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*branding\/(?:branding|index)\.html[`"']/gi, replacement: '"/Branding"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*branding\.html[`"']/gi, replacement: '"/Branding"' },

  // Pricing
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*pricingpage\/(?:pricing|index)\.html[`"']/gi, replacement: 'href:"/Pricing"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*pricingpage\/(?:pricing|index)\.html[`"']/gi, replacement: 'href="/Pricing"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*pricing\.html[`"']/gi, replacement: 'href:"/Pricing"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*pricing\.html[`"']/gi, replacement: 'href="/Pricing"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*pricingpage\/(?:pricing|index)\.html[`"']/gi, replacement: '"/Pricing"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*pricing\.html[`"']/gi, replacement: '"/Pricing"' },

  // BookUs / Login
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*loginpg\/(?:login|index)\.html[`"']/gi, replacement: 'href:"/BookUs"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*loginpg\/(?:login|index)\.html[`"']/gi, replacement: 'href="/BookUs"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*login\.html[`"']/gi, replacement: 'href:"/BookUs"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*login\.html[`"']/gi, replacement: 'href="/BookUs"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*loginpg\/(?:login|index)\.html[`"']/gi, replacement: '"/BookUs"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*login\.html[`"']/gi, replacement: '"/BookUs"' },

  // Consult
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*consult\/(?:consult|index)\.html[`"']/gi, replacement: 'href:"/Consult"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*consult\/(?:consult|index)\.html[`"']/gi, replacement: 'href="/Consult"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*consult\.html[`"']/gi, replacement: 'href:"/Consult"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*consult\.html[`"']/gi, replacement: 'href="/Consult"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*consult\/(?:consult|index)\.html[`"']/gi, replacement: '"/Consult"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*consult\.html[`"']/gi, replacement: '"/Consult"' },

  // Support
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*support\/(?:support|index)\.html[`"']/gi, replacement: 'href:"/Support"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*support\/(?:support|index)\.html[`"']/gi, replacement: 'href="/Support"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*support\.html[`"']/gi, replacement: 'href:"/Support"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*support\.html[`"']/gi, replacement: 'href="/Support"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*support\/(?:support|index)\.html[`"']/gi, replacement: '"/Support"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*support\.html[`"']/gi, replacement: '"/Support"' },
  
  // Profile
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*profile\/(?:profile|index)\.html(?:\?login=success)?[`"']/gi, replacement: 'href:"/Profile"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*profile\/(?:profile|index)\.html(?:\?login=success)?[`"']/gi, replacement: 'href="/Profile"' },
  { regex: /href\s*:\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*profile\.html(?:\?login=success)?[`"']/gi, replacement: 'href:"/Profile"' },
  { regex: /href\s*=\s*[`"'](?:\/?)(?:\.\.\/|\.\/)*profile\.html(?:\?login=success)?[`"']/gi, replacement: 'href="/Profile"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*profile\/(?:profile|index)\.html(?:\?login=success)?[`"']/gi, replacement: '"/Profile"' },
  { regex: /[`"'](?:\/?)(?:\.\.\/|\.\/)*profile\.html(?:\?login=success)?[`"']/gi, replacement: '"/Profile"' },
  
  // Also explicitly replace /index.html with /Home
  { regex: /href\s*=\s*[`"']\/index\.html[`"']/gi, replacement: 'href="/Home"' },
  { regex: /href\s*:\s*[`"']\/index\.html[`"']/gi, replacement: 'href:"/Home"' },
  { regex: /[`"']\/index\.html[`"']/gi, replacement: '"/Home"' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      // Specifically ignore iframe src for portfolio pages which shouldn't be touched.
      // Wait, if it replaces it, I should undo it for portfolio. Let's just fix it.
      content = content.replace(/src="\/Home"/g, 'src="./index.html"');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed links in: ' + fullPath);
      }
    }
  }
}

processDir(path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend'));
processDir(path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/works-src'));

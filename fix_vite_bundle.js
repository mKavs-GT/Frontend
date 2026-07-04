const fs = require('fs');
const path = require('path');

const file = path.resolve('frontend/works-build/assets/index-BMg4ettD.js');

let content = fs.readFileSync(file, 'utf8');
const originalContent = content;

// Replace any variant of about.html in the JS bundle
content = content.replace(/(["'])(?:\.\.\/)*(?:about\/)?about\.html\1/g, '"/About"');
content = content.replace(/(["'])(?:\.\.\/)*(?:branding\/)?branding\.html\1/g, '"/Branding"');
content = content.replace(/(["'])(?:\.\.\/)*(?:pricingpage\/)?pricing\.html\1/g, '"/Pricing"');
content = content.replace(/(["'])(?:\.\.\/)*(?:loginpg\/)?login\.html\1/g, '"/BookUs"');
content = content.replace(/(["'])(?:\.\.\/)*(?:support\/)?support\.html\1/g, '"/Support"');
content = content.replace(/(["'])(?:\.\.\/)*(?:consult\/)?consult\.html\1/g, '"/Consult"');
content = content.replace(/(["'])(?:\.\.\/)*works-build\/index\.dev\.html\1/g, '"/Works"');

if (content !== originalContent) {
  fs.writeFileSync(file, content);
  console.log('Fixed links in index-BMg4ettD.js!');
} else {
  console.log('No links found to fix in index-BMg4ettD.js');
}

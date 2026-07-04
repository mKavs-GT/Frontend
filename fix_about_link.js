const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/works-build/assets/index-BMg4ettD.js');

try {
  let content = fs.readFileSync(targetFile, 'utf8');
  let originalContent = content;

  // Replace any about.html variations with /About, considering backticks
  content = content.replace(/href\s*:\s*[`"'][^`"']*about\/about\.html[`"']/gi, 'href:"/About"');
  content = content.replace(/href\s*:\s*[`"'][^`"']*about\.html[`"']/gi, 'href:"/About"');
  content = content.replace(/[`"'][^`"']*about\/about\.html[`"']/gi, '"/About"');
  content = content.replace(/[`"'][^`"']*about\.html[`"']/gi, '"/About"');
  
  if (content !== originalContent) {
    fs.writeFileSync(targetFile, content);
    console.log('Successfully fixed about links in ' + targetFile);
  } else {
    console.log('No links were found to replace in ' + targetFile);
  }
} catch (e) {
  console.error(e);
}

const fs = require('fs');
const content = fs.readFileSync('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/works-build/assets/index-BMg4ettD.js', 'utf8');
const index = content.indexOf('about.html');
if (index !== -1) {
  console.log('FOUND:', content.substring(Math.max(0, index - 50), index + 50));
} else {
  console.log('NOT FOUND');
}

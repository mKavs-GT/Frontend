const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend';

const replacements = [
    { regex: /href=["']branding\.html["']/g, replace: 'href="/Branding"' },
    { regex: /href=["']pricing\.html["']/g, replace: 'href="/Pricing"' },
    { regex: /href=["']support\.html["']/g, replace: 'href="/Support"' },
    { regex: /href=["']consult\.html["']/g, replace: 'href="/BookUs"' },
    { regex: /href=["']login\.html["']/g, replace: 'href="/Login"' },
    
    // Also catch some single quote variants or spaces just in case
    { regex: /href=["']\.\/consult\/consult\.html\s*["']/g, replace: 'href="/BookUs"' }
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.vercel') {
            continue; 
        }
        
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const { regex, replace } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replace);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed bare links in ${fullPath}`);
            }
        }
    }
}

processDirectory(dir);
console.log('Done fixing internal links!');

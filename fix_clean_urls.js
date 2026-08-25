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
  { regex: /[`"']\/index\.html[`"']/gi, replacement: '"/Home"' },

  // E-Commerce Portfolio Migrations (with index.html removal)
  { regex: /Portfolio\/Ecommerce\/Bag\/index\.html/gi, replacement: 'Portfolio/E-Commerce/hush/' },
  { regex: /Portfolio\/Ecommerce\/Ink\/index\.html/gi, replacement: 'Portfolio/E-Commerce/slick/' },
  { regex: /Portfolio\/Ecommerce\/Kaizoku\/index\.html/gi, replacement: 'Portfolio/E-Commerce/kaizoku/' },
  { regex: /Portfolio\/Ecommerce\/Kaizoku\/dist\/index\.html/gi, replacement: 'Portfolio/E-Commerce/kaizoku/' },
  { regex: /Portfolio\/E-Commerce\/kaizoku\/dist\/index\.html/gi, replacement: 'Portfolio/E-Commerce/kaizoku/' },
  { regex: /Portfolio\/Ecommerce\/Wegrow\/index\.html/gi, replacement: 'Portfolio/E-Commerce/wegrow/' },
  { regex: /Portfolio\/Ecommerce\/Bag/gi, replacement: 'Portfolio/E-Commerce/hush' },
  { regex: /Portfolio\/Ecommerce\/Ink/gi, replacement: 'Portfolio/E-Commerce/slick' },
  { regex: /Portfolio\/Ecommerce\/Kaizoku/gi, replacement: 'Portfolio/E-Commerce/kaizoku' },
  { regex: /Portfolio\/Ecommerce\/Wegrow/gi, replacement: 'Portfolio/E-Commerce/wegrow' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Ecommerce\/Bag/gi, replacement: 'dev.mkavs.com/Portfolio/E-Commerce/hush' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Ecommerce\/Ink/gi, replacement: 'dev.mkavs.com/Portfolio/E-Commerce/slick' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Ecommerce\/Kaizoku/gi, replacement: 'dev.mkavs.com/Portfolio/E-Commerce/kaizoku' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Ecommerce\/Wegrow/gi, replacement: 'dev.mkavs.com/Portfolio/E-Commerce/wegrow' },

  // Company Portfolio Migrations
  { regex: /Portfolio\/Company\/Cars-website-main\/index\.html/gi, replacement: 'Portfolio/Company/CarGo/' },
  { regex: /Portfolio\/Company\/FilmAura\/index\.html/gi, replacement: 'Portfolio/Company/filmaura/' },
  { regex: /Portfolio\/Company\/JERI\/index\.html/gi, replacement: 'Portfolio/Company/jeri/' },
  { regex: /Portfolio\/Company\/Waypoint\/index\.html/gi, replacement: 'Portfolio/Company/waypoint/' },
  { regex: /Portfolio\/Company\/Cars-website-main/gi, replacement: 'Portfolio/Company/CarGo' },
  { regex: /Portfolio\/Company\/FilmAura/gi, replacement: 'Portfolio/Company/filmaura' },
  { regex: /Portfolio\/Company\/JERI/gi, replacement: 'Portfolio/Company/jeri' },
  { regex: /Portfolio\/Company\/Waypoint/gi, replacement: 'Portfolio/Company/waypoint' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Company\/Cars-website-main/gi, replacement: 'dev.mkavs.com/Portfolio/Company/CarGo' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Company\/FilmAura/gi, replacement: 'dev.mkavs.com/Portfolio/Company/filmaura' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Company\/JERI/gi, replacement: 'dev.mkavs.com/Portfolio/Company/jeri' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Company\/Waypoint/gi, replacement: 'dev.mkavs.com/Portfolio/Company/waypoint' },

  // Dashboard Portfolio Migrations
  { regex: /Portfolio\/Dashboards\/Kyat\/index\.html/gi, replacement: 'Portfolio/Dashboard/Kyat/' },
  { regex: /Portfolio\/Dashboards\/Serch\/index\.html/gi, replacement: 'Portfolio/Dashboard/Serch/' },
  { regex: /Portfolio\/Dashboards\/Kyat/gi, replacement: 'Portfolio/Dashboard/Kyat' },
  { regex: /Portfolio\/Dashboards\/Serch/gi, replacement: 'Portfolio/Dashboard/Serch' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Dashboards\/Kyat/gi, replacement: 'dev.mkavs.com/Portfolio/Dashboard/Kyat' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Dashboards\/Serch/gi, replacement: 'dev.mkavs.com/Portfolio/Dashboard/Serch' },

  // Portfolio Sites Migrations
  { regex: /Portfolio\/Portfolio\/Editing\/index\.html/gi, replacement: 'Portfolio/Portfolio/Editing/' },
  { regex: /Portfolio\/Portfolio\/Latency\/index\.html/gi, replacement: 'Portfolio/Portfolio/Latency/' },
  { regex: /Portfolio\/Portfolio\/Pritam\/index\.html/gi, replacement: 'Portfolio/Portfolio/Pritam/' },
  { regex: /Portfolio\/Portfolio\/Tarot\/index\.html/gi, replacement: 'Portfolio/Portfolio/Tarot/' },
  { regex: /Portfolio\/Portfolio\/Editing/gi, replacement: 'Portfolio/Portfolio/Editing' },
  { regex: /Portfolio\/Portfolio\/Latency/gi, replacement: 'Portfolio/Portfolio/Latency' },
  { regex: /Portfolio\/Portfolio\/Pritam/gi, replacement: 'Portfolio/Portfolio/Pritam' },
  { regex: /Portfolio\/Portfolio\/Tarot/gi, replacement: 'Portfolio/Portfolio/Tarot' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Portfolio\/Editing/gi, replacement: 'dev.mkavs.com/Portfolio/Portfolio/Editing' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Portfolio\/Latency/gi, replacement: 'dev.mkavs.com/Portfolio/Portfolio/Latency' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Portfolio\/Pritam/gi, replacement: 'dev.mkavs.com/Portfolio/Portfolio/Pritam' },
  { regex: /dev\.mkavs\.com\/Portfolio\/Portfolio\/Tarot/gi, replacement: 'dev.mkavs.com/Portfolio/Portfolio/Tarot' },

  // SignUp Migrations
  { regex: /signpg\/index\.html/gi, replacement: 'SignUp' },
  { regex: /signpg\/signup\.html/gi, replacement: 'SignUp' }
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

      // Fix nested quotes in onclick handlers (e.g. onclick="window.location.href="/BookUs"")
      content = content.replace(/onclick="window\.location\.href\s*=\s*"\/([^"]+)""/g, 'onclick="window.location.href=\'/$1\'"');
      content = content.replace(/onclick="window\.location\.href\s*=\s*"([^"]+)""/g, 'onclick="window.location.href=\'$1\'"');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed links in: ' + fullPath);
      }
    }
  }
}

processDir(path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend'));
processDir(path.resolve('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/works-src'));

// Absolute Path Fix for Portfolio Items
const portfolioDirs = [
  { root: 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/Portfolio/E-Commerce', basePath: '/Portfolio/E-Commerce/' },
  { root: 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/Portfolio/Company', basePath: '/Portfolio/Company/' },
  { root: 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/Portfolio/Dashboard', basePath: '/Portfolio/Dashboard/' },
  { root: 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend/Portfolio/Portfolio', basePath: '/Portfolio/Portfolio/' }
];

portfolioDirs.forEach(({ root, basePath }) => {
  if (!fs.existsSync(root)) return;
  const sites = fs.readdirSync(root).filter(f => fs.statSync(path.join(root, f)).isDirectory());

  sites.forEach(site => {
    const siteDir = path.join(root, site);
    const siteBasePath = `${basePath}${site}/`;

    function processSiteDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', '.git'].includes(file)) processSiteDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || (fullPath.endsWith('.js') && !fullPath.split(path.sep).includes('assets'))) {
          let content = fs.readFileSync(fullPath, 'utf8');
          let originalContent = content;

          content = content.replace(/href=["'](?!\/|http|mailto|tel|#|data:)(?:\.\/)?([^"']+)["']/gi, (match, p1) => `href="${siteBasePath}${p1}"`);
          content = content.replace(/src=["'](?!\/|http|data:)(?:\.\/)?([^"']+)["']/gi, (match, p1) => `src="${siteBasePath}${p1}"`);
          content = content.replace(/url\(['"]?(?!\/|http|data:)(?:\.\/)?([^'"\)]+)['"]?\)/g, (match, p1) => `url("${siteBasePath}${p1}")`);

          if (content !== originalContent) {
            fs.writeFileSync(fullPath, content);
            console.log(`Updated relative paths to absolute in: ${fullPath}`);
          }
        }
      }
    }
    processSiteDir(siteDir);
  });
});

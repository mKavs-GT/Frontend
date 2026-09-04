(function() {
    // Check if preloader has already run in this session
    if (sessionStorage.getItem('mkavs_preloaded') === 'true') {
        return; // Exit immediately, no preloader
    }

    // Create the Preloader UI
    const preloaderHTML = `
        <div id="global-mkavs-preloader" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #111111;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s ease-out;
        ">
            <div style="margin-bottom: 2rem;">
                <img src="images/LOGOI.webp" alt="mKavs Logo" style="height: 80px; filter: brightness(0) invert(1);" onerror="this.style.display='none'" />
            </div>
            
            <div style="
                width: 250px;
                height: 4px;
                background-color: #333;
                border-radius: 4px;
                overflow: hidden;
            ">
                <div id="mkavs-progress-bar" style="
                    width: 0%;
                    height: 100%;
                    background-color: #c7f908;
                "></div>
            </div>
            <p id="mkavs-progress-text" style="
                color: #fff;
                font-family: sans-serif;
                font-size: 28px;
                font-weight: 700;
                margin-top: 1.5rem;
                text-transform: uppercase;
                letter-spacing: 4px;
                text-align: center;
                min-width: 250px;
            ">HELLO</p>
        </div>
    `;

    document.write(preloaderHTML);

    const greetings = [
        "Hello",        // English
        "Nǐ hǎo",       // Chinese
        "Marhaba",      // Arabic
        "Bonjour",      // French
        "Namaste",      // Hindi
        "Vanakkam",     // Tamil
        "Namaskara"     // Kannada
    ];

    // List of assets to preload
    const assetsToPreload = [
        // Fonts
        'https://fonts.googleapis.com/css2?family=Notable&display=swap',
        'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Permanent+Marker&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
        
        // Subpages
        "/About",
        "/Works",
        "/Branding",
        "/Pricing",
        "/BookUs",
        "/Support",
        "/BookUs",

        // Images
        'images/MKAVS.png',
        'images/LOGOI.png',
        'images/herofg.png',
        'images/hero.png',
        'images/1.jpeg',
        'images/2.jpeg',
        'images/3.jpeg',
        'images/thumb1.png',
        'images/thumb2.png',
        'images/thumb3.png'
    ];

    let loadedCount = 0;
    const totalAssets = assetsToPreload.length;

    let startTime = Date.now();
    let actualProgress = 0;
    let displayedProgress = 0;
    let preloaderCompleted = false;
    let progressBar = null;
    let progressText = null;

    function loop() {
        if (preloaderCompleted) return;

        let now = Date.now();
        let elapsed = now - startTime;

        // Actual progress based on assets loaded
        actualProgress = (loadedCount / totalAssets) * 100;

        // If 6 seconds have passed, force actualProgress to 100
        if (elapsed >= 6000) {
            actualProgress = 100;
        }

        // We want the progress to take at LEAST 3 seconds to reach 100%.
        // So the maximum allowed progress at any time 'elapsed' is (elapsed / 3000) * 100.
        let maxAllowedProgress = Math.min((elapsed / 3000) * 100, 100);

        // Target is actual progress, but cannot exceed the maximum allowed for a 3-second minimum duration
        let targetProgress = Math.min(actualProgress, maxAllowedProgress);

        // Also, we want it to never get completely stuck. We can add a slow minimum progression based on the 6 seconds max
        let minAllowedProgress = Math.min((elapsed / 6000) * 100, 100);
        targetProgress = Math.max(targetProgress, minAllowedProgress);

        // Smoothly interpolate displayed progress towards target progress
        // (using an easing factor, e.g., 0.08 per frame)
        displayedProgress += (targetProgress - displayedProgress) * 0.08;

        // Safety clamp
        if (displayedProgress > 100) displayedProgress = 100;

        // Calculate which greeting to show (change roughly every 250ms)
        const greetingIndex = Math.floor(elapsed / 250) % greetings.length;
        const currentGreeting = greetings[greetingIndex];

        // Update UI
        const progressBar = document.getElementById('mkavs-progress-bar');
        const progressText = document.getElementById('mkavs-progress-text');
        
        if (progressBar) progressBar.style.width = displayedProgress + '%';
        if (progressText) progressText.innerText = currentGreeting;

        // Check completion condition
        if (displayedProgress >= 99.5 && actualProgress === 100 && elapsed >= 3000) {
            // We are effectively at 100%, and at least 3 seconds have passed
            if (progressBar) progressBar.style.width = '100%';
            if (progressText) progressText.innerText = currentGreeting;
            completePreloader();
            return;
        }

        requestAnimationFrame(loop);
    }

    function completePreloader() {
        if (preloaderCompleted) return;
        preloaderCompleted = true;
        
        setTimeout(() => {
            const preloader = document.getElementById('global-mkavs-preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                    sessionStorage.setItem('mkavs_preloaded', 'true');
                }, 800);
            }
        }, 300);
    }

    function updateProgress() {
        loadedCount++;
    }

    // Wait until document body exists before starting fetches to prioritize initial HTML parsing
    window.addEventListener('load', () => {
        // Reset start time to when the window load event actually fires, so the 3-6s is counted from here
        startTime = Date.now();
        
        // Start the smooth animation loop
        requestAnimationFrame(loop);

        assetsToPreload.forEach(url => {
            if (url.match(/\.(jpeg|jpg|png|gif|svg|webp)$/i)) {
                const img = new Image();
                img.onload = updateProgress;
                img.onerror = updateProgress; // Increment even on error so we don't block
                img.src = url;
            } else {
                fetch(url, { mode: 'no-cors', cache: 'force-cache' })
                    .then(updateProgress)
                    .catch(updateProgress); // Increment even on error
            }
        });
    });
})();

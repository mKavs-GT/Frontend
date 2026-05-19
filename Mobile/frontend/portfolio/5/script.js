document.addEventListener('DOMContentLoaded', () => {

    // Add a simple "pop" interaction on clicks
    document.addEventListener('click', (e) => {
        createPopEffect(e.clientX, e.clientY);
    });

    function createPopEffect(x, y) {
        const pop = document.createElement('div');
        pop.textContent = 'POP!';
        pop.style.position = 'absolute';
        pop.style.left = `${x}px`;
        pop.style.top = `${y}px`;
        pop.style.fontFamily = 'Bangers';
        pop.style.fontSize = '2rem';
        pop.style.color = 'var(--primary-magenta)';
        pop.style.pointerEvents = 'none';
        pop.style.transition = 'transform 0.5s ease-out, opacity 0.5s';
        pop.style.zIndex = '9999';
        pop.style.textShadow = '2px 2px 0 black';
        pop.style.transform = 'translate(-50%, -50%) scale(0)';

        document.body.appendChild(pop);

        // Animate
        requestAnimationFrame(() => {
            pop.style.transform = 'translate(-50%, -50%) scale(1.5) rotate(' + (Math.random() * 40 - 20) + 'deg)';
            pop.style.opacity = '0';
        });

        setTimeout(() => {
            pop.remove();
        }, 500);
    }
});

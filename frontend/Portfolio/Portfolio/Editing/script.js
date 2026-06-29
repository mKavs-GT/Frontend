// This script can be used to add interactivity in the future.
// For now, it handles a simple hover effect for the arrows as a demonstration.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Genesis Video Studio script loaded.");

    // You can add logic for the arrow controls here (e.g. switching featured video)
    const arrows = document.querySelectorAll('.arrow');
    
    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            console.log("Arrow clicked - implement video change logic here");
            // Example: Animate the click
            arrow.style.transform = 'scale(0.9)';
            setTimeout(() => {
                arrow.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

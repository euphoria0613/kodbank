// Confetti Animation for Balance Check
class Confetti {
    constructor(container) {
        this.container = container || document.createElement('div');
        this.container.className = 'confetti-container';
        document.body.appendChild(this.container);
    }

    createConfetti() {
        const confettiCount = 150;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2; // 2-5 seconds
            const size = Math.random() * 10 + 5; // 5-15px
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.left = `${left}%`;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.background = color;
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            
            this.container.appendChild(confetti);
        }
    }

    cleanup() {
        // Remove confetti elements after animation
        setTimeout(() => {
            this.container.innerHTML = '';
        }, 6000);
    }

    trigger() {
        this.createConfetti();
        this.cleanup();
    }
}

// Make it available globally
window.Confetti = Confetti;

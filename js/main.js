document.addEventListener('DOMContentLoaded', function() {
    // Initialize Copy to Clipboard
    function initCopyToClipboard() {
        const copyBtn = document.getElementById('copy-btn');
        const contractAddress = document.getElementById('contract-address');
        
        if (!copyBtn || !contractAddress) return;

        // Create feedback element if it doesn't exist
        let feedback = document.getElementById('copy-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'copy-feedback';
            document.body.appendChild(feedback);
        }

        async function copyToClipboard() {
            try {
                await navigator.clipboard.writeText(contractAddress.textContent.trim());
                
                // Show feedback
                feedback.textContent = '✓ Address Copied!';
                feedback.classList.add('show');
                
                // Add copied class to button
                copyBtn.classList.add('copied');
                
                // Change icon
                const icon = copyBtn.querySelector('i');
                if (icon) {
                    const originalIcon = icon.className;
                    icon.className = 'fas fa-check';
                    
                    // Reset after delay
                    setTimeout(() => {
                        icon.className = originalIcon;
                        copyBtn.classList.remove('copied');
                        feedback.classList.remove('show');
                    }, 2000);
                }
            } catch (err) {
                console.error('Failed to copy:', err);
                feedback.textContent = 'Press Ctrl+C to copy';
                feedback.classList.add('show');
                setTimeout(() => {
                    feedback.classList.remove('show');
                }, 3000);
            }
        }

        // Add click event
        copyBtn.addEventListener('click', copyToClipboard);
        
        // Add keyboard support
        copyBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard();
            }
        });
    }

    // Create Particles
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Create Stars
    function createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }
    }

    // Initialize Roadmap Animation
    function initRoadmapAnimation() {
        const roadmapItems = document.querySelectorAll('.roadmap-item');
        
        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight * 0.8) &&
                rect.bottom >= (window.innerHeight * 0.2)
            );
        }

        // Animate items when they come into view
        function checkItems() {
            roadmapItems.forEach(item => {
                if (isInViewport(item) && !item.classList.contains('visible')) {
                    item.classList.add('visible');
                }
            });
        }

        // Initial check
        checkItems();

        // Check on scroll
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    checkItems();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // Check on resize
        window.addEventListener('resize', checkItems);
    }

    // Initialize all functions
    initCopyToClipboard();
    createParticles();
    createStars();
    initRoadmapAnimation();
});
                                        
                                
                                                            
                            

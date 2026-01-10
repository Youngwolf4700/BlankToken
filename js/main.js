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

    // Token distribution data
    const tokenData = [
        { label: 'Liquidity', percent: 40, color: '#00ffff', color2: '#00c8c8' },
        { label: 'Community', percent: 25, color: '#8a2be2', color2: '#6a1cb8' },
        { label: 'Team', percent: 15, color: '#ff6b6b', color2: '#e64c4c' },
        { label: 'Ecosystem', percent: 10, color: '#4ecdc4', color2: '#3aa8a0' },
        { label: 'Marketing', percent: 10, color: '#ffd166', color2: '#e6b84c' }
    ];

    // Initialize the chart
    function initTokenChart() {
        const chartContainer = document.querySelector('.chart-container .chart');
        if (!chartContainer) return;

        // Create canvas element
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        
        // Set canvas size to match container
        const size = Math.min(chartContainer.offsetWidth, chartContainer.offsetHeight);
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        // Draw function
        function draw() {
            ctx.clearRect(0, 0, size, size);
            
            // Draw chart
            let startAngle = -Math.PI / 2; // Start from top (-90 degrees)
            
            tokenData.forEach((item, index) => {
                const sliceAngle = (item.percent / 100) * 2 * Math.PI;
                const endAngle = startAngle + sliceAngle;
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, size, 0);
                gradient.addColorStop(0, item.color);
                gradient.addColorStop(1, item.color2);
                
                // Draw segment
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Add border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                startAngle = endAngle;
            });
            
            // Add inner circle for donut effect
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(10, 10, 20, 0.8)';
            ctx.fill();
            
            // Add total supply in center
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('25M', centerX, centerY - 10);
            ctx.font = '10px Arial';
            ctx.fillText('TOTAL SUPPLY', centerX, centerY + 10);
        }
        
        // Create legend
        function createLegend() {
            const legendContainer = document.querySelector('.chart-legend');
            if (!legendContainer) return;
            
            legendContainer.innerHTML = ''; // Clear existing legend
            
            tokenData.forEach((item, index) => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                
                const colorBox = document.createElement('div');
                colorBox.className = 'legend-color';
                colorBox.style.background = `linear-gradient(135deg, ${item.color}, ${item.color2})`;
                
                const label = document.createElement('span');
                label.textContent = `${item.label} (${item.percent}%)`;
                
                legendItem.appendChild(colorBox);
                legendItem.appendChild(label);
                legendContainer.appendChild(legendItem);
            });
        }
        
        // Initial draw and legend creation
        draw();
        createLegend();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            const newSize = Math.min(chartContainer.offsetWidth, chartContainer.offsetHeight);
            canvas.width = newSize;
            canvas.height = newSize;
            draw();
        });
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
    initTokenChart();
    initRoadmapAnimation();
});
                                        
                                
                                                            
                            

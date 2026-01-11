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
        console.log('Initializing token chart...');
        const chartContainer = document.querySelector('.chart-container .chart');
        if (!chartContainer) {
            console.error('Chart container not found!');
            return;
        }
        console.log('Chart container found:', chartContainer);

        // Create canvas element
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        console.log('Canvas created and appended');
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        `;
        chartContainer.appendChild(tooltip);
        console.log('Tooltip created');
        
        // Set canvas size to match container
        const size = Math.min(chartContainer.offsetWidth, chartContainer.offsetHeight);
        canvas.width = size;
        canvas.height = size;
        console.log('Canvas size set to:', size);
        
        const ctx = canvas.getContext('2d');
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        console.log('Chart dimensions calculated');
        
        // Track hovered segment
        let hoveredIndex = -1;
        
        // Draw function
        function draw() {
            console.log('Drawing chart...');
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
                
                // Add hover effect
                if (index === hoveredIndex) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 3;
                    ctx.shadowColor = item.color;
                    ctx.shadowBlur = 10;
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 0;
                }
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
            console.log('Chart drawing completed');
        }
        
        // Mouse move handler for hover effects
        function handleMouseMove(event) {
            console.log('Mouse move detected on chart');
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left - centerX;
            const y = event.clientY - rect.top - centerY;
            const distance = Math.sqrt(x * x + y * y);
            
            // Check if mouse is within the donut chart area
            if (distance > radius * 0.5 && distance < radius) {
                const angle = Math.atan2(y, x);
                let normalizedAngle = (angle + Math.PI * 2.5) % (Math.PI * 2);
                
                let cumulativeAngle = 0;
                let foundIndex = -1;
                
                for (let i = 0; i < tokenData.length; i++) {
                    const sliceAngle = (tokenData[i].percent / 100) * 2 * Math.PI;
                    if (normalizedAngle >= cumulativeAngle && normalizedAngle < cumulativeAngle + sliceAngle) {
                        foundIndex = i;
                        break;
                    }
                    cumulativeAngle += sliceAngle;
                }
                
                if (foundIndex !== hoveredIndex) {
                    hoveredIndex = foundIndex;
                    draw();
                    
                    // Show tooltip
                    if (foundIndex !== -1) {
                        const item = tokenData[foundIndex];
                        tooltip.innerHTML = `<strong>${item.label}</strong><br>${item.percent}%`;
                        tooltip.style.opacity = '1';
                        tooltip.style.left = (event.clientX - rect.left + 10) + 'px';
                        tooltip.style.top = (event.clientY - rect.top - 30) + 'px';
                        console.log(`Showing tooltip for: ${item.label} (${item.percent}%)`);
                    } else {
                        tooltip.style.opacity = '0';
                    }
                }
            } else {
                if (hoveredIndex !== -1) {
                    hoveredIndex = -1;
                    draw();
                    tooltip.style.opacity = '0';
                    console.log('Mouse left chart area');
                }
            }
        }
        
        // Mouse leave handler
        function handleMouseLeave() {
            console.log('Mouse left canvas');
            hoveredIndex = -1;
            draw();
            tooltip.style.opacity = '0';
        }
        
        // Add event listeners
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('mouseenter', () => console.log('Mouse entered canvas'));
        
        // Initial draw
        console.log('Starting initial draw...');
        draw();
        console.log('Chart initialization completed');
        
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
    console.log('Initializing all functions...');
    initCopyToClipboard();
    console.log('Copy to clipboard initialized');
    createParticles();
    console.log('Particles created');
    createStars();
    console.log('Stars created');
    initTokenChart();
    console.log('Token chart initialized');
    initRoadmapAnimation();
    console.log('Roadmap animation initialized');
    console.log('All functions initialized successfully');
});
                                        
                                
                                                            
                            

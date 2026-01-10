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
                        feedback.classList.remove('show');
                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                            icon.className = originalIcon;
                        }, 300);
                    }, 2000);
                }
                
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Fallback for older browsers
                try {
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNode(contractAddress);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand('copy');
                    selection.removeAllRanges();
                    
                    // Show success feedback
                    feedback.textContent = '✓ Copied to clipboard!';
                    feedback.classList.add('show');
                    copyBtn.classList.add('copied');
                    
                    // Change icon
                    const icon = copyBtn.querySelector('i');
                    if (icon) {
                        const originalIcon = icon.className;
                        icon.className = 'fas fa-check';
                        
                        setTimeout(() => {
                            feedback.classList.remove('show');
                            setTimeout(() => {
                                copyBtn.classList.remove('copied');
                                icon.className = originalIcon;
                            }, 300);
                        }, 2000);
                    }
                } catch (err2) {
                    console.error('Fallback copy failed: ', err2);
                    feedback.textContent = 'Press Ctrl+C to copy';
                    feedback.classList.add('show');
                    setTimeout(() => {
                        feedback.classList.remove('show');
                    }, 3000);
                }
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

    // Initialize Roadmap Animation
    initRoadmapAnimation();

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
        
        // Draw the chart
        let startAngle = -Math.PI / 2; // Start from top (-90 degrees)
        
        // Add hover effect
        let hoveredIndex = -1;
        
        // Draw function
        function draw() {
            ctx.clearRect(0, 0, size, size);
            
            // Draw the chart
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
                
                // Add hover effect
                const isHovered = index === hoveredIndex;
                const hoverOffset = isHovered ? 10 : 0;
                const hoverX = centerX + Math.cos(startAngle + sliceAngle / 2) * hoverOffset;
                const hoverY = centerY + Math.sin(startAngle + sliceAngle / 2) * hoverOffset;
                
                ctx.save();
                ctx.translate(hoverX - centerX, hoverY - centerY);
                ctx.fillStyle = isHovered ? gradient : gradient;
                ctx.globalAlpha = isHovered ? 0.9 : 0.8;
                ctx.fill();
                
                // Add border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
                
                startAngle = endAngle;
            });
            
            // Add inner circle for donut effect
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(10, 10, 20, 0.8)';
            ctx.fill();
            
            // Add total supply in the center
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
                legendItem.style.cursor = 'pointer';
                
                const colorBox = document.createElement('div');
                colorBox.className = 'legend-color';
                colorBox.style.background = `linear-gradient(135deg, ${item.color}, ${item.color2})`;
                
                const label = document.createElement('span');
                label.textContent = `${item.label} (${item.percent}%)`;
                
                // Add hover effect
                legendItem.addEventListener('mouseenter', () => {
                    hoveredIndex = index;
                    draw();
                });
                
                legendItem.addEventListener('mouseleave', () => {
                    hoveredIndex = -1;
                    draw();
                });
                
                legendItem.appendChild(colorBox);
                legendItem.appendChild(label);
                legendContainer.appendChild(legendItem);
            });
        }
        
        // Add hover effect to chart
        function handleMouseMove(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left - centerX;
            const y = event.clientY - rect.top - centerY;
            const distance = Math.sqrt(x * x + y * y);
            
            if (distance > radius * 0.5 && distance < radius) {
                const angle = Math.atan2(y, x);
                let normalizedAngle = (angle + Math.PI * 2.5) % (Math.PI * 2);
                
                let cumulativeAngle = 0;
                for (let i = 0; i < tokenData.length; i++) {
                    const sliceAngle = (tokenData[i].percent / 100) * 2 * Math.PI;
                    if (normalizedAngle >= cumulativeAngle && normalizedAngle < cumulativeAngle + sliceAngle) {
                        hoveredIndex = i;
                        draw();
                        return;
                    }
                    cumulativeAngle += sliceAngle;
                }
            } else if (hoveredIndex !== -1) {
                hoveredIndex = -1;
                draw();
            }
        }
        
        // Add click event to show details
        function handleClick(event) {
            if (hoveredIndex !== -1) {
                const item = tokenData[hoveredIndex];
                console.log(`Selected: ${item.label} - ${item.percent}%`);
                // You can add more interactive features here
            }
        }
        
        // Add event listeners
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
        
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
    
    // Initialize the chart when the page loads
    initTokenChart();
    
    // Initialize copy to clipboard functionality
    initCopyToClipboard();
});

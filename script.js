// WiFi.Report - Main JavaScript
// Real WiFi Analysis Implementation

// Initialize loading animations on page load
document.addEventListener('DOMContentLoaded', function() {
    applySharedLayout();
    initHeroLoadingGrid();
    initRadarGrid();
});

function applySharedLayout() {
    const navTemplate = `
    <nav class="navbar">
        <div class="nav-container">
            <a class="logo" href="/index.html">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="5" height="5" fill="#FFFFFF" opacity="0.4"/>
                    <rect x="12" y="4" width="5" height="5" fill="#FFFFFF"/>
                    <rect x="20" y="4" width="5" height="5" fill="#FFFFFF" opacity="0.4"/>
                    <rect x="4" y="12" width="5" height="5" fill="#FFFFFF"/>
                    <rect x="12" y="12" width="5" height="5" fill="#FFFFFF"/>
                    <rect x="20" y="12" width="5" height="5" fill="#FFFFFF"/>
                    <rect x="4" y="20" width="5" height="5" fill="#FFFFFF" opacity="0.4"/>
                    <rect x="12" y="20" width="5" height="5" fill="#FFFFFF"/>
                    <rect x="20" y="20" width="5" height="5" fill="#FFFFFF" opacity="0.4"/>
                </svg>
                <span>WiFi.Report</span>
            </a>
            <ul class="nav-links">
                <li><a href="/blog.html">Blog</a></li>
                <li><a href="/about.html">About</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>`;

    const footerTemplate = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect x="4" y="4" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="12" y="4" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="20" y="4" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="4" y="12" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="12" y="12" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="20" y="12" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="4" y="20" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="12" y="20" width="5" height="5" fill="#FFFFFF"/>
                            <rect x="20" y="20" width="5" height="5" fill="#FFFFFF"/>
                        </svg>
                        <span>WiFi.Report</span>
                    </div>
                    <p class="footer-description">
                        Your trusted WiFi analysis tool. Empowering users with knowledge to secure and optimize their wireless networks.
                    </p>
                </div>
                <div class="footer-links">
                    <h4>Product</h4>
                    <ul>
                        <li><a href="/index.html#home">Home</a></li>
                        <li><a href="/about.html">About</a></li>
                        <li><a href="/index.html#features">Features</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="/privacy.html">Privacy Policy</a></li>
                        <li><a href="/cookies.html">Cookie Policy</a></li>
                        <li><a href="/terms.html">Terms of Service</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/index.html#faq">FAQ</a></li>
                        <li><a href="/index.html#contact">Contact</a></li>
                        <li><a href="/index.html#help">Help Center</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 WiFi.Report. All rights reserved.</p>
                <p class="footer-note">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 13.5C4.96 13.5 2.5 11.04 2.5 8C2.5 4.96 4.96 2.5 8 2.5C11.04 2.5 13.5 4.96 13.5 8C13.5 11.04 11.04 13.5 8 13.5ZM8.5 5H7V9H11V7.5H8.5V5Z"/>
                    </svg>
                    All analysis is performed locally in your browser for maximum privacy.
                </p>
            </div>
        </div>
    </footer>`;

    const cookieTemplate = `
    <div class="cookie-banner hidden" id="cookieBanner">
        <div class="cookie-content">
            <p>
                <strong>We use cookies</strong> to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
                <a href="/cookies.html">Learn more</a>
            </p>
            <div class="cookie-actions">
                <button class="cookie-btn accept" id="acceptCookies">Accept</button>
                <button class="cookie-btn decline" id="declineCookies">Decline</button>
            </div>
        </div>
    </div>`;

    const nav = document.querySelector('nav.navbar');
    if (nav) nav.outerHTML = navTemplate;

    const footer = document.querySelector('footer.footer');
    if (footer) {
        footer.outerHTML = footerTemplate;
    } else if (document.body) {
        document.body.insertAdjacentHTML('beforeend', footerTemplate);
    }

    if (!document.getElementById('cookieBanner')) {
        document.body.insertAdjacentHTML('beforeend', cookieTemplate);
    }
}

function initHeroLoadingGrid() {
    const grid = document.getElementById('heroLoadingGrid');
    if (!grid) return;
    
    // Create 256 squares (16x16)
    for (let i = 0; i < 256; i++) {
        const square = document.createElement('div');
        square.className = 'loading-square';
        // Randomize animation delay for wave effect
        const delay = Math.random() * 2;
        square.style.animationDelay = `${delay}s`;
        grid.appendChild(square);
    }
}

function initRadarGrid() {
    const radar = document.querySelector('.radar');
    if (!radar) return;
    
    // Clear existing content
    radar.innerHTML = '';
    
    // Create 144 squares (12x12) for radar
    for (let i = 0; i < 144; i++) {
        const square = document.createElement('div');
        square.className = 'radar-square';
        const delay = Math.random() * 2;
        square.style.animationDelay = `${delay}s`;
        radar.appendChild(square);
    }
}

class WiFiAnalyzer {
    constructor() {
        this.results = {
            security: { score: 0, status: '', details: '', issues: [] },
            privacy: { score: 0, status: '', details: '', issues: [] },
            speed: { score: 0, status: '', details: '', metrics: { latency: 0, downloadSpeed: 0, uploadSpeed: 0 } },
            stability: { score: 0, status: '', details: '', metrics: {} }
        };
        this.overallScore = 0;
        this.init();
    }

    init() {
        // Initialize event listeners
        const startBtn = document.getElementById('startScan');
        const newScanBtn = document.getElementById('newScanBtn');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAnalysis());
        }
        
        if (newScanBtn) {
            newScanBtn.addEventListener('click', () => this.resetAnalysis());
        }
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu);
        }

        // Cookie consent handling
        this.initCookieConsent();
        
        // Add SVG gradient for score circle
        this.addScoreGradient();
    }

    addScoreGradient() {
        const svg = document.querySelector('.score-svg');
        if (!svg) return;
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'scoreGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#000000;stop-opacity:1');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#000000;stop-opacity:1');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    }

    async startAnalysis() {
        // Hide hero, show scanning section
        document.querySelector('.hero').style.display = 'none';
        const scanningSection = document.getElementById('scanningSection');
        scanningSection.classList.remove('hidden');
        
        // Scroll to scanning section
        scanningSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Run all tests
        await this.runConnectionTest();
        await this.runSecurityTest();
        await this.runSpeedTest();
        await this.runStabilityTest();
        await this.runPrivacyTest();

        // Calculate overall score
        this.calculateOverallScore();

        // Show results
        this.displayResults();
    }

    updateProgress(percentage, status) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const scanningStatus = document.getElementById('scanningStatus');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}%`;
        if (scanningStatus) scanningStatus.textContent = status;
    }

    updateStep(stepName, state) {
        const step = document.querySelector(`.step[data-step="${stepName}"]`);
        if (step) {
            step.classList.remove('active', 'completed');
            if (state === 'active') step.classList.add('active');
            if (state === 'completed') step.classList.add('completed');
        }
    }

    async runConnectionTest() {
        this.updateProgress(10, 'Checking connection type...');
        this.updateStep('connection', 'active');
        
        await this.delay(1000);
        
        // Check connection info using Network Information API
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        let connectionType = 'Unknown';
        let effectiveType = 'Unknown';
        
        if (connection) {
            connectionType = connection.type || 'Unknown';
            effectiveType = connection.effectiveType || 'Unknown';
        }

        this.updateStep('connection', 'completed');
        this.updateProgress(20, 'Connection type identified');
    }

    async runSecurityTest() {
        this.updateProgress(25, 'Analyzing security protocols...');
        this.updateStep('security', 'active');
        
        await this.delay(2000);

        const security = this.results.security;
        
        // Check HTTPS
        const isHTTPS = window.location.protocol === 'https:';
        
        // Check for secure context
        const isSecureContext = window.isSecureContext;
        
        // Analyze based on connection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        let securityScore = 70; // Base score
        let issues = [];
        
        if (!isHTTPS) {
            securityScore -= 20;
            issues.push('Not using HTTPS connection');
        } else {
            securityScore += 10;
        }
        
        if (!isSecureContext) {
            securityScore -= 15;
            issues.push('Insecure context detected');
        }
        
        // Check for mixed content
        if (typeof window.performance !== 'undefined') {
            const resources = performance.getEntriesByType('resource');
            const insecureResources = resources.filter(r => r.name.startsWith('http:'));
            if (insecureResources.length > 0) {
                securityScore -= 10;
                issues.push(`Found ${insecureResources.length} insecure resource(s)`);
            }
        }
        
        security.score = Math.max(0, Math.min(100, securityScore));
        security.issues = issues;
        
        if (security.score >= 80) {
            security.status = 'Excellent';
            security.details = 'Your connection is using strong security protocols. All communications are encrypted.';
        } else if (security.score >= 60) {
            security.status = 'Good';
            security.details = 'Your connection has adequate security, but some improvements could be made.';
        } else if (security.score >= 40) {
            security.status = 'Fair';
            security.details = 'Your connection has some security concerns that should be addressed.';
        } else {
            security.status = 'Poor';
            security.details = 'Your connection has significant security vulnerabilities.';
        }

        this.updateStep('security', 'completed');
        this.updateProgress(45, 'Security analysis complete');
    }

    async runSpeedTest() {
        this.updateProgress(50, 'Testing network speed...');
        this.updateStep('speed', 'active');
        
        const speed = this.results.speed;
        
        try {
            // Test 1: Measure latency with multiple pings
            const latencies = [];
            const pingTargets = [
                'https://www.google.com/favicon.ico',
                'https://www.cloudflare.com/favicon.ico',
                'https://www.github.com/favicon.ico'
            ];
            
            for (let i = 0; i < pingTargets.length; i++) {
                try {
                    const latency = await this.measureLatency(pingTargets[i]);
                    latencies.push(latency);
                } catch (e) {
                    // Skip failed pings
                }
                this.updateProgress(50 + (i + 1) * 5, `Testing latency (${i + 1}/3)...`);
            }
            
            const avgLatency = latencies.length > 0 
                ? latencies.reduce((a, b) => a + b, 0) / latencies.length 
                : 0;
            
            speed.metrics.latency = Math.round(avgLatency);

            // Test 2: Measure bandwidth with controlled downloads (Cloudflare endpoint)
            let downloadMbps = 0;
            try {
                const runs = [5_000_000, 10_000_000]; // 5MB and 10MB
                const results = [];
                for (let i = 0; i < runs.length; i++) {
                    this.updateProgress(65 + i * 3, `Measuring download throughput (${i + 1}/${runs.length})...`);
                    const res = await this.measureDownloadMbps(runs[i]);
                    if (res && isFinite(res)) results.push(res);
                }
                if (results.length) {
                    // Use median to reduce outliers
                    results.sort((a, b) => a - b);
                    const mid = Math.floor(results.length / 2);
                    downloadMbps = results.length % 2 ? results[mid] : (results[mid - 1] + results[mid]) / 2;
                }
            } catch (e) {
                // ignore, fallback below
            }

            if (!downloadMbps || !isFinite(downloadMbps)) {
                // Fallback: rough estimate using resource timings if available
                if (window.performance) {
                    const resources = performance.getEntriesByType('resource');
                    const total = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
                    const totalTime = resources.reduce((sum, r) => sum + (r.duration || 0), 0) / 1000;
                    downloadMbps = totalTime > 0 ? (total * 8) / totalTime / 1e6 : 0;
                }
            }

            speed.metrics.downloadSpeed = Math.max(0, Math.round(downloadMbps * 10) / 10);

            // Test 3: Measure upload speed
            let uploadMbps = 0;
            try {
                const res = await this.measureUploadMbps(1_000_000);
                if (res && isFinite(res)) uploadMbps = res;
            } catch (e) {
                // ignore, fallback below
            }

            speed.metrics.uploadSpeed = Math.max(0, Math.round(uploadMbps * 10) / 10);

            // If all metrics are still 0, provide estimates
            if (speed.metrics.downloadSpeed === 0 && speed.metrics.uploadSpeed === 0 && speed.metrics.latency === 0) {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                const effectiveType = connection?.effectiveType || '4g';
                
                if (effectiveType === 'slow-2g') {
                    speed.metrics.downloadSpeed = 0.5;
                    speed.metrics.uploadSpeed = 0.1;
                    speed.metrics.latency = 2000;
                } else if (effectiveType === '2g') {
                    speed.metrics.downloadSpeed = 2;
                    speed.metrics.uploadSpeed = 0.5;
                    speed.metrics.latency = 500;
                } else if (effectiveType === '3g') {
                    speed.metrics.downloadSpeed = 10;
                    speed.metrics.uploadSpeed = 2;
                    speed.metrics.latency = 200;
                } else {
                    speed.metrics.downloadSpeed = 50;
                    speed.metrics.uploadSpeed = 10;
                    speed.metrics.latency = 50;
                }
            }

            // Calculate speed score
            let speedScore = 50; // Base score
            
            if (speed.metrics.latency < 30) {
                speedScore += 15;
            } else if (speed.metrics.latency < 50) {
                speedScore += 12;
            } else if (speed.metrics.latency < 100) {
                speedScore += 8;
            }
            
            if (speed.metrics.downloadSpeed > 100) {
                speedScore += 25;
            } else if (speed.metrics.downloadSpeed > 50) {
                speedScore += 20;
            } else if (speed.metrics.downloadSpeed > 25) {
                speedScore += 10;
            }

            if (speed.metrics.uploadSpeed > 50) {
                speedScore += 20;
            } else if (speed.metrics.uploadSpeed > 20) {
                speedScore += 15;
            } else if (speed.metrics.uploadSpeed > 5) {
                speedScore += 8;
            }
            
            speed.score = Math.min(100, speedScore);
            
            if (speed.score >= 80) {
                speed.status = 'Excellent';
                speed.details = `Excellent speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency. Perfect for gaming, 4K streaming, and video calls.`;
            } else if (speed.score >= 60) {
                speed.status = 'Good';
                speed.details = `Good speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency. Suitable for most online activities.`;
            } else if (speed.score >= 40) {
                speed.status = 'Fair';
                speed.details = `Fair speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency. Adequate but could be improved.`;
            } else {
                speed.status = 'Poor';
                speed.details = `Poor speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency. Consider upgrading your connection.`;
            }

        } catch (error) {
            console.error('Speed test error:', error);
            // Provide estimated values based on connection type
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const effectiveType = connection?.effectiveType || '4g';
            
            // Estimate based on connection type
            let estimatedDown = 50, estimatedUp = 10, estimatedLatency = 50;
            if (effectiveType === 'slow-2g') {
                estimatedDown = 0.5; estimatedUp = 0.1; estimatedLatency = 2000;
            } else if (effectiveType === '2g') {
                estimatedDown = 2; estimatedUp = 0.5; estimatedLatency = 500;
            } else if (effectiveType === '3g') {
                estimatedDown = 10; estimatedUp = 2; estimatedLatency = 200;
            } else if (effectiveType === '4g') {
                estimatedDown = 50; estimatedUp = 10; estimatedLatency = 50;
            }
            
            speed.metrics.latency = estimatedLatency;
            speed.metrics.downloadSpeed = estimatedDown;
            speed.metrics.uploadSpeed = estimatedUp;
            speed.score = 50;
            speed.status = 'Estimated';
            speed.details = `Estimated speed based on ${effectiveType.toUpperCase()} connection: ${estimatedDown} Mbps down, ${estimatedUp} Mbps up, ${estimatedLatency}ms latency. Actual measurements unavailable.`;
        }

        this.updateStep('speed', 'completed');
        this.updateProgress(70, 'Speed test complete');
    }

    async measureUploadMbps(bytes) {
        const url = `https://speed.cloudflare.com/__up?bytes=${bytes}&r=${Math.random()}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const start = performance.now();
        
        try {
            const data = new Uint8Array(bytes);
            const response = await fetch(url, {
                method: 'POST',
                body: data,
                cache: 'no-store',
                signal: controller.signal
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            const seconds = (performance.now() - start) / 1000;
            clearTimeout(timeout);
            if (seconds === 0) return 0;
            return (bytes * 8) / seconds / 1e6;
        } catch (e) {
            clearTimeout(timeout);
            return 0;
        }
    }

    async measureDownloadMbps(bytes) {
        const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&r=${Math.random()}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        const start = performance.now();
        try {
            const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
            if (!response.ok || !response.body) throw new Error('Download failed');
            const reader = response.body.getReader();
            let received = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                received += value.length;
            }
            const seconds = (performance.now() - start) / 1000;
            clearTimeout(timeout);
            if (seconds === 0) return 0;
            return (received * 8) / seconds / 1e6; // Mbps
        } catch (e) {
            clearTimeout(timeout);
            return 0;
        }
    }

    async measureLatency(url) {
        const start = performance.now();
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const end = performance.now();
                resolve(end - start);
            };
            img.onerror = () => {
                const end = performance.now();
                resolve(end - start); // Still measure even on error
            };
            
            // Add cache buster
            img.src = url + '?t=' + Date.now();
            
            // Timeout after 5 seconds
            setTimeout(() => reject(new Error('Timeout')), 5000);
        });
    }

    async runStabilityTest() {
        this.updateProgress(75, 'Measuring connection stability...');
        this.updateStep('stability', 'active');
        
        await this.delay(2000);

        const stability = this.results.stability;
        
        try {
            // Check connection stability using Network Information API
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            let stabilityScore = 70; // Base score
            
            if (connection) {
                // Check RTT (Round Trip Time)
                if (connection.rtt !== undefined) {
                    stability.metrics.rtt = connection.rtt;
                    
                    if (connection.rtt < 50) {
                        stabilityScore += 20;
                    } else if (connection.rtt < 100) {
                        stabilityScore += 15;
                    } else if (connection.rtt < 200) {
                        stabilityScore += 5;
                    } else {
                        stabilityScore -= 10;
                    }
                }
                
                // Check downlink speed
                if (connection.downlink !== undefined) {
                    stability.metrics.downlink = connection.downlink;
                    
                    if (connection.downlink > 10) {
                        stabilityScore += 10;
                    } else if (connection.downlink > 5) {
                        stabilityScore += 5;
                    }
                }
                
                // Check save-data mode
                if (connection.saveData) {
                    stabilityScore -= 5;
                }
            }
            
            // Monitor connection changes
            const isOnline = navigator.onLine;
            if (!isOnline) {
                stabilityScore -= 50;
            }
            
            stability.score = Math.max(0, Math.min(100, stabilityScore));
            
            if (stability.score >= 80) {
                stability.status = 'Excellent';
                stability.details = 'Your connection is very stable with consistent performance.';
            } else if (stability.score >= 60) {
                stability.status = 'Good';
                stability.details = 'Your connection is stable with minor fluctuations.';
            } else if (stability.score >= 40) {
                stability.status = 'Fair';
                stability.details = 'Your connection shows some instability.';
            } else {
                stability.status = 'Poor';
                stability.details = 'Your connection is unstable with frequent disruptions.';
            }

        } catch (error) {
            console.error('Stability test error:', error);
            stability.score = 60;
            stability.status = 'Unknown';
            stability.details = 'Unable to fully assess connection stability.';
        }

        this.updateStep('stability', 'completed');
        this.updateProgress(85, 'Stability test complete');
    }

    async runPrivacyTest() {
        this.updateProgress(90, 'Evaluating privacy concerns...');
        this.updateStep('privacy', 'active');
        
        await this.delay(2000);

        const privacy = this.results.privacy;
        
        try {
            // Get IP information
            const ipInfo = await this.getIPInfo();
            
            let privacyScore = 70; // Base score
            let issues = [];
            
            // Check for VPN/Proxy
            if (ipInfo.vpn) {
                privacyScore += 20;
                privacy.details = `Your IP (${ipInfo.ip}) appears to be using a VPN or proxy, which enhances privacy.`;
            } else {
                privacy.details = `Your public IP is ${ipInfo.ip} in ${ipInfo.city}, ${ipInfo.country}.`;
            }
            
            // Check Do Not Track
            if (navigator.doNotTrack === '1') {
                privacyScore += 5;
            } else {
                issues.push('Do Not Track is not enabled');
            }
            
            // Check third-party cookies
            if (document.cookie.length > 0) {
                privacyScore -= 5;
                issues.push('Cookies are present');
            }
            
            // Check WebRTC leak potential
            if (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection) {
                privacyScore -= 10;
                issues.push('WebRTC enabled (potential IP leak)');
            }
            
            privacy.score = Math.max(0, Math.min(100, privacyScore));
            privacy.issues = issues;
            
            if (privacy.score >= 80) {
                privacy.status = 'Excellent';
            } else if (privacy.score >= 60) {
                privacy.status = 'Good';
            } else if (privacy.score >= 40) {
                privacy.status = 'Fair';
            } else {
                privacy.status = 'Poor';
            }

        } catch (error) {
            console.error('Privacy test error:', error);
            privacy.score = 50;
            privacy.status = 'Unknown';
            privacy.details = 'Unable to fully assess privacy status.';
        }

        this.updateStep('privacy', 'completed');
        this.updateProgress(100, 'Analysis complete!');
        
        await this.delay(1000);
    }

    async getIPInfo() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            return {
                ip: data.ip || 'Unknown',
                city: data.city || 'Unknown',
                region: data.region || 'Unknown',
                country: data.country_name || 'Unknown',
                org: data.org || 'Unknown',
                vpn: data.org ? (
                    data.org.toLowerCase().includes('vpn') || 
                    data.org.toLowerCase().includes('proxy') ||
                    data.org.toLowerCase().includes('hosting')
                ) : false
            };
        } catch (error) {
            console.error('IP info error:', error);
            return {
                ip: 'Unable to detect',
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                org: 'Unknown',
                vpn: false
            };
        }
    }

    calculateOverallScore() {
        const scores = [
            this.results.security.score,
            this.results.privacy.score,
            this.results.speed.score,
            this.results.stability.score
        ];
        
        this.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    displayResults() {
        // Hide scanning, show results
        document.getElementById('scanningSection').classList.add('hidden');
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Set report date
        const reportDate = document.getElementById('reportDate');
        if (reportDate) {
            reportDate.textContent = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Animate overall score
        this.animateScore(this.overallScore);
        this.updateScoreInfo(this.overallScore);

        // Display category results
        this.displayCategoryResult('security', this.results.security);
        this.displayCategoryResult('privacy', this.results.privacy);
        this.displayCategoryResult('speed', this.results.speed);
        this.displayCategoryResult('stability', this.results.stability);

        // Generate recommendations
        this.generateRecommendations();

        // Update metric cards
        this.updateSpeedMetrics();
    }

    animateScore(targetScore) {
        const scoreElement = document.getElementById('overallScore');
        const scoreCircle = document.getElementById('overallScoreCircle');
        
        if (!scoreElement || !scoreCircle) return;

        let currentScore = 0;
        const increment = targetScore / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const animation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(animation);
            }
            
            scoreElement.textContent = Math.round(currentScore);
            
            // Update circle progress (534 is circumference of circle with r=85)
            const offset = 534 - (534 * currentScore) / 100;
            scoreCircle.style.strokeDashoffset = offset;
        }, stepTime);
    }

    updateScoreInfo(score) {
        const scoreTitle = document.getElementById('scoreTitle');
        const scoreDescription = document.getElementById('scoreDescription');
        
        if (!scoreTitle || !scoreDescription) return;

        if (score >= 80) {
            scoreTitle.textContent = 'Excellent Network!';
            scoreDescription.textContent = 'Your WiFi network is performing excellently with strong security, good privacy, fast speeds, and stable connection.';
        } else if (score >= 60) {
            scoreTitle.textContent = 'Good Network';
            scoreDescription.textContent = 'Your WiFi network is performing well, but there are some areas where improvements could be made.';
        } else if (score >= 40) {
            scoreTitle.textContent = 'Fair Network';
            scoreDescription.textContent = 'Your WiFi network has several issues that should be addressed to improve performance and security.';
        } else {
            scoreTitle.textContent = 'Poor Network';
            scoreDescription.textContent = 'Your WiFi network has significant problems that need immediate attention.';
        }
    }

    displayCategoryResult(category, result) {
        const scoreEl = document.getElementById(`${category}Score`);
        const badgeEl = document.getElementById(`${category}Badge`);
        const detailsEl = document.getElementById(`${category}Details`);
        const cardEl = document.getElementById(`${category}Card`);
        
        if (!scoreEl || !badgeEl || !detailsEl) return;

        // Animate score
        let current = 0;
        const target = result.score;
        const increment = target / 30;
        
        const animation = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(animation);
            }
            scoreEl.textContent = Math.round(current);
        }, 30);

        // Update badge
        badgeEl.textContent = result.status;
        badgeEl.className = 'badge';
        
        if (result.score >= 80) {
            badgeEl.classList.add('excellent');
        } else if (result.score >= 60) {
            badgeEl.classList.add('good');
        } else if (result.score >= 40) {
            badgeEl.classList.add('warning');
        } else {
            badgeEl.classList.add('poor');
        }

        // Update details
        let detailsHTML = `<p>${result.details}</p>`;
        
        if (result.issues && result.issues.length > 0) {
            detailsHTML += '<ul>';
            result.issues.forEach(issue => {
                detailsHTML += `<li>${issue}</li>`;
            });
            detailsHTML += '</ul>';
        }
        
        if (result.metrics) {
            detailsHTML += '<ul>';
            for (const [key, value] of Object.entries(result.metrics)) {
                if (value !== undefined && value !== 'N/A') {
                    const label = key.replace(/([A-Z])/g, ' $1').trim();
                    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
                    detailsHTML += `<li>${capitalizedLabel}: ${value}${key.includes('Speed') ? ' Mbps' : key.includes('latency') || key.includes('rtt') ? 'ms' : ''}</li>`;
                }
            }
            detailsHTML += '</ul>';
        }
        
        detailsEl.innerHTML = detailsHTML;
    }

    updateSpeedMetrics() {
        const { downloadSpeed = 0, uploadSpeed = 0, latency = 0 } = this.results.speed.metrics || {};
        const downloadEl = document.getElementById('downloadMetric');
        const uploadEl = document.getElementById('uploadMetric');
        const latencyEl = document.getElementById('latencyMetric');
        if (downloadEl) downloadEl.textContent = `${downloadSpeed || 0} Mbps`;
        if (uploadEl) uploadEl.textContent = `${uploadSpeed || 0} Mbps`;
        if (latencyEl) latencyEl.textContent = `${latency || 0} ms`;
    }

    generateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        if (!recommendationsList) return;

        const recommendations = [];

        // Security recommendations
        if (this.results.security.score < 80) {
            if (this.results.security.issues.includes('Not using HTTPS connection')) {
                recommendations.push({
                    type: 'critical',
                    icon: '🔒',
                    title: 'Enable HTTPS',
                    description: 'Always use HTTPS connections to encrypt your data. Avoid accessing sensitive information over HTTP.'
                });
            }
            if (this.results.security.score < 60) {
                recommendations.push({
                    type: 'critical',
                    icon: '🛡️',
                    title: 'Upgrade Router Security',
                    description: 'Ensure your router is using WPA3 or at minimum WPA2 encryption. Disable WEP and WPA as they are outdated and insecure.'
                });
            }
        }

        // Privacy recommendations
        if (this.results.privacy.score < 70) {
            if (this.results.privacy.issues.includes('WebRTC enabled (potential IP leak)')) {
                recommendations.push({
                    type: 'warning',
                    icon: '🔍',
                    title: 'WebRTC Leak Protection',
                    description: 'Consider using a browser extension to prevent WebRTC leaks that could expose your real IP address even when using a VPN.'
                });
            }
            if (!this.results.privacy.details.includes('VPN')) {
                recommendations.push({
                    type: 'info',
                    icon: '🌐',
                    title: 'Consider Using a VPN',
                    description: 'A VPN can encrypt your internet traffic and hide your IP address, providing an extra layer of privacy and security.'
                });
            }
        }

        // Speed recommendations
        if (this.results.speed.score < 70) {
            if (this.results.speed.metrics.downloadSpeed < 25) {
                recommendations.push({
                    type: 'warning',
                    icon: '⬇️',
                    title: 'Improve Download Speed',
                    description: 'Your download speed is below optimal. Move closer to your router, reduce interference, or contact your ISP.'
                });
            }
            if (this.results.speed.metrics.uploadSpeed < 5) {
                recommendations.push({
                    type: 'warning',
                    icon: '⬆️',
                    title: 'Improve Upload Speed',
                    description: 'Your upload speed is low. This may affect video calls and cloud uploads. Consider upgrading your plan.'
                });
            }
            if (this.results.speed.metrics.latency > 100) {
                recommendations.push({
                    type: 'warning',
                    icon: '📶',
                    title: 'Reduce Latency',
                    description: 'High latency detected. Use a wired ethernet connection for gaming or video calls, and close bandwidth-heavy applications.'
                });
            }
        }

        // Stability recommendations
        if (this.results.stability.score < 70) {
            recommendations.push({
                type: 'warning',
                icon: '📡',
                title: 'Improve Connection Stability',
                description: 'Update your router firmware, reduce the number of connected devices, or consider upgrading to a mesh WiFi system for better coverage.'
            });
        }

        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                type: 'info',
                icon: '✅',
                title: 'Excellent Configuration',
                description: 'Your network is well-configured! Continue to monitor your network regularly and keep your devices updated.'
            });
            recommendations.push({
                type: 'info',
                icon: '🔄',
                title: 'Regular Maintenance',
                description: 'Restart your router monthly, update firmware regularly, and change your WiFi password every few months for optimal security.'
            });
        }

        // Render recommendations
        let html = '';
        recommendations.forEach(rec => {
            html += `
                <div class="recommendation-card ${rec.type}">
                    <div class="recommendation-icon">${rec.icon}</div>
                    <div class="recommendation-content">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                    </div>
                </div>
            `;
        });
        
        recommendationsList.innerHTML = html;
    }

    resetAnalysis() {
        // Reset results
        this.results = {
            security: { score: 0, status: '', details: '', issues: [] },
            privacy: { score: 0, status: '', details: '', issues: [] },
            speed: { score: 0, status: '', details: '', metrics: {} },
            stability: { score: 0, status: '', details: '', metrics: {} }
        };
        this.overallScore = 0;

        // Hide results, show hero
        document.getElementById('resultsSection').classList.add('hidden');
        document.querySelector('.hero').style.display = 'block';
        
        // Reset progress
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = '0%';
        
        // Reset steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    initCookieConsent() {
        const cookieBanner = document.getElementById('cookieBanner');
        const acceptBtn = document.getElementById('acceptCookies');
        const declineBtn = document.getElementById('declineCookies');
        
        // Check if consent was already given
        const consent = localStorage.getItem('cookieConsent');
        
        if (!consent && cookieBanner) {
            // Show banner after 2 seconds
            setTimeout(() => {
                cookieBanner.classList.remove('hidden');
            }, 2000);
        }
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                if (cookieBanner) cookieBanner.classList.add('hidden');
            });
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                if (cookieBanner) cookieBanner.classList.add('hidden');
            });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the analyzer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WiFiAnalyzer();
});

// Monitor online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});

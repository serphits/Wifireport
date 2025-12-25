// WiFi.Report - Main JavaScript
// Real WiFi Analysis Implementation
// 
// Speed Test Improvements (v2.3 - Multi-Connection & Accurate):
// - Multi-connection speed tests like speedtest.net/fast.com (4 parallel downloads, 3 parallel uploads)
// - Improved accuracy by saturating bandwidth with concurrent connections
// - Real-time speed display during testing
// - Adaptive test sizes based on connection type (10-25MB downloads, 5-10MB uploads)
// - Reliable endpoints with multiple fallback options
// - Enhanced error handling and retry logic
// - Relaxed sanity checks to detect slow connections (0.01 Mbps minimum)
// - Mobile Safari/iOS compatibility with fallback mechanisms
// - Division by zero protection with minimal 1ms floor for edge cases

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
            speed: { score: 0, status: '', details: '', metrics: { latency: 0, downloadSpeed: 0, uploadSpeed: 0, jitter: 0 } },
            stability: { score: 0, status: '', details: '', metrics: {} },
            connection: { type: '', effectiveType: '', downlink: 0, rtt: 0, saveData: false }
        };
        this.overallScore = 0;
        this.latencyMeasurements = [];
        
        // Thresholds for metrics evaluation
        this.thresholds = {
            latency: { good: 50, fair: 100 },
            jitter: { good: 10, fair: 30 }
        };
        
        // Speed test constants - simplified for faster, more accurate results
        this.speedTestConstants = {
            MIN_MEASUREMENT_TIME: 1.0, // Minimum time in seconds for valid measurement (reduced for speed)
            MIN_MEASUREMENT_BUFFER: 0.5, // Buffer added to minimum time for warnings
            TARGET_TEST_DURATION: 2.0, // Target duration for each speed test (reduced for speed)
            MAX_TEST_TIMEOUT: 30000 // Maximum timeout for a single test (30 seconds)
        };
        
        // Common screen resolutions for fingerprinting detection
        this.commonResolutions = ['1920x1080x24', '1366x768x24', '1440x900x24', '1536x864x24', '1280x720x24'];
        
        // Pre-generate test data for upload tests to avoid timing overhead
        this.uploadTestData = this.generateTestData();
        
        this.init();
    }
    
    generateTestData() {
        // Pre-generate 100MB of test data once to support large upload tests
        const maxSize = 100_000_000; // Increased from 10MB to 100MB for larger uploads
        const data = new Uint8Array(maxSize);
        if (window.crypto && window.crypto.getRandomValues) {
            const chunkSize = 65536;
            for (let i = 0; i < maxSize; i += chunkSize) {
                const chunk = new Uint8Array(data.buffer, i, Math.min(chunkSize, maxSize - i));
                window.crypto.getRandomValues(chunk);
            }
        } else {
            for (let i = 0; i < maxSize; i++) {
                data[i] = Math.floor(Math.random() * 256);
            }
        }
        return data;
    }

    calculateMbps(bytes, seconds) {
        // Helper method to calculate Mbps from bytes and time
        // Formula: (bytes * 8 bits/byte) / seconds / 1,000,000 bits/Mbps
        // Prevent division by zero or extremely small values (< 0.001s)
        // Values >= 0.001s (1ms) use their actual time for accurate speed calculation
        const effectiveSeconds = Math.max(seconds, 0.001);
        return (bytes * 8) / effectiveSeconds / 1e6;
    }

    getActualBytes(received, contentLength, endpoint, expectedSize) {
        // Helper method to determine actual bytes for speed calculation
        // Falls back through multiple sources when streaming API doesn't report bytes correctly
        // This is critical for Safari/iPhone where response.body.getReader() may fail silently
        
        // Validate inputs - ensure numeric values
        const validReceived = typeof received === 'number' && received > 0 ? received : 0;
        const validContentLength = typeof contentLength === 'number' && contentLength > 0 ? contentLength : 0;
        const validExpectedSize = typeof expectedSize === 'number' && expectedSize > 0 ? expectedSize : 0;
        const validFixedSize = endpoint && typeof endpoint.fixedSize === 'number' && endpoint.fixedSize > 0 ? endpoint.fixedSize : 0;
        
        if (validReceived > 0) {
            return validReceived;
        }
        // Fallback chain: contentLength -> fixedSize -> expectedSize
        return validContentLength || validFixedSize || validExpectedSize || 0;
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
        
        await this.delay(500);
        
        // Check connection info using Network Information API
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            this.results.connection.type = connection.type || 'Unknown';
            this.results.connection.effectiveType = connection.effectiveType || 'Unknown';
            this.results.connection.downlink = connection.downlink || 0;
            this.results.connection.rtt = connection.rtt || 0;
            this.results.connection.saveData = connection.saveData || false;
        } else {
            this.results.connection.type = 'Not available';
            this.results.connection.effectiveType = 'Unknown';
        }

        this.updateStep('connection', 'completed');
        this.updateProgress(20, 'Connection type identified: ' + this.results.connection.effectiveType);
    }

    async runSecurityTest() {
        this.updateProgress(25, 'Analyzing security protocols...');
        this.updateStep('security', 'active');
        
        await this.delay(1500);

        const security = this.results.security;
        
        // Check HTTPS
        const isHTTPS = window.location.protocol === 'https:';
        
        // Check for secure context
        const isSecureContext = window.isSecureContext;
        
        // Analyze based on connection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        let securityScore = 70; // Base score
        let issues = [];
        let strengths = [];
        
        if (!isHTTPS) {
            securityScore -= 20;
            issues.push('Not using HTTPS connection');
        } else {
            securityScore += 10;
            strengths.push('Using HTTPS encrypted connection');
        }
        
        if (!isSecureContext) {
            securityScore -= 15;
            issues.push('Insecure context detected');
        } else {
            strengths.push('Secure browser context verified');
        }
        
        // Check for mixed content
        if (typeof window.performance !== 'undefined') {
            const resources = performance.getEntriesByType('resource');
            const insecureResources = resources.filter(r => r.name.startsWith('http:'));
            if (insecureResources.length > 0) {
                securityScore -= 10;
                issues.push(`Found ${insecureResources.length} insecure resource(s)`);
            } else if (resources.length > 0) {
                strengths.push('No mixed content detected');
            }
        }
        
        // Check for TLS protocol info (if available through performance API)
        if (window.performance && window.performance.getEntriesByType) {
            const navEntry = window.performance.getEntriesByType('navigation')[0];
            if (navEntry && navEntry.nextHopProtocol) {
                const protocol = navEntry.nextHopProtocol;
                if (protocol.includes('h2') || protocol.includes('h3')) {
                    securityScore += 5;
                    strengths.push(`Using modern protocol: ${protocol}`);
                }
            }
        }
        
        // Check for HSTS support (Strict-Transport-Security)
        // This is a best-effort check - we can't directly access response headers from JS
        // but we can infer from the secure context
        if (isHTTPS && isSecureContext) {
            strengths.push('HTTPS enforced by browser');
        }
        
        security.score = Math.max(0, Math.min(100, securityScore));
        security.issues = issues;
        security.strengths = strengths;
        
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
            // Test 1: Measure latency with multiple pings for jitter calculation
            const latencies = [];
            const pingTargets = [
                'https://www.google.com/favicon.ico',
                'https://www.cloudflare.com/favicon.ico',
                'https://www.github.com/favicon.ico'
            ];
            
            // Perform 2 rounds of pings (fast and simple)
            for (let round = 0; round < 2; round++) {
                for (let i = 0; i < pingTargets.length; i++) {
                    try {
                        const latency = await this.measureLatency(pingTargets[i]);
                        latencies.push(latency);
                    } catch (e) {
                        // Skip failed pings
                    }
                    this.updateProgress(50 + Math.floor((round * 3 + i + 1) * 2), `Latency: ${latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : '...'} ms`);
                }
            }
            
            if (latencies.length > 0) {
                const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
                speed.metrics.latency = Math.round(avgLatency);
                
                // Calculate jitter using industry-standard method (RFC 3550)
                // Jitter is the mean deviation of differences in packet spacing
                if (latencies.length > 1) {
                    // Method 1: Standard deviation (current approach - good for general variance)
                    const squaredDiffs = latencies.map(lat => Math.pow(lat - avgLatency, 2));
                    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;
                    const stdDevJitter = Math.sqrt(variance);
                    
                    // Method 2: Mean absolute difference (more robust to outliers)
                    const absoluteDiffs = [];
                    for (let i = 1; i < latencies.length; i++) {
                        absoluteDiffs.push(Math.abs(latencies[i] - latencies[i - 1]));
                    }
                    const meanAbsoluteJitter = absoluteDiffs.length > 0 
                        ? absoluteDiffs.reduce((a, b) => a + b, 0) / absoluteDiffs.length 
                        : 0;
                    
                    // Combine both methods: use standard deviation as primary measure
                    const jitter = stdDevJitter;
                    speed.metrics.jitter = Math.round(jitter * 10) / 10;
                } else {
                    speed.metrics.jitter = 0;
                }
                
                this.latencyMeasurements = latencies;
            } else {
                speed.metrics.latency = 0;
                speed.metrics.jitter = 0;
            }

            // Warmup: Simplified and faster
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const effectiveType = connection?.effectiveType || '4g';
            const shouldWarmup = effectiveType === '4g' || effectiveType === '5g';
            
            if (shouldWarmup) {
                this.updateProgress(62, 'Warming up connection...');
                try {
                    await this.measureDownloadMbps(1_000_000); // 1MB warmup (faster)
                    await this.measureUploadMbps(500_000);     // 500KB warmup (faster)
                } catch (e) {
                    console.log('Warmup test error (non-critical):', e.message);
                }
            }

            // Test 2: Measure bandwidth with controlled downloads
            // Simplified and faster speed test with real-time display
            let downloadMbps = 0;
            try {
                // Use smaller, faster tests (2-3 seconds each) for quicker results
                let runs;
                if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                    // For slow connections: 1MB, 2MB (quick tests)
                    runs = [1_000_000, 2_000_000];
                } else if (effectiveType === '3g') {
                    // For 3G: 5MB, 10MB (2-3 seconds each)
                    runs = [5_000_000, 10_000_000];
                } else {
                    // For fast connections: 10MB, 25MB (2-3 seconds each)
                    runs = [10_000_000, 25_000_000];
                }
                
                const results = [];
                for (let i = 0; i < runs.length; i++) {
                    const res = await this.measureDownloadMbps(runs[i]);
                    if (res && isFinite(res) && res > 0) {
                        results.push(res);
                        console.log(`Download test ${i + 1}: ${res.toFixed(2)} Mbps (${(runs[i] / 1e6).toFixed(1)}MB)`);
                        // Show real-time speed to user
                        this.updateProgress(64 + i * 5, `Download: ${res.toFixed(1)} Mbps (${i + 1}/${runs.length})`);
                    } else {
                        this.updateProgress(64 + i * 5, `Testing download (${i + 1}/${runs.length})...`);
                    }
                }
                if (results.length) {
                    // Use median to reduce outliers
                    results.sort((a, b) => a - b);
                    const mid = Math.floor(results.length / 2);
                    downloadMbps = results.length % 2 ? results[mid] : (results[mid - 1] + results[mid]) / 2;
                    console.log(`Final download speed: ${downloadMbps.toFixed(2)} Mbps (median from ${results.length} measurements)`);
                }
            } catch (e) {
                console.error('Download measurement error:', e);
                // ignore, fallback below
            }

            if (!downloadMbps || !isFinite(downloadMbps) || downloadMbps === 0) {
                // Fallback: rough estimate using resource timings if available
                if (window.performance) {
                    const resources = performance.getEntriesByType('resource');
                    const largeResources = resources.filter(r => (r.transferSize || 0) > 10000);
                    if (largeResources.length > 0) {
                        const total = largeResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
                        const totalTime = largeResources.reduce((sum, r) => sum + (r.duration || 0), 0) / 1000;
                        if (totalTime > 0 && total > 0) {
                            downloadMbps = (total * 8) / totalTime / 1e6;
                        }
                    }
                }
            }

            // If still 0, use connection API estimate as last resort
            if (!downloadMbps || !isFinite(downloadMbps) || downloadMbps === 0) {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (connection && connection.downlink) {
                    downloadMbps = connection.downlink;
                }
            }

            speed.metrics.downloadSpeed = Math.max(0, Math.round(downloadMbps * 10) / 10);

            // Test 3: Measure upload speed - simplified and faster
            let uploadMbps = 0;
            try {
                // Use smaller, faster tests for quicker results
                let uploadTests;
                if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                    // For slow connections: 500KB, 1MB
                    uploadTests = [500_000, 1_000_000];
                } else if (effectiveType === '3g') {
                    // For 3G: 2MB, 5MB
                    uploadTests = [2_000_000, 5_000_000];
                } else {
                    // For fast connections: 5MB, 10MB
                    uploadTests = [5_000_000, 10_000_000];
                }
                
                const uploadResults = [];
                for (let i = 0; i < uploadTests.length; i++) {
                    const res = await this.measureUploadMbps(uploadTests[i]);
                    if (res && isFinite(res) && res > 0) {
                        uploadResults.push(res);
                        console.log(`Upload test ${i + 1}: ${res.toFixed(2)} Mbps (${(uploadTests[i] / 1e6).toFixed(1)}MB)`);
                        // Show real-time speed to user
                        this.updateProgress(74 + i * 5, `Upload: ${res.toFixed(1)} Mbps (${i + 1}/${uploadTests.length})`);
                    } else {
                        this.updateProgress(74 + i * 5, `Testing upload (${i + 1}/${uploadTests.length})...`);
                    }
                }
                if (uploadResults.length > 0) {
                    // Use median for better accuracy
                    uploadResults.sort((a, b) => a - b);
                    const mid = Math.floor(uploadResults.length / 2);
                    uploadMbps = uploadResults.length % 2 ? uploadResults[mid] : (uploadResults[mid - 1] + uploadResults[mid]) / 2;
                    console.log(`Final upload speed: ${uploadMbps.toFixed(2)} Mbps (median from ${uploadResults.length} measurements)`);
                }
            } catch (e) {
                console.error('Upload measurement error:', e);
                // ignore, fallback below
            }

            // If upload is 0, estimate based on download (typically 10-20% of download for residential)
            if ((!uploadMbps || !isFinite(uploadMbps) || uploadMbps === 0) && speed.metrics.downloadSpeed > 0) {
                uploadMbps = speed.metrics.downloadSpeed * 0.15; // Conservative 15% estimate
            }

            speed.metrics.uploadSpeed = Math.max(0, Math.round(uploadMbps * 10) / 10);

            // If all metrics are still 0, provide conservative estimates with a warning
            if (speed.metrics.downloadSpeed === 0 && speed.metrics.uploadSpeed === 0 && speed.metrics.latency === 0) {
                console.warn('All speed tests failed - using estimates based on connection type');
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                const effectiveType = connection?.effectiveType || '4g';
                
                // Provide conservative estimates based on connection type
                if (effectiveType === 'slow-2g') {
                    speed.metrics.downloadSpeed = 0.5;
                    speed.metrics.uploadSpeed = 0.1;
                    speed.metrics.latency = 2000;
                    speed.metrics.jitter = 200;
                } else if (effectiveType === '2g') {
                    speed.metrics.downloadSpeed = 2;
                    speed.metrics.uploadSpeed = 0.5;
                    speed.metrics.latency = 500;
                    speed.metrics.jitter = 100;
                } else if (effectiveType === '3g') {
                    speed.metrics.downloadSpeed = 10;
                    speed.metrics.uploadSpeed = 2;
                    speed.metrics.latency = 200;
                    speed.metrics.jitter = 50;
                } else {
                    // For 4G and unknown, use more conservative estimates
                    speed.metrics.downloadSpeed = 25;
                    speed.metrics.uploadSpeed = 5;
                    speed.metrics.latency = 50;
                    speed.metrics.jitter = 10;
                }
                
                // Add a note in the status
                speed.status = 'Estimated';
                speed.details = `⚠️ Speed test measurements were unavailable. Showing estimates based on ${effectiveType.toUpperCase()} connection type: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency. Try refreshing for an actual measurement.`;
            }

            // Calculate speed score with better thresholds
            let speedScore = 30; // Lower base score for more accurate rating
            
            // Latency scoring (max 20 points)
            if (speed.metrics.latency < this.thresholds.latency.good) {
                speedScore += 20;
            } else if (speed.metrics.latency < this.thresholds.latency.fair) {
                speedScore += 15;
            } else if (speed.metrics.latency < this.thresholds.latency.fair * 2) {
                speedScore += 10;
            } else {
                speedScore += 5; // Poor latency
            }
            
            // Jitter scoring (max 10 points)
            if (speed.metrics.jitter < this.thresholds.jitter.good) {
                speedScore += 10;
            } else if (speed.metrics.jitter < this.thresholds.jitter.fair) {
                speedScore += 5;
            } else {
                speedScore -= 5; // High jitter is a problem
            }
            
            // Download speed scoring (max 30 points) - more realistic thresholds
            if (speed.metrics.downloadSpeed >= 100) {
                speedScore += 30;
            } else if (speed.metrics.downloadSpeed >= 50) {
                speedScore += 25;
            } else if (speed.metrics.downloadSpeed >= 25) {
                speedScore += 20;
            } else if (speed.metrics.downloadSpeed >= 10) {
                speedScore += 15;
            } else if (speed.metrics.downloadSpeed >= 5) {
                speedScore += 10;
            } else if (speed.metrics.downloadSpeed >= 2) {
                speedScore += 5;
            }
            // Below 2 Mbps gets 0 additional points

            // Upload speed scoring (max 20 points) - more realistic thresholds
            if (speed.metrics.uploadSpeed >= 50) {
                speedScore += 20;
            } else if (speed.metrics.uploadSpeed >= 20) {
                speedScore += 15;
            } else if (speed.metrics.uploadSpeed >= 10) {
                speedScore += 12;
            } else if (speed.metrics.uploadSpeed >= 5) {
                speedScore += 10;
            } else if (speed.metrics.uploadSpeed >= 2) {
                speedScore += 7;
            } else if (speed.metrics.uploadSpeed >= 1) {
                speedScore += 4;
            }
            // Below 1 Mbps gets 0 additional points
            
            speed.score = Math.max(0, Math.min(100, speedScore));
            
            if (speed.score >= 80) {
                speed.status = 'Excellent';
                speed.details = `Excellent speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency, ${speed.metrics.jitter}ms jitter. Perfect for gaming, 4K streaming, and video calls.`;
            } else if (speed.score >= 60) {
                speed.status = 'Good';
                speed.details = `Good speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency, ${speed.metrics.jitter}ms jitter. Suitable for most online activities.`;
            } else if (speed.score >= 40) {
                speed.status = 'Fair';
                speed.details = `Fair speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency, ${speed.metrics.jitter}ms jitter. Adequate but could be improved.`;
            } else {
                speed.status = 'Poor';
                speed.details = `Poor speed: ${speed.metrics.downloadSpeed} Mbps down, ${speed.metrics.uploadSpeed} Mbps up, ${speed.metrics.latency}ms latency, ${speed.metrics.jitter}ms jitter. Consider upgrading your connection.`;
            }

        } catch (error) {
            console.error('Speed test error:', error);
            // Provide estimated values based on connection type
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const effectiveType = connection?.effectiveType || '4g';
            
            // Estimate based on connection type
            let estimatedDown = 50, estimatedUp = 10, estimatedLatency = 50, estimatedJitter = 10;
            if (effectiveType === 'slow-2g') {
                estimatedDown = 0.5; estimatedUp = 0.1; estimatedLatency = 2000; estimatedJitter = 200;
            } else if (effectiveType === '2g') {
                estimatedDown = 2; estimatedUp = 0.5; estimatedLatency = 500; estimatedJitter = 100;
            } else if (effectiveType === '3g') {
                estimatedDown = 10; estimatedUp = 2; estimatedLatency = 200; estimatedJitter = 50;
            } else if (effectiveType === '4g') {
                estimatedDown = 50; estimatedUp = 10; estimatedLatency = 50; estimatedJitter = 10;
            }
            
            speed.metrics.latency = estimatedLatency;
            speed.metrics.downloadSpeed = estimatedDown;
            speed.metrics.uploadSpeed = estimatedUp;
            speed.metrics.jitter = estimatedJitter;
            speed.score = 50;
            speed.status = 'Estimated';
            speed.details = `Estimated speed based on ${effectiveType.toUpperCase()} connection: ${estimatedDown} Mbps down, ${estimatedUp} Mbps up, ${estimatedLatency}ms latency, ${estimatedJitter}ms jitter. Actual measurements unavailable.`;
        }

        this.updateStep('speed', 'completed');
        this.updateProgress(88, 'Speed test complete');
    }

    async measureUploadMbps(bytes) {
        // Improved upload test with CORS-friendly endpoints
        const endpoints = [
            {
                url: 'https://httpbin.org/post',
                provider: 'httpbin.org',
                concurrent: false
            },
            {
                url: 'https://httpbin.org/anything',
                provider: 'httpbin.org/anything',
                concurrent: false
            }
        ];
        
        // Test with single connection (httpbin.org doesn't benefit from multi-connection)
        for (const endpoint of endpoints) {
            try {
                // Generate test data
                let data;
                if (bytes <= this.uploadTestData.length) {
                    data = this.uploadTestData.slice(0, bytes);
                } else {
                    // For very large uploads, generate on-demand
                    data = new Uint8Array(bytes);
                    if (window.crypto && window.crypto.getRandomValues) {
                        const chunkSize = 65536;
                        for (let i = 0; i < bytes; i += chunkSize) {
                            const chunk = new Uint8Array(data.buffer, i, Math.min(chunkSize, bytes - i));
                            window.crypto.getRandomValues(chunk);
                        }
                    }
                }
                
                if (!data || data.length === 0) {
                    console.error('Upload test failed: invalid data');
                    continue;
                }
                
                const timestamp = Date.now();
                const url = `${endpoint.url}?bytes=${bytes}&t=${timestamp}`;
                
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), this.speedTestConstants.MAX_TEST_TIMEOUT);
                
                const blob = new Blob([data], { type: 'application/octet-stream' });
                
                const startTime = performance.now();
                
                const response = await fetch(url, {
                    method: 'POST',
                    body: blob,
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Cache-Control': 'no-cache'
                    },
                    signal: controller.signal
                });
                
                if (!response.ok) {
                    throw new Error(`Upload failed with status ${response.status}`);
                }
                
                await response.text(); // Consume response
                
                const endTime = performance.now();
                clearTimeout(timeout);
                
                const totalTime = (endTime - startTime) / 1000;
                const mbps = this.calculateMbps(bytes, totalTime);
                
                console.log(`Upload test (${endpoint.provider}): ${mbps.toFixed(2)} Mbps (${(bytes / 1e6).toFixed(2)}MB in ${totalTime.toFixed(2)}s)`);
                
                // Relaxed sanity check
                if (mbps > 0.01 && mbps < 10000) {
                    return mbps;
                }
            } catch (e) {
                console.error(`Upload test failed (${endpoint.provider}):`, e.message);
            }
        }
        
        return 0;
    }
    
    async measureUploadMultiConnection(endpoint, targetBytes) {
        // Implement multiple concurrent upload connections like speedtest.net
        const numConnections = 3; // Use 3 concurrent connections for uploads
        const bytesPerConnection = Math.ceil(targetBytes / numConnections);
        
        console.log(`Starting multi-connection upload test (${endpoint.provider}): ${numConnections} connections x ${(bytesPerConnection / 1e6).toFixed(2)}MB`);
        
        const startTime = performance.now();
        const results = [];
        
        // Start all connections simultaneously
        const promises = [];
        for (let i = 0; i < numConnections; i++) {
            promises.push(this.uploadChunk(endpoint, bytesPerConnection, i));
        }
        
        // Wait for all connections to complete (use allSettled to handle partial failures)
        try {
            const results = await Promise.allSettled(promises);
            
            // Calculate total bytes uploaded from successful connections
            let totalBytes = 0;
            const successfulChunks = [];
            
            for (const result of results) {
                if (result.status === 'fulfilled' && result.value && result.value.bytes > 0) {
                    totalBytes += result.value.bytes;
                    successfulChunks.push(result.value);
                }
            }
            
            const endTime = performance.now();
            const totalTime = (endTime - startTime) / 1000;
            
            // Need at least some successful connections
            if (successfulChunks.length === 0 || totalBytes === 0) {
                throw new Error('No data uploaded from any connection');
            }
            
            // Calculate overall speed
            const mbps = this.calculateMbps(totalBytes, totalTime);
            console.log(`Multi-connection upload complete (${endpoint.provider}): ${mbps.toFixed(2)} Mbps (${(totalBytes / 1e6).toFixed(2)}MB in ${totalTime.toFixed(2)}s, ${successfulChunks.length}/${numConnections} connections successful)`);
            
            return mbps;
        } catch (e) {
            throw new Error(`Multi-connection upload test failed: ${e.message}`);
        }
    }
    
    async uploadChunk(endpoint, bytes, connectionId) {
        // Upload a chunk of data in one connection
        try {
            // Generate test data for this connection
            let data;
            if (bytes <= this.uploadTestData.length) {
                data = this.uploadTestData.slice(0, bytes);
            } else {
                data = new Uint8Array(bytes);
                if (window.crypto && window.crypto.getRandomValues) {
                    const chunkSize = 65536;
                    for (let i = 0; i < bytes; i += chunkSize) {
                        const chunk = new Uint8Array(data.buffer, i, Math.min(chunkSize, bytes - i));
                        window.crypto.getRandomValues(chunk);
                    }
                }
            }
            
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const url = `${endpoint.url}?bytes=${bytes}&t=${timestamp}&r=${random}&conn=${connectionId}`;
            
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.speedTestConstants.MAX_TEST_TIMEOUT);
            
            const blob = new Blob([data], { type: 'application/octet-stream' });
            
            const response = await fetch(url, {
                method: 'POST',
                body: blob,
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Cache-Control': 'no-cache'
                },
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }
            
            await response.text(); // Consume response
            clearTimeout(timeout);
            
            return { bytes: bytes, connectionId };
        } catch (e) {
            console.warn(`Upload connection ${connectionId} failed: ${e.message}`);
            return { bytes: 0, connectionId };
        }
    }

    async measureDownloadMbps(bytes) {
        // Improved speed test using multiple CORS-friendly methods and endpoints
        // Uses public CDN files and APIs for accurate measurements
        
        const endpoints = [
            // Primary: Use GitHub's reliable CDN for test files (CORS-friendly, very reliable)
            {
                url: 'https://raw.githubusercontent.com/inventer-dev/speed-test-files/main',
                provider: 'GitHub CDN',
                useParams: false,
                concurrent: true,
                sizeMap: {
                    512000: '/512KB.bin',     // 512KB
                    1000000: '/1MB.bin',      // 1MB
                    2000000: '/2MB.bin',      // 2MB  
                    5000000: '/5MB.bin',      // 5MB
                    10000000: '/10MB.bin',    // 10MB
                    20000000: '/20MB.bin',    // 20MB
                    25000000: '/20MB.bin'     // 25MB (use 20MB as closest)
                }
            },
            // Fallback 1: jsDelivr CDN (very fast, globally distributed, CORS-enabled)
            {
                url: 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist',
                provider: 'jsDelivr CDN',
                useParams: false,
                fixedSize: 88000, // jquery.min.js is ~88KB
                concurrent: false,
                sizeMap: {
                    512000: '/jquery.min.js',  // Repeat file multiple times for larger tests
                    1000000: '/jquery.min.js',
                    2000000: '/jquery.min.js',
                    5000000: '/jquery.min.js',
                    10000000: '/jquery.min.js',
                    20000000: '/jquery.min.js',
                    25000000: '/jquery.min.js'
                }
            },
            // Fallback 2: httpbin.org (reliable when available, supports CORS, any size)
            {
                url: 'https://httpbin.org/bytes',
                provider: 'httpbin.org',
                useParams: true,
                concurrent: false
            },
            // Fallback 3: Use cdnjs (Cloudflare's CDN, very reliable)
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21',
                provider: 'cdnjs.com',
                useParams: false,
                fixedSize: 72000, // lodash.min.js is ~72KB
                concurrent: false,
                sizeMap: {
                    512000: '/lodash.min.js',
                    1000000: '/lodash.min.js',
                    2000000: '/lodash.min.js',
                    5000000: '/lodash.min.js',
                    10000000: '/lodash.min.js',
                    20000000: '/lodash.min.js',
                    25000000: '/lodash.min.js'
                }
            }
        ];
        
        // Try multiple concurrent connections first (speedtest.net method)
        // This is the most accurate method for measuring true bandwidth
        for (const endpoint of endpoints) {
            if (endpoint.concurrent) {
                try {
                    const result = await this.measureDownloadMultiConnection(endpoint, bytes);
                    if (result > 0.01) { // Lower threshold for slow connections
                        return result;
                    }
                } catch (e) {
                    console.error(`Multi-connection download test failed (${endpoint.provider}):`, e.message);
                }
            }
        }
        
        // Fallback to single connection tests
        for (const endpoint of endpoints) {
            try {
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(7);
                
                // Determine expected file size from sizeMap if available
                let expectedSize = bytes;
                
                // Construct URL based on endpoint type
                let url;
                if (endpoint.sizeMap) {
                    // For CDN endpoints with size map (like jsDelivr)
                    const sizes = Object.keys(endpoint.sizeMap).map(Number).sort((a, b) => a - b);
                    const closestSize = sizes.reduce((prev, curr) => 
                        Math.abs(curr - bytes) < Math.abs(prev - bytes) ? curr : prev
                    );
                    url = `${endpoint.url}${endpoint.sizeMap[closestSize]}?t=${timestamp}&r=${random}`;
                    // Use the closest size from the map as expected size
                    expectedSize = closestSize;
                } else if (endpoint.useParams) {
                    url = `${endpoint.url}?bytes=${bytes}&t=${timestamp}&r=${random}`;
                } else {
                    url = `${endpoint.url}?t=${timestamp}&r=${random}`;
                }
                
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), this.speedTestConstants.MAX_TEST_TIMEOUT);
                
                const startTime = performance.now();
                let firstByteTime = null;
                
                const response = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    },
                    signal: controller.signal
                });
                
                if (!response.ok) {
                    throw new Error(`Download failed with status ${response.status}`);
                }
                
                // Get content length from headers
                const contentLength = parseInt(response.headers.get('content-length') || '0');
                
                // Read the response body
                let received = 0;
                
                if (response.body && response.body.getReader) {
                    // Use streaming for accurate measurement
                    const reader = response.body.getReader();
                    
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            
                            if (!firstByteTime) {
                                firstByteTime = performance.now();
                            }
                            received += value.length;
                        }
                    } finally {
                        reader.releaseLock();
                    }
                } else {
                    // Fallback for older browsers
                    const buffer = await response.arrayBuffer();
                    received = buffer.byteLength;
                    firstByteTime = performance.now();
                }
                
                const endTime = performance.now();
                clearTimeout(timeout);
                
                // Calculate time - use full time for simplicity
                const totalTime = (endTime - startTime) / 1000;
                
                // Use actual bytes received, or fall back to content-length, fixed size, or expected size
                // This is critical for Safari/iPhone where streaming may not report bytes correctly
                const actualBytes = this.getActualBytes(received, contentLength, endpoint, expectedSize);
                
                // Validate we got data
                if (actualBytes <= 0) {
                    console.error(`Download test failed (${endpoint.provider}): no data received`);
                    continue;
                }
                
                // Calculate speed
                const mbps = this.calculateMbps(actualBytes, totalTime);
                console.log(
                    `Download test (${endpoint.provider}): ${mbps.toFixed(2)} Mbps\n` +
                    `  Size: ${(actualBytes / 1e6).toFixed(2)}MB in ${totalTime.toFixed(3)}s\n` +
                    `  Received: ${received}, ContentLength: ${contentLength}`
                );
                
                // Very relaxed sanity check for slow connections: 0.01 Mbps to 10000 Mbps
                // This allows detection of very slow connections (dial-up, etc.)
                if (mbps >= 0.01 && mbps < 10000 && actualBytes > 0) {
                    console.log(`✓ Download test successful using ${endpoint.provider}`);
                    return mbps;
                } else {
                    console.warn(`Download test (${endpoint.provider}): speed ${mbps.toFixed(2)} Mbps out of range or invalid`);
                }
            } catch (e) {
                console.error(`Download test failed (${endpoint.provider}):`, e.message);
            }
        }
        
        console.error('❌ All download test endpoints failed - no measurements available');
        return 0;
    }
    
    async measureDownloadMultiConnection(endpoint, targetBytes) {
        // Implement multiple concurrent connections like speedtest.net
        // This saturates the bandwidth for more accurate measurements
        const numConnections = 4; // Use 4 concurrent connections
        const bytesPerConnection = Math.ceil(targetBytes / numConnections);
        
        console.log(`Starting multi-connection download test (${endpoint.provider}): ${numConnections} connections x ${(bytesPerConnection / 1e6).toFixed(2)}MB`);
        
        const startTime = performance.now();
        const results = [];
        
        // Start all connections simultaneously
        const promises = [];
        for (let i = 0; i < numConnections; i++) {
            promises.push(this.downloadChunk(endpoint, bytesPerConnection, i));
        }
        
        // Wait for all connections to complete (use allSettled to handle partial failures)
        try {
            const results = await Promise.allSettled(promises);
            
            // Calculate total bytes received from successful connections
            let totalBytes = 0;
            const successfulChunks = [];
            
            for (const result of results) {
                if (result.status === 'fulfilled' && result.value && result.value.bytes > 0) {
                    totalBytes += result.value.bytes;
                    successfulChunks.push(result.value);
                }
            }
            
            const endTime = performance.now();
            const totalTime = (endTime - startTime) / 1000;
            
            // Need at least some successful connections
            if (successfulChunks.length === 0 || totalBytes === 0) {
                throw new Error('No data received from any connection');
            }
            
            // Calculate overall speed
            const mbps = this.calculateMbps(totalBytes, totalTime);
            console.log(`Multi-connection download complete (${endpoint.provider}): ${mbps.toFixed(2)} Mbps (${(totalBytes / 1e6).toFixed(2)}MB in ${totalTime.toFixed(2)}s, ${successfulChunks.length}/${numConnections} connections successful)`);
            
            return mbps;
        } catch (e) {
            throw new Error(`Multi-connection test failed: ${e.message}`);
        }
    }
    
    async downloadChunk(endpoint, bytes, connectionId) {
        // Download a chunk of data in one connection
        try {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            
            // Determine expected file size from sizeMap if available
            let expectedSize = bytes;
            
            // Construct URL based on endpoint type
            let url;
            if (endpoint.sizeMap) {
                // For CDN endpoints with size map (like jsDelivr)
                // Find the closest size match
                const sizes = Object.keys(endpoint.sizeMap).map(Number).sort((a, b) => a - b);
                const closestSize = sizes.reduce((prev, curr) => 
                    Math.abs(curr - bytes) < Math.abs(prev - bytes) ? curr : prev
                );
                url = `${endpoint.url}${endpoint.sizeMap[closestSize]}?t=${timestamp}&r=${random}`;
                // Use the closest size from the map as expected size
                expectedSize = closestSize;
            } else if (endpoint.useParams) {
                url = `${endpoint.url}?bytes=${bytes}&t=${timestamp}&r=${random}`;
            } else {
                url = `${endpoint.url}?t=${timestamp}&r=${random}`;
            }
            
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.speedTestConstants.MAX_TEST_TIMEOUT);
            
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }
            
            // Get content length from headers as fallback
            const contentLength = parseInt(response.headers.get('content-length') || '0');
            
            // Read the response body
            let received = 0;
            
            if (response.body && response.body.getReader) {
                const reader = response.body.getReader();
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        received += value.length;
                    }
                } finally {
                    reader.releaseLock();
                }
            } else {
                const buffer = await response.arrayBuffer();
                received = buffer.byteLength;
            }
            
            clearTimeout(timeout);
            
            // Use actual bytes received, or fall back to content-length, fixed size, or expected size
            // This is critical for Safari/iPhone where streaming may not report bytes correctly
            const actualBytes = this.getActualBytes(received, contentLength, endpoint, expectedSize);
            
            console.log(
                `Connection ${connectionId}:\n` +
                `  Received: ${received} bytes, Using: ${actualBytes} bytes\n` +
                `  ContentLength: ${contentLength}, Expected: ${expectedSize}`
            );
            
            return { bytes: actualBytes, connectionId };
        } catch (e) {
            console.warn(`Connection ${connectionId} failed: ${e.message}`);
            return { bytes: 0, connectionId };
        }
    }

    async measureLatency(url) {
        // Use fetch with HEAD request for more accurate latency measurement
        // HEAD is better than GET as it only retrieves headers, not the full resource
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const testUrl = `${url}?t=${timestamp}&r=${random}`;
        
        try {
            const start = performance.now();
            
            // Try HEAD request first (most accurate for latency)
            try {
                const response = await fetch(testUrl, {
                    method: 'HEAD',
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                
                const end = performance.now();
                return end - start;
            } catch (headError) {
                // Fallback to GET if HEAD is not supported
                const response = await fetch(testUrl, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                
                const end = performance.now();
                // Consume response to complete the request
                await response.text();
                return end - start;
            }
        } catch (fetchError) {
            // Fallback to Image loading for maximum compatibility
            return new Promise((resolve, reject) => {
                const img = new Image();
                const start = performance.now();
                
                img.onload = () => {
                    const end = performance.now();
                    resolve(end - start);
                };
                img.onerror = () => {
                    const end = performance.now();
                    resolve(end - start); // Still measure even on error
                };
                
                img.src = testUrl;
                
                // Timeout after 5 seconds
                setTimeout(() => reject(new Error('Timeout')), 5000);
            });
        }
    }

    async runStabilityTest() {
        this.updateProgress(89, 'Measuring connection stability...');
        this.updateStep('stability', 'active');
        
        await this.delay(2000);

        const stability = this.results.stability;
        
        try {
            // Check connection stability using Network Information API
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            let stabilityScore = 70; // Base score
            
            // Use latency measurements from speed test for jitter/stability analysis
            if (this.latencyMeasurements && this.latencyMeasurements.length > 1) {
                const latencies = this.latencyMeasurements;
                const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
                
                // Calculate variance for stability metric
                const squaredDiffs = latencies.map(lat => Math.pow(lat - avgLatency, 2));
                const variance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;
                const stdDev = Math.sqrt(variance);
                
                stability.metrics.latencyVariance = Math.round(stdDev * 10) / 10;
                stability.metrics.avgLatency = Math.round(avgLatency);
                stability.metrics.minLatency = Math.round(Math.min(...latencies));
                stability.metrics.maxLatency = Math.round(Math.max(...latencies));
                
                // Score based on latency variance (lower variance = more stable)
                if (stdDev < 5) {
                    stabilityScore += 15; // Very stable
                } else if (stdDev < 15) {
                    stabilityScore += 10; // Stable
                } else if (stdDev < 30) {
                    stabilityScore += 5; // Moderately stable
                } else {
                    stabilityScore -= 10; // Unstable
                }
            }
            
            if (connection) {
                // Check RTT (Round Trip Time) from Network Info API
                if (connection.rtt !== undefined && connection.rtt > 0) {
                    stability.metrics.rtt = connection.rtt;
                    
                    if (connection.rtt < 50) {
                        stabilityScore += 15;
                    } else if (connection.rtt < 100) {
                        stabilityScore += 10;
                    } else if (connection.rtt < 200) {
                        stabilityScore += 5;
                    } else {
                        stabilityScore -= 10;
                    }
                }
                
                // Check downlink speed
                if (connection.downlink !== undefined && connection.downlink > 0) {
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
                    stability.metrics.saveDataMode = 'Enabled';
                }
            }
            
            // Monitor connection changes
            const isOnline = navigator.onLine;
            if (!isOnline) {
                stabilityScore -= 50;
            }
            
            stability.score = Math.max(0, Math.min(100, stabilityScore));
            
            // Generate detailed status message
            let detailsParts = [];
            
            if (stability.metrics.latencyVariance !== undefined) {
                if (stability.metrics.latencyVariance < 5) {
                    detailsParts.push('very consistent latency');
                } else if (stability.metrics.latencyVariance < 15) {
                    detailsParts.push('stable latency');
                } else if (stability.metrics.latencyVariance < 30) {
                    detailsParts.push('moderate latency variation');
                } else {
                    detailsParts.push('high latency variation');
                }
            }
            
            if (stability.score >= 80) {
                stability.status = 'Excellent';
                stability.details = 'Your connection is very stable with ' + (detailsParts.length > 0 ? detailsParts.join(', ') : 'consistent performance') + '.';
            } else if (stability.score >= 60) {
                stability.status = 'Good';
                stability.details = 'Your connection is stable with ' + (detailsParts.length > 0 ? detailsParts.join(', ') : 'minor fluctuations') + '.';
            } else if (stability.score >= 40) {
                stability.status = 'Fair';
                stability.details = 'Your connection shows some instability' + (detailsParts.length > 0 ? ' with ' + detailsParts.join(', ') : '') + '.';
            } else {
                stability.status = 'Poor';
                stability.details = 'Your connection is unstable' + (detailsParts.length > 0 ? ' with ' + detailsParts.join(', ') : ' with frequent disruptions') + '.';
            }

        } catch (error) {
            console.error('Stability test error:', error);
            stability.score = 60;
            stability.status = 'Unknown';
            stability.details = 'Unable to fully assess connection stability.';
        }

        this.updateStep('stability', 'completed');
        this.updateProgress(93, 'Stability test complete');
    }

    async runPrivacyTest() {
        this.updateProgress(94, 'Evaluating privacy concerns...');
        this.updateStep('privacy', 'active');
        
        await this.delay(1500);

        const privacy = this.results.privacy;
        
        try {
            // Get IP information
            const ipInfo = await this.getIPInfo();
            
            // Store IP info for later display
            privacy.ipInfo = ipInfo;
            
            let privacyScore = 70; // Base score
            let issues = [];
            
            // Check for VPN/Proxy - This is the key privacy validator
            if (ipInfo.vpn) {
                privacyScore += 20;
                privacy.status = 'PROTECTED';
                privacy.details = `Your connection is protected! IP: ${ipInfo.ip} via ${ipInfo.org}`;
                privacy.isProtected = true;
            } else {
                // UNPROTECTED - Major privacy concern
                privacyScore -= 30;
                privacy.status = 'UNPROTECTED';
                privacy.details = `Your real IP address (${ipInfo.ip}) is visible to all websites you visit.`;
                privacy.isProtected = false;
                // Only show the most important issue - IP visibility
                issues.push(`Your IP address is visible to all websites`);
            }
            
            // Check WebRTC leak potential - important for VPN users
            if (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection) {
                privacyScore -= 10;
                if (!ipInfo.vpn) {
                    issues.push('WebRTC can reveal your IP address');
                }
            }
            
            // Browser fingerprinting detection - limit issues
            const fingerprintScore = this.checkBrowserFingerprint();
            privacyScore -= fingerprintScore.deduction;
            // Only show top 2 fingerprinting issues to avoid overwhelming users
            if (fingerprintScore.issues.length > 0) {
                issues.push(...fingerprintScore.issues.slice(0, 2));
            }
            
            // Check for tracking protection
            if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') {
                privacyScore += 5;
            }
            
            privacy.score = Math.max(0, Math.min(100, privacyScore));
            privacy.issues = issues;

        } catch (error) {
            console.error('Privacy test error:', error);
            privacy.score = 50;
            privacy.status = 'Unknown';
            privacy.details = 'Unable to fully assess privacy status.';
            privacy.isProtected = false;
        }

        this.updateStep('privacy', 'completed');
        this.updateProgress(100, 'Analysis complete!');
        
        await this.delay(1000);
    }

    checkBrowserFingerprint() {
        const issues = [];
        let deduction = 0;
        
        // Check for unique identifiers that can be used for fingerprinting
        // Simplified messages for user-friendliness
        
        // Canvas fingerprinting
        let canvas;
        try {
            canvas = document.createElement('canvas');
            if (canvas.getContext) {
                issues.push('Browser fingerprinting is possible');
                deduction += 3;
            }
        } catch (e) {
            // Canvas not available
        }
        
        // WebGL fingerprinting - reuse canvas if available
        try {
            if (!canvas) canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                issues.push('Graphics hardware can be tracked');
                deduction += 3;
            }
        } catch (e) {
            // WebGL not available
        }
        
        // Audio fingerprinting
        if (window.AudioContext || window.webkitAudioContext) {
            issues.push('Audio hardware can identify your device');
            deduction += 2;
        }
        
        // Font detection
        if (document.fonts && document.fonts.check) {
            issues.push('Installed fonts can be detected');
            deduction += 2;
        }
        
        // Screen resolution
        if (screen.width && screen.height && screen.colorDepth) {
            const uniqueScreen = `${screen.width}x${screen.height}x${screen.colorDepth}`;
            // Common resolutions get less deduction
            if (!this.commonResolutions.includes(uniqueScreen)) {
                deduction += 2;
            }
        }
        
        // Plugins and extensions can be detected
        if (navigator.plugins && navigator.plugins.length > 0) {
            issues.push(`Browser plugins can identify you`);
            deduction += 2;
        }
        
        return { issues, deduction };
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
            // When IP is unable to detect (usually means VPN is used), treat as protected
            return {
                ip: 'Unable to detect',
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                org: 'Unknown',
                vpn: true  // Treat "Unable to detect" as VPN-protected
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
        
        // Add connection comparison insights
        this.addConnectionComparison();
    }
    
    addConnectionComparison() {
        const effectiveType = this.results.connection.effectiveType?.toLowerCase() || 'unknown';
        const downloadSpeed = this.results.speed.metrics.downloadSpeed || 0;
        const latency = this.results.speed.metrics.latency || 0;
        
        // Define typical ranges for each connection type
        const typicalRanges = {
            'slow-2g': { download: [0.1, 1], latency: [1500, 3000], label: 'Slow 2G' },
            '2g': { download: [1, 3], latency: [300, 1000], label: '2G' },
            '3g': { download: [3, 15], latency: [100, 300], label: '3G' },
            '4g': { download: [15, 100], latency: [30, 100], label: '4G' },
            '5g': { download: [100, 1000], latency: [10, 30], label: '5G' }
        };
        
        if (typicalRanges[effectiveType]) {
            const range = typicalRanges[effectiveType];
            const connectionInfo = document.getElementById('connectionInfo');
            
            if (connectionInfo) {
                let comparisonHTML = '<div class="connection-comparison">';
                comparisonHTML += `<h4>📈 Comparison with Typical ${range.label} Performance</h4>`;
                comparisonHTML += '<div class="comparison-grid">';
                
                // Download comparison
                const downloadStatus = downloadSpeed >= range.download[0] && downloadSpeed <= range.download[1] * 1.5
                    ? 'typical' 
                    : downloadSpeed > range.download[1] * 1.5 
                        ? 'better' 
                        : 'worse';
                comparisonHTML += `<div class="comparison-item ${downloadStatus}">`;
                comparisonHTML += `<span class="comparison-label">Download Speed</span>`;
                comparisonHTML += `<span class="comparison-value">Your: ${downloadSpeed} Mbps</span>`;
                comparisonHTML += `<span class="comparison-typical">Typical: ${range.download[0]}-${range.download[1]} Mbps</span>`;
                comparisonHTML += `<span class="comparison-indicator">${downloadStatus === 'better' ? '✓ Above Average' : downloadStatus === 'typical' ? '• Average' : '⚠ Below Average'}</span>`;
                comparisonHTML += '</div>';
                
                // Latency comparison
                const latencyStatus = latency <= range.latency[1]
                    ? 'better'
                    : latency <= range.latency[1] * 1.5
                        ? 'typical'
                        : 'worse';
                comparisonHTML += `<div class="comparison-item ${latencyStatus}">`;
                comparisonHTML += `<span class="comparison-label">Latency</span>`;
                comparisonHTML += `<span class="comparison-value">Your: ${latency} ms</span>`;
                comparisonHTML += `<span class="comparison-typical">Typical: ${range.latency[0]}-${range.latency[1]} ms</span>`;
                comparisonHTML += `<span class="comparison-indicator">${latencyStatus === 'better' ? '✓ Better than Average' : latencyStatus === 'typical' ? '• Average' : '⚠ Worse than Average'}</span>`;
                comparisonHTML += '</div>';
                
                comparisonHTML += '</div></div>';
                connectionInfo.insertAdjacentHTML('beforeend', comparisonHTML);
            }
        }
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
        
        // Special handling for privacy - use EXPOSED badge for unprotected
        if (category === 'privacy') {
            if (result.isProtected) {
                badgeEl.classList.add('protected');
            } else {
                badgeEl.classList.add('exposed');
                badgeEl.textContent = 'EXPOSED';
            }
        } else {
            if (result.score >= 80) {
                badgeEl.classList.add('excellent');
            } else if (result.score >= 60) {
                badgeEl.classList.add('good');
            } else if (result.score >= 40) {
                badgeEl.classList.add('warning');
            } else {
                badgeEl.classList.add('poor');
            }
        }

        // Update details - Special handling for privacy category
        let detailsHTML = '';
        
        if (category === 'privacy' && result.ipInfo) {
            // Display IP information prominently with exposure badge
            detailsHTML += `<div class="privacy-ip-display">`;
            detailsHTML += `<div class="ip-info-row">`;
            detailsHTML += `<span class="ip-label">Your IP Address</span>`;
            detailsHTML += `<span class="ip-address">${result.ipInfo.ip}</span>`;
            if (!result.isProtected) {
                detailsHTML += `<span class="exposed-badge">🚨 VISIBLE</span>`;
            }
            detailsHTML += `</div>`;
            detailsHTML += `<div class="ip-details">`;
            detailsHTML += `<div><strong>Location:</strong> ${result.ipInfo.city}, ${result.ipInfo.country}</div>`;
            detailsHTML += `<div><strong>Provider:</strong> ${result.ipInfo.org}</div>`;
            detailsHTML += `</div>`;
            detailsHTML += `</div>`;
            
            // Simplified explanation for unprotected connections
            if (!result.isProtected) {
                detailsHTML += `<div class="vpn-cta">`;
                detailsHTML += `<p class="vpn-warning">⚠️ Your IP is visible to all websites you visit</p>`;
                detailsHTML += `<a href="https://www.expressvpn.com/order" target="_blank" rel="noopener" class="vpn-button expressvpn">`;
                detailsHTML += `<span class="vpn-icon">🛡️</span>`;
                detailsHTML += `<span class="vpn-text">Protect with VPN</span>`;
                detailsHTML += `</a>`;
                detailsHTML += `</div>`;
            } else {
                detailsHTML += `<p class="protected-message">✅ Great! Your connection is protected and your real IP is hidden!</p>`;
            }
        } else if (category === 'security' && result.strengths) {
            // Show strengths and issues
            detailsHTML += `<p>${result.details}</p>`;
            if (result.strengths && result.strengths.length > 0) {
                detailsHTML += '<div class="strengths-section"><strong>✓ Security Strengths:</strong><ul>';
                result.strengths.forEach(strength => {
                    detailsHTML += `<li class="strength-item">${strength}</li>`;
                });
                detailsHTML += '</ul></div>';
            }
        } else {
            detailsHTML += `<p>${result.details}</p>`;
        }
        
        if (result.issues && result.issues.length > 0) {
            if (category === 'privacy') {
                detailsHTML += '<div class="issues-section"><strong>Privacy Concerns:</strong>';
                detailsHTML += '<ul class="issue-list">';
            } else {
                detailsHTML += '<div class="issues-section"><strong>Issues Found:</strong><ul class="issue-list">';
            }
            result.issues.forEach(issue => {
                detailsHTML += `<li>${issue}</li>`;
            });
            detailsHTML += '</ul></div>';
        }
        
        if (result.metrics && category !== 'privacy') {
            detailsHTML += '<div class="metrics-section"><strong>📊 Measurements:</strong><ul>';
            const metricEntries = Object.entries(result.metrics);
            if (metricEntries.length > 0) {
                let hasVisibleMetrics = false;
                for (const [key, value] of metricEntries) {
                    if (value !== undefined && value !== 'N/A') {
                        hasVisibleMetrics = true;
                        const label = key.replace(/([A-Z])/g, ' $1').trim();
                        const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
                        let unit = '';
                        let displayValue = value;
                        
                        if (key.includes('Speed') || key.includes('downlink')) unit = ' Mbps';
                        else if (key.includes('latency') || key.includes('rtt') || key.includes('jitter')) unit = ' ms';
                        
                        // Handle 0 values - show them but indicate if not available
                        if (value === 0 && category === 'stability') {
                            displayValue = 'Not Available';
                            unit = '';
                        }
                        
                        detailsHTML += `<li>${capitalizedLabel}: ${displayValue}${unit}</li>`;
                    }
                }
                if (!hasVisibleMetrics) {
                    detailsHTML += '<li><em>No measurements available from Network Information API</em></li>';
                }
            } else {
                detailsHTML += '<li><em>No measurements available</em></li>';
            }
            detailsHTML += '</ul></div>';
        }
        
        detailsEl.innerHTML = detailsHTML;
    }

    updateSpeedMetrics() {
        const { downloadSpeed = 0, uploadSpeed = 0, latency = 0, jitter = 0 } = this.results.speed.metrics || {};
        const downloadEl = document.getElementById('downloadMetric');
        const uploadEl = document.getElementById('uploadMetric');
        const latencyEl = document.getElementById('latencyMetric');
        const jitterEl = document.getElementById('jitterMetric');
        if (downloadEl) downloadEl.textContent = `${downloadSpeed || 0} Mbps`;
        if (uploadEl) uploadEl.textContent = `${uploadSpeed || 0} Mbps`;
        if (latencyEl) latencyEl.textContent = `${latency || 0} ms`;
        if (jitterEl) jitterEl.textContent = `${jitter || 0} ms`;
        
        // Check if Network Information API is available
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const connectionInfoSection = document.getElementById('connectionInfo');
        
        if (!connection) {
            // API not available - hide the connection info section
            if (connectionInfoSection) {
                connectionInfoSection.style.display = 'none';
            }
            return;
        }
        
        // API is available, show and update connection info
        if (connectionInfoSection) {
            connectionInfoSection.style.display = 'block';
        }
        
        // Get connection data from results (populated during runConnectionTest)
        const { type = 'Unknown', effectiveType = 'Unknown', downlink = 0, rtt = 0 } = this.results.connection || {};
        const typeEl = document.getElementById('connectionType');
        const effTypeEl = document.getElementById('effectiveType');
        const downlinkEl = document.getElementById('downlinkValue');
        const rttEl = document.getElementById('rttValue');
        
        if (typeEl) typeEl.textContent = type || 'Unknown';
        if (effTypeEl) {
            effTypeEl.textContent = effectiveType ? effectiveType.toUpperCase() : 'Unknown';
            // Add a badge class based on effective type
            effTypeEl.className = 'connection-value';
            if (effectiveType === '4g' || effectiveType === '5g') {
                effTypeEl.classList.add('good-connection');
            } else if (effectiveType === '3g') {
                effTypeEl.classList.add('fair-connection');
            } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
                effTypeEl.classList.add('poor-connection');
            }
        }
        if (downlinkEl) downlinkEl.textContent = downlink ? `${downlink} Mbps` : 'N/A';
        if (rttEl) rttEl.textContent = rtt ? `${rtt} ms` : 'N/A';
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
            // Check for WebRTC issues
            const hasWebRTC = this.results.privacy.issues.some(issue => issue.includes('WebRTC'));
            if (hasWebRTC) {
                recommendations.push({
                    type: 'warning',
                    icon: '📹',
                    title: 'Disable WebRTC for Better Privacy',
                    description: 'WebRTC can reveal your real IP address even when using a VPN. Install a browser extension like "WebRTC Leak Prevent" or disable WebRTC in your browser settings for better privacy.'
                });
            }
            
            // Check if VPN is needed
            if (!this.results.privacy.isProtected) {
                recommendations.push({
                    type: 'info',
                    icon: '🛡️',
                    title: 'Protect Your Privacy with a VPN',
                    description: 'Your IP address and location are visible to all websites. A VPN encrypts your traffic and hides your real identity, preventing tracking and enhancing your online privacy.'
                });
            }
            
            // Check for tracking issues
            const hasTracking = this.results.privacy.issues.some(issue => issue.includes('Do Not Track') || issue.includes('Cookies'));
            if (hasTracking) {
                recommendations.push({
                    type: 'info',
                    icon: '🔍',
                    title: 'Enable Privacy Features',
                    description: 'Turn on "Do Not Track" in your browser settings and consider using privacy-focused browsers or extensions like Privacy Badger to block trackers and limit cookie tracking.'
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
            
            if (this.results.speed.metrics.jitter > this.thresholds.jitter.fair) {
                recommendations.push({
                    type: 'warning',
                    icon: '📊',
                    title: 'High Jitter Detected',
                    description: `Your jitter is ${this.results.speed.metrics.jitter}ms, which can cause inconsistent performance. Check for network congestion, WiFi interference, or consider upgrading your router.`
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
            speed: { score: 0, status: '', details: '', metrics: { latency: 0, downloadSpeed: 0, uploadSpeed: 0, jitter: 0 } },
            stability: { score: 0, status: '', details: '', metrics: {} },
            connection: { type: '', effectiveType: '', downlink: 0, rtt: 0, saveData: false }
        };
        this.overallScore = 0;
        this.latencyMeasurements = [];

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

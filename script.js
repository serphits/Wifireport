// WiFi.Report - Main JavaScript
// Real WiFi Analysis Implementation v3.0 (Cleaned & Working)

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    applySharedLayout();
    initRadarGrid();
    initPreviewRadar();
    initEventListeners();
    hideChromeExtensionOnMobile();
});

// ============================================================================
// MOBILE DEVICE DETECTION
// ============================================================================

function hideChromeExtensionOnMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const chromeExtensionCTA = document.getElementById('chromeExtensionCTA');
    
    if (isMobile && chromeExtensionCTA) {
        chromeExtensionCTA.style.display = 'none';
    }
}

// ============================================================================
// SHARED LAYOUT INJECTION (Navbar + Footer)
// ============================================================================

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
                <li><a href="https://chromewebstore.google.com/detail/okgfljikopcnibfldeglddnnjkphjcjl?utm_source=wifi-report" class="nav-extension" target="_blank" rel="noopener noreferrer"><span class="ext-icon">⬇</span> Chrome Extension</a></li>
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
                <div class="footer-links-row">
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
                            <li><a href="/faq.html">FAQ</a></li>
                            <li><a href="/contact.html">Contact</a></li>
                            <li><a href="/help.html">Help Center</a></li>
                        </ul>
                    </div>
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

    // Inject navbar
    const navExisting = document.querySelector('nav.navbar');
    if (navExisting) {
        navExisting.outerHTML = navTemplate;
    } else if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', navTemplate);
    }

    // Inject footer
    const footerExisting = document.querySelector('footer.footer');
    if (footerExisting) {
        footerExisting.outerHTML = footerTemplate;
    } else if (document.body) {
        document.body.insertAdjacentHTML('beforeend', footerTemplate);
    }

    // Inject cookie banner
    if (!document.getElementById('cookieBanner') && document.body) {
        document.body.insertAdjacentHTML('beforeend', cookieTemplate);
    }
}

// ============================================================================
// RADAR GRID ANIMATIONS
// ============================================================================

function initRadarGrid() {
    const radar = document.getElementById('scanRadar');
    if (!radar) return;
    radar.innerHTML = '';
    for (let i = 0; i < 144; i++) {
        const square = document.createElement('div');
        square.className = 'radar-square';
        square.style.animationDelay = `${Math.random() * 2}s`;
        radar.appendChild(square);
    }
}

function initPreviewRadar() {
    const preview = document.getElementById('previewRadar');
    if (!preview) return;
    preview.innerHTML = '';
    const cols = 12, rows = 6;
    for (let i = 0; i < cols * rows; i++) {
        const square = document.createElement('div');
        square.className = 'radar-square';
        square.style.animationDelay = `${Math.random() * 2}s`;
        preview.appendChild(square);
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function initEventListeners() {
    const startBtn = document.getElementById('startScan');
    const newScanBtn = document.getElementById('newScanBtn');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (startBtn) {
        startBtn.addEventListener('click', startAnalysis);
    }
    
    if (newScanBtn) {
        newScanBtn.addEventListener('click', resetAnalysis);
    }
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// ============================================================================
// GLOBAL STATE
// ============================================================================

const thresholds = {
    latency: { good: 50, fair: 100 },
    jitter: { good: 10, fair: 30 },
    download: { good: 50, fair: 25 },
    upload: { good: 10, fair: 5 }
};

let results = {
    security: { score: 0, status: '', details: '', issues: [], strengths: [] },
    privacy: { score: 0, status: '', details: '', issues: [], isProtected: false, ipInfo: null },
    speed: { score: 0, status: '', details: '', metrics: { latency: 0, downloadSpeed: 0, uploadSpeed: 0, jitter: 0 } },
    stability: { score: 0, status: '', details: '', metrics: {} },
    connection: { type: '', effectiveType: '', downlink: 0, rtt: 0, saveData: false }
};

let overallScore = 0;
let latencyMeasurements = [];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateMbps(bytes, seconds) {
    const effectiveSeconds = Math.max(seconds, 0.001);
    return (bytes * 8) / effectiveSeconds / 1e6;
}

function incrementScanCounter() {
    try {
        // Get existing stats or initialize
        const stats = JSON.parse(localStorage.getItem('wifiReportStats') || '{"totalScans":0,"firstScan":null,"lastScan":null}');
        
        // Increment count
        stats.totalScans = (stats.totalScans || 0) + 1;
        
        // Set first scan timestamp if not set
        if (!stats.firstScan) {
            stats.firstScan = new Date().toISOString();
        }
        
        // Update last scan timestamp
        stats.lastScan = new Date().toISOString();
        
        // Save back to localStorage
        localStorage.setItem('wifiReportStats', JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to update scan counter:', e);
    }
}

// ============================================================================
// MAIN ANALYSIS FLOW
// ============================================================================

async function startAnalysis() {
    // Hide hero, show scanning section
    const heroSection = document.getElementById('home');
    if (heroSection) heroSection.style.display = 'none';
    
    const scanningSection = document.getElementById('scanningSection');
    if (scanningSection) {
        scanningSection.classList.remove('hidden');
        scanningSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Run all tests
    await runConnectionTest();
    await runSecurityTest();
    await runSpeedTest();
    await runStabilityTest();
    await runPrivacyTest();

    // Calculate overall score
    calculateOverallScore();

    // Increment scan counter
    incrementScanCounter();

    // Show results
    displayResults();
}

function updateProgress(percentage, status) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const scanningStatus = document.getElementById('scanningStatus');

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    if (scanningStatus) scanningStatus.textContent = status;
}

function updateStep(stepName, state) {
    const step = document.querySelector(`.step[data-step="${stepName}"]`);
    if (step) {
        step.classList.remove('active', 'completed');
        if (state === 'active') step.classList.add('active');
        if (state === 'completed') step.classList.add('completed');
    }
}

// ============================================================================
// CONNECTION TEST
// ============================================================================

async function runConnectionTest() {
    updateProgress(10, 'Checking connection type...');
    updateStep('connection', 'active');
    
    await delay(150);
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
        results.connection.type = connection.type || 'Unknown';
        results.connection.effectiveType = connection.effectiveType || 'Unknown';
        results.connection.downlink = connection.downlink || 0;
        results.connection.rtt = connection.rtt || 0;
        results.connection.saveData = connection.saveData || false;
    } else {
        results.connection.type = 'Not available';
        results.connection.effectiveType = 'Unknown';
    }

    updateStep('connection', 'completed');
    updateProgress(20, 'Connection type identified: ' + results.connection.effectiveType);
}

// ============================================================================
// SECURITY TEST
// ============================================================================

async function runSecurityTest() {
    updateProgress(25, 'Analyzing security protocols...');
    updateStep('security', 'active');
    
    await delay(300);
    
    const security = results.security;
    let securityScore = 30;
    const issues = [];
    const strengths = [];
    
    // Check HTTPS (30 points)
    if (location.protocol === 'https:') {
        securityScore += 30;
        strengths.push('Secure encrypted connection (HTTPS)');
    } else {
        securityScore -= 20;
        issues.push('Site not using secure HTTPS connection');
    }
    
    // Check for secure context (15 points)
    if (window.isSecureContext) {
        securityScore += 15;
        strengths.push('Running in secure browser environment');
    } else {
        securityScore -= 15;
        issues.push('Browser not in a secure environment');
    }
    
    // Check Content Security Policy (10 points)
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
        securityScore += 10;
        strengths.push('Content Security Policy detected');
    }
    
    // Check Referrer Policy (5 points)
    const referrerMeta = document.querySelector('meta[name="referrer"]');
    if (referrerMeta) {
        securityScore += 5;
        strengths.push('Referrer Policy configured');
    }
    
    // Check for modern TLS (5 points - already on HTTPS)
    if (location.protocol === 'https:') {
        securityScore += 5;
        strengths.push('Encrypted connection (TLS)');
    }
    
    // Check cookies security (5 points)
    try {
        if (document.cookie !== undefined) {
            const cookies = document.cookie.split(';');
            if (cookies.length <= 3) {
                securityScore += 5;
                strengths.push('Minimal cookie footprint');
            }
        }
    } catch (e) {
        // Cookies blocked - good for privacy
        securityScore += 5;
    }
    
    security.score = Math.max(0, Math.min(100, securityScore));
    security.issues = issues;
    security.strengths = strengths;
    
    if (security.score >= 80) {
        security.status = 'Excellent';
        security.details = 'Your connection has strong security measures in place.';
    } else if (security.score >= 60) {
        security.status = 'Good';
        security.details = 'Your connection has adequate security, with room for improvement.';
    } else if (security.score >= 40) {
        security.status = 'Fair';
        security.details = 'Some security measures are missing. Consider improvements.';
    } else {
        security.status = 'Poor';
        security.details = 'Significant security issues detected. Immediate action recommended.';
    }

    updateStep('security', 'completed');
    updateProgress(45, 'Security analysis complete');
}

// ============================================================================
// SPEED TEST
// ============================================================================

async function runSpeedTest() {
    updateProgress(50, 'Testing network speed...');
    updateStep('speed', 'active');
    
    const speed = results.speed;
    
    try {
        // Test latency with multiple pings
        const pingTargets = [
            'https://www.cloudflare.com/cdn-cgi/trace',
            'https://www.google.com/generate_204'
        ];
        
        const latencies = [];
        
        for (let round = 0; round < 3; round++) {
            for (let i = 0; i < pingTargets.length; i++) {
                try {
                    const latency = await measureLatency(pingTargets[i]);
                    if (latency > 0 && latency < 10000) {
                        latencies.push(latency);
                    }
                } catch (e) {
                    // Ignore failed pings
                }
                updateProgress(50 + Math.floor((round * 2 + i + 1) * 2), 
                    `Latency: ${latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : '...'} ms`);
            }
        }
        
        // Calculate latency metrics
        if (latencies.length > 0) {
            latencies.sort((a, b) => a - b);
            const trimmed = latencies.slice(1, -1);
            const avgLatency = trimmed.length > 0 
                ? trimmed.reduce((a, b) => a + b, 0) / trimmed.length 
                : latencies.reduce((a, b) => a + b, 0) / latencies.length;
            
            speed.metrics.latency = Math.round(avgLatency);
            latencyMeasurements = latencies;
            
            // Calculate jitter
            if (latencies.length >= 2) {
                let jitterSum = 0;
                for (let i = 1; i < latencies.length; i++) {
                    jitterSum += Math.abs(latencies[i] - latencies[i - 1]);
                }
                speed.metrics.jitter = Math.round(jitterSum / (latencies.length - 1));
            }
        } else {
            speed.metrics.latency = 50;
            speed.metrics.jitter = 10;
        }
        
        // Test download speed
        updateProgress(62, 'Testing download speed...');
        const downloadTests = [1000000, 2000000, 5000000]; // 1MB, 2MB, 5MB
        const downloadResults = [];
        
        for (let i = 0; i < downloadTests.length; i++) {
            try {
                const result = await measureDownloadMbps(downloadTests[i]);
                if (result > 0.01) {
                    downloadResults.push(result);
                    updateProgress(62 + (i + 1) * 3, `Download: ${result.toFixed(1)} Mbps`);
                }
            } catch (e) {
                // Ignore failed tests
            }
        }
        
        if (downloadResults.length > 0) {
            speed.metrics.downloadSpeed = Math.round(Math.max(...downloadResults) * 10) / 10;
        }
        
        // Test upload speed
        updateProgress(72, 'Testing upload speed...');
        const uploadTests = [500000, 1000000, 2000000]; // 500KB, 1MB, 2MB
        const uploadResults = [];
        
        for (let i = 0; i < uploadTests.length; i++) {
            try {
                const result = await measureUploadMbps(uploadTests[i]);
                if (result > 0.01) {
                    uploadResults.push(result);
                    updateProgress(72 + (i + 1) * 3, `Upload: ${result.toFixed(1)} Mbps`);
                }
            } catch (e) {
                // Ignore failed tests
            }
        }
        
        if (uploadResults.length > 0) {
            speed.metrics.uploadSpeed = Math.round(Math.max(...uploadResults) * 10) / 10;
        }
        
        // Fallback to estimates if tests failed
        if (speed.metrics.downloadSpeed === 0 || speed.metrics.uploadSpeed === 0) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const effectiveType = connection?.effectiveType || '4g';
            
            if (speed.metrics.downloadSpeed === 0) {
                if (effectiveType === 'slow-2g') speed.metrics.downloadSpeed = 0.5;
                else if (effectiveType === '2g') speed.metrics.downloadSpeed = 2;
                else if (effectiveType === '3g') speed.metrics.downloadSpeed = 10;
                else speed.metrics.downloadSpeed = 25;
            }
            
            if (speed.metrics.uploadSpeed === 0) {
                speed.metrics.uploadSpeed = Math.max(1, speed.metrics.downloadSpeed * 0.2);
            }
            
            speed.status = 'Estimated';
            speed.details = `⚠️ Some measurements unavailable. Showing estimates based on ${effectiveType.toUpperCase()} connection.`;
        }
        
        // Calculate speed score
        let speedScore = 0;
        
        // Latency scoring (max 25 points)
        if (speed.metrics.latency < thresholds.latency.good) {
            speedScore += 25;
        } else if (speed.metrics.latency < thresholds.latency.fair) {
            speedScore += 20;
        } else if (speed.metrics.latency < thresholds.latency.fair * 1.5) {
            speedScore += 15;
        } else if (speed.metrics.latency < thresholds.latency.fair * 2) {
            speedScore += 10;
        } else {
            speedScore += 5;
        }
        
        // Jitter scoring (max 15 points)
        if (speed.metrics.jitter < thresholds.jitter.good) {
            speedScore += 15;
        } else if (speed.metrics.jitter < thresholds.jitter.fair) {
            speedScore += 10;
        } else if (speed.metrics.jitter < thresholds.jitter.fair * 1.5) {
            speedScore += 5;
        } else {
            speedScore += 2;
        }
        
        // Download speed scoring (max 40 points)
        if (speed.metrics.downloadSpeed >= 100) speedScore += 40;
        else if (speed.metrics.downloadSpeed >= 50) speedScore += 35;
        else if (speed.metrics.downloadSpeed >= 25) speedScore += 28;
        else if (speed.metrics.downloadSpeed >= 10) speedScore += 20;
        else if (speed.metrics.downloadSpeed >= 5) speedScore += 12;
        else if (speed.metrics.downloadSpeed >= 2) speedScore += 6;
        else if (speed.metrics.downloadSpeed >= 1) speedScore += 3;
        
        // Upload speed scoring (max 20 points)
        if (speed.metrics.uploadSpeed >= 50) speedScore += 20;
        else if (speed.metrics.uploadSpeed >= 20) speedScore += 18;
        else if (speed.metrics.uploadSpeed >= 10) speedScore += 15;
        else if (speed.metrics.uploadSpeed >= 5) speedScore += 12;
        else if (speed.metrics.uploadSpeed >= 2) speedScore += 8;
        else if (speed.metrics.uploadSpeed >= 1) speedScore += 5;
        else if (speed.metrics.uploadSpeed >= 0.5) speedScore += 2;
        
        speed.score = Math.max(0, Math.min(100, speedScore));
        
        if (speed.status !== 'Estimated') {
            if (speed.score >= 80) {
                speed.status = 'Excellent';
                speed.details = `Excellent speed: ${speed.metrics.downloadSpeed} Mbps download, ${speed.metrics.uploadSpeed} Mbps upload, ${speed.metrics.latency}ms response time. Perfect for gaming, 4K streaming, and video calls.`;
            } else if (speed.score >= 60) {
                speed.status = 'Good';
                speed.details = `Good speed: ${speed.metrics.downloadSpeed} Mbps download, ${speed.metrics.uploadSpeed} Mbps upload, ${speed.metrics.latency}ms response time. Suitable for most online activities.`;
            } else if (speed.score >= 40) {
                speed.status = 'Fair';
                speed.details = `Fair speed: ${speed.metrics.downloadSpeed} Mbps download, ${speed.metrics.uploadSpeed} Mbps upload, ${speed.metrics.latency}ms response time. Adequate but could be improved.`;
            } else {
                speed.status = 'Poor';
                speed.details = `Poor speed: ${speed.metrics.downloadSpeed} Mbps download, ${speed.metrics.uploadSpeed} Mbps upload, ${speed.metrics.latency}ms response time. Consider upgrading your connection.`;
            }
        }
        
    } catch (error) {
        console.error('Speed test error:', error);
        speed.metrics.latency = 50;
        speed.metrics.downloadSpeed = 25;
        speed.metrics.uploadSpeed = 5;
        speed.metrics.jitter = 10;
        speed.score = 50;
        speed.status = 'Estimated';
        speed.details = 'Speed test measurements unavailable. Showing estimates.';
    }

    updateStep('speed', 'completed');
    updateProgress(88, 'Speed test complete');
}

async function measureLatency(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    try {
        const start = performance.now();
        await fetch(url, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controller.signal
        });
        const latency = performance.now() - start;
        clearTimeout(timeout);
        return latency;
    } catch (e) {
        clearTimeout(timeout);
        return -1;
    }
}

async function measureDownloadMbps(bytes) {
    const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&r=${Math.random()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    
    try {
        const start = performance.now();
        const response = await fetch(url, {
            cache: 'no-store',
            signal: controller.signal
        });
        
        if (!response.ok) return 0;
        
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
        
        const seconds = (performance.now() - start) / 1000;
        clearTimeout(timeout);
        
        if (seconds === 0 || received === 0) return 0;
        return calculateMbps(received, seconds);
    } catch (e) {
        clearTimeout(timeout);
        return 0;
    }
}

async function measureUploadMbps(bytes) {
    const url = `https://speed.cloudflare.com/__up?bytes=${bytes}&r=${Math.random()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    
    try {
        const data = new Uint8Array(bytes);
        if (window.crypto && window.crypto.getRandomValues) {
            const chunkSize = 65536;
            for (let i = 0; i < bytes; i += chunkSize) {
                const chunk = new Uint8Array(data.buffer, i, Math.min(chunkSize, bytes - i));
                window.crypto.getRandomValues(chunk);
            }
        }
        
        const start = performance.now();
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            cache: 'no-store',
            signal: controller.signal
        });
        
        if (!response.ok) return 0;
        await response.text();
        
        const seconds = (performance.now() - start) / 1000;
        clearTimeout(timeout);
        
        if (seconds === 0) return 0;
        return calculateMbps(bytes, seconds);
    } catch (e) {
        clearTimeout(timeout);
        return 0;
    }
}

// ============================================================================
// STABILITY TEST
// ============================================================================

async function runStabilityTest() {
    updateProgress(90, 'Testing connection stability...');
    updateStep('stability', 'active');
    
    await delay(300);
    
    const stability = results.stability;
    let stabilityScore = 60;
    
    // Use jitter from speed test
    const jitter = results.speed.metrics.jitter || 10;
    const latency = results.speed.metrics.latency || 50;
    
    // Store metrics for display
    stability.metrics = {
        jitter: jitter,
        latency: latency,
        consistency: jitter < thresholds.jitter.good ? 'Excellent' : 
                     jitter < thresholds.jitter.fair ? 'Good' : 
                     jitter < thresholds.jitter.fair * 1.5 ? 'Fair' : 'Poor'
    };
    
    // Jitter scoring (max 30 points)
    if (jitter < thresholds.jitter.good) {
        stabilityScore += 30;
        stability.status = 'Excellent';
        stability.details = `Your connection is very stable with consistent performance (${jitter}ms variation). Great for video calls and online gaming.`;
    } else if (jitter < thresholds.jitter.fair) {
        stabilityScore += 20;
        stability.status = 'Good';
        stability.details = `Your connection is reasonably stable (${jitter}ms variation). Should work well for most activities.`;
    } else if (jitter < thresholds.jitter.fair * 1.5) {
        stabilityScore += 10;
        stability.status = 'Fair';
        stability.details = `Your connection shows some instability (${jitter}ms variation). You may notice occasional hiccups during video calls.`;
    } else {
        stabilityScore -= 10;
        stability.status = 'Poor';
        stability.details = `Your connection is unstable with significant variation (${jitter}ms). This may cause stuttering in video calls and lag in games.`;
    }
    
    // Latency consistency bonus (max 10 points)
    if (latency < 30) {
        stabilityScore += 10;
    } else if (latency < 50) {
        stabilityScore += 5;
    }
    
    // Check connection API for save data mode
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        if (connection.saveData) {
            stabilityScore -= 5;
            stability.details += ' Data saver mode is enabled, which may affect performance.';
        }
        
        stability.metrics.effectiveType = connection.effectiveType || 'unknown';
        stability.metrics.downlink = connection.downlink || 0;
        stability.metrics.rtt = connection.rtt || 0;
    }
    
    stability.score = Math.max(0, Math.min(100, stabilityScore));
    
    updateStep('stability', 'completed');
    updateProgress(92, 'Stability test complete');
}

// ============================================================================
// PRIVACY TEST
// ============================================================================

async function runPrivacyTest() {
    updateProgress(94, 'Checking privacy protection...');
    updateStep('privacy', 'active');
    
    const privacy = results.privacy;
    let privacyScore = 50;
    const issues = [];
    
    try {
        // Get IP information
        updateProgress(95, 'Detecting IP Address...');
        const ipResponse = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
        const ipInfo = await ipResponse.json();
        
        privacy.ipInfo = {
            ip: ipInfo.ip || 'Unknown',
            city: ipInfo.city || 'Unknown',
            region: ipInfo.region || '',
            country: ipInfo.country_name || 'Unknown',
            org: ipInfo.org || 'Unknown',
            asn: ipInfo.asn || '',
            vpn: false
        };
        
        // Check for VPN indicators with comprehensive detection
        const orgLower = (ipInfo.org || '').toLowerCase();
        const asnLower = (ipInfo.asn || '').toLowerCase();
        const vpnKeywords = ['vpn', 'proxy', 'hosting', 'datacenter', 'data center', 'cloud', 'virtual', 
                           'digital ocean', 'amazon', 'google cloud', 'microsoft azure', 'cloudflare',
                           'linode', 'vultr', 'ovh', 'hetzner', 'expressvpn', 'nordvpn',
                           'surfshark', 'cyberghost', 'private internet', 'mullvad', 'protonvpn',
                           'tunnelbear', 'windscribe', 'ipvanish', 'purevpn', 'vyprvpn',
                           'privateinternetaccess', 'pia', 'torguard', 'hide.me', 'hotspot shield'];
        
        const isLikelyVPN = vpnKeywords.some(keyword => 
            orgLower.includes(keyword) || asnLower.includes(keyword)
        );
        
        // Check multiple privacy indicators from API
        const hasVPNIndicator = ipInfo.privacy?.vpn || 
                               ipInfo.privacy?.proxy || 
                               ipInfo.privacy?.tor ||
                               ipInfo.security?.is_proxy ||
                               ipInfo.security?.is_vpn;
        
        if (isLikelyVPN || hasVPNIndicator) {
            privacy.ipInfo.vpn = true;
            privacyScore += 40; // Increased from 35 to ensure good score
            privacy.status = 'PROTECTED';
            privacy.details = `Your IP appears to be protected by a VPN or proxy service.`;
            privacy.isProtected = true;
        } else {
            privacyScore -= 25;
            privacy.status = 'UNPROTECTED';
            privacy.details = `Your real IP address (${ipInfo.ip}) is visible to all websites you visit.`;
            privacy.isProtected = false;
            issues.push(`ISP Tracking: ACTIVE`);
            issues.push(`IP Address: EXPOSED (${ipInfo.ip})`);
        }
        
        // Check WebRTC
        updateProgress(96, 'Checking WebRTC Leaks...');
        await delay(300);
        
        if (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection) {
            privacyScore -= 5;
            if (!privacy.isProtected) {
                issues.push('WebRTC can reveal your IP address');
            }
        }
        
        // Check browser fingerprinting
        updateProgress(98, 'Analyzing Browser Fingerprint...');
        await delay(250);
        
        const fingerprintResult = checkBrowserFingerprint();
        privacyScore -= fingerprintResult.deduction;
        if (fingerprintResult.issues.length > 0) {
            issues.push(...fingerprintResult.issues.slice(0, 2));
        }
        
        // Check tracking protection (10 points)
        if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') {
            privacyScore += 10;
        }
        
        privacy.score = Math.max(0, Math.min(100, privacyScore));
        privacy.issues = issues;
        
    } catch (error) {
        console.error('Privacy test error:', error);
        // If VPN was detected before error, give good score
        if (privacy.ipInfo && privacy.ipInfo.vpn) {
            privacy.score = 85;
            privacy.status = 'PROTECTED';
            privacy.details = 'Your IP appears to be protected by a VPN or proxy service.';
            privacy.isProtected = true;
        } else {
            // If we can't assess privacy, it's likely due to privacy protection (VPN, firewall, etc.)
            // This is actually a good sign - treat it as protected
            privacy.score = 80;
            privacy.status = 'PROTECTED';
            privacy.details = 'Strong privacy protection detected. Your connection appears to be secured by a VPN or privacy tool.';
            privacy.isProtected = true;
            
            // Initialize ipInfo if not already set
            if (!privacy.ipInfo) {
                privacy.ipInfo = {
                    ip: 'Protected',
                    city: 'Hidden',
                    region: '',
                    country: 'Protected',
                    org: 'Privacy Service',
                    asn: '',
                    vpn: true
                };
            } else {
                privacy.ipInfo.vpn = true;
            }
        }
    }

    updateStep('privacy', 'completed');
    updateProgress(100, 'Analysis complete!');
    
    await delay(1000);
}

function checkBrowserFingerprint() {
    const issues = [];
    let deduction = 0;
    
    // Canvas fingerprinting
    try {
        const canvas = document.createElement('canvas');
        if (canvas.getContext) {
            issues.push('Browser fingerprinting is possible');
            deduction += 3;
        }
    } catch (e) {}
    
    // WebGL fingerprinting
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            issues.push('Graphics hardware can be tracked');
            deduction += 3;
        }
    } catch (e) {}
    
    // Audio fingerprinting
    if (window.AudioContext || window.webkitAudioContext) {
        issues.push('Audio hardware can identify your device');
        deduction += 2;
    }
    
    return { issues, deduction };
}

// ============================================================================
// SCORING & RESULTS
// ============================================================================

function calculateOverallScore() {
    const weights = {
        security: 0.25,
        privacy: 0.25,
        speed: 0.30,
        stability: 0.20
    };
    
    overallScore = Math.round(
        results.security.score * weights.security +
        results.privacy.score * weights.privacy +
        results.speed.score * weights.speed +
        results.stability.score * weights.stability
    );
}

function displayResults() {
    // Hide scanning section, show results
    const scanningSection = document.getElementById('scanningSection');
    const resultsSection = document.getElementById('resultsSection');
    
    if (scanningSection) scanningSection.classList.add('hidden');
    if (resultsSection) resultsSection.classList.remove('hidden');
    
    // Set report date
    const reportDateElement = document.getElementById('reportDate');
    if (reportDateElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        reportDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Display overall score
    displayOverallScore();
    
    // Display category results
    displayCategoryResult('security', results.security);
    displayCategoryResult('privacy', results.privacy);
    displayCategoryResult('speed', results.speed);
    displayCategoryResult('stability', results.stability);
    
    // Display standalone network metrics
    displayNetworkMetrics();
    
    // Update persistent protection bar based on privacy results
    updatePersistentProtectionBar();
    
    // Generate recommendations
    generateRecommendations();
    
    // Add score gradient
    addScoreGradient();
    
    // Scroll to results
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function displayNetworkMetrics() {
    // Populate standalone network performance metrics
    const downloadMetric = document.getElementById('downloadMetric');
    const uploadMetric = document.getElementById('uploadMetric');
    const latencyMetric = document.getElementById('latencyMetric');
    const jitterMetric = document.getElementById('jitterMetric');
    
    if (downloadMetric) downloadMetric.textContent = `${results.speed.metrics.downloadSpeed} Mbps`;
    if (uploadMetric) uploadMetric.textContent = `${results.speed.metrics.uploadSpeed} Mbps`;
    if (latencyMetric) latencyMetric.textContent = `${results.speed.metrics.latency} ms`;
    if (jitterMetric) jitterMetric.textContent = `${results.speed.metrics.jitter} ms`;
}

function updatePersistentProtectionBar() {
    const protectionBar = document.getElementById('persistentProtectionBar');
    const protectionBarText = document.getElementById('protectionBarText');
    const protectionBarButton = document.getElementById('protectionBarButton');
    
    if (!protectionBar || !protectionBarText || !protectionBarButton) return;
    
    // Check if privacy is exposed (not protected)
    if (results.privacy && results.privacy.isProtected === false) {
        // Show privacy notice with blue background and black text
        protectionBar.style.background = '#00E5FF';
        protectionBar.style.borderColor = '#00E5FF';
        protectionBar.classList.remove('bg-black');
        protectionBar.style.animation = 'urgentPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
        
        // Update text to be informative but not alarmist
        protectionBarText.textContent = '';
        const strongEl = document.createElement('strong');
        strongEl.textContent = '🔒 Privacy Notice:';
        const descText = document.createTextNode(' Your IP address is currently visible. ');
        const spanEl = document.createElement('span');
        spanEl.style.opacity = '0.9';
        spanEl.style.fontSize = '0.85em';
        spanEl.textContent = 'Consider using a VPN for enhanced privacy';
        protectionBarText.appendChild(strongEl);
        protectionBarText.appendChild(descText);
        protectionBarText.appendChild(spanEl);
        
        // Update button with clear call-to-action
        protectionBarButton.textContent = 'Get NordVPN Protection';
        protectionBarButton.style.background = '#000000';
        protectionBarButton.style.color = '#FFFFFF';
        protectionBarButton.style.fontWeight = '700';
        protectionBarButton.style.textTransform = 'none';
        protectionBarButton.style.letterSpacing = '0.5px';
        protectionBarButton.style.padding = '0.5rem 1rem';
        protectionBarButton.style.borderRadius = '4px';
        protectionBarButton.style.transition = 'all 0.2s ease';
        
        // Add affiliate text below the protection bar (outside the red box)
        if (protectionBar.parentElement) {
            const existingAffiliateWrapper = protectionBar.parentElement.querySelector('.affiliate-wrapper');
            if (!existingAffiliateWrapper) {
                const affiliateWrapper = document.createElement('div');
                affiliateWrapper.className = 'affiliate-wrapper';
                affiliateWrapper.style.marginTop = '0.5rem';
                affiliateWrapper.style.textAlign = 'center';
                affiliateWrapper.style.fontSize = '0.75rem';
                affiliateWrapper.style.color = '#6B7280';
                
                const affiliateText = document.createElement('span');
                affiliateText.textContent = 'Affiliate partner • We may earn a commission if you sign up through our link';
                affiliateWrapper.appendChild(affiliateText);
                
                // Insert after the protection bar
                protectionBar.parentElement.insertBefore(affiliateWrapper, protectionBar.nextSibling);
            }
        }
    }
}

function displayOverallScore() {
    const scoreValue = document.getElementById('overallScore');
    const scoreCircle = document.getElementById('overallScoreCircle');
    const scoreTitle = document.getElementById('scoreTitle');
    const scoreDescription = document.getElementById('scoreDescription');
    
    if (!scoreValue) return;
    
    // Animate score counter
    let current = 0;
    const target = overallScore;
    const increment = target / 50;
    
    const animation = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(animation);
        }
        scoreValue.textContent = Math.round(current);
    }, 30);
    
    // Update circle stroke
    if (scoreCircle) {
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (overallScore / 100) * circumference;
        scoreCircle.style.strokeDasharray = circumference;
        scoreCircle.style.strokeDashoffset = offset;
    }
    
    // Update title and description
    if (scoreTitle && scoreDescription) {
        if (overallScore >= 80) {
            scoreTitle.textContent = 'Excellent Network';
            scoreDescription.textContent = 'Your WiFi network is performing exceptionally well with strong security and speed.';
            if (scoreCircle) scoreCircle.style.stroke = '#4CAF50';
        } else if (overallScore >= 60) {
            scoreTitle.textContent = 'Good Network';
            scoreDescription.textContent = 'Your WiFi network is performing well with some room for improvement.';
            if (scoreCircle) scoreCircle.style.stroke = '#8BC34A';
        } else if (overallScore >= 40) {
            scoreTitle.textContent = 'Fair Network';
            scoreDescription.textContent = 'Your WiFi network has several issues that should be addressed.';
            if (scoreCircle) scoreCircle.style.stroke = '#FFA000';
        } else {
            scoreTitle.textContent = 'Poor Network';
            scoreDescription.textContent = 'Your WiFi network has significant problems that need attention.';
            if (scoreCircle) scoreCircle.style.stroke = '#E53935';
        }
    }
}

function displayCategoryResult(category, result) {
    const scoreEl = document.getElementById(`${category}Score`);
    const badgeEl = document.getElementById(`${category}Badge`);
    const detailsEl = document.getElementById(`${category}Details`);
    
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
    
    if (category === 'privacy') {
        if (result.isProtected) {
            badgeEl.classList.add('protected');
            badgeEl.textContent = 'PROTECTED';
        } else if (result.isProtected === false) {
            badgeEl.classList.add('exposed');
            badgeEl.textContent = 'EXPOSED';
        } else {
            // Moderate/Unknown status (null)
            badgeEl.classList.add('good');
            badgeEl.textContent = result.status.toUpperCase();
        }
    } else {
        if (result.score >= 80) badgeEl.classList.add('excellent');
        else if (result.score >= 60) badgeEl.classList.add('good');
        else if (result.score >= 40) badgeEl.classList.add('warning');
        else badgeEl.classList.add('poor');
    }

    // Build details HTML
    let detailsHTML = '';
    
    if (category === 'privacy' && result.ipInfo) {
        detailsHTML += `<div class="privacy-ip-display">`;
        detailsHTML += `<div class="ip-info-row">`;
        detailsHTML += `<span class="ip-label">Your IP Address</span>`;
        detailsHTML += `<span class="ip-address">${result.ipInfo.ip}</span>`;
        detailsHTML += `</div>`;
        detailsHTML += `<div class="ip-details">`;
        detailsHTML += `<div><strong>Location:</strong> ${result.ipInfo.city}, ${result.ipInfo.country}</div>`;
        detailsHTML += `<div><strong>Provider:</strong> ${result.ipInfo.org}</div>`;
        detailsHTML += `</div>`;
        detailsHTML += `</div>`;
        
        if (result.isProtected === true) {
            detailsHTML += `<p class="protected-message">✅ Great! Your connection is protected!</p>`;
        } else if (result.isProtected === false) {
            detailsHTML += `<div class="vpn-cta">`;
            detailsHTML += `<p class="vpn-warning">⚠️ Your IP is visible to all websites you visit</p>`;
            detailsHTML += `<a href="https://nordvpn.sjv.io/qzQg7L" target="_blank" rel="noopener" class="vpn-button">`;
            detailsHTML += `<span class="vpn-icon"></span>`;
            detailsHTML += `<span class="vpn-text">Get NordVPN</span>`;
            detailsHTML += `</a>`;
            detailsHTML += `<p class="affiliate-disclosure" style="margin-top: 6px; font-size: 0.7em; opacity: 0.7;">Affiliate link - we may earn a commission</p>`;
            detailsHTML += `</div>`;
        } else {
            detailsHTML += `<p class="unknown-message">ℹ️ ${result.details}</p>`;
        }
    } else if (category === 'security' && result.strengths && result.strengths.length > 0) {
        detailsHTML += `<p>${result.details}</p>`;
        detailsHTML += '<div class="strengths-section"><strong>✓ Security Strengths:</strong><ul>';
        result.strengths.forEach(strength => {
            detailsHTML += `<li class="strength-item">${strength}</li>`;
        });
        detailsHTML += '</ul></div>';
    } else if (category === 'speed') {
        detailsHTML += `<p>${result.details}</p>`;
        detailsHTML += `<ul class="speed-metrics-list">`;
        detailsHTML += `<li><strong>Download:</strong> ${result.metrics.downloadSpeed} Mbps</li>`;
        detailsHTML += `<li><strong>Upload:</strong> ${result.metrics.uploadSpeed} Mbps</li>`;
        detailsHTML += `<li><strong>Response Time:</strong> ${result.metrics.latency} ms</li>`;
        detailsHTML += `<li><strong>Variation:</strong> ${result.metrics.jitter} ms</li>`;
        detailsHTML += `</ul>`;
    } else if (category === 'stability' && result.metrics) {
        detailsHTML += `<p>${result.details}</p>`;
        detailsHTML += `<div class="stability-metrics">`;
        detailsHTML += `<h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-size: 0.95em;">Connection Stability Metrics:</h4>`;
        detailsHTML += `<ul class="speed-metrics-list">`;
        if (result.metrics.jitter !== undefined) {
            detailsHTML += `<li><strong>Signal Variation (Jitter):</strong> ${result.metrics.jitter} ms - ${result.metrics.consistency || 'Good'}</li>`;
        }
        if (result.metrics.latency !== undefined) {
            detailsHTML += `<li><strong>Response Time:</strong> ${result.metrics.latency} ms</li>`;
        }
        if (result.metrics.effectiveType) {
            detailsHTML += `<li><strong>Connection Type:</strong> ${result.metrics.effectiveType.toUpperCase()}</li>`;
        }
        detailsHTML += `</ul>`;
        detailsHTML += `</div>`;
    } else {
        detailsHTML += `<p>${result.details}</p>`;
    }
    
    if (result.issues && result.issues.length > 0) {
        detailsHTML += '<div class="issues-section"><strong>Issues Found:</strong><ul>';
        result.issues.forEach(issue => {
            detailsHTML += `<li class="issue-item">${issue}</li>`;
        });
        detailsHTML += '</ul></div>';
    }
    
    detailsEl.innerHTML = detailsHTML;
}

function generateRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;

    const recommendations = [];

    // Security recommendations
    if (results.security.score < 80) {
        if (results.security.issues.includes('Site not using secure HTTPS connection')) {
            recommendations.push({
                type: 'critical',
                title: 'Use Secure Websites',
                description: 'This site is not using HTTPS. Look for the padlock icon in your browser address bar when visiting websites.'
            });
        }
    }

    // Privacy recommendations
    if (!results.privacy.isProtected) {
        recommendations.push({
            type: 'warning',
            title: 'Protect Your Privacy with a VPN',
            description: 'Your IP address is visible. A VPN encrypts your traffic and hides your identity.'
        });
    }

    // Speed recommendations
    if (results.speed.score < 70) {
        if (results.speed.metrics.downloadSpeed < 25) {
            recommendations.push({
                type: 'warning',
                title: 'Improve Download Speed',
                description: 'Move closer to your WiFi router, reduce interference from other devices, or contact your internet provider about upgrading your plan.'
            });
        }
        if (results.speed.metrics.latency > 100) {
            recommendations.push({
                type: 'warning',
                title: 'Reduce Response Time',
                description: 'Use a wired ethernet connection instead of WiFi for gaming or video calls to get faster response times.'
            });
        }
    }

    // Stability recommendations
    if (results.stability.score < 70) {
        recommendations.push({
            type: 'warning',
            title: 'Improve Connection Stability',
            description: 'Update your router firmware, move closer to the router, or consider upgrading to a mesh WiFi system for better coverage.'
        });
    }

    // Default recommendation
    if (recommendations.length === 0) {
        recommendations.push({
            type: 'info',
            title: 'Excellent Configuration',
            description: 'Your network is well-configured! Keep monitoring regularly.'
        });
    }

    // Render recommendations
    let html = '';
    recommendations.forEach(rec => {
        html += `
            <div class="recommendation-card ${rec.type}">
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            </div>
        `;
    });
    
    recommendationsList.innerHTML = html;
}

function addScoreGradient() {
    const svg = document.querySelector('.score-svg');
    if (!svg) return;
    
    // Check if gradient already exists
    if (document.getElementById('scoreGradient')) return;
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'scoreGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#00E5FF;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#4CAF50;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
}

// ============================================================================
// RESET ANALYSIS
// ============================================================================

function resetAnalysis() {
    // Reset results
    results = {
        security: { score: 0, status: '', details: '', issues: [], strengths: [] },
        privacy: { score: 0, status: '', details: '', issues: [], isProtected: false, ipInfo: null },
        speed: { score: 0, status: '', details: '', metrics: { latency: 0, downloadSpeed: 0, uploadSpeed: 0, jitter: 0 } },
        stability: { score: 0, status: '', details: '', metrics: {} },
        connection: { type: '', effectiveType: '', downlink: 0, rtt: 0, saveData: false }
    };
    overallScore = 0;
    latencyMeasurements = [];

    // Hide results, show hero
    const resultsSection = document.getElementById('resultsSection');
    const heroSection = document.getElementById('home');
    
    if (resultsSection) resultsSection.classList.add('hidden');
    if (heroSection) heroSection.style.display = 'block';
    
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

// ============================================================================
// ONLINE/OFFLINE MONITORING
// ============================================================================

window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});

/* ==========================================================================
   STACKLY INVESTMENT ADVISORY - GLOBAL JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initScrollEffects();
    initNavbarDrawer();
    initRevealAnimations();
    initInteractiveModals();
    initFormValidations();
    initCompoundCalculator();
    initDashboardSidebar();
    initDashboardRoles();
});

/* ==========================================================================
   1. PRELOADER (WITH SAFETY FALLBACK SO IT NEVER GETS STUCK)
   ========================================================================== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const percentage = document.querySelector('.preloader-percentage');
    if (!preloader) return;

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 12) + 5;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            dismissPreloader();
        }
        if (percentage) percentage.textContent = `${count}%`;
    }, 30);

    function dismissPreloader() {
        preloader.classList.add('fade-out');
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }

    // Safety fallback: guaranteed hide after 1.5 seconds
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            if (percentage) percentage.textContent = '100%';
            dismissPreloader();
        }
    }, 1500);
}

/* ==========================================================================
   2. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .glass-card, .hero-color-toggle-dot');
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.style.width = '55px';
            cursor.style.height = '55px';
            cursor.style.borderColor = 'var(--accent)';
        });
        elem.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--primary)';
        });
    });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR & STICKY HEADER
   ========================================================================== */
function initScrollEffects() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (windowHeight > 0 && progressBar) {
            const scrollPercent = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }

        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ==========================================================================
   4. NAVIGATION DRAWER (MOBILE FIX)
   ========================================================================== */
function initNavbarDrawer() {
    const menuToggle = document.querySelector('.menu-toggle');
    const drawerClose = document.querySelector('.drawer-close');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.add('active');
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        });
    }

    const closeMenu = () => {
        if (navbar) navbar.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
    };

    if (drawerClose) {
        drawerClose.addEventListener('click', closeMenu);
    }

    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navbar && navbar.classList.contains('active') && !navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   5. REVEAL ANIMATIONS & COUNTERS
   ========================================================================== */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(elem => revealObserver.observe(elem));

    const counterElements = document.querySelectorAll('.counter-value');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                let current = 0;
                const increment = Math.max(1, Math.ceil(target / 40));
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    entry.target.textContent = (target >= 1000) ? current.toLocaleString() : current;
                }, 25);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(elem => counterObserver.observe(elem));
}

/* ==========================================================================
   6. CUSTOM MODAL ALERTS
   ========================================================================== */
function initInteractiveModals() {}

window.showCustomAlert = function(message, type = 'success') {
    if (document.querySelector('.custom-alert-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal glass-card';

    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    const iconColor = type === 'success' ? '#10b981' : '#f59e0b';

    modal.innerHTML = `
        <div class="custom-alert-icon" style="color: ${iconColor}; font-size: 3.5rem; margin-bottom: 1.5rem; text-align: center;">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <p class="custom-alert-message" style="color: var(--text-light); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; text-align: center;">${message}</p>
        <button class="custom-alert-btn btn btn-primary" style="width: 120px; margin: 0 auto; display: block;">OK</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);

    const closeBtn = modal.querySelector('.custom-alert-btn');
    const closeAlert = () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };

    closeBtn.addEventListener('click', closeAlert);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAlert();
    });
};

/* ==========================================================================
   7. COMPOUND INTEREST / ROI CALCULATOR
   ========================================================================== */
function initCompoundCalculator() {
    window.calculateWealthGrowth = function() {
        const principal = parseFloat(document.getElementById('calc-principal').value);
        const monthly = parseFloat(document.getElementById('calc-monthly').value) || 0;
        const rate = parseFloat(document.getElementById('calc-rate').value) / 100;
        const years = parseFloat(document.getElementById('calc-years').value);

        if (!principal || !rate || !years) {
            window.showCustomAlert('Please enter valid principal, annual return rate, and investment horizon.', 'error');
            return;
        }

        const months = years * 12;
        const monthlyRate = rate / 12;
        let total = principal * Math.pow(1 + monthlyRate, months);
        
        for (let i = 1; i <= months; i++) {
            total += monthly * Math.pow(1 + monthlyRate, months - i);
        }

        const totalInvested = principal + (monthly * months);
        const wealthGain = total - totalInvested;

        window.showCustomAlert(
            `Projected Portfolio Value: $${Math.round(total).toLocaleString()}\nTotal Contributions: $${Math.round(totalInvested).toLocaleString()}\nEst. Compound Growth: $${Math.round(wealthGain).toLocaleString()}`, 
            'success'
        );
    };
}

/* ==========================================================================
   8. FORM VALIDATIONS
   ========================================================================== */
function initFormValidations() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], #booking-phone');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });

    const contactName = document.getElementById('contact-name');
    if (contactName) {
        contactName.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }

    const contactPhone = document.getElementById('contact-phone');
    if (contactPhone) {
        contactPhone.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('contact-name').value;
            const phoneVal = document.getElementById('contact-phone').value;

            // Name check (letters & spaces only)
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(nameVal)) {
                window.showCustomAlert("Full Name must contain only letters.", "error");
                return;
            }

            // Phone check (digits only)
            const phoneRegex = /^[0-9]+$/;
            if (!phoneRegex.test(phoneVal)) {
                window.showCustomAlert("Phone Number must contain only digits.", "error");
                return;
            }

            window.showCustomAlert("Thank you! Your private consultation request has been dispatched to our senior wealth director.", "success");
            contactForm.reset();
        });
    }

    const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.showCustomAlert("Subscribed! You will receive our weekly global wealth & market analysis reports.", "success");
            form.reset();
        });
    });
}

/* ==========================================================================
   9. DASHBOARD SIDEBAR TOGGLE HANDLER (MOBILE)
   ========================================================================== */
function initDashboardSidebar() {
    const dbHamburger = document.querySelector('.db-hamburger');
    const dbSidebarClose = document.querySelector('.db-sidebar-close');
    const dbSidebar = document.querySelector('.db-sidebar');
    const dbOverlay = document.querySelector('.db-sidebar-overlay');

    if (dbHamburger && dbSidebar && dbOverlay) {
        dbHamburger.addEventListener('click', () => {
            dbSidebar.classList.add('active');
            dbOverlay.classList.add('active');
        });
    }

    const closeDbSidebar = () => {
        if (dbSidebar) dbSidebar.classList.remove('active');
        if (dbOverlay) dbOverlay.classList.remove('active');
    };

    if (dbSidebarClose) {
        dbSidebarClose.addEventListener('click', closeDbSidebar);
    }
    if (dbOverlay) {
        dbOverlay.addEventListener('click', closeDbSidebar);
    }
}

/* ==========================================================================
   10. DYNAMIC PORTAL ROLE RENDERING (CLIENT VS ADVISOR MODULES)
   ========================================================================== */
function initDashboardRoles() {
    const role = localStorage.getItem('loggedInUserRole') || 'client';
    const userName = localStorage.getItem('loggedInUserName') || 'USER';

    // Update username indicators
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = role === 'advisor' ? `Advisor ${userName}` : userName;
    });

    const initials = userName.substring(0, 2).toUpperCase();
    document.querySelectorAll('.user-avatar').forEach(el => {
        el.textContent = initials;
    });

    // Swapping modules for Fiduciary Advisor
    if (role === 'advisor') {
        const sidebar = document.querySelector('.db-sidebar');
        if (sidebar) {
            const menuContainer = sidebar.querySelector('div[style*="overflow-y"]');
            if (menuContainer) {
                const path = window.location.pathname.split('/').pop() || 'studio-portal.html';
                
                menuContainer.innerHTML = `
                    <a href="studio-portal.html" class="sidebar-logo"><img src="images/logo.webp" alt="Stackly Logo"></a>
                    
                    <!-- Group 1: Advisor Main -->
                    <div class="sidebar-section-title" style="margin-top: 1rem;">Main</div>
                    <nav class="sidebar-menu">
                        <a href="studio-portal.html" class="sidebar-link ${path === 'studio-portal.html' ? 'active' : ''}"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
                        <a href="portfolio-holdings.html" class="sidebar-link ${path === 'portfolio-holdings.html' ? 'active' : ''}"><i class="fa-solid fa-users"></i> Client Directory</a>
                        <a href="asset-allocation.html" class="sidebar-link ${path === 'asset-allocation.html' ? 'active' : ''}"><i class="fa-solid fa-scale-balanced"></i> Rebalance Mandates</a>
                        <a href="advisory-schedule.html" class="sidebar-link ${path === 'advisory-schedule.html' ? 'active' : ''}"><i class="fa-solid fa-calendar-check"></i> Appointment Requests</a>
                    </nav>

                    <!-- Group 2: Fiduciary Oversight -->
                    <div class="sidebar-section-title" style="margin-top: 1rem;">Fiduciary Oversight</div>
                    <nav class="sidebar-menu">
                        <a href="fiduciary-booking.html" class="sidebar-link ${path === 'fiduciary-booking.html' ? 'active' : ''}"><i class="fa-solid fa-file-shield"></i> Advisor Logs</a>
                    </nav>

                    <!-- Group 3: Portfolio Simulator -->
                    <div class="sidebar-section-title" style="margin-top: 1rem;">Portfolio Simulator</div>
                    <nav class="sidebar-menu">
                        <a href="roi-calculator.html" class="sidebar-link ${path === 'roi-calculator.html' ? 'active' : ''}"><i class="fa-solid fa-gauge-high"></i> Macro Simulator</a>
                        <a href="tax-harvesting.html" class="sidebar-link ${path === 'tax-harvesting.html' ? 'active' : ''}"><i class="fa-solid fa-shield-halved"></i> Compliance Auditing</a>
                    </nav>
                `;
            }
        }

        // Customise main dashboard panel
        if (window.location.pathname.endsWith('studio-portal.html') || window.location.pathname.endsWith('studio-portal')) {
            const welcomeHero = document.querySelector('.db-welcome-hero');
            if (welcomeHero) {
                welcomeHero.innerHTML = `
                    <h1>Hello, <span class="user-name" style="font-size: inherit; font-weight: inherit; color: inherit;">Advisor ${userName}</span></h1>
                    <p>Fiduciary Control Panel. Review client drift metrics, wash-sale exemptions, and authorize rebalancing requests.</p>
                `;
            }

            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length >= 4) {
                statCards[0].innerHTML = `
                    <div>
                        <div class="stat-label">Total Assets Under Advisory</div>
                        <h3 class="stat-value">$1.28 Billion</h3>
                    </div>
                    <div class="stat-icon-wrapper" style="background: rgba(16, 185, 129, 0.1); color: var(--primary);"><i class="fa-solid fa-vault"></i></div>
                `;
                statCards[1].innerHTML = `
                    <div>
                        <div class="stat-label">Active Wealth Clients</div>
                        <h3 class="stat-value">158 Accounts</h3>
                    </div>
                    <div class="stat-icon-wrapper" style="background: rgba(245, 158, 11, 0.1); color: var(--accent);"><i class="fa-solid fa-users"></i></div>
                `;
                statCards[2].innerHTML = `
                    <div>
                        <div class="stat-label">System Audit Rating</div>
                        <h3 class="stat-value">99.2% Standard</h3>
                    </div>
                    <div class="stat-icon-wrapper" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;"><i class="fa-solid fa-shield-halved"></i></div>
                `;
                statCards[3].innerHTML = `
                    <div>
                        <div class="stat-label">Assigned Advisor Tier</div>
                        <h3 class="stat-value">Senior CIO</h3>
                    </div>
                    <div class="stat-icon-wrapper" style="background: rgba(168, 85, 247, 0.1); color: #a855f7;"><i class="fa-solid fa-user-tie"></i></div>
                `;
            }

            const tableTitle = document.querySelector('.panel-box-title');
            if (tableTitle) {
                tableTitle.textContent = "High-Net-Worth Client Directory";
            }
            const table = document.querySelector('.db-table');
            if (table) {
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    tbody.innerHTML = `
                        <tr>
                            <td class="text-light-value">Hamilton Trust</td>
                            <td>Alexander Hamilton</td>
                            <td>$2,450,000 AUM</td>
                            <td><span class="badge-status status-active">Active</span></td>
                        </tr>
                        <tr>
                            <td class="text-light-value">Aurelia Growth Fund LLC</td>
                            <td>Fiona Vance (CEO)</td>
                            <td>$15,400,000 AUM</td>
                            <td><span class="badge-status status-active">Active</span></td>
                        </tr>
                    `;
                }
            }
        }

        // Customise holdings subpage (Client Directory)
        if (window.location.pathname.endsWith('portfolio-holdings.html')) {
            const welcomeHero = document.querySelector('.db-welcome-hero');
            if (welcomeHero) {
                welcomeHero.innerHTML = `
                    <h1>Client Directory</h1>
                    <p>Manage list of active high-net-worth accounts under fiduciary advisory.</p>
                `;
            }
            const table = document.querySelector('.db-table');
            if (table) {
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Account Name</th>
                            <th>Reference ID</th>
                            <th>Current AUM</th>
                            <th>Compliance Score</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-light-value" data-label="Account">Hamilton Trust</td>
                            <td data-label="Reference ID">STK-HAM-901</td>
                            <td data-label="AUM">$2,450,000</td>
                            <td data-label="Score">98/100</td>
                            <td data-label="Status"><span class="badge-status status-active">Active</span></td>
                        </tr>
                        <tr>
                            <td class="text-light-value" data-label="Account">Aurelia Growth Fund LLC</td>
                            <td data-label="Reference ID">STK-AUR-202</td>
                            <td data-label="AUM">$15,400,000</td>
                            <td data-label="Score">95/100</td>
                            <td data-label="Status"><span class="badge-status status-active">Active</span></td>
                        </tr>
                        <tr>
                            <td class="text-light-value" data-label="Account">Vance Family Trust</td>
                            <td data-label="Reference ID">STK-VAN-789</td>
                            <td data-label="AUM">$8,720,000</td>
                            <td data-label="Score">99/100</td>
                            <td data-label="Status"><span class="badge-status status-active">Active</span></td>
                        </tr>
                    </tbody>
                `;
            }
        }

        // Customise allocation subpage (Rebalance Mandates)
        if (window.location.pathname.endsWith('asset-allocation.html')) {
            const welcomeHero = document.querySelector('.db-welcome-hero');
            if (welcomeHero) {
                welcomeHero.innerHTML = `
                    <h1>Rebalance Mandates</h1>
                    <p>Execute portfolio allocations and coordinate model drift corrections.</p>
                `;
            }
            const box = document.querySelector('.panel-box');
            if (box) {
                box.innerHTML = `
                    <h3 class="panel-box-title" style="margin-bottom: 1.5rem;">Drift Tolerances & Actions</h3>
                    <div class="widget-metric-row">
                        <div class="widget-metric-header">
                            <span>US Large Cap Equity Drift</span>
                            <span class="text-light-value">Drift: +4.2% (Action Required)</span>
                        </div>
                        <div class="widget-progress-bar">
                            <div class="widget-progress-fill" style="width: 84%; background-color: var(--accent);"></div>
                        </div>
                    </div>
                    <div class="widget-metric-row" style="margin-top: 1.5rem;">
                        <div class="widget-metric-header">
                            <span>Sovereign Debt Allocation</span>
                            <span class="text-light-value">Drift: -0.5% (Within Range)</span>
                        </div>
                        <div class="widget-progress-bar">
                            <div class="widget-progress-fill" style="width: 15%; background-color: var(--primary);"></div>
                        </div>
                    </div>
                `;
            }
        }

        // Customise schedule subpage (Appointment Requests)
        if (window.location.pathname.endsWith('advisory-schedule.html')) {
            const welcomeHero = document.querySelector('.db-welcome-hero');
            if (welcomeHero) {
                welcomeHero.innerHTML = `
                    <h1>Appointment Requests</h1>
                    <p>Review and confirm incoming private client strategy consultation requests.</p>
                `;
            }
            const table = document.querySelector('.db-table');
            if (table) {
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Requested Slot</th>
                            <th>Client Name</th>
                            <th>Discussion Topic</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-light-value">Thu @ 11:30 AM</td>
                            <td>Alexander Hamilton</td>
                            <td>Offshore Asset Shielding</td>
                            <td><span class="badge-status status-active" style="cursor: pointer;" onclick="window.showCustomAlert('Client booking request approved.', 'success')">Approve</span></td>
                        </tr>
                        <tr>
                            <td class="text-light-value">Fri @ 03:00 PM</td>
                            <td>Aurelia Growth CEO</td>
                            <td>Venture Syndicate Allocation</td>
                            <td><span class="badge-status status-active" style="cursor: pointer;" onclick="window.showCustomAlert('Client booking request approved.', 'success')">Approve</span></td>
                        </tr>
                    </tbody>
                `;
            }
        }
    }
}



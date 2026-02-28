/**
 * MHUDUMU HOSPITAL - MAIN JAVASCRIPT
 * All interactive functionality for the hospital website
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initBackToTop();
    initTestimonialsCarousel();
    initFaqAccordion(); // Enhanced FAQ accordion
    initDepartmentFilter();
    initFormValidation();
    initSmoothScroll();
    initStatsCounter();
    initEmergencySticky();
    initLazyLoading();
    initToastNotifications();
    initWhatsAppButton();
    initSkipLink();
    initServiceFilter();
    initExpandableSections();
    initServiceModal();
    initDoctorFilters();
    initDoctorProfileModal();
    
    // Initialize page-specific functions based on URL
    if (window.location.pathname.includes('services.html')) {
        initServicesPage();
    }
    if (window.location.pathname.includes('insurance.html')) {
        // Insurance page specific initializations
        setTimeout(() => {
            initFaqAccordion(); // Re-initialize for insurance page FAQ
        }, 100);
    }
    
    // Re-initialize AOS if it exists
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            // Toggle icon between bars and times
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuBtn.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('show');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    const floatingBackToTop = document.querySelector('.floating-chat:last-child');
    
    // Handle both possible back to top buttons
    const buttons = [backToTop, floatingBackToTop].filter(btn => btn);
    
    buttons.forEach(btn => {
        if (btn) {
            // Initially hide
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
            btn.style.transition = 'all 0.3s ease';
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                } else {
                    btn.style.opacity = '0';
                    btn.style.visibility = 'hidden';
                }
            });
            
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    });
}

/**
 * Testimonials Carousel
 */
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const dots = document.querySelectorAll('.dot');
    
    if (carousel && dots.length > 0) {
        let currentIndex = 0;
        const itemWidth = 300; // Width of each testimonial item
        const gap = 32; // Gap between items (2rem = 32px)
        const totalItems = document.querySelectorAll('.testimonial-item').length;
        
        function updateCarousel(index) {
            if (index < 0) index = 0;
            if (index >= totalItems - 2) index = totalItems - 2;
            
            currentIndex = index;
            const translateX = -(currentIndex * (itemWidth + gap));
            carousel.style.transform = `translateX(${translateX}px)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => updateCarousel(index));
        });
        
        // Auto advance carousel every 5 seconds
        setInterval(() => {
            if (currentIndex < totalItems - 2) {
                updateCarousel(currentIndex + 1);
            } else {
                updateCarousel(0);
            }
        }, 5000);
    }
}

/**
 * FAQ Accordion - Enhanced Version
 */
function initFaqAccordion() {
    console.log('Initializing FAQ accordion...');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        console.log(`Found ${faqQuestions.length} FAQ items`);
        
        // Remove any existing event listeners and add new ones
        faqQuestions.forEach(question => {
            // Clone and replace to remove all event listeners
            const newQuestion = question.cloneNode(true);
            question.parentNode.replaceChild(newQuestion, question);
            
            // Add click event to the new element
            newQuestion.addEventListener('click', function(e) {
                e.preventDefault();
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                const icon = this.querySelector('i');
                
                console.log('FAQ clicked');
                
                // Close all other FAQs
                document.querySelectorAll('.faq-question').forEach(q => {
                    if (q !== this && q.classList.contains('active')) {
                        q.classList.remove('active');
                        const otherAnswer = q.nextElementSibling;
                        if (otherAnswer) {
                            otherAnswer.classList.remove('show');
                        }
                        const otherIcon = q.querySelector('i');
                        if (otherIcon) {
                            otherIcon.classList.remove('fa-chevron-up');
                            otherIcon.classList.add('fa-chevron-down');
                        }
                    }
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    this.classList.add('active');
                    if (answer) {
                        answer.classList.add('show');
                    }
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                } else {
                    this.classList.remove('active');
                    if (answer) {
                        answer.classList.remove('show');
                    }
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            });
        });
    } else {
        console.log('No FAQ items found');
    }
}

/**
 * Department Filter (Original)
 */
function initDepartmentFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterBtns.length > 0 && serviceCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter cards
                serviceCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-department') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Form Validation
 */
function initFormValidation() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Validate fields
            let isValid = true;
            
            // Full Name validation
            const fullName = document.getElementById('fullName');
            if (fullName && !fullName.value.trim()) {
                showError(fullName, 'Full name is required');
                isValid = false;
            }
            
            // Phone validation (Kenyan format)
            const phone = document.getElementById('phone');
            const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
            if (phone) {
                if (!phone.value.trim()) {
                    showError(phone, 'Phone number is required');
                    isValid = false;
                } else if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
                    showError(phone, 'Please enter a valid Kenyan phone number');
                    isValid = false;
                }
            }
            
            // Email validation
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email) {
                if (!email.value.trim()) {
                    showError(email, 'Email is required');
                    isValid = false;
                } else if (!emailRegex.test(email.value)) {
                    showError(email, 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            // Date validation
            const date = document.getElementById('date');
            if (date && !date.value) {
                showError(date, 'Preferred date is required');
                isValid = false;
            } else if (date) {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    showError(date, 'Please select a future date');
                    isValid = false;
                }
            }
            
            // Department validation
            const department = document.getElementById('department');
            if (department && !department.value) {
                showError(department, 'Please select a department');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = appointmentForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
                
                // Simulate form submission
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                    
                    // Show success toast
                    showToast('Appointment Request Received!', 'We will contact you within 24 hours to confirm your appointment.', 'success');
                    
                    // Reset form
                    appointmentForm.reset();
                }, 1500);
            }
        });
        
        // Real-time validation on input
        const inputs = appointmentForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const errorElement = this.parentElement?.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                    this.classList.remove('error');
                }
            });
        });
    }
}

/**
 * Show error message for form field
 */
function showError(element, message) {
    if (!element) return;
    element.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentElement?.appendChild(errorDiv);
}

/**
 * Clear all form errors
 */
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

/**
 * Show toast notification
 */
function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number, .stat-number-modern, .quick-stat-number');
    
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const targetText = stat.textContent;
                    const target = parseInt(targetText.replace(/[^0-9]/g, ''));
                    
                    if (!isNaN(target)) {
                        let current = 0;
                        const increment = target / 50; // Increment over 50 steps
                        const hasPlus = targetText.includes('+');
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                stat.textContent = target + (hasPlus ? '+' : '');
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                            }
                        }, 20);
                    }
                    
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }
}

/**
 * Emergency Header Sticky Behavior
 */
function initEmergencySticky() {
    const emergencyHeader = document.querySelector('.emergency-header');
    const mainNav = document.querySelector('.main-nav');
    
    if (emergencyHeader && mainNav) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                emergencyHeader.style.transform = 'translateY(-100%)';
                mainNav.style.top = '0';
            } else {
                // Scrolling up
                emergencyHeader.style.transform = 'translateY(0)';
                mainNav.style.top = '60px';
            }
            
            lastScroll = currentScroll;
        });
    }
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Initialize Toast Notifications (for demo purposes)
 */
function initToastNotifications() {
    // Add demo toast triggers if needed
    const demoButtons = document.querySelectorAll('[data-toast]');
    
    demoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-toast-type') || 'success';
            const title = this.getAttribute('data-toast-title') || 'Notification';
            const message = this.getAttribute('data-toast-message') || 'This is a demo notification';
            
            showToast(title, message, type);
        });
    });
}

/**
 * WhatsApp Button Click Handler
 */
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.floating-whatsapp, .floating-chat:first-child');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phone = this.getAttribute('data-phone') || '254712345678';
            const message = encodeURIComponent('Hello MHUDUMU Hospital, I would like to inquire about your services.');
            
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
}

/**
 * Skip to Main Content Link
 */
function initSkipLink() {
    const skipLink = document.querySelector('.skip-nav');
    
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }
}

/**
 * SERVICE FILTER FUNCTIONALITY
 */
function initServiceFilter() {
    const filterTabs = document.querySelectorAll('.service-tab');
    const serviceCards = document.querySelectorAll('.service-card-modern');
    
    if (filterTabs.length > 0 && serviceCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter cards with animation
                serviceCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || card.getAttribute('data-department') === filterValue) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
        
        // Activate first tab by default
        if (filterTabs.length > 0 && !document.querySelector('.service-tab.active')) {
            filterTabs[0].classList.add('active');
        }
    }
}

/**
 * EXPANDABLE SERVICE SECTIONS
 */
function initExpandableSections() {
    const expandBtns = document.querySelectorAll('.expand-btn');
    
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const expandableSection = document.getElementById(targetId);
            
            if (expandableSection) {
                // Close other open sections
                document.querySelectorAll('.expandable-section.expanded').forEach(section => {
                    if (section.id !== targetId) {
                        section.classList.remove('expanded');
                        const correspondingBtn = document.querySelector(`[data-target="${section.id}"]`);
                        if (correspondingBtn) {
                            const icon = correspondingBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-chevron-up');
                                icon.classList.add('fa-chevron-down');
                            }
                        }
                    }
                });
                
                // Toggle current section
                expandableSection.classList.toggle('expanded');
                
                // Toggle icon
                const icon = this.querySelector('i');
                if (icon) {
                    if (expandableSection.classList.contains('expanded')) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            }
        });
    });
}

/**
 * SERVICE DETAIL MODAL
 */
function initServiceModal() {
    const modal = document.getElementById('serviceDetailModal');
    const viewDetailBtns = document.querySelectorAll('.view-detail-btn');
    
    if (modal && viewDetailBtns.length > 0) {
        viewDetailBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-service-id');
                loadServiceDetails(serviceId);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal when clicking on background
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

/**
 * Load Service Details (simulated data)
 */
function loadServiceDetails(serviceId) {
    const modal = document.getElementById('serviceDetailModal');
    if (!modal) return;
    
    let modalContent = modal.querySelector('.modal-content');
    if (!modalContent) {
        modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modal.appendChild(modalContent);
    }
    
    // Show loading
    modalContent.innerHTML = '<div style="text-align: center; padding: 3rem;"><i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary);"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const services = {
            'emergency': {
                title: 'Emergency Services',
                description: 'Our 24/7 Emergency Department is equipped to handle any medical emergency with rapid response and advanced life support.',
                leadDoctor: 'Dr. James Kariuki',
                leadDoctorQual: 'MBChB, MMed (Emergency Medicine)',
                equipment: [
                    'Advanced Life Support Ambulances',
                    'Cardiac Monitors',
                    'Ventilators',
                    'Defibrillators',
                    'Point-of-Care Ultrasound'
                ],
                services: [
                    'Trauma Care',
                    'Cardiac Emergencies',
                    'Stroke Management',
                    'Pediatric Emergencies',
                    'Poisoning Cases'
                ],
                hours: '24/7 - 365 days',
                contact: '+254 722 000 000'
            },
            'maternity': {
                title: 'Maternity Services',
                description: 'Comprehensive maternal care from pregnancy to postpartum in a warm, supportive environment.',
                leadDoctor: 'Dr. Sarah Wanjiku',
                leadDoctorQual: 'MBChB, MMed (OB/GYN)',
                equipment: [
                    'Fetal Monitors',
                    'Ultrasound Machines',
                    'Neonatal Incubators',
                    'C-Section Theatre',
                    'Resuscitation Equipment'
                ],
                services: [
                    'Antenatal Care',
                    'Normal Delivery',
                    'C-Section Delivery',
                    'Postnatal Care',
                    'Newborn Screening'
                ],
                hours: '24/7 Maternity Wing',
                contact: '+254 700 111 222'
            },
            'outpatient': {
                title: 'Outpatient Services',
                description: 'Convenient outpatient care with minimal waiting times and comprehensive consultations.',
                leadDoctor: 'Dr. Peter Odhiambo',
                leadDoctorQual: 'MBChB, MMed (Family Medicine)',
                equipment: [
                    'Consultation Rooms',
                    'Minor Procedure Room',
                    'ECG Machines',
                    'Point-of-Care Testing'
                ],
                services: [
                    'General Consultations',
                    'Health Check-ups',
                    'Minor Procedures',
                    'Vaccinations',
                    'Chronic Disease Management'
                ],
                hours: 'Mon-Sat: 8am-8pm, Sun: 10am-4pm',
                contact: '+254 700 333 444'
            },
            'laboratory': {
                title: 'Laboratory Services',
                description: 'State-of-the-art diagnostic laboratory with automated analyzers for accurate, timely results.',
                leadDoctor: 'Dr. Lucy Muthoni',
                leadDoctorQual: 'PhD Clinical Pathology',
                equipment: [
                    'Automated Hematology Analyzer',
                    'Chemistry Analyzer',
                    'Microbiology Incubators',
                    'Centrifuges',
                    'Microscopes'
                ],
                services: [
                    'Blood Tests (CBC, Chemistry)',
                    'Urinalysis',
                    'Microbiology Cultures',
                    'Hormone Assays',
                    'Rapid Tests'
                ],
                hours: 'Mon-Sat: 7am-8pm, Sun: 9am-2pm',
                contact: '+254 700 555 666'
            },
            'radiology': {
                title: 'Radiology & Imaging',
                description: 'Advanced imaging services with digital technology for precise diagnosis.',
                leadDoctor: 'Dr. Michael Kimani',
                leadDoctorQual: 'MBChB, MMed (Radiology)',
                equipment: [
                    'Digital X-Ray',
                    'Ultrasound (3D/4D)',
                    'CT Scanner',
                    'MRI (Coming Soon)',
                    'Mammography'
                ],
                services: [
                    'X-Ray Imaging',
                    'Obstetric Ultrasound',
                    'Abdominal Ultrasound',
                    'CT Scans',
                    'Bone Densitometry'
                ],
                hours: 'Mon-Sat: 8am-6pm',
                contact: '+254 700 777 888'
            },
            'pharmacy': {
                title: 'Pharmacy',
                description: 'Well-stocked pharmacy with quality medications and professional pharmaceutical care.',
                leadDoctor: 'Dr. Anne Waweru',
                leadDoctorQual: 'PharmD',
                equipment: [
                    'Temperature-controlled Storage',
                    'Automated Dispensing System',
                    'Compounding Equipment'
                ],
                services: [
                    'Prescription Filling',
                    'Medication Counseling',
                    'Over-the-Counter Medications',
                    'Chronic Disease Medications',
                    'Health Supplements'
                ],
                hours: 'Mon-Sat: 8am-9pm, Sun: 10am-5pm',
                contact: '+254 700 999 000'
            }
        };
        
        const service = services[serviceId] || services['emergency'];
        
        modalContent.innerHTML = `
            <div class="modal-close" style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: var(--light); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);">
                <i class="fas fa-times"></i>
            </div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary);">${service.title}</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">${service.description}</p>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">Lead Doctor</h3>
                <div style="display: flex; align-items: center; gap: 1rem; background: var(--light); padding: 1rem; border-radius: var(--border-radius-md);">
                    <div style="width: 60px; height: 60px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <div>
                        <div style="font-weight: 700; font-size: 1.2rem;">${service.leadDoctor}</div>
                        <div style="color: var(--gray);">${service.leadDoctorQual}</div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="margin-bottom: 1rem;">Equipment Available</h3>
                    <ul style="list-style: none;">
                        ${service.equipment.map(item => `
                            <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: var(--success);"></i>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div>
                    <h3 style="margin-bottom: 1rem;">Services Offered</h3>
                    <ul style="list-style: none;">
                        ${service.services.map(item => `
                            <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-stethoscope" style="color: var(--primary);"></i>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="display: flex; gap: 2rem; flex-wrap: wrap; padding-top: 1rem; border-top: 1px solid var(--gray-light);">
                <div>
                    <i class="fas fa-clock" style="color: var(--primary); margin-right: 0.5rem;"></i>
                    <strong>Hours:</strong> ${service.hours}
                </div>
                <div>
                    <i class="fas fa-phone" style="color: var(--primary); margin-right: 0.5rem;"></i>
                    <strong>Contact:</strong> ${service.contact}
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <a href="appointment.html?department=${encodeURIComponent(service.title)}" class="btn-modern btn-primary-modern" style="display: inline-block; padding: 1rem 2rem; background: var(--gradient-primary); color: white; text-decoration: none; border-radius: 50px; font-weight: 600;">
                    <i class="fas fa-calendar-check"></i> Book Appointment
                </a>
            </div>
        `;
        
        // Add close button functionality
        const closeBtn = modalContent.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
    }, 500);
}

/**
 * Initialize services page
 */
function initServicesPage() {
    initServiceFilter();
    initExpandableSections();
    initServiceModal();
}

/**
 * Doctor Filters for Doctors Page
 */
function initDoctorFilters() {
    const filterTabs = document.querySelectorAll('.service-tab');
    const doctorCards = document.querySelectorAll('.doctor-card-modern');
    
    if (filterTabs.length > 0 && doctorCards.length > 0 && window.location.pathname.includes('doctors.html')) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                doctorCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-doctor-type') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

/**
 * Doctor Profile Modal
 */
function initDoctorProfileModal() {
    const profileBtns = document.querySelectorAll('.doctor-profile-btn');
    const modal = document.getElementById('doctorProfileModal');
    
    if (profileBtns.length > 0 && modal) {
        profileBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const doctorId = this.getAttribute('data-doctor');
                loadDoctorProfile(doctorId);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

/**
 * Load Doctor Profile (simulated)
 */
function loadDoctorProfile(doctorId) {
    const modal = document.getElementById('doctorProfileModal');
    if (!modal) return;
    
    let modalContent = modal.querySelector('.modal-content');
    if (!modalContent) {
        modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modal.appendChild(modalContent);
    }
    
    const doctors = {
        'jane-mwende': {
            name: 'Dr. Jane Mwende',
            specialty: 'Consultant Physician',
            qualifications: 'MBChB, MMed (Internal Medicine)',
            experience: '12+ years',
            reg: 'A12345',
            bio: 'Dr. Jane Mwende is a highly respected physician with over 12 years of experience in internal medicine. She specializes in managing complex medical conditions and has a passion for preventive healthcare.',
            education: [
                'MMed Internal Medicine - University of Nairobi',
                'MBChB - University of Nairobi',
                'Certificate in Diabetes Management - Kenya Diabetes Association'
            ],
            languages: ['English', 'Kiswahili', 'Kamba']
        },
        'james-odhiambo': {
            name: 'Dr. James Odhiambo',
            specialty: 'Pediatrician',
            qualifications: 'MBChB, MMed (Paediatrics)',
            experience: '10+ years',
            reg: 'B67890',
            bio: 'Dr. James Odhiambo is dedicated to child health and has extensive experience in managing pediatric emergencies and chronic conditions. He is known for his gentle approach with children.',
            education: [
                'MMed Paediatrics - University of Nairobi',
                'MBChB - Moi University',
                'Fellowship in Neonatology - Aga Khan Hospital'
            ],
            languages: ['English', 'Kiswahili', 'Luo']
        },
        'sarah-wanjiku': {
            name: 'Dr. Sarah Wanjiku',
            specialty: 'Obstetrician/Gynecologist',
            qualifications: 'MBChB, MMed (OB/GYN)',
            experience: '15+ years',
            reg: 'C24680',
            bio: 'Dr. Sarah Wanjiku is a senior obstetrician with a special interest in high-risk pregnancies and minimally invasive gynecological surgery. She has delivered thousands of babies.',
            education: [
                'MMed Obstetrics & Gynecology - University of Nairobi',
                'MBChB - University of Nairobi',
                'Fellowship in Laparoscopic Surgery - India'
            ],
            languages: ['English', 'Kiswahili', 'Kikuyu']
        },
        'peter-kipchoge': {
            name: 'Dr. Peter Kipchoge',
            specialty: 'Cardiologist',
            qualifications: 'MBChB, MMed (Cardiology)',
            experience: '8+ years',
            reg: 'D13579',
            bio: 'Dr. Peter Kipchoge is a young but highly skilled cardiologist trained in advanced cardiac imaging and interventional procedures. He is passionate about heart health awareness.',
            education: [
                'MMed Cardiology - University of Nairobi',
                'MBChB - Moi University',
                'Fellowship in Echocardiography - South Africa'
            ],
            languages: ['English', 'Kiswahili', 'Kalenjin']
        }
    };
    
    const doctor = doctors[doctorId] || doctors['jane-mwende'];
    
    modalContent.innerHTML = `
        <div class="modal-close" style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: var(--light); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);">
            <i class="fas fa-times"></i>
        </div>
        <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem;">
            <div style="width: 120px; height: 120px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                <i class="fas fa-user-md"></i>
            </div>
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary);">${doctor.name}</h2>
                <p style="font-size: 1.2rem; color: var(--gray-dark); margin-bottom: 0.5rem;">${doctor.specialty}</p>
                <p style="color: var(--gray);">${doctor.qualifications}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Professional Bio</h3>
            <p style="line-height: 1.8;">${doctor.bio}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="margin-bottom: 1rem;">Education & Training</h3>
                <ul style="list-style: none;">
                    ${doctor.education.map(item => `
                        <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-graduation-cap" style="color: var(--primary);"></i>
                            ${item}
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h3 style="margin-bottom: 1rem;">Languages Spoken</h3>
                <ul style="list-style: none;">
                    ${doctor.languages.map(lang => `
                        <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-language" style="color: var(--primary);"></i>
                            ${lang}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; padding-top: 1rem; border-top: 1px solid var(--gray-light);">
            <div>
                <i class="fas fa-clock" style="color: var(--primary); margin-right: 0.5rem;"></i>
                <strong>Experience:</strong> ${doctor.experience}
            </div>
            <div>
                <i class="fas fa-id-card" style="color: var(--primary); margin-right: 0.5rem;"></i>
                <strong>Reg No:</strong> ${doctor.reg}
            </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <a href="appointment.html" class="btn-modern btn-primary-modern" style="display: inline-block; padding: 1rem 2rem; background: var(--gradient-primary); color: white; text-decoration: none; border-radius: 50px; font-weight: 600;">
                <i class="fas fa-calendar-check"></i> Book Appointment with ${doctor.name.split(' ')[1]}
            </a>
        </div>
    `;
    
    const closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
}

/**
 * Appointment Booking Function (Global)
 */
function bookAppointment(department) {
    // Redirect to appointment page with department pre-selected
    window.location.href = `appointment.html?department=${encodeURIComponent(department)}`;
}

/**
 * Search Functionality
 */
function searchSite(query) {
    if (!query.trim()) return;
    
    // In a real implementation, this would search through content
    // For now, show a toast notification
    showToast('Search', `Searching for: ${query}`, 'info');
}

/**
 * Newsletter Signup
 */
function signupNewsletter(email) {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showToast('Error', 'Please enter a valid email address', 'error');
        return false;
    }
    
    // Simulate newsletter signup
    showToast('Success!', 'Thank you for subscribing to our newsletter!', 'success');
    return true;
}

// Export functions for global use
window.bookAppointment = bookAppointment;
window.searchSite = searchSite;
window.signupNewsletter = signupNewsletter;
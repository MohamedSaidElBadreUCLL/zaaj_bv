let currentLang = 'fr';
let currentSlide = 0;

// Language toggle functionality
function toggleLanguage() {
    const newLang = currentLang === 'fr' ? 'nl' : 'fr';
    setLanguage(newLang);
}

function setLanguage(lang) {
    currentLang = lang;
    
    // Hide all language content
    document.querySelectorAll('.lang-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show content for selected language
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
        el.classList.add('active');
    });
    
    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    langToggle.textContent = lang === 'fr' ? 'NL' : 'FR';
    
    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        const text = link.getAttribute(`data-${lang}`);
        if (text) link.textContent = text;
    });
    
    // Update page language attribute
    document.documentElement.lang = lang;
    
    // Reset carousel to first slide when language changes
    currentSlide = 0;
    updateCarousel();
}

// Mobile menu functionality
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('mobile-open');
}

// Price Calculator functionality
function calculatePrice(lang) {
    const metersInput = lang === 'fr' ? document.getElementById('meters') : document.getElementById('metersNL');
    const priceDisplay = lang === 'fr' ? document.getElementById('priceDisplayFR') : document.getElementById('priceDisplayNL');
    const priceAmount = lang === 'fr' ? document.getElementById('priceAmountFR') : document.getElementById('priceAmountNL');
    const priceDetails = lang === 'fr' ? document.getElementById('priceDetailsFR') : document.getElementById('priceDetailsNL');
    
    const meters = parseFloat(metersInput.value);
    
    if (isNaN(meters) || meters < 1) {
        priceDisplay.style.display = 'none';
        return;
    }
    
    let pricePerMeter;
    let priceRange;
    
    if (meters >= 10 && meters <= 15) {
        pricePerMeter = 130;
        priceRange = lang === 'fr' ? '10-15m' : '10-15m';
    } else if (meters >= 16 && meters <= 19) {
        pricePerMeter = 120;
        priceRange = lang === 'fr' ? '16-19m' : '16-19m';
    } else if (meters >= 20) {
        pricePerMeter = 99;
        priceRange = lang === 'fr' ? '20m+' : '20m+';
    } else {
        // Less than 10 meters - show message
        priceDisplay.style.display = 'block';
        priceAmount.textContent = lang === 'fr' ? 'Minimum 10m' : 'Minimum 10m';
        priceDetails.textContent = lang === 'fr' 
            ? 'Notre service commence à partir de 10 mètres linéaires' 
            : 'Onze service begint vanaf 10 strekkende meters';
        return;
    }
    
    const totalPrice = meters * pricePerMeter;
    
    priceDisplay.style.display = 'block';
    priceAmount.textContent = `€${totalPrice.toLocaleString('fr-BE')}`;
    
    if (lang === 'fr') {
        priceDetails.textContent = `${meters}m × €${pricePerMeter}/m (tranche ${priceRange})`;
    } else {
        priceDetails.textContent = `${meters}m × €${pricePerMeter}/m (bereik ${priceRange})`;
    }
}

// Carousel functionality
function updateCarousel() {
    const trackId = currentLang === 'fr' ? 'carouselTrack' : 'carouselTrackNL';
    const indicatorsId = currentLang === 'fr' ? 'carouselIndicators' : 'carouselIndicatorsNL';
    
    const track = document.getElementById(trackId);
    const indicators = document.getElementById(indicatorsId);
    
    if (track) {
        const slides = track.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
    }
    
    if (indicators) {
        const dots = indicators.querySelectorAll('.indicator');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

function nextSlide() {
    const trackId = currentLang === 'fr' ? 'carouselTrack' : 'carouselTrackNL';
    const track = document.getElementById(trackId);
    
    if (track) {
        const slides = track.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
}

function prevSlide() {
    const trackId = currentLang === 'fr' ? 'carouselTrack' : 'carouselTrackNL';
    const track = document.getElementById(trackId);
    
    if (track) {
        const slides = track.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Auto-play carousel
function startCarouselAutoplay() {
    setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

// Form submission handling
function handleFormSubmit(e, formId) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp and language
    data.timestamp = new Date().toISOString();
    data.formLanguage = currentLang;
    
    // Store in browser's memory (you can modify this to send to a server)
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Show success message
    const successMessage = currentLang === 'fr' 
        ? 'Merci ! Votre demande a été envoyée. Nous vous contactons bientôt.'
        : 'Bedankt! Uw aanvraag is verzonden. We nemen binnenkort contact op.';
    
    alert(successMessage);
    
    // Reset form and price display
    e.target.reset();
    if (currentLang === 'fr') {
        document.getElementById('priceDisplayFR').style.display = 'none';
    } else {
        document.getElementById('priceDisplayNL').style.display = 'none';
    }
    
    console.log('Form submitted:', data);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Form submissions
    const contactForm = document.getElementById('contactForm');
    const contactFormNL = document.getElementById('contactFormNL');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contactForm'));
    }
    
    if (contactFormNL) {
        contactFormNL.addEventListener('submit', (e) => handleFormSubmit(e, 'contactFormNL'));
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            document.getElementById('navLinks').classList.remove('mobile-open');
        });
    });
    
    // Initialize carousel
    updateCarousel();
    
    // Start carousel autoplay
    startCarouselAutoplay();
    
    // Add keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Add touch/swipe support for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselWrapper.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('nav');
    const navLinks = document.getElementById('navLinks');
    
    if (!nav.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
    }
});
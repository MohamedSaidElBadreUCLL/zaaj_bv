var currentLang = 'nl';
var currentSlide = 0;

function toggleLanguage() {
    var newLang = currentLang === 'fr' ? 'nl' : 'fr';
    setLanguage(newLang);
}

function setLanguage(lang) {
    currentLang = lang;

    var allLang = document.querySelectorAll('.lang-content');
    for (var i = 0; i < allLang.length; i++) {
        allLang[i].classList.remove('active');
    }

    var activeLang = document.querySelectorAll('[data-lang="' + lang + '"]');
    for (var i = 0; i < activeLang.length; i++) {
        activeLang[i].classList.add('active');
    }

    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = lang === 'fr' ? 'NL' : 'FR';
    }

    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        var text = navLinks[i].getAttribute('data-' + lang);
        if (text) navLinks[i].textContent = text;
    }

    document.documentElement.lang = lang;
    currentSlide = 0;
    updateCarousel();
}

function toggleMobileMenu() {
    var navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('mobile-open');
    }
}

function calculatePrice(lang) {
    var metersInput = lang === 'fr' ? document.getElementById('meters') : document.getElementById('metersNL');
    var priceDisplay = lang === 'fr' ? document.getElementById('priceDisplayFR') : document.getElementById('priceDisplayNL');
    var priceAmount = lang === 'fr' ? document.getElementById('priceAmountFR') : document.getElementById('priceAmountNL');
    var priceDetails = lang === 'fr' ? document.getElementById('priceDetailsFR') : document.getElementById('priceDetailsNL');

    var meters = parseFloat(metersInput.value);

    if (isNaN(meters) || meters < 1) {
        priceDisplay.style.display = 'none';
        return;
    }

    var pricePerMeter;
    var priceRange;

    if (meters >= 10 && meters <= 15) {
        pricePerMeter = 130;
        priceRange = '10-15m';
    } else if (meters >= 16 && meters <= 19) {
        pricePerMeter = 120;
        priceRange = '16-19m';
    } else if (meters >= 20) {
        pricePerMeter = 99;
        priceRange = '20m+';
    } else {
        priceDisplay.style.display = 'block';
        priceAmount.textContent = 'Minimum 10m';
        priceDetails.textContent = lang === 'fr'
            ? 'Notre service commence \u00e0 partir de 10 m\u00e8tres lin\u00e9aires'
            : 'Onze service begint vanaf 10 strekkende meters';
        return;
    }

    var totalPrice = meters * pricePerMeter;

    priceDisplay.style.display = 'block';
    priceAmount.textContent = '\u20ac' + totalPrice.toLocaleString('fr-BE');

    if (lang === 'fr') {
        priceDetails.textContent = meters + 'm \u00d7 \u20ac' + pricePerMeter + '/m (tranche ' + priceRange + ')';
    } else {
        priceDetails.textContent = meters + 'm \u00d7 \u20ac' + pricePerMeter + '/m (bereik ' + priceRange + ')';
    }
}

function updateCarousel() {
    var trackId = currentLang === 'fr' ? 'carouselTrack' : 'carouselTrackNL';
    var indicatorsId = currentLang === 'fr' ? 'carouselIndicators' : 'carouselIndicatorsNL';

    var track = document.getElementById(trackId);
    var indicators = document.getElementById(indicatorsId);

    if (track) {
        var slides = track.querySelectorAll('.carousel-slide');
        for (var i = 0; i < slides.length; i++) {
            if (i === currentSlide) {
                slides[i].classList.add('active');
            } else {
                slides[i].classList.remove('active');
            }
        }
    }

    if (indicators) {
        var dots = indicators.querySelectorAll('.indicator');
        for (var i = 0; i < dots.length; i++) {
            if (i === currentSlide) {
                dots[i].classList.add('active');
            } else {
                dots[i].classList.remove('active');
            }
        }
    }
}

function nextSlide() {
    var trackId = currentLang === 'fr' ? 'carouselTrack' : 'carouselTrackNL';
    var track = document.getElementById(trackId);
    if (track) {
        var slides = track.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
}

function prevSlide() {
    var trackId = currentLang === 'fr' ? 'carouselTrack' : 'carouselTrackNL';
    var track = document.getElementById(trackId);
    if (track) {
        var slides = track.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', function() {
    setLanguage('nl');

    // Copyright year
    var yearEls = document.querySelectorAll('.copyright-year');
    var year = new Date().getFullYear();
    for (var i = 0; i < yearEls.length; i++) {
        yearEls[i].textContent = year;
    }

    // Carousel autoplay
    updateCarousel();
    setInterval(nextSlide, 5000);

    // Smooth scroll for nav links only
    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    for (var i = 0; i < navAnchors.length; i++) {
        navAnchors[i].addEventListener('click', function(e) {
            e.preventDefault();
            var targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            var navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('mobile-open');
        });
    }

    // Logo smooth scroll
    var logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Keyboard nav for carousel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch swipe for carousel
    var touchStartX = 0;
    var carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        carouselWrapper.addEventListener('touchend', function(e) {
            var touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        var nav = document.querySelector('nav');
        var mobileMenu = document.querySelector('.mobile-menu');
        var navLinks = document.getElementById('navLinks');
        if (nav && navLinks && !nav.contains(e.target)) {
            navLinks.classList.remove('mobile-open');
        }
    });
});
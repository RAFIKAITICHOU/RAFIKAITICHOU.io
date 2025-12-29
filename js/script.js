// Script pour les animations et interactions
document.addEventListener('DOMContentLoaded', function () {

    // Gestionnaire d'erreurs global
    try {
        // Animation de la navbar au scroll (uniquement pour index.html)
        const navbar = document.querySelector('.navbar');

        if (!navbar) throw new Error('Navbar non trouvée');

        // Fonction throttle pour optimiser les performances
        function throttle(func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        // Navigation active selon la section visible (uniquement pour index.html)
        function updateActiveNav() {
            // Vérifier si on est sur la page d'accueil avec des sections
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            // Si pas de sections avec ID, on arrête
            if (sections.length === 0) return;

            let currentSection = '';
            let currentScroll = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');

                // Gérer les liens vers les pages
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }

                // Marquer comme actif si c'est la page courante (pour les pages individuelles)
                if (href === window.location.pathname.split('/').pop() ||
                    (href.includes(currentSection) && currentSection)) {
                    link.classList.add('active');
                }
            });
        }

        // Mettre à jour la navigation active pour les pages individuelles
        function updatePageActiveNav() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.nav-link');

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');

                if (href === currentPage) {
                    link.classList.add('active');
                }
            });
        }

        // Vérifier si on est sur la page d'accueil ou une page individuelle
        const isHomePage = window.location.pathname.endsWith('index.html') ||
            window.location.pathname.endsWith('/') ||
            window.location.pathname === '';

        if (isHomePage) {
            // Écouter le scroll avec throttle pour performance (uniquement sur l'accueil)
            window.addEventListener('scroll', throttle(updateActiveNav, 100));
        } else {
            // Pour les pages individuelles, mettre à jour la navigation active
            updatePageActiveNav();
        }

        // Animation des éléments au défilement avec Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate3d(0, 0, 0)'; // Hardware acceleration
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }
            });
        }, observerOptions);

        // Observer les sections avec gestion d'erreur
        const sections = document.querySelectorAll('.section');
        if (sections.length > 0) {
            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translate3d(0, 20px, 0)';
                observer.observe(section);
            });
        }

        // Animation des cartes avec délais progressifs
        const cards = document.querySelectorAll('.card, .project-card');
        cards.forEach((card, index) => {
            card.style.transition = 'all 0.3s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Animation des tags avec délais progressifs
        const tags = document.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            tag.style.transition = 'all 0.3s ease';
            tag.style.transitionDelay = `${index * 0.05}s`;
        });

        // Smooth scroll pour les liens d'ancrage (uniquement sur l'accueil)
        if (isHomePage) {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    if (targetId === '#' || !targetId) return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const targetPosition = targetElement.offsetTop - 80;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Mettre à jour la navigation active après animation
                        setTimeout(updateActiveNav, 300);

                        // Fermer le menu mobile si ouvert
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                            bsCollapse.hide();
                        }
                    }
                });
            });
        }

        // Fonctionnalité pour la photo cliquable (uniquement si elle existe)
        const clickablePhoto = document.querySelector('.clickable-photo');

        if (clickablePhoto) {
            // Effet de hover avancé
            clickablePhoto.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05) rotate(2deg)';
            });

            clickablePhoto.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1) rotate(0deg)';
            });

            // Animation au clic
            clickablePhoto.addEventListener('click', function () {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });

            // Accessibilité - navigation au clavier
            clickablePhoto.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // Gestion du modal photo (uniquement si le modal existe)
        const photoModal = document.getElementById('photoModal');

        if (photoModal) {
            let modalInstance = null;

            // Initialiser le modal Bootstrap
            try {
                modalInstance = new bootstrap.Modal(photoModal);
            } catch (error) {
                console.warn('Erreur initialisation modal:', error);
            }

            photoModal.addEventListener('show.bs.modal', function () {
                document.body.style.overflow = 'hidden';
            });

            photoModal.addEventListener('hidden.bs.modal', function () {
                document.body.style.overflow = 'auto';
            });

            // Fermer le modal avec la touche Échap
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && photoModal.classList.contains('show')) {
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });

            // Fermer le modal en cliquant à l'extérieur
            photoModal.addEventListener('click', function (e) {
                if (e.target === this) {
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });
        }

        // Préchargement de l'image pour le modal
        function preloadImage() {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = 'assets/photo.jpeg';
                img.onload = resolve;
                img.onerror = reject;
            });
        }

        // Précharger l'image au chargement de la page
        window.addEventListener('load', function () {
            preloadImage().catch(error => {
                console.warn('Erreur préchargement image:', error);
            });
        });

        // Mettre à jour la navigation active au chargement initial
        if (isHomePage) {
            updateActiveNav();
        } else {
            updatePageActiveNav();
        }

        // Gestion du resize pour recalculer les positions
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (isHomePage) {
                    updateActiveNav();
                } else {
                    updatePageActiveNav();
                }
            }, 250);
        });

        // Initialisation des tooltips Bootstrap (si utilisés plus tard)
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        // Animation des boutons de retour
        const backButtons = document.querySelectorAll('a[href="index.html"] .btn-primary');
        backButtons.forEach(button => {
            button.addEventListener('mouseenter', function () {
                this.style.transform = 'translateX(-5px)';
            });

            button.addEventListener('mouseleave', function () {
                this.style.transform = 'translateX(0)';
            });
        });

        // Gestion des liens externes - ouvrir dans un nouvel onglet
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

    } catch (error) {
        console.error('Erreur dans le script principal:', error);
    }

    // Gestion des erreurs de ressources (images, etc.)
    window.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Image non chargée:', e.target.src);
            // Optionnel: afficher une image de remplacement
            // e.target.src = 'assets/placeholder.jpg';
        }
    }, true);

    // Performance monitoring
    window.addEventListener('load', function () {
        // Log le temps de chargement
        if (window.performance) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Temps de chargement: ${loadTime}ms`);
        }

        // Ajouter une classe pour indiquer que le chargement est terminé
        document.body.classList.add('page-loaded');
    });

    // Gestion du scroll pour la navbar (effet de blur/opacity)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', throttle(function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scroll vers le bas
                navbar.style.background = 'rgba(10, 14, 39, 0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                // Scroll vers le haut
                navbar.style.background = 'rgba(10, 14, 39, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 100));
    }

    // Animation au chargement de la page
    function initPageAnimations() {
        // Animation progressive des éléments
        const animatedElements = document.querySelectorAll('.card, .tag, .project-card, .contact-item');

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }

    // Démarrer les animations après le chargement
    window.addEventListener('load', initPageAnimations);
});

// Fonction utilitaire pour détecter les appareils mobiles
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Fonction pour formater les dates si nécessaire
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}
function setLanguagePreference(lang) {
    localStorage.setItem('preferred-language', lang);
    return lang;
}

function getLanguagePreference() {
    return localStorage.getItem('preferred-language') ||
        navigator.language.split('-')[0] ||
        'fr';
}

// Redirection basée sur la préférence
function redirectToPreferredLanguage() {
    const preferredLang = getLanguagePreference();
    const currentPath = window.location.pathname;

    // Si on est à la racine et pas déjà dans la bonne langue
    if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
        if (preferredLang === 'en' && !currentPath.includes('/en/')) {
            window.location.href = 'en/index.html';
        } else if (preferredLang === 'fr' && currentPath.includes('/en/')) {
            window.location.href = '../index.html';
        }
    }
}

// Appeler au chargement
document.addEventListener('DOMContentLoaded', redirectToPreferredLanguage);
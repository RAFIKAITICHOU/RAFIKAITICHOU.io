// Script pour les animations et interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Gestionnaire d'erreurs global
    try {
        // Animation de la navbar au scroll
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) throw new Error('Navbar non trouvée');
        
        // Fonction throttle pour optimiser les performances
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        // Navigation active selon la section visible
        function updateActiveNav() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
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
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }

        // Écouter le scroll avec throttle pour performance
        window.addEventListener('scroll', throttle(updateActiveNav, 100));
        
        // Animation des éléments au défilement avec Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
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
        
        // Animation des cartes de projet avec délais progressifs
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.transition = 'all 0.3s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Animation des tags avec délais progressifs
        const tags = document.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            tag.style.transition = 'all 0.3s ease';
            tag.style.transitionDelay = `${index * 0.05}s`;
        });
        
        // Smooth scroll pour les liens d'ancrage
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
        
        // Fonctionnalité pour la photo cliquable
        const clickablePhoto = document.querySelector('.clickable-photo');
        
        if (clickablePhoto) {
            // Effet de hover avancé
            clickablePhoto.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) rotate(2deg)';
            });
            
            clickablePhoto.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
            
            // Animation au clic
            clickablePhoto.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
            
            // Accessibilité - navigation au clavier
            clickablePhoto.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        // Gestion du modal photo
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
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && photoModal.classList.contains('show')) {
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });
            
            // Fermer le modal en cliquant à l'extérieur
            photoModal.addEventListener('click', function(e) {
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
        window.addEventListener('load', function() {
            preloadImage().catch(error => {
                console.warn('Erreur préchargement image:', error);
            });
        });
        
        // Mettre à jour la navigation active au chargement initial
        updateActiveNav();
        
        // Gestion du resize pour recalculer les positions
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateActiveNav, 250);
        });

        // Initialisation des tooltips Bootstrap (si utilisés plus tard)
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        if (tooltipTriggerList.length > 0 && typeof bootstrap.Tooltip !== 'undefined') {
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

    } catch (error) {
        console.error('Erreur dans le script principal:', error);
    }

    // Gestion des erreurs de ressources (images, etc.)
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Image non chargée:', e.target.src);
            // Optionnel: afficher une image de remplacement
            // e.target.src = 'assets/placeholder.jpg';
        }
    }, true);

    // Performance monitoring
    window.addEventListener('load', function() {
        // Log le temps de chargement
        if (window.performance) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Temps de chargement: ${loadTime}ms`);
        }
    });
});
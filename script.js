document.addEventListener('DOMContentLoaded', () => {
    function renderIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    renderIcons();

    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const html = document.documentElement;
    const langButtons = document.querySelectorAll('[data-lang-switch]');
    const savedLang = localStorage.getItem('portfolio-lang') || 'en';

    function syncLanguageButtons(lang) {
        langButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.langSwitch === lang);
        });
    }

    function setLanguage(lang) {
        html.lang = lang;
        localStorage.setItem('portfolio-lang', lang);
        syncLanguageButtons(lang);
    }

    syncLanguageButtons(savedLang);
    setLanguage(savedLang);

    langButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setLanguage(button.dataset.langSwitch);
        });
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.innerHTML = isHidden ? '<i data-lucide="menu"></i>' : '<i data-lucide="x"></i>';
            renderIcons();
        });
    }

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                navbar.classList.add('shadow-sm');
            } else {
                navbar.classList.remove('shadow-sm');
            }
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    const desktopNavLinks = document.querySelectorAll('#navbar nav a[href^="#"]');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a[href^="#"]');

    function updateActiveLink() {
        const navbarHeight = navbar ? navbar.offsetHeight : 72;
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - navbarHeight - 24;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        [...desktopNavLinks, ...mobileNavLinks].forEach((link) => {
            const isActive = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('text-sky', isActive);
            link.classList.toggle('font-semibold', isActive);
            link.classList.toggle('bg-slate-100', isActive && link.closest('#mobile-menu'));
        });
    }

    if (sections.length > 0) {
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.getElementById(targetId.slice(1));
            if (!targetElement) return;

            const navbarHeight = navbar ? navbar.offsetHeight : 72;
            const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: targetTop - navbarHeight - 12,
                behavior: 'smooth'
            });

            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.innerHTML = '<i data-lucide="menu"></i>';
                renderIcons();
            }
        });
    });
});

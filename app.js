```javascript
/* =========================================================
   HAICO TECH & DESIGN
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. SELECT ELEMENTS
       ===================================================== */

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const navbar = document.getElementById("navbar");
    const yearElement = document.getElementById("year");

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section");


    /* =====================================================
       2. CURRENT YEAR
       ===================================================== */

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================================
       3. OPEN MOBILE MENU
       ===================================================== */

    function openMenu() {

        if (!navbar) {
            return;
        }

        navbar.classList.add("active");
        document.body.classList.add("menu-open");

        if (menuBtn) {
            menuBtn.setAttribute("aria-expanded", "true");
        }
    }


    /* =====================================================
       4. CLOSE MOBILE MENU
       ===================================================== */

    function closeMenu() {

        if (!navbar) {
            return;
        }

        navbar.classList.remove("active");
        document.body.classList.remove("menu-open");

        if (menuBtn) {
            menuBtn.setAttribute("aria-expanded", "false");
        }
    }


    /* =====================================================
       5. MENU BUTTON
       ===================================================== */

    if (menuBtn) {

        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            if (navbar && navbar.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }

        });
    }


    /* =====================================================
       6. CLOSE BUTTON
       ===================================================== */

    if (closeBtn) {

        closeBtn.addEventListener("click", function () {
            closeMenu();
        });

    }


    /* =====================================================
       7. CLOSE MENU WHEN NAV LINK IS CLICKED
       ===================================================== */

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            closeMenu();

        });

    });


    /* =====================================================
       8. CLOSE MENU WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener("click", function (event) {

        if (!navbar || !navbar.classList.contains("active")) {
            return;
        }

        const clickedInsideNavbar = navbar.contains(event.target);
        const clickedMenuButton = menuBtn && menuBtn.contains(event.target);

        if (!clickedInsideNavbar && !clickedMenuButton) {
            closeMenu();
        }

    });


    /* =====================================================
       9. ESCAPE KEY CLOSES MENU
       ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    /* =====================================================
       10. CLOSE MOBILE MENU AFTER RESIZE
       ===================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    });


    /* =====================================================
       11. SMOOTH SCROLLING
       ===================================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const header = document.querySelector(".header");

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       12. ACTIVE NAVIGATION
       ===================================================== */

    function updateActiveNavigation() {

        const scrollPosition =
            window.pageYOffset +
            150;

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }

        });


        navLinks.forEach(function (link) {

            link.classList.remove("active-link");

            const linkTarget =
                link.getAttribute("href");

            if (
                linkTarget === "#" + currentSection
            ) {
                link.classList.add("active-link");
            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    updateActiveNavigation();


    /* =====================================================
       13. SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".about-box, .service-card, .project-card, .contact-item"
    );


    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show-element"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


        revealElements.forEach(function (element) {

            element.classList.add(
                "reveal-element"
            );

            observer.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {

            element.classList.add(
                "show-element"
            );

        });

    }


    /* =====================================================
       14. WHATSAPP LINKS
       ===================================================== */

    /*
       WhatsApp links are intentionally NOT intercepted.

       The href values already contain the correct
       phone number and pre-filled messages.

       This prevents JavaScript from accidentally
       changing or breaking WhatsApp messages.
    */

    const whatsappLinks = document.querySelectorAll(
        'a[href*="wa.me"]'
    );


    whatsappLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            console.log(
                "Opening HAICO WhatsApp contact..."
            );

        });

    });


    /* =====================================================
       15. PREVENT DOUBLE SUBMISSION / DOUBLE CLICK
       FOR NORMAL BUTTONS
       ===================================================== */

    const normalButtons = document.querySelectorAll(
        ".btn:not([href*='wa.me'])"
    );


    normalButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            this.classList.add("button-clicked");

            setTimeout(function () {

                button.classList.remove(
                    "button-clicked"
                );

            }, 300);

        });

    });


    /* =====================================================
       16. HANDLE HASH ON PAGE LOAD
       ===================================================== */

    if (window.location.hash) {

        const hashTarget =
            document.querySelector(
                window.location.hash
            );

        if (hashTarget) {

            setTimeout(function () {

                const header =
                    document.querySelector(".header");

                const headerHeight = header
                    ? header.offsetHeight
                    : 0;

                const targetPosition =
                    hashTarget.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }, 100);

        }

    }


    /* =====================================================
       17. LOGO / HOME NAVIGATION
       ===================================================== */

    const homeLinks =
        document.querySelectorAll(
            'a[href="#home"]'
        );


    homeLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            closeMenu();

        });

    });


    /* =====================================================
       18. INITIAL STATE
       ===================================================== */

    closeMenu();


    /* =====================================================
       19. CONSOLE INFORMATION
       ===================================================== */

    console.log(
        "HAICO Tech & Design website loaded successfully."
    );

    console.log(
        "WhatsApp: +255 718 170 176"
    );

});
```

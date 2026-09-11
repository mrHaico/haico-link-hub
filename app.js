```javascript
/* =====================================================
   HAICO TECH AND DESIGN
   APP.JS
===================================================== */


/* =====================================================
   WAIT FOR PAGE TO LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       ELEMENTS
    ================================================= */

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const navbar = document.getElementById("navbar");
    const yearElement = document.getElementById("year");


    /* =================================================
       MOBILE MENU - OPEN
    ================================================= */

    if (menuBtn && navbar) {

        menuBtn.addEventListener("click", function () {

            navbar.classList.add("active");

            document.body.classList.add("menu-open");

        });

    }


    /* =================================================
       MOBILE MENU - CLOSE
    ================================================= */

    if (closeBtn && navbar) {

        closeBtn.addEventListener("click", function () {

            navbar.classList.remove("active");

            document.body.classList.remove("menu-open");

        });

    }


    /* =================================================
       CLOSE MENU AFTER CLICKING NAV LINK
    ================================================= */

    const navLinks = document.querySelectorAll(
        ".navbar a"
    );

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navbar.classList.remove("active");

            document.body.classList.remove("menu-open");

        });

    });


    /* =================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ================================================= */

    document.addEventListener("click", function (event) {

        if (!navbar || !menuBtn) {
            return;
        }

        const clickedInsideNavbar =
            navbar.contains(event.target);

        const clickedMenuButton =
            menuBtn.contains(event.target);

        if (
            navbar.classList.contains("active") &&
            !clickedInsideNavbar &&
            !clickedMenuButton
        ) {

            navbar.classList.remove("active");

            document.body.classList.remove("menu-open");

        }

    });


    /* =================================================
       CURRENT YEAR
    ================================================= */

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =================================================
       WHATSAPP SETTINGS
    ================================================= */

    const whatsappNumber =
        "255718170176";


    /* =================================================
       OPEN WHATSAPP FUNCTION
    ================================================= */

    function openWhatsApp(message) {

        const encodedMessage =
            encodeURIComponent(message);

        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodedMessage;

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =================================================
       SERVICE WHATSAPP MESSAGES
    ================================================= */

    const serviceLinks =
        document.querySelectorAll(
            ".service-link"
        );


    serviceLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();


            const service =
                this.getAttribute("data-service");


            const message =
                "Hello HAICO Tech and Design, " +
                "I am interested in your " +
                service +
                " service. " +
                "Please share more details, " +
                "requirements and pricing.";


            openWhatsApp(message);

        });

    });


    /* =================================================
       SCROLL REVEAL
    ================================================= */

    const revealElements =
        document.querySelectorAll(
            ".about-box, " +
            ".service-card, " +
            ".project-card, " +
            ".contact-item"
        );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "show-element"
                            );

                            observer.unobserve(
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

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {

            element.classList.add(
                "show-element"
            );

        });

    }


    /* =================================================
       ACTIVE NAVIGATION
    ================================================= */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const navigationLinks =
        document.querySelectorAll(
            '.navbar a[href^="#"]'
        );


    function updateActiveNavigation() {

        let currentSection = "";


        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 150;


            const sectionHeight =
                section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navigationLinks.forEach(function (link) {

            link.classList.remove(
                "active-link"
            );


            const target =
                link.getAttribute("href");


            if (
                target === "#" + currentSection
            ) {

                link.classList.add(
                    "active-link"
                );

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );


    updateActiveNavigation();


    /* =================================================
       SMOOTH INTERNAL NAVIGATION
    ================================================= */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetID =
                    this.getAttribute("href");


                if (
                    targetID === "#" ||
                    targetID === ""
                ) {

                    return;

                }


                const targetElement =
                    document.querySelector(targetID);


                if (!targetElement) {

                    return;

                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    targetElement.offsetTop -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


    /* =================================================
       WHATSAPP BUTTON TRACKING
    ================================================= */

    const whatsappButtons =
        document.querySelectorAll(
            'a[href*="wa.me"]'
        );


    whatsappButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                console.log(
                    "WhatsApp button clicked."
                );

            }
        );

    });


    /* =================================================
       ESCAPE KEY CLOSES MOBILE MENU
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                navbar
            ) {

                navbar.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            }

        }
    );


    /* =================================================
       RESIZE HANDLER
    ================================================= */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 900 &&
                navbar
            ) {

                navbar.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            }

        }
    );


    /* =================================================
       CONSOLE INFORMATION
    ================================================= */

    console.log(
        "HAICO Tech and Design website loaded successfully."
    );

    console.log(
        "WhatsApp: +255 718 170 176"
    );

});
```

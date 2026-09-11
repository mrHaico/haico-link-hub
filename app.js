/* =========================================================
   HAICO LINK HUB
   COMPLETE APPLICATION JAVASCRIPT

   PUBLIC WEBSITE
   ADMIN LOGIN
   SUPABASE AUTH
   FORGOT PASSWORD
   RESET PASSWORD
   ADMIN DASHBOARD
   PROJECT CRUD
   PROJECT IMAGE STORAGE
   MESSAGES
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://lhgjvezxmeedbyiibbin.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Nj4CRhnyMm2Psb209Rnq8w_rXiZLBbX";


const WEBSITE_URL =
    "https://mrhaico.github.io/haico-link-hub/";


/* =========================================================
   2. HAICO CONFIGURATION
   ========================================================= */

const HAICO_CONFIG = {

    companyName:
        "HAICO TECH AND DESIGN",

    whatsappNumber:
        "255718170176",

    whatsappMessage:
        "Hello HAICO Tech & Design, I would like to know more about your digital services.",

    email:
        "ayoubhafidhi1@gmail.com",

    projectsTable:
        "projects",

    messagesTable:
        "messages",

    storageBucket:
        "project-images"

};


/* =========================================================
   3. SUPABASE CLIENT
   ========================================================= */

let supabaseClient = null;

let supabaseReady = false;


try {

    if (
        window.supabase &&
        SUPABASE_URL &&
        SUPABASE_PUBLISHABLE_KEY
    ) {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                }
            );

        supabaseReady = true;

    }

} catch (error) {

    console.error(
        "Supabase initialization error:",
        error
    );

}


/* =========================================================
   4. DOM HELPERS
   ========================================================= */

const $ = (selector) =>
    document.querySelector(selector);


const $$ = (selector) =>
    document.querySelectorAll(selector);


function byId(id) {
    return document.getElementById(id);
}


/* =========================================================
   5. GLOBAL STATE
   ========================================================= */

let currentUser = null;

let currentSession = null;

let allProjects = [];

let allMessages = [];

let activeProjectFilter = "all";

let editingProjectId = null;

let projectImageUrl = "";

let isAdminMode = false;


/* =========================================================
   6. PUBLIC WEBSITE ELEMENTS
   ========================================================= */

const publicApp =
    byId("publicApp");

const adminApp =
    byId("adminApp");

const pageLoader =
    byId("pageLoader");

const siteHeader =
    byId("siteHeader");

const mobileMenuBtn =
    byId("mobileMenuBtn");

const mainNav =
    byId("mainNav");

const toast =
    byId("toast");


/* =========================================================
   7. UTILITY
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatDateTime(dateValue) {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function capitalize(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .charAt(0)
        .toUpperCase()
        +
        String(value)
            .slice(1)
            .toLowerCase();
}


/* =========================================================
   8. TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
    message,
    type = "normal"
) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.className =
        "toast show " + type;

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );
}


/* =========================================================
   9. PAGE LOADER
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                pageLoader?.classList.add(
                    "loaded"
                );

            },
            400
        );

    }
);


/* =========================================================
   10. YEAR
   ========================================================= */

const currentYear =
    byId("currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   11. HEADER SCROLL
   ========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!siteHeader) {
            return;
        }

        if (window.scrollY > 30) {

            siteHeader.classList.add(
                "scrolled"
            );

        } else {

            siteHeader.classList.remove(
                "scrolled"
            );

        }

    }
);


/* =========================================================
   12. MOBILE NAVIGATION
   ========================================================= */

mobileMenuBtn?.addEventListener(
    "click",
    () => {

        mainNav?.classList.toggle(
            "open"
        );

    }
);


$$(".nav-link").forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                mainNav?.classList.remove(
                    "open"
                );

            }
        );

    }
);


/* =========================================================
   13. ACTIVE NAVIGATION
   ========================================================= */

const publicSections =
    document.querySelectorAll(
        "#publicApp section[id]"
    );


function updateActiveNav() {

    if (isAdminMode) {
        return;
    }

    let currentSection =
        "home";

    const scrollPosition =
        window.scrollY + 150;


    publicSections.forEach(
        (section) => {

            if (
                scrollPosition >=
                section.offsetTop
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    $$(".nav-link").forEach(
        (link) => {

            link.classList.remove(
                "active"
            );

            const href =
                link.getAttribute("href");

            if (
                href ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =========================================================
   14. REVEAL ANIMATIONS
   ========================================================= */

let revealObserver = null;


function initRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    if (revealObserver) {

        revealObserver.disconnect();

    }


    revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );

        }
    );

}


initRevealAnimations();


/* =========================================================
   15. SUPABASE ERROR HELPERS
   ========================================================= */

function getFriendlyError(error) {

    if (!error) {
        return "Something went wrong.";
    }

    const message =
        error.message || "";


    if (
        message.toLowerCase()
            .includes(
                "invalid login credentials"
            )
    ) {

        return "Incorrect email or password.";

    }


    if (
        message.toLowerCase()
            .includes(
                "email not confirmed"
            )
    ) {

        return "Please confirm your email before signing in.";

    }


    if (
        message.toLowerCase()
            .includes(
                "user not found"
            )
    ) {

        return "No account was found with that email.";

    }


    if (
        message.toLowerCase()
            .includes(
                "password should be at least"
            )
    ) {

        return "Password is too short.";

    }


    if (
        message.toLowerCase()
            .includes(
                "row-level security"
            )
    ) {

        return "Database permission denied. Please check your Supabase RLS policies.";

    }


    return message ||
        "Something went wrong. Please try again.";

}


/* =========================================================
   16. MODAL HELPERS
   ========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );

}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =========================================================
   17. ADMIN LOGIN OPEN
   ========================================================= */

const adminLoginModal =
    byId("adminLoginModal");


function openAdminLogin() {

    isAdminMode = false;

    openModal(
        adminLoginModal
    );

    setTimeout(
        () => {

            byId("adminEmail")?.focus();

        },
        150
    );

}


byId("openAdminLogin")?.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        openAdminLogin();

    }
);


byId("footerAdminLogin")?.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        openAdminLogin();

    }
);


byId("closeAdminLogin")?.addEventListener(
    "click",
    () => {

        closeModal(
            adminLoginModal
        );

    }
);


byId("authBackWebsite")?.addEventListener(
    "click",
    () => {

        closeModal(
            adminLoginModal
        );

        window.location.hash =
            "#home";

    }
);


/* =========================================================
   18. PASSWORD VISIBILITY
   ========================================================= */

byId("toggleAdminPassword")
    ?.addEventListener(
        "click",
        () => {

            const input =
                byId("adminPassword");

            const button =
                byId("toggleAdminPassword");


            if (!input || !button) {
                return;
            }


            if (
                input.type ===
                "password"
            ) {

                input.type = "text";

                button.textContent =
                    "🙈";

            } else {

                input.type =
                    "password";

                button.textContent =
                    "👁";

            }

        }
    );


/* =========================================================
   19. LOGIN ALERT
   ========================================================= */

function showLoginAlert(
    message,
    type = "error"
) {

    const alert =
        byId("loginAlert");

    if (!alert) {
        return;
    }

    alert.textContent =
        message;

    alert.className =
        "auth-alert show " +
        type;

}


function hideLoginAlert() {

    const alert =
        byId("loginAlert");

    if (!alert) {
        return;
    }

    alert.textContent = "";

    alert.className =
        "auth-alert";

}


/* =========================================================
   20. ADMIN LOGIN
   ========================================================= */

byId("loginForm")
    ?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideLoginAlert();


            if (!supabaseReady) {

                showLoginAlert(
                    "Supabase is not configured correctly."
                );

                return;

            }


            const email =
                byId("adminEmail")
                    .value
                    .trim();

            const password =
                byId("adminPassword")
                    .value;


            if (!email || !password) {

                showLoginAlert(
                    "Please enter your email and password."
                );

                return;

            }


            const submitButton =
                byId("adminLoginSubmit");

            const submitText =
                byId("loginSubmitText");


            submitButton.disabled =
                true;

            submitButton.classList.add(
                "loading"
            );

            submitText.textContent =
                "Signing In...";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });


                if (error) {
                    throw error;
                }


                currentSession =
                    data.session;

                currentUser =
                    data.user;


                showLoginAlert(
                    "Login successful. Opening dashboard...",
                    "success"
                );


                setTimeout(
                    () => {

                        closeModal(
                            adminLoginModal
                        );

                        showAdminDashboard(
                            currentUser
                        );

                    },
                    650
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showLoginAlert(
                    getFriendlyError(
                        error
                    )
                );


                submitButton.disabled =
                    false;

                submitButton.classList.remove(
                    "loading"
                );

                submitText.textContent =
                    "Sign In";

            }

        }
    );


/* =========================================================
   21. FORGOT PASSWORD
   ========================================================= */

const forgotPasswordModal =
    byId("forgotPasswordModal");


byId("forgotPasswordBtn")
    ?.addEventListener(
        "click",
        () => {

            const loginEmail =
                byId("adminEmail")?.value
                    ?.trim() || "";

            byId("forgotEmail").value =
                loginEmail;

            hideForgotAlert();

            closeModal(
                adminLoginModal
            );

            openModal(
                forgotPasswordModal
            );

        }
    );


byId("closeForgotPassword")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                forgotPasswordModal
            );

        }
    );


byId("backToLogin")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                forgotPasswordModal
            );

            openModal(
                adminLoginModal
            );

        }
    );


function showForgotAlert(
    message,
    type = "error"
) {

    const alert =
        byId("forgotAlert");

    if (!alert) {
        return;
    }

    alert.textContent =
        message;

    alert.className =
        "auth-alert show " +
        type;

}


function hideForgotAlert() {

    const alert =
        byId("forgotAlert");

    if (!alert) {
        return;
    }

    alert.textContent = "";

    alert.className =
        "auth-alert";

}


/* =========================================================
   22. SEND PASSWORD RESET EMAIL
   ========================================================= */

byId("forgotForm")
    ?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideForgotAlert();


            if (!supabaseReady) {

                showForgotAlert(
                    "Supabase is not configured."
                );

                return;

            }


            const email =
                byId("forgotEmail")
                    .value
                    .trim();


            if (!email) {

                showForgotAlert(
                    "Please enter your admin email."
                );

                return;

            }


            const button =
                byId("forgotSubmit");

            const text =
                byId("forgotSubmitText");


            button.disabled = true;

            button.classList.add(
                "loading"
            );

            text.textContent =
                "Sending...";


            try {

                /*
                 * IMPORTANT:
                 * Because this project uses only index.html,
                 * password recovery returns to the SAME website.
                 */

                const redirectUrl =
                    WEBSITE_URL +
                    "#reset-password";


                const {
                    error
                } =
                    await supabaseClient.auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    redirectUrl
                            }
                        );


                if (error) {
                    throw error;
                }


                showForgotAlert(
                    "Password reset link sent. Check your email.",
                    "success"
                );


                text.textContent =
                    "Email Sent";


                setTimeout(
                    () => {

                        closeModal(
                            forgotPasswordModal
                        );

                        button.disabled =
                            false;

                        button.classList.remove(
                            "loading"
                        );

                        text.textContent =
                            "Send Reset Link";

                    },
                    3000
                );


            } catch (error) {

                console.error(
                    "Reset email error:",
                    error
                );


                showForgotAlert(
                    getFriendlyError(
                        error
                    )
                );


                button.disabled =
                    false;

                button.classList.remove(
                    "loading"
                );

                text.textContent =
                    "Send Reset Link";

            }

        }
    );


/* =========================================================
   23. PASSWORD RESET MODAL
   ========================================================= */

const resetPasswordModal =
    byId("resetPasswordModal");


function showResetPasswordScreen() {

    openModal(
        resetPasswordModal
    );

}


function hideResetAlert() {

    const alert =
        byId("resetAlert");

    if (!alert) {
        return;
    }

    alert.textContent = "";

    alert.className =
        "auth-alert";

}


function showResetAlert(
    message,
    type = "error"
) {

    const alert =
        byId("resetAlert");

    if (!alert) {
        return;
    }

    alert.textContent =
        message;

    alert.className =
        "auth-alert show " +
        type;

}


/* =========================================================
   24. PASSWORD UPDATE
   ========================================================= */

byId("resetForm")
    ?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideResetAlert();


            const password =
                byId("newPassword")
                    .value;

            const confirm =
                byId("confirmPassword")
                    .value;


            if (password.length < 6) {

                showResetAlert(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            if (password !== confirm) {

                showResetAlert(
                    "Passwords do not match."
                );

                return;

            }


            const button =
                byId("resetSubmit");

            button.disabled =
                true;

            button.textContent =
                "Updating...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .updateUser({
                            password
                        });


                if (error) {
                    throw error;
                }


                showResetAlert(
                    "Password updated successfully.",
                    "success"
                );


                setTimeout(
                    async () => {

                        closeModal(
                            resetPasswordModal
                        );

                        await supabaseClient.auth
                            .signOut();

                        openAdminLogin();

                    },
                    1800
                );


            } catch (error) {

                console.error(
                    "Password update error:",
                    error
                );


                showResetAlert(
                    getFriendlyError(
                        error
                    )
                );


                button.disabled =
                    false;

                button.textContent =
                    "Update Password";

            }

        }
    );


/* =========================================================
   25. CHECK PASSWORD RECOVERY URL
   ========================================================= */

async function checkRecoveryMode() {

    if (!supabaseReady) {
        return;
    }


    /*
     * Supabase can put the recovery session in the URL.
     * We listen for PASSWORD_RECOVERY below.
     */

    try {

        const {
            data
        } =
            await supabaseClient.auth
                .getSession();


        if (
            window.location.hash
                .includes(
                    "reset-password"
                ) &&
            data?.session
        ) {

            showResetPasswordScreen();

        }

    } catch (error) {

        console.error(
            "Recovery check error:",
            error
        );

    }

}


/* =========================================================
   26. SUPABASE AUTH STATE
   ========================================================= */

if (supabaseReady) {

    supabaseClient.auth
        .onAuthStateChange(
            async (event, session) => {

                currentSession =
                    session;

                currentUser =
                    session?.user || null;


                if (
                    event ===
                    "PASSWORD_RECOVERY"
                ) {

                    showResetPasswordScreen();

                    return;

                }


                if (
                    event ===
                    "SIGNED_OUT"
                ) {

                    currentUser =
                        null;

                    currentSession =
                        null;

                    showPublicWebsite();

                }

            }
        );

}


/* =========================================================
   27. INITIAL SESSION CHECK
   ========================================================= */

async function initializeAuthentication() {

    if (!supabaseReady) {

        console.warn(
            "Supabase is not ready."
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .getSession();


        if (error) {
            throw error;
        }


        currentSession =
            data.session;

        currentUser =
            data.session?.user || null;


        if (
            currentUser &&
            window.location.hash ===
            "#admin"
        ) {

            showAdminDashboard(
                currentUser
            );

        }


        await checkRecoveryMode();


    } catch (error) {

        console.error(
            "Session initialization error:",
            error
        );

    }

}


initializeAuthentication();


/* =========================================================
   28. SHOW ADMIN DASHBOARD
   ========================================================= */

async function showAdminDashboard(user) {

    if (!user) {

        openAdminLogin();

        return;

    }


    isAdminMode = true;


    publicApp.classList.add(
        "hidden"
    );

    adminApp.classList.remove(
        "hidden"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "instant"
        }
    );


    updateAdminProfile(
        user
    );


    updateAdminDate();


    await loadProjects();

    await loadMessages();

    await updateDashboard();


    byId("storageStatus").textContent =
        "Connected";

    byId("storageStatus").className =
        "status-pill success";


    window.location.hash =
        "admin";

}


/* =========================================================
   29. SHOW PUBLIC WEBSITE
   ========================================================= */

function showPublicWebsite() {

    isAdminMode = false;

    adminApp.classList.add(
        "hidden"
    );

    publicApp.classList.remove(
        "hidden"
    );


    window.location.hash = "";

    window.scrollTo(
        {
            top: 0,
            behavior: "instant"
        }
    );


    initRevealAnimations();

}


/* =========================================================
   30. ADMIN PROFILE
   ========================================================= */

function updateAdminProfile(user) {

    if (!user) {
        return;
    }


    const email =
        user.email || "Administrator";


    const metadata =
        user.user_metadata || {};


    const fullName =
        metadata.full_name ||
        metadata.name ||
        "Administrator";


    byId("adminUserEmail").textContent =
        email;


    byId("sidebarAdminName").textContent =
        fullName;


    byId("profileName").textContent =
        fullName;


    byId("profileEmail").textContent =
        email;


    byId("detailEmail").textContent =
        email;


    byId("detailUserId").textContent =
        user.id || "—";


    byId("detailCreated").textContent =
        formatDateTime(
            user.created_at
        );


    byId("detailLastLogin").textContent =
        formatDateTime(
            user.last_sign_in_at
        );


    const firstLetter =
        fullName
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "H";


    byId("sidebarAvatar").textContent =
        firstLetter;


    byId("profileAvatar").textContent =
        firstLetter;


    const hour =
        new Date().getHours();


    let greeting =
        "Welcome back";


    if (hour < 12) {

        greeting =
            "Good morning";

    } else if (hour < 18) {

        greeting =
            "Good afternoon";

    } else {

        greeting =
            "Good evening";

    }


    byId("adminGreeting").textContent =
        `${greeting}, ${fullName}. Welcome to your admin dashboard.`;

}


/* =========================================================
   31. ADMIN DATE
   ========================================================= */

function updateAdminDate() {

    const date =
        new Date();


    const formatted =
        date.toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    byId("dashboardDate").textContent =
        formatted;

}


/* =========================================================
   32. ADMIN NAVIGATION
   ========================================================= */

$$(".admin-nav-item")
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.adminPage;

                    switchAdminPage(
                        page
                    );


                    byId("adminSidebar")
                        ?.classList.remove(
                            "open"
                        );

                }
            );

        }
    );


function switchAdminPage(page) {

    $$(".admin-nav-item")
        .forEach(
            (button) => {

                button.classList.toggle(
                    "active",
                    button.dataset.adminPage ===
                    page
                );

            }
        );


    $$(".admin-page")
        .forEach(
            (section) => {

                section.classList.remove(
                    "active"
                );

            }
        );


    const pageMap = {

        dashboard:
            "adminDashboardPage",

        projects:
            "adminProjectsPage",

        messages:
            "adminMessagesPage",

        profile:
            "adminProfilePage",

        settings:
            "adminSettingsPage"

    };


    const target =
        byId(
            pageMap[page]
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    if (page === "projects") {

        renderAdminProjects();

    }


    if (page === "messages") {

        renderAdminMessages();

    }

}


/* =========================================================
   33. ADMIN SIDEBAR TOGGLE
   ========================================================= */

byId("adminSidebarToggle")
    ?.addEventListener(
        "click",
        () => {

            byId("adminSidebar")
                ?.classList.toggle(
                    "open"
                );

        }
    );


/* =========================================================
   34. BACK TO PUBLIC WEBSITE
   ========================================================= */

byId("backToWebsite")
    ?.addEventListener(
        "click",
        () => {

            showPublicWebsite();

        }
    );


/* =========================================================
   35. QUICK ACTIONS
   ========================================================= */

$$("[data-admin-action]")
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.adminAction;

                    switchAdminPage(
                        action
                    );

                }
            );

        }
    );


/* =========================================================
   36. LOGOUT
   ========================================================= */

async function logoutAdmin() {

    if (!supabaseReady) {

        showPublicWebsite();

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient.auth
                .signOut();


        if (error) {
            throw error;
        }


        showToast(
            "You have been signed out.",
            "success"
        );


        showPublicWebsite();


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        showToast(
            getFriendlyError(
                error
            ),
            "error"
        );

    }

}


byId("logoutBtn")
    ?.addEventListener(
        "click",
        logoutAdmin
    );


byId("settingsLogout")
    ?.addEventListener(
        "click",
        logoutAdmin
    );


/* =========================================================
   37. SETTINGS PASSWORD RESET
   ========================================================= */

byId("settingsResetPassword")
    ?.addEventListener(
        "click",
        async () => {

            if (
                !currentUser?.email
            ) {

                showToast(
                    "No authenticated admin email found.",
                    "error"
                );

                return;

            }


            try {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .resetPasswordForEmail(
                            currentUser.email,
                            {
                                redirectTo:
                                    WEBSITE_URL +
                                    "#reset-password"
                            }
                        );


                if (error) {
                    throw error;
                }


                showToast(
                    "Password reset email sent.",
                    "success"
                );


            } catch (error) {

                showToast(
                    getFriendlyError(
                        error
                    ),
                    "error"
                );

            }

        }
    );


/* =========================================================
   38. LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    if (!supabaseReady) {

        allProjects = [];

        renderPublicProjects();

        renderAdminProjects();

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    HAICO_CONFIG.projectsTable
                )
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {
            throw error;
        }


        allProjects =
            Array.isArray(data)
                ? data
                : [];


    } catch (error) {

        console.error(
            "Load projects error:",
            error
        );


        allProjects = [];


        renderProjectLoadError(
            error
        );

    }


    renderPublicProjects();

    renderAdminProjects();

    renderRecentProjects();

}


/* =========================================================
   39. PUBLIC PROJECTS
   ========================================================= */

function renderPublicProjects() {

    const grid =
        byId("projectsGrid");

    if (!grid) {
        return;
    }


    let projects =
        allProjects;


    if (
        activeProjectFilter !==
        "all"
    ) {

        projects =
            allProjects.filter(
                (project) =>
                    String(
                        project.category ||
                        ""
                    ).toLowerCase() ===
                    activeProjectFilter
            );

    }


    if (!projects.length) {

        grid.innerHTML = `
            <div class="empty-state">
                <div class="service-icon">
                    📁
                </div>

                <h3>
                    No projects available yet
                </h3>

                <p>
                    Projects added from the admin dashboard
                    will appear here.
                </p>
            </div>
        `;

        return;

    }


    grid.innerHTML =
        projects
            .map(
                (project) =>
                    createPublicProjectCard(
                        project
                    )
            )
            .join("");


    grid
        .querySelectorAll(
            "[data-view-project]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset
                                .viewProject;

                        openProjectView(
                            id
                        );

                    }
                );

            }
        );

}


function createPublicProjectCard(
    project
) {

    const title =
        escapeHTML(
            project.title ||
            "Untitled Project"
        );


    const description =
        escapeHTML(
            project.description ||
            ""
        );


    const category =
        escapeHTML(
            capitalize(
                project.category ||
                "Project"
            )
        );


    const year =
        escapeHTML(
            project.year ||
            ""
        );


    const image =
        project.image_url ||
        project.image ||
        "";


    const imageHTML =
        image
            ? `
                <img
                    src="${escapeHTML(image)}"
                    alt="${title}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.parentElement.querySelector('.project-placeholder').style.display='flex';"
                >

                <div
                    class="project-placeholder"
                    style="display:none;"
                >
                    H
                </div>
            `
            : `
                <div class="project-placeholder">
                    H
                </div>
            `;


    return `
        <article class="project-card reveal visible">

            <div class="project-image">
                ${imageHTML}
            </div>

            <div class="project-body">

                <span class="project-category">
                    ${category}
                </span>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

                <div class="project-footer">

                    <span class="project-year">
                        ${year || "HAICO TECH"}
                    </span>

                    <button
                        type="button"
                        class="project-view-btn"
                        data-view-project="${escapeHTML(project.id)}"
                    >
                        View Project →
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   40. PROJECT FILTERS
   ========================================================= */

$$(".filter-btn")
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    $$(".filter-btn")
                        .forEach(
                            (item) => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    activeProjectFilter =
                        button.dataset.filter ||
                        "all";


                    renderPublicProjects();

                }
            );

        }
    );


/* =========================================================
   41. PROJECT VIEW
   ========================================================= */

function openProjectView(id) {

    const project =
        allProjects.find(
            (item) =>
                String(item.id) ===
                String(id)
        );


    if (!project) {

        showToast(
            "Project could not be found.",
            "error"
        );

        return;

    }


    const image =
        project.image_url ||
        project.image ||
        "";


    const imageElement =
        byId("viewProjectImage");


    if (image) {

        imageElement.src =
            image;

        imageElement.alt =
            project.title ||
            "Project";

    } else {

        imageElement.src =
            "";

        imageElement.alt =
            "No project image";

    }


    byId("viewProjectCategory")
        .textContent =
        capitalize(
            project.category ||
            "Project"
        );


    byId("viewProjectTitle")
        .textContent =
        project.title ||
        "Untitled Project";


    byId("viewProjectDescription")
        .textContent =
        project.description ||
        "No description available.";


    byId("viewProjectYear")
        .textContent =
        project.year ||
        "HAICO TECH AND DESIGN";


    const link =
        byId("viewProjectLink");


    if (project.project_url) {

        link.href =
            project.project_url;

        link.style.display =
            "inline-flex";

    } else {

        link.removeAttribute(
            "href"
        );

        link.style.display =
            "none";

    }


    openModal(
        byId("projectViewModal")
    );

}


byId("closeProjectView")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                byId("projectViewModal")
            );

        }
    );


/* =========================================================
   42. CONTACT FORM
   ========================================================= */

byId("contactForm")
    ?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                byId("contactName")
                    .value
                    .trim();

            const email =
                byId("contactEmail")
                    .value
                    .trim();

            const phone =
                byId("contactPhone")
                    .value
                    .trim();

            const service =
                byId("contactService")
                    .value
                    .trim();

            const message =
                byId("contactMessage")
                    .value
                    .trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                showToast(
                    "Please complete the required fields.",
                    "error"
                );

                return;

            }


            const submitButton =
                byId("contactSubmit");


            submitButton.disabled =
                true;


            const originalHTML =
                submitButton.innerHTML;


            submitButton.innerHTML =
                "Sending...";


            try {

                if (!supabaseReady) {

                    /*
                     * If database is unavailable,
                     * use WhatsApp as fallback.
                     */

                    const whatsappText =
                        encodeURIComponent(
                            `Hello HAICO Tech & Design.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Service: ${service || "Not specified"}

Message:
${message}`
                        );


                    window.open(
                        `https://wa.me/${HAICO_CONFIG.whatsappNumber}?text=${whatsappText}`,
                        "_blank"
                    );


                    showToast(
                        "Opening WhatsApp...",
                        "success"
                    );


                } else {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from(
                                HAICO_CONFIG.messagesTable
                            )
                            .insert([
                                {
                                    name,
                                    email,
                                    phone,
                                    service,
                                    message
                                }
                            ]);


                    if (error) {
                        throw error;
                    }


                    byId("contactForm")
                        .reset();


                    showToast(
                        "Your message has been sent successfully.",
                        "success"
                    );

                }


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                /*
                 * WhatsApp fallback
                 */

                const whatsappText =
                    encodeURIComponent(
                        `Hello HAICO Tech & Design.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Service: ${service || "Not specified"}

Message:
${message}`
                    );


                window.open(
                    `https://wa.me/${HAICO_CONFIG.whatsappNumber}?text=${whatsappText}`,
                    "_blank"
                );


                showToast(
                    "Database unavailable. Opening WhatsApp instead.",
                    "error"
                );

            }


            submitButton.disabled =
                false;

            submitButton.innerHTML =
                originalHTML;

        }
    );


/* =========================================================
   43. ADMIN PROJECT MODAL
   ========================================================= */

const projectModal =
    byId("projectModal");


byId("addProjectBtn")
    ?.addEventListener(
        "click",
        () => {

            openAddProjectModal();

        }
    );


function openAddProjectModal() {

    editingProjectId =
        null;

    projectImageUrl =
        "";


    byId("projectForm").reset();

    byId("projectId").value =
        "";

    byId("projectModalTitle")
        .textContent =
        "Add Project";


    byId("saveProjectText")
        .textContent =
        "Save Project";


    byId("projectImagePreview")
        .innerHTML =
        "";

    byId("projectImagePreview")
        .classList.remove(
            "show"
        );


    hideProjectFormAlert();


    openModal(
        projectModal
    );

}


/* =========================================================
   44. EDIT PROJECT
   ========================================================= */

function openEditProjectModal(id) {

    const project =
        allProjects.find(
            (item) =>
                String(item.id) ===
                String(id)
        );


    if (!project) {

        showToast(
            "Project not found.",
            "error"
        );

        return;

    }


    editingProjectId =
        project.id;


    projectImageUrl =
        project.image_url ||
        project.image ||
        "";


    byId("projectId").value =
        project.id || "";


    byId("projectTitle").value =
        project.title || "";


    byId("projectCategory").value =
        project.category || "";


    byId("projectYear").value =
        project.year || "";


    byId("projectDescription").value =
        project.description || "";


    byId("projectUrl").value =
        project.project_url || "";


    byId("projectImage").value =
        "";


    byId("projectModalTitle")
        .textContent =
        "Edit Project";


    byId("saveProjectText")
        .textContent =
        "Update Project";


    if (projectImageUrl) {

        byId("projectImagePreview")
            .innerHTML =
            `
                <img
                    src="${escapeHTML(projectImageUrl)}"
                    alt="Project preview"
                >
            `;

        byId("projectImagePreview")
            .classList.add(
                "show"
            );

    } else {

        byId("projectImagePreview")
            .innerHTML =
            "";

        byId("projectImagePreview")
            .classList.remove(
                "show"
            );

    }


    hideProjectFormAlert();

    openModal(
        projectModal
    );

}


/* =========================================================
   45. PROJECT IMAGE PREVIEW
   ========================================================= */

byId("projectImage")
    ?.addEventListener(
        "change",
        () => {

            const file =
                byId("projectImage")
                    .files?.[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showProjectFormAlert(
                    "Please select an image file."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    byId(
                        "projectImagePreview"
                    ).innerHTML =
                        `
                            <img
                                src="${event.target.result}"
                                alt="Preview"
                            >
                        `;


                    byId(
                        "projectImagePreview"
                    ).classList.add(
                        "show"
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );


/* =========================================================
   46. PROJECT FORM ALERT
   ========================================================= */

function showProjectFormAlert(
    message,
    type = "error"
) {

    const alert =
        byId("projectFormAlert");

    if (!alert) {
        return;
    }

    alert.textContent =
        message;

    alert.className =
        "auth-alert show " +
        type;

}


function hideProjectFormAlert() {

    const alert =
        byId("projectFormAlert");

    if (!alert) {
        return;
    }

    alert.textContent = "";

    alert.className =
        "auth-alert";

}


/* =========================================================
   47. CLOSE PROJECT MODAL
   ========================================================= */

byId("closeProjectModal")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                projectModal
            );

        }
    );


byId("cancelProject")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                projectModal
            );

        }
    );


/* =========================================================
   48. UPLOAD PROJECT IMAGE
   ========================================================= */

async function uploadProjectImage(
    file
) {

    if (!file) {
        return projectImageUrl || "";
    }


    if (!supabaseReady) {

        throw new Error(
            "Supabase is not configured."
        );

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const safeExtension =
        extension || "jpg";


    const fileName =
        `project-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}.${safeExtension}`;


    const filePath =
        `projects/${fileName}`;


    const {
        error
    } =
        await supabaseClient.storage
            .from(
                HAICO_CONFIG.storageBucket
            )
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (error) {
        throw error;
    }


    const {
        data
    } =
        supabaseClient.storage
            .from(
                HAICO_CONFIG.storageBucket
            )
            .getPublicUrl(
                filePath
            );


    return data?.publicUrl || "";

}


/* =========================================================
   49. SAVE PROJECT
   ========================================================= */

byId("projectForm")
    ?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideProjectFormAlert();


            if (!currentUser) {

                showProjectFormAlert(
                    "Please login as administrator first."
                );

                return;

            }


            if (!supabaseReady) {

                showProjectFormAlert(
                    "Supabase is not available."
                );

                return;

            }


            const title =
                byId("projectTitle")
                    .value
                    .trim();

            const category =
                byId("projectCategory")
                    .value
                    .trim();

            const year =
                byId("projectYear")
                    .value
                    .trim();

            const description =
                byId("projectDescription")
                    .value
                    .trim();

            const projectUrl =
                byId("projectUrl")
                    .value
                    .trim();

            const imageFile =
                byId("projectImage")
                    .files?.[0];


            if (
                !title ||
                !category ||
                !description
            ) {

                showProjectFormAlert(
                    "Please complete all required fields."
                );

                return;

            }


            const saveButton =
                byId("saveProjectBtn");

            const saveText =
                byId("saveProjectText");


            saveButton.disabled =
                true;

            saveButton.classList.add(
                "loading"
            );

            saveText.textContent =
                editingProjectId
                    ? "Updating..."
                    : "Saving...";


            try {

                let finalImageUrl =
                    projectImageUrl || null;


                if (imageFile) {

                    finalImageUrl =
                        await uploadProjectImage(
                            imageFile
                        );

                }


                const payload = {

                    title,

                    category,

                    year:
                        year || null,

                    description,

                    project_url:
                        projectUrl || null,

                    image_url:
                        finalImageUrl

                };


                if (editingProjectId) {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from(
                                HAICO_CONFIG.projectsTable
                            )
                            .update(
                                payload
                            )
                            .eq(
                                "id",
                                editingProjectId
                            );


                    if (error) {
                        throw error;
                    }


                    showToast(
                        "Project updated successfully.",
                        "success"
                    );


                } else {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from(
                                HAICO_CONFIG.projectsTable
                            )
                            .insert([
                                payload
                            ]);


                    if (error) {
                        throw error;
                    }


                    showToast(
                        "Project added successfully.",
                        "success"
                    );

                }


                closeModal(
                    projectModal
                );


                await loadProjects();

                await updateDashboard();


            } catch (error) {

                console.error(
                    "Save project error:",
                    error
                );


                showProjectFormAlert(
                    getFriendlyError(
                        error
                    )
                );

            }


            saveButton.disabled =
                false;

            saveButton.classList.remove(
                "loading"
            );

            saveText.textContent =
                editingProjectId
                    ? "Update Project"
                    : "Save Project";

        }
    );


/* =========================================================
   50. DELETE PROJECT
   ========================================================= */

async function deleteProject(id) {

    const project =
        allProjects.find(
            (item) =>
                String(item.id) ===
                String(id)
        );


    if (!project) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${project.title || "this project"}"?\n\nThis action cannot be undone.`
        );


    if (!confirmed) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from(
                    HAICO_CONFIG.projectsTable
                )
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {
            throw error;
        }


        showToast(
            "Project deleted successfully.",
            "success"
        );


        await loadProjects();

        await updateDashboard();


    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        showToast(
            getFriendlyError(
                error
            ),
            "error"
        );

    }

}


/* =========================================================
   51. ADMIN PROJECTS TABLE
   ========================================================= */

function renderAdminProjects() {

    const container =
        byId("adminProjectsList");

    if (!container) {
        return;
    }


    if (!allProjects.length) {

        container.innerHTML =
            `
                <div class="empty-mini">
                    No projects yet.
                    Click "Add Project" to create your first project.
                </div>
            `;

        return;

    }


    container.innerHTML = `
        <table class="admin-table">

            <thead>

                <tr>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                ${allProjects
                    .map(
                        (project) =>
                            createAdminProjectRow(
                                project
                            )
                    )
                    .join("")}

            </tbody>

        </table>
    `;


    container
        .querySelectorAll(
            "[data-edit-project]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        openEditProjectModal(
                            button.dataset
                                .editProject
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-delete-project]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteProject(
                            button.dataset
                                .deleteProject
                        );

                    }
                );

            }
        );

}


function createAdminProjectRow(
    project
) {

    const title =
        escapeHTML(
            project.title ||
            "Untitled"
        );


    const category =
        escapeHTML(
            project.category ||
            "project"
        );


    const year =
        escapeHTML(
            project.year ||
            "—"
        );


    const image =
        project.image_url ||
        project.image ||
        "";


    const imageHTML =
        image
            ? `
                <img
                    class="table-project-image"
                    src="${escapeHTML(image)}"
                    alt=""
                >
            `
            : `
                <div class="table-project-placeholder">
                    H
                </div>
            `;


    return `
        <tr>

            <td>

                <div class="table-project">

                    ${imageHTML}

                    <div>
                        <strong>
                            ${title}
                        </strong>

                        <small>
                            ${escapeHTML(
                                project.project_url ||
                                "No project link"
                            )}
                        </small>
                    </div>

                </div>

            </td>


            <td>
                <span class="category-badge">
                    ${category}
                </span>
            </td>


            <td>
                ${year}
            </td>


            <td>
                ${formatDate(
                    project.created_at
                )}
            </td>


            <td>

                <div class="table-actions">

                    <button
                        type="button"
                        class="table-action"
                        title="Edit"
                        data-edit-project="${escapeHTML(project.id)}"
                    >
                        ✏️
                    </button>


                    <button
                        type="button"
                        class="table-action delete"
                        title="Delete"
                        data-delete-project="${escapeHTML(project.id)}"
                    >
                        🗑️
                    </button>

                </div>

            </td>

        </tr>
    `;

}


/* =========================================================
   52. RECENT PROJECTS
   ========================================================= */

function renderRecentProjects() {

    const container =
        byId("recentProjects");

    if (!container) {
        return;
    }


    const recent =
        allProjects.slice(
            0,
            5
        );


    if (!recent.length) {

        container.innerHTML =
            `
                <div class="empty-mini">
                    No projects yet.
                </div>
            `;

        return;

    }


    container.innerHTML =
        recent
            .map(
                (project) =>
                    `
                    <div class="message-card">

                        <div>

                            <h4>
                                ${escapeHTML(
                                    project.title ||
                                    "Untitled Project"
                                )}
                            </h4>

                            <div class="message-meta">
                                ${capitalize(
                                    project.category ||
                                    "Project"
                                )}
                                •
                                ${formatDate(
                                    project.created_at
                                )}
                            </div>

                        </div>

                        <button
                            type="button"
                            class="card-link"
                            data-recent-edit="${escapeHTML(project.id)}"
                        >
                            Edit
                        </button>

                    </div>
                    `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-recent-edit]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        switchAdminPage(
                            "projects"
                        );

                        openEditProjectModal(
                            button.dataset
                                .recentEdit
                        );

                    }
                );

            }
        );

}


/* =========================================================
   53. PROJECT LOAD ERROR
   ========================================================= */

function renderProjectLoadError(
    error
) {

    const grid =
        byId("projectsGrid");

    if (!grid) {
        return;
    }


    grid.innerHTML =
        `
            <div class="empty-state">

                <div class="service-icon">
                    ⚠️
                </div>

                <h3>
                    Projects could not be loaded
                </h3>

                <p>
                    Please check the Supabase projects table
                    and its RLS policies.
                </p>

            </div>
        `;

}


/* =========================================================
   54. LOAD MESSAGES
   ========================================================= */

async function loadMessages() {

    if (!supabaseReady) {

        allMessages = [];

        renderAdminMessages();

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    HAICO_CONFIG.messagesTable
                )
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {
            throw error;
        }


        allMessages =
            Array.isArray(data)
                ? data
                : [];


    } catch (error) {

        console.error(
            "Load messages error:",
            error
        );


        allMessages = [];

    }


    renderAdminMessages();

    renderRecentMessages();

}


/* =========================================================
   55. RENDER ADMIN MESSAGES
   ========================================================= */

function renderAdminMessages() {

    const container =
        byId("adminMessagesList");

    if (!container) {
        return;
    }


    if (!allMessages.length) {

        container.innerHTML =
            `
                <div class="empty-mini">
                    No messages received yet.
                </div>
            `;

        return;

    }


    container.innerHTML =
        allMessages
            .map(
                (message) =>
                    createMessageCard(
                        message
                    )
            )
            .join("");

}


function createMessageCard(
    message
) {

    const name =
        escapeHTML(
            message.name ||
            "Unknown"
        );


    const email =
        escapeHTML(
            message.email ||
            ""
        );


    const phone =
        escapeHTML(
            message.phone ||
            ""
        );


    const service =
        escapeHTML(
            message.service ||
            "General Inquiry"
        );


    const text =
        escapeHTML(
            message.message ||
            ""
        );


    const emailLink =
        message.email
            ? `
                <a
                    href="mailto:${encodeURIComponent(message.email)}"
                >
                    Email
                </a>
            `
            : "";


    const phoneLink =
        message.phone
            ? `
                <a
                    href="tel:${escapeHTML(message.phone)}"
                >
                    Call
                </a>
            `
            : "";


    return `
        <article class="message-card">

            <div>

                <h4>
                    ${name}
                </h4>

                <div class="message-meta">
                    ${email}
                    ${phone ? ` • ${phone}` : ""}
                    •
                    ${formatDateTime(
                        message.created_at
                    )}
                </div>

                <span class="message-service">
                    ${service}
                </span>

                <p class="message-text">
                    ${text}
                </p>

            </div>


            <div class="message-actions">

                ${emailLink}

                ${phoneLink}

            </div>

        </article>
    `;

}


/* =========================================================
   56. RECENT MESSAGES
   ========================================================= */

function renderRecentMessages() {

    const container =
        byId("recentMessages");

    if (!container) {
        return;
    }


    const recent =
        allMessages.slice(
            0,
            5
        );


    if (!recent.length) {

        container.innerHTML =
            `
                <div class="empty-mini">
                    No messages yet.
                </div>
            `;

        return;

    }


    container.innerHTML =
        recent
            .map(
                (message) =>
                    `
                    <div class="message-card">

                        <div>

                            <h4>
                                ${escapeHTML(
                                    message.name ||
                                    "Unknown"
                                )}
                            </h4>

                            <div class="message-meta">
                                ${escapeHTML(
                                    message.email ||
                                    ""
                                )}
                                •
                                ${formatDate(
                                    message.created_at
                                )}
                            </div>

                            <p class="message-text">
                                ${escapeHTML(
                                    message.message ||
                                    ""
                                )}
                            </p>

                        </div>

                    </div>
                    `
            )
            .join("");

}


/* =========================================================
   57. REFRESH MESSAGES
   ========================================================= */

byId("refreshMessagesBtn")
    ?.addEventListener(
        "click",
        async () => {

            await loadMessages();

            await updateDashboard();

            showToast(
                "Messages refreshed.",
                "success"
            );

        }
    );


/* =========================================================
   58. DASHBOARD UPDATE
   ========================================================= */

async function updateDashboard() {

    byId("totalProjects").textContent =
        allProjects.length;


    byId("totalMessages").textContent =
        allMessages.length;


    byId("messageCount").textContent =
        allMessages.length > 99
            ? "99+"
            : allMessages.length;


    renderRecentProjects();

    renderRecentMessages();

}


/* =========================================================
   59. CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

[
    adminLoginModal,
    forgotPasswordModal,
    resetPasswordModal,
    projectModal,
    byId("projectViewModal")
]
    .forEach(
        (modal) => {

            modal?.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        modal
                    ) {

                        /*
                         * Do not close reset-password
                         * accidentally.
                         */

                        if (
                            modal ===
                            resetPasswordModal
                        ) {

                            return;

                        }


                        closeModal(
                            modal
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   60. ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        [
            adminLoginModal,
            forgotPasswordModal,
            projectModal,
            byId("projectViewModal")
        ]
            .forEach(
                (modal) => {

                    if (
                        modal?.classList
                            .contains(
                                "show"
                            )
                    ) {

                        closeModal(
                            modal
                        );

                    }

                }
            );

    }
);


/* =========================================================
   61. STORAGE CHECK
   ========================================================= */

async function checkStorage() {

    if (!supabaseReady) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(
                    HAICO_CONFIG.storageBucket
                )
                .list(
                    "",
                    {
                        limit: 1
                    }
                );


        if (error) {
            throw error;
        }


        byId("storageStatus").textContent =
            "Connected";

        byId("storageStatus").className =
            "status-pill success";


    } catch (error) {

        console.warn(
            "Storage check:",
            error
        );


        byId("storageStatus").textContent =
            "Check setup";

        byId("storageStatus").className =
            "status-pill";

    }

}


/* =========================================================
   62. ADMIN STORAGE CHECK WHEN DASHBOARD OPENS
   ========================================================= */

const originalShowAdminDashboard =
    showAdminDashboard;


/* =========================================================
   63. ONLINE / OFFLINE
   ========================================================= */

window.addEventListener(
    "online",
    () => {

        showToast(
            "Internet connection restored.",
            "success"
        );

    }
);


window.addEventListener(
    "offline",
    () => {

        showToast(
            "You are currently offline.",
            "error"
        );

    }
);


/* =========================================================
   64. HASH NAVIGATION
   ========================================================= */

window.addEventListener(
    "hashchange",
    async () => {

        const hash =
            window.location.hash;


        if (
            hash ===
            "#reset-password"
        ) {

            if (
                currentSession ||
                currentUser
            ) {

                showResetPasswordScreen();

            }

            return;

        }


        if (
            hash ===
            "#admin"
        ) {

            if (currentUser) {

                showAdminDashboard(
                    currentUser
                );

            } else {

                openAdminLogin();

            }

        }

    }
);


/* =========================================================
   65. WHATSAPP HELP
   ========================================================= */

function openWhatsApp(
    message = HAICO_CONFIG.whatsappMessage
) {

    const text =
        encodeURIComponent(
            message
        );


    window.open(
        `https://wa.me/${HAICO_CONFIG.whatsappNumber}?text=${text}`,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   66. SMOOTH ANCHOR FALLBACK
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if (!link) {
            return;
        }


        const href =
            link.getAttribute("href");


        if (
            !href ||
            href === "#" ||
            href === "#admin" ||
            href === "#reset-password"
        ) {

            return;

        }


        const target =
            document.querySelector(
                href
            );


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);


/* =========================================================
   67. INITIAL PUBLIC PROJECT LOAD
   ========================================================= */

loadProjects();


/* =========================================================
   68. INITIAL STORAGE CHECK
   ========================================================= */

checkStorage();


/* =========================================================
   69. CONTACT EMAIL PROTECTION
   ========================================================= */

document
    .querySelectorAll(
        'input[type="email"]'
    )
    .forEach(
        (input) => {

            input.addEventListener(
                "blur",
                () => {

                    if (
                        input.value &&
                        !input.value.includes(
                            "@"
                        )
                    ) {

                        input.setCustomValidity(
                            "Please enter a valid email address."
                        );

                    } else {

                        input.setCustomValidity(
                            ""
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   70. PROJECT IMAGE FILE VALIDATION
   ========================================================= */

byId("projectImage")
    ?.addEventListener(
        "change",
        () => {

            const file =
                byId("projectImage")
                    .files?.[0];


            if (!file) {
                return;
            }


            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size >
                maxSize
            ) {

                showProjectFormAlert(
                    "Image is too large. Maximum size is 5MB."
                );


                byId("projectImage")
                    .value = "";

                byId(
                    "projectImagePreview"
                ).innerHTML = "";

                byId(
                    "projectImagePreview"
                ).classList.remove(
                    "show"
                );

            }

        }
    );


/* =========================================================
   71. INITIAL CONSOLE
   ========================================================= */

console.log(
    "%cHAICO TECH AND DESIGN",
    "font-size:20px;font-weight:900;color:#0b1f3a;"
);

console.log(
    "HAICO Link Hub initialized."
);

console.log(
    "Website:",
    WEBSITE_URL
);

console.log(
    "Supabase:",
    supabaseReady
        ? "Connected"
        : "Not initialized"
);

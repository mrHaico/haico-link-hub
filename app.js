/* =========================================================
   HAICO LINK HUB
   SUPABASE APPLICATION
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://lhgjvezxmeedbyiibbin.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Nj4CRhnyMm2Psb209Rnq8w_rXiZLBbB";

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   GLOBAL STATE
========================================================= */

let projects = [];
let services = [];
let socialLinks = [];
let brandSettings = null;
let currentUser = null;

let recoveryMode = false;


/* =========================================================
   DOM HELPER
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    setupYear();

    setupNavigation();

    setupModals();

    setupLogin();

    setupPasswordToggle();

    setupForgotPassword();

    setupResetPassword();

    setupAdminTabs();

    setupProjectForm();

    setupServiceForm();

    setupBrandForm();

    setupSocialForm();

    setupSearch();

    setupRealtime();

    await loadAllData();

    await checkCurrentSession();

    handleRecoveryUrl();

    setTimeout(() => {

        const loader = $("pageLoader");

        if (loader) {
            loader.classList.add("hidden");
        }

    }, 500);

});


/* =========================================================
   YEAR
========================================================= */

function setupYear() {

    const year = $("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const menuBtn = $("menuBtn");
    const closeBtn = $("closeBtn");
    const sidebar = $("sidebar");
    const overlay = $("overlay");

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.add("active");
            overlay.classList.add("active");

        });

    }


    if (closeBtn) {

        closeBtn.addEventListener("click", closeSidebar);

    }


    if (overlay) {

        overlay.addEventListener("click", closeSidebar);

    }


    document.querySelectorAll(".sidebar-link").forEach(link => {

        link.addEventListener("click", closeSidebar);

    });


    const sidebarLoginBtn = $("sidebarLoginBtn");

    if (sidebarLoginBtn) {

        sidebarLoginBtn.addEventListener("click", () => {

            closeSidebar();
            openModal("loginModal");

        });

    }

}


function closeSidebar() {

    $("sidebar")?.classList.remove("active");
    $("overlay")?.classList.remove("active");

}


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("active");

    const anyModalOpen =
        document.querySelector(".modal.active");

    if (!anyModalOpen) {
        document.body.classList.remove("modal-open");
    }

}


function setupModals() {

    $("openLoginBtn")?.addEventListener(
        "click",
        () => openModal("loginModal")
    );

    $("footerAdminBtn")?.addEventListener(
        "click",
        () => openModal("loginModal")
    );


    $("closeLoginModal")?.addEventListener(
        "click",
        () => closeModal("loginModal")
    );


    $("closeAdminModal")?.addEventListener(
        "click",
        () => closeModal("adminModal")
    );


    $("closeProjectModal")?.addEventListener(
        "click",
        () => closeModal("projectModal")
    );


    $("closeProjectFormModal")?.addEventListener(
        "click",
        () => closeModal("projectFormModal")
    );


    $("cancelProjectBtn")?.addEventListener(
        "click",
        () => closeModal("projectFormModal")
    );


    $("closeForgotModal")?.addEventListener(
        "click",
        () => closeModal("forgotModal")
    );


    $("backToLoginBtn")?.addEventListener(
        "click",
        () => {

            closeModal("forgotModal");
            openModal("loginModal");

        }
    );


    document.querySelectorAll(".modal").forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {

                if (modal.id === "adminModal") {
                    return;
                }

                closeModal(modal.id);

            }

        });

    });

}


/* =========================================================
   LOAD ALL DATA
========================================================= */

async function loadAllData() {

    await Promise.all([
        loadBrandSettings(),
        loadServices(),
        loadProjects(),
        loadSocialLinks()
    ]);

}


/* =========================================================
   BRAND SETTINGS
========================================================= */

async function loadBrandSettings() {

    const { data, error } = await db
        .from("brand_settings")
        .select("*")
        .limit(1);

    if (error) {

        console.error(
            "Brand settings error:",
            error
        );

        return;

    }

    if (data && data.length > 0) {

        brandSettings = data[0];

        renderBrand();

    }

}


function renderBrand() {

    if (!brandSettings) return;


    const name =
        brandSettings.brand_name ||
        "HAICO TECH & DESIGN";

    const tagline =
        brandSettings.tagline ||
        "Your Idea. Our Creativity. One Digital Solution.";


    setText("heroBrand", name);

    setText("heroTagline", tagline);

    setText("aboutTitle", name);

    setText(
        "aboutText",
        brandSettings.about ||
        "HAICO TECH & DESIGN is a digital technology and creative design brand focused on building professional digital solutions."
    );


    setText(
        "phoneText",
        brandSettings.phone ||
        "+255 718 170 176"
    );


    setText(
        "emailText",
        brandSettings.email ||
        "ayoubhafidhi1@gmail.com"
    );


    setText(
        "whatsappText",
        brandSettings.whatsapp ||
        brandSettings.phone ||
        "+255 718 170 176"
    );


    setText("headerBrandName", shortBrandName(name));

    setText("sidebarBrandName", shortBrandName(name));

    setText("footerBrandName", name);

    setText("loginBrandName", name);


    const email =
        brandSettings.email ||
        "ayoubhafidhi1@gmail.com";

    const emailContact = $("emailContact");

    if (emailContact) {
        emailContact.href = `mailto:${email}`;
    }


    const whatsapp =
        brandSettings.whatsapp ||
        brandSettings.phone ||
        "+255 718 170 176";

    const whatsappContact = $("whatsappContact");

    if (whatsappContact) {

        const clean =
            whatsapp.replace(/\D/g, "");

        whatsappContact.href =
            `https://wa.me/${clean}`;

    }

}


function shortBrandName(name) {

    if (!name) {
        return "HAICO";
    }

    if (name.length > 18) {
        return "HAICO";
    }

    return name;

}


function setText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value ?? "";
    }

}


/* =========================================================
   SERVICES
========================================================= */

async function loadServices() {

    const { data, error } = await db
        .from("services")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Services error:",
            error
        );

        return;

    }

    services = data || [];

    renderServices();

    renderAdminServices();

    updateDashboardStats();

}


function renderServices() {

    const container =
        $("servicesContainer");

    if (!container) return;


    if (!services.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div>✦</div>
                <p>No services available yet.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        services.map(service => {

            const icon =
                escapeHTML(
                    service.icon || "✦"
                );

            const name =
                escapeHTML(
                    service.name || "Service"
                );

            const description =
                escapeHTML(
                    service.description || ""
                );

            return `

                <article class="service-card">

                    <div class="service-icon">
                        ${icon}
                    </div>

                    <h3>
                        ${name}
                    </h3>

                    <p>
                        ${description}
                    </p>

                </article>

            `;

        }).join("");

}


/* =========================================================
   PROJECTS
========================================================= */

async function loadProjects() {

    const { data, error } = await db
        .from("projects")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Projects error:",
            error
        );

        renderProjectsError(error);

        return;

    }

    projects = data || [];

    renderProjects();

    renderAdminProjects();

    updateCategoryFilter();

    updateDashboardStats();

}


function renderProjectsError(error) {

    const container =
        $("projectsContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">

            <div>!</div>

            <p>
                Unable to load projects.
            </p>

        </div>
    `;

}


function renderProjects(list = projects) {

    const container =
        $("projectsContainer");

    if (!container) return;


    if (!list.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div>▣</div>

                <p>
                    No projects found.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        list.map(project => {

            const image =
                project.image_url ||
                project.image ||
                "";


            const imageHTML = image

                ? `
                    <img
                        src="${escapeAttribute(image)}"
                        alt="${escapeAttribute(project.name || "Project")}"
                        loading="lazy"
                    >
                `

                : `
                    <div class="project-placeholder">
                        H
                    </div>
                `;


            const featured =
                project.featured === true
                    ? `<span class="project-featured">FEATURED</span>`
                    : "";


            return `

                <article class="project-card">

                    <div class="project-image">

                        ${imageHTML}

                        ${featured}

                    </div>


                    <div class="project-content">

                        <span class="project-category">

                            ${escapeHTML(
                                project.category ||
                                "Digital Project"
                            )}

                        </span>


                        <h3>
                            ${escapeHTML(
                                project.name ||
                                "Untitled Project"
                            )}
                        </h3>


                        <p>
                            ${escapeHTML(
                                project.description ||
                                ""
                            )}
                        </p>


                        <div class="project-footer">

                            <span class="project-status">

                                ●
                                ${escapeHTML(
                                    project.status ||
                                    "Active"
                                )}

                            </span>


                            <button
                                class="view-project"
                                data-project-id="${escapeAttribute(project.id)}"
                            >
                                View Details →
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    container
        .querySelectorAll(".view-project")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.projectId;

                    openProjectDetails(id);

                }
            );

        });

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function updateCategoryFilter() {

    const select =
        $("categoryFilter");

    if (!select) return;


    const current =
        select.value;


    const categories =
        [...new Set(
            projects
                .map(project => project.category)
                .filter(Boolean)
        )]
        .sort();


    select.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);

    });


    if (
        categories.includes(current)
    ) {

        select.value = current;

    }

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        $("searchInput");

    const filter =
        $("categoryFilter");


    if (search) {

        search.addEventListener(
            "input",
            filterProjects
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            filterProjects
        );

    }

}


function filterProjects() {

    const search =
        ($("searchInput")?.value || "")
            .toLowerCase()
            .trim();


    const category =
        $("categoryFilter")?.value ||
        "all";


    const filtered =
        projects.filter(project => {

            const searchable = [

                project.name,
                project.category,
                project.description,
                project.details,
                project.created_by,
                project.technologies

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(search);


            const matchesCategory =
                category === "all" ||
                project.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    renderProjects(filtered);

}


/* =========================================================
   PROJECT DETAILS
========================================================= */

function openProjectDetails(id) {

    const project =
        projects.find(
            item => String(item.id) === String(id)
        );


    if (!project) return;


    const container =
        $("projectDetails");

    if (!container) return;


    const image =
        project.image_url ||
        project.image ||
        "";


    const imageHTML = image

        ? `
            <img
                class="project-detail-image"
                src="${escapeAttribute(image)}"
                alt="${escapeAttribute(project.name || "Project")}"
            >
        `

        : "";


    const technologies =
        project.technologies ||
        "Not specified";


    const createdBy =
        project.created_by ||
        "HAICO TECH & DESIGN";


    const status =
        project.status ||
        "Active";


    let actions = "";


    if (project.live_link) {

        actions += `
            <a
                href="${escapeAttribute(project.live_link)}"
                target="_blank"
                rel="noopener"
                class="btn btn-primary"
            >
                Open Live Website
            </a>
        `;

    }


    if (project.github_link) {

        actions += `
            <a
                href="${escapeAttribute(project.github_link)}"
                target="_blank"
                rel="noopener"
                class="btn btn-secondary"
            >
                GitHub
            </a>
        `;

    }


    if (project.whatsapp_link) {

        actions += `
            <a
                href="${escapeAttribute(project.whatsapp_link)}"
                target="_blank"
                rel="noopener"
                class="btn btn-whatsapp"
            >
                WhatsApp
            </a>
        `;

    }


    if (project.attachment_url) {

        actions += `
            <a
                href="${escapeAttribute(project.attachment_url)}"
                target="_blank"
                rel="noopener"
                class="btn btn-secondary"
            >
                Download Attachment
            </a>
        `;

    }


    container.innerHTML = `

        ${imageHTML}

        <div class="project-detail-content">

            <span class="section-label">

                ${escapeHTML(
                    project.category ||
                    "PROJECT"
                )}

            </span>


            <h2>

                ${escapeHTML(
                    project.name ||
                    "Untitled Project"
                )}

            </h2>


            <p class="project-detail-description">

                ${escapeHTML(
                    project.details ||
                    project.description ||
                    ""
                )}

            </p>


            <div class="project-detail-meta">

                <div class="detail-meta-box">

                    <small>STATUS</small>

                    <strong>
                        ${escapeHTML(status)}
                    </strong>

                </div>


                <div class="detail-meta-box">

                    <small>CREATED BY</small>

                    <strong>
                        ${escapeHTML(createdBy)}
                    </strong>

                </div>


                <div class="detail-meta-box">

                    <small>TECHNOLOGIES</small>

                    <strong>
                        ${escapeHTML(technologies)}
                    </strong>

                </div>


                <div class="detail-meta-box">

                    <small>CATEGORY</small>

                    <strong>
                        ${escapeHTML(
                            project.category ||
                            "Digital"
                        )}
                    </strong>

                </div>

            </div>


            <div class="project-detail-actions">

                ${actions}

            </div>

        </div>

    `;


    openModal("projectModal");

}


/* =========================================================
   SOCIAL LINKS
========================================================= */

async function loadSocialLinks() {

    const { data, error } = await db
        .from("social_links")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Social links error:",
            error
        );

        return;

    }

    socialLinks = data || [];

    renderSocialLinks();

    renderAdminSocial();

    updateDashboardStats();

}


function renderSocialLinks() {

    const container =
        $("socialContainer");

    if (!container) return;


    if (!socialLinks.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div>◎</div>

                <p>
                    Social links will appear here.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        socialLinks.map(link => {

            return `

                <a
                    href="${escapeAttribute(link.url || "#")}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-card"
                >

                    <span class="social-icon">

                        ${escapeHTML(
                            link.icon || "◎"
                        )}

                    </span>

                    <strong>

                        ${escapeHTML(
                            link.platform ||
                            "Social Media"
                        )}

                    </strong>

                </a>

            `;

        }).join("");

}


/* =========================================================
   AUTH CHECK
========================================================= */

async function checkCurrentSession() {

    const {
        data,
        error
    } = await db.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        return;

    }


    if (data?.session?.user) {

        currentUser =
            data.session.user;

    }

}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {

    const form =
        $("loginForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await loginAdmin();

        }
    );

}


async function loginAdmin() {

    const email =
        $("loginEmail")?.value
            .trim();

    const password =
        $("loginPassword")?.value;


    const message =
        $("loginMessage");

    const button =
        $("loginSubmitBtn");


    if (!email || !password) {

        showMessage(
            message,
            "Please enter your email and password.",
            "error"
        );

        return;

    }


    button?.classList.add("loading");


    if (button) {
        button.querySelector("span")
            ?.replaceWith(
                createTextElement(
                    "span",
                    "Signing in..."
                )
            );
    }


    const {
        data,
        error
    } = await db.auth.signInWithPassword({
        email,
        password
    });


    button?.classList.remove("loading");


    if (error) {

        showMessage(
            message,
            friendlyAuthError(error.message),
            "error"
        );

        restoreLoginButton();

        return;

    }


    currentUser =
        data.user;


    showMessage(
        message,
        "Login successful. Opening dashboard...",
        "success"
    );


    setTimeout(() => {

        closeModal("loginModal");

        openAdminDashboard();

        restoreLoginButton();

    }, 500);

}


function restoreLoginButton() {

    const button =
        $("loginSubmitBtn");

    if (!button) return;


    button.innerHTML = `
        <span>Login to Dashboard</span>
        <span>→</span>
    `;

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle() {

    const button =
        $("togglePassword");

    const input =
        $("loginPassword");


    if (!button || !input) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (input.type === "password") {

                input.type = "text";

                button.textContent = "Hide";

            } else {

                input.type = "password";

                button.textContent = "Show";

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function setupForgotPassword() {

    $("forgotPasswordBtn")
        ?.addEventListener(
            "click",
            () => {

                const loginEmail =
                    $("loginEmail")?.value.trim();

                if (loginEmail) {

                    $("forgotEmail").value =
                        loginEmail;

                }

                closeModal("loginModal");

                openModal("forgotModal");

            }
        );


    $("forgotForm")
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await sendPasswordReset();

            }
        );

}


/* =========================================================
   SEND PASSWORD RESET
========================================================= */

async function sendPasswordReset() {

    const email =
        $("forgotEmail")?.value.trim();

    const message =
        $("forgotMessage");

    const button =
        $("resetEmailBtn");


    if (!email) {

        showMessage(
            message,
            "Please enter your admin email.",
            "error"
        );

        return;

    }


    button?.classList.add("loading");


    const redirectUrl =
        `${window.location.origin}${window.location.pathname}?reset=1`;


    const {
        error
    } = await db.auth.resetPasswordForEmail(
        email,
        {
            redirectTo: redirectUrl
        }
    );


    button?.classList.remove("loading");


    if (error) {

        showMessage(
            message,
            friendlyAuthError(error.message),
            "error"
        );

        return;

    }


    showMessage(
        message,
        "Reset link sent. Check your email inbox.",
        "success"
    );

}


/* =========================================================
   RECOVERY URL
========================================================= */

function handleRecoveryUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    if (
        params.get("reset") === "1"
    ) {

        recoveryMode = true;

    }

}


/* =========================================================
   SUPABASE AUTH STATE
========================================================= */

db.auth.onAuthStateChange(
    async (event, session) => {

        if (
            event === "PASSWORD_RECOVERY"
        ) {

            recoveryMode = true;

            openModal("resetModal");

        }


        if (
            event === "SIGNED_IN" &&
            session?.user
        ) {

            currentUser =
                session.user;

            if (
                recoveryMode &&
                window.location.search.includes(
                    "reset=1"
                )
            ) {

                openModal("resetModal");

            }

        }


        if (
            event === "SIGNED_OUT"
        ) {

            currentUser = null;

        }

    }
);


/* =========================================================
   RESET PASSWORD
========================================================= */

function setupResetPassword() {

    const form =
        $("resetForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const password =
                $("newPassword")?.value;

            const confirm =
                $("confirmPassword")?.value;

            const message =
                $("resetMessage");


            if (
                !password ||
                password.length < 6
            ) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;

            }


            if (password !== confirm) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            const {
                error
            } = await db.auth.updateUser({
                password
            });


            if (error) {

                showMessage(
                    message,
                    friendlyAuthError(error.message),
                    "error"
                );

                return;

            }


            showMessage(
                message,
                "Password updated successfully.",
                "success"
            );


            setTimeout(async () => {

                await db.auth.signOut();

                closeModal("resetModal");

                openModal("loginModal");

                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

                recoveryMode = false;

            }, 1200);

        }
    );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function openAdminDashboard() {

    if (!currentUser) {

        openModal("loginModal");

        return;

    }


    const email =
        currentUser.email ||
        "Admin";


    setText(
        "adminUserEmail",
        email
    );


    updateDashboardStats();

    renderAdminProjects();

    renderAdminServices();

    renderAdminSocial();

    populateBrandForm();

    openModal("adminModal");

}


/* =========================================================
   ADMIN TABS
========================================================= */

function setupAdminTabs() {

    document
        .querySelectorAll(".admin-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".admin-tab"
                        )
                        .forEach(item => {
                            item.classList.remove(
                                "active"
                            );
                        });


                    document
                        .querySelectorAll(
                            ".admin-tab-content"
                        )
                        .forEach(content => {
                            content.classList.remove(
                                "active"
                            );
                        });


                    tab.classList.add(
                        "active"
                    );


                    const target =
                        $(tab.dataset.tab);

                    target?.classList.add(
                        "active"
                    );

                }
            );

        });

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

function updateDashboardStats() {

    setText(
        "projectCount",
        projects.length
    );

    setText(
        "serviceCount",
        services.length
    );

    setText(
        "socialCount",
        socialLinks.length
    );


    const featured =
        projects.filter(
            project =>
                project.featured === true
        ).length;


    setText(
        "featuredCount",
        featured
    );

}


/* =========================================================
   ADMIN PROJECT LIST
========================================================= */

function renderAdminProjects() {

    const container =
        $("adminProjectsContainer");

    if (!container) return;


    if (!projects.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div>▣</div>

                <p>
                    No projects added yet.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        projects.map(project => {

            const image =
                project.image_url ||
                project.image ||
                "";


            const imageHTML = image

                ? `
                    <img
                        class="admin-list-image"
                        src="${escapeAttribute(image)}"
                        alt=""
                    >
                `

                : `
                    <div class="admin-list-image
                                project-placeholder">
                        H
                    </div>
                `;


            return `

                <div class="admin-list-item">

                    ${imageHTML}


                    <div class="admin-list-info">

                        <strong>

                            ${escapeHTML(
                                project.name ||
                                "Untitled"
                            )}

                        </strong>

                        <small>

                            ${escapeHTML(
                                project.category ||
                                "Project"
                            )}

                            ·

                            ${escapeHTML(
                                project.status ||
                                "Active"
                            )}

                        </small>

                    </div>


                    <div class="admin-list-actions">

                        <button
                            class="icon-btn edit-project"
                            data-id="${escapeAttribute(project.id)}"
                            title="Edit"
                        >
                            ✎
                        </button>


                        <button
                            class="icon-btn delete delete-project"
                            data-id="${escapeAttribute(project.id)}"
                            title="Delete"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;

        }).join("");


    container
        .querySelectorAll(".edit-project")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => editProject(
                    button.dataset.id
                )
            );

        });


    container
        .querySelectorAll(".delete-project")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => deleteProject(
                    button.dataset.id
                )
            );

        });

}


/* =========================================================
   PROJECT FORM
========================================================= */

function setupProjectForm() {

    $("addProjectBtn")
        ?.addEventListener(
            "click",
            () => {

                resetProjectForm();

                setText(
                    "projectFormTitle",
                    "Add Project"
                );

                openModal(
                    "projectFormModal"
                );

            }
        );


    $("projectForm")
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveProject();

            }
        );

}


/* =========================================================
   RESET PROJECT FORM
========================================================= */

function resetProjectForm() {

    const form =
        $("projectForm");

    form?.reset();

    $("projectId").value = "";

    setText(
        "projectFormMessage",
        ""
    );

}


/* =========================================================
   EDIT PROJECT
========================================================= */

function editProject(id) {

    const project =
        projects.find(
            item => String(item.id) === String(id)
        );


    if (!project) return;


    $("projectId").value =
        project.id || "";


    $("projectName").value =
        project.name || "";


    $("projectCategory").value =
        project.category || "";


    $("projectDescription").value =
        project.description || "";


    $("projectDetailsText").value =
        project.details || "";


    $("projectCreatedBy").value =
        project.created_by || "";


    $("projectTechnologies").value =
        project.technologies || "";


    $("projectStatus").value =
        project.status || "Completed";


    $("projectLiveLink").value =
        project.live_link || "";


    $("projectGithubLink").value =
        project.github_link || "";


    $("projectWhatsappLink").value =
        project.whatsapp_link || "";


    $("projectFeatured").checked =
        project.featured === true;


    $("projectImage").value = "";

    $("projectAttachment").value = "";


    setText(
        "projectFormTitle",
        "Edit Project"
    );


    openModal(
        "projectFormModal"
    );

}


/* =========================================================
   SAVE PROJECT
========================================================= */

async function saveProject() {

    const id =
        $("projectId")?.value;


    const projectData = {

        name:
            $("projectName").value.trim(),

        category:
            $("projectCategory").value.trim(),

        description:
            $("projectDescription").value.trim(),

        details:
            $("projectDetailsText").value.trim(),

        created_by:
            $("projectCreatedBy").value.trim(),

        technologies:
            $("projectTechnologies").value.trim(),

        status:
            $("projectStatus").value,

        live_link:
            $("projectLiveLink").value.trim(),

        github_link:
            $("projectGithubLink").value.trim(),

        whatsapp_link:
            $("projectWhatsappLink").value.trim(),

        featured:
            $("projectFeatured").checked

    };


    if (!projectData.name) {

        showMessage(
            $("projectFormMessage"),
            "Project name is required.",
            "error"
        );

        return;

    }


    const saveButton =
        $("saveProjectBtn");


    saveButton?.classList.add(
        "loading"
    );


    try {

        /* =============================================
           IMAGE UPLOAD
        ============================================= */

        const imageFile =
            $("projectImage")?.files?.[0];


        if (imageFile) {

            const imageResult =
                await uploadFile(
                    imageFile,
                    "project-images"
                );


            if (
                imageResult &&
                imageResult.url
            ) {

                projectData.image_url =
                    imageResult.url;

            }

        }


        /* =============================================
           ATTACHMENT UPLOAD
        ============================================= */

        const attachmentFile =
            $("projectAttachment")
                ?.files?.[0];


        if (attachmentFile) {

            const attachmentResult =
                await uploadFile(
                    attachmentFile,
                    "attachments"
                );


            if (
                attachmentResult &&
                attachmentResult.url
            ) {

                projectData.attachment_url =
                    attachmentResult.url;

            }

        }


        /* =============================================
           INSERT / UPDATE
        ============================================= */

        let result;


        if (id) {

            result =
                await db
                    .from("projects")
                    .update(projectData)
                    .eq("id", id);

        } else {

            result =
                await db
                    .from("projects")
                    .insert([
                        projectData
                    ]);

        }


        if (result.error) {
            throw result.error;
        }


        showMessage(
            $("projectFormMessage"),
            id
                ? "Project updated successfully."
                : "Project added successfully.",
            "success"
        );


        await loadProjects();


        setTimeout(() => {

            closeModal(
                "projectFormModal"
            );

        }, 700);

    } catch (error) {

        console.error(
            "Save project error:",
            error
        );


        showMessage(
            $("projectFormMessage"),
            error.message ||
                "Unable to save project.",
            "error"
        );

    } finally {

        saveButton?.classList.remove(
            "loading"
        );

    }

}


/* =========================================================
   UPLOAD FILE
========================================================= */

async function uploadFile(
    file,
    bucket
) {

    if (!file) return null;


    const safeName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "-"
            );


    const path =
        `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${safeName}`;


    const {
        error
    } = await db.storage
        .from(bucket)
        .upload(
            path,
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
    } = db.storage
        .from(bucket)
        .getPublicUrl(path);


    return {
        path,
        url: data.publicUrl
    };

}


/* =========================================================
   DELETE PROJECT
========================================================= */

async function deleteProject(id) {

    const project =
        projects.find(
            item => String(item.id) === String(id)
        );


    if (!project) return;


    const confirmed =
        confirm(
            `Delete "${project.name}"?\n\nThis action cannot be undone.`
        );


    if (!confirmed) return;


    const {
        error
    } = await db
        .from("projects")
        .delete()
        .eq("id", id);


    if (error) {

        alert(
            `Unable to delete project: ${error.message}`
        );

        return;

    }


    await loadProjects();

}


/* =========================================================
   ADMIN SERVICES
========================================================= */

function renderAdminServices() {

    const container =
        $("adminServicesContainer");

    if (!container) return;


    if (!services.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div>✦</div>

                <p>
                    No services available.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        services.map(service => {

            return `

                <div class="admin-list-item">

                    <div class="admin-list-image
                                project-placeholder">

                        ${escapeHTML(
                            service.icon || "✦"
                        )}

                    </div>


                    <div class="admin-list-info">

                        <strong>

                            ${escapeHTML(
                                service.name ||
                                "Service"
                            )}

                        </strong>

                        <small>

                            ${escapeHTML(
                                service.description ||
                                ""
                            )}

                        </small>

                    </div>


                    <div class="admin-list-actions">

                        <button
                            class="icon-btn edit-service"
                            data-id="${escapeAttribute(service.id)}"
                        >
                            ✎
                        </button>


                        <button
                            class="icon-btn delete delete-service"
                            data-id="${escapeAttribute(service.id)}"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;

        }).join("");


    container
        .querySelectorAll(".edit-service")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => editService(
                    button.dataset.id
                )
            );

        });


    container
        .querySelectorAll(".delete-service")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => deleteService(
                    button.dataset.id
                )
            );

        });

}


/* =========================================================
   SERVICE FORM
========================================================= */

function setupServiceForm() {

    $("serviceForm")
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveService();

            }
        );


    $("cancelServiceBtn")
        ?.addEventListener(
            "click",
            resetServiceForm
        );

}


async function saveService() {

    const id =
        $("serviceId").value;


    const data = {

        name:
            $("serviceName").value.trim(),

        icon:
            $("serviceIcon").value.trim(),

        description:
            $("serviceDescription").value.trim()

    };


    if (!data.name) return;


    let result;


    if (id) {

        result =
            await db
                .from("services")
                .update(data)
                .eq("id", id);

    } else {

        result =
            await db
                .from("services")
                .insert([data]);

    }


    if (result.error) {

        alert(
            result.error.message
        );

        return;

    }


    resetServiceForm();

    await loadServices();

}


function editService(id) {

    const service =
        services.find(
            item => String(item.id) === String(id)
        );


    if (!service) return;


    $("serviceId").value =
        service.id || "";


    $("serviceName").value =
        service.name || "";


    $("serviceIcon").value =
        service.icon || "";


    $("serviceDescription").value =
        service.description || "";


    document
        .querySelector(
            '.admin-tab[data-tab="servicesTab"]'
        )
        ?.click();

}


function resetServiceForm() {

    $("serviceForm")?.reset();

    $("serviceId").value = "";

}


async function deleteService(id) {

    const service =
        services.find(
            item => String(item.id) === String(id)
        );


    if (!service) return;


    if (
        !confirm(
            `Delete "${service.name}"?`
        )
    ) {
        return;
    }


    const {
        error
    } = await db
        .from("services")
        .delete()
        .eq("id", id);


    if (error) {

        alert(
            error.message
        );

        return;

    }


    await loadServices();

}


/* =========================================================
   BRAND FORM
========================================================= */

function setupBrandForm() {

    $("brandForm")
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveBrandSettings();

            }
        );

}


function populateBrandForm() {

    if (!brandSettings) return;


    $("brandName").value =
        brandSettings.brand_name || "";


    $("brandTagline").value =
        brandSettings.tagline || "";


    $("brandAbout").value =
        brandSettings.about || "";


    $("brandPhone").value =
        brandSettings.phone || "";


    $("brandEmail").value =
        brandSettings.email || "";


    $("brandWhatsapp").value =
        brandSettings.whatsapp || "";


    $("brandLogo").value =
        brandSettings.logo_url || "";

}


async function saveBrandSettings() {

    const data = {

        brand_name:
            $("brandName").value.trim(),

        tagline:
            $("brandTagline").value.trim(),

        about:
            $("brandAbout").value.trim(),

        phone:
            $("brandPhone").value.trim(),

        email:
            $("brandEmail").value.trim(),

        whatsapp:
            $("brandWhatsapp").value.trim(),

        logo_url:
            $("brandLogo").value.trim()

    };


    let result;


    if (brandSettings?.id) {

        result =
            await db
                .from("brand_settings")
                .update(data)
                .eq(
                    "id",
                    brandSettings.id
                );

    } else {

        result =
            await db
                .from("brand_settings")
                .insert([data]);

    }


    if (result.error) {

        showMessage(
            $("brandMessage"),
            result.error.message,
            "error"
        );

        return;

    }


    showMessage(
        $("brandMessage"),
        "Brand settings updated successfully.",
        "success"
    );


    await loadBrandSettings();

}


/* =========================================================
   SOCIAL ADMIN
========================================================= */

function renderAdminSocial() {

    const container =
        $("adminSocialContainer");

    if (!container) return;


    if (!socialLinks.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div>◎</div>

                <p>
                    No social links added.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        socialLinks.map(link => {

            return `

                <div class="admin-list-item">

                    <div class="admin-list-image
                                project-placeholder">

                        ${escapeHTML(
                            link.icon || "◎"
                        )}

                    </div>


                    <div class="admin-list-info">

                        <strong>

                            ${escapeHTML(
                                link.platform ||
                                "Social"
                            )}

                        </strong>

                        <small>

                            ${escapeHTML(
                                link.url ||
                                ""
                            )}

                        </small>

                    </div>


                    <div class="admin-list-actions">

                        <button
                            class="icon-btn edit-social"
                            data-id="${escapeAttribute(link.id)}"
                        >
                            ✎
                        </button>


                        <button
                            class="icon-btn delete delete-social"
                            data-id="${escapeAttribute(link.id)}"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;

        }).join("");


    container
        .querySelectorAll(".edit-social")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => editSocial(
                    button.dataset.id
                )
            );

        });


    container
        .querySelectorAll(".delete-social")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => deleteSocial(
                    button.dataset.id
                )
            );

        });

}


/* =========================================================
   SOCIAL FORM
========================================================= */

function setupSocialForm() {

    $("socialForm")
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveSocial();

            }
        );


    $("cancelSocialBtn")
        ?.addEventListener(
            "click",
            resetSocialForm
        );

}


async function saveSocial() {

    const id =
        $("socialId").value;


    const data = {

        platform:
            $("socialPlatform").value.trim(),

        url:
            $("socialUrl").value.trim(),

        icon:
            $("socialIcon").value.trim()

    };


    if (
        !data.platform ||
        !data.url
    ) {
        return;
    }


    let result;


    if (id) {

        result =
            await db
                .from("social_links")
                .update(data)
                .eq("id", id);

    } else {

        result =
            await db
                .from("social_links")
                .insert([data]);

    }


    if (result.error) {

        alert(
            result.error.message
        );

        return;

    }


    resetSocialForm();

    await loadSocialLinks();

}


function editSocial(id) {

    const link =
        socialLinks.find(
            item => String(item.id) === String(id)
        );


    if (!link) return;


    $("socialId").value =
        link.id || "";


    $("socialPlatform").value =
        link.platform || "";


    $("socialUrl").value =
        link.url || "";


    $("socialIcon").value =
        link.icon || "";


    document
        .querySelector(
            '.admin-tab[data-tab="socialTab"]'
        )
        ?.click();

}


function resetSocialForm() {

    $("socialForm")?.reset();

    $("socialId").value = "";

}


async function deleteSocial(id) {

    const link =
        socialLinks.find(
            item => String(item.id) === String(id)
        );


    if (!link) return;


    if (
        !confirm(
            `Delete "${link.platform}"?`
        )
    ) {
        return;
    }


    const {
        error
    } = await db
        .from("social_links")
        .delete()
        .eq("id", id);


    if (error) {

        alert(
            error.message
        );

        return;

    }


    await loadSocialLinks();

}


/* =========================================================
   LOGOUT
========================================================= */

$("logoutBtn")
    ?.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) return;


            const {
                error
            } = await db.auth.signOut();


            if (error) {

                alert(
                    error.message
                );

                return;

            }


            currentUser = null;

            closeModal("adminModal");

        }
    );


/* =========================================================
   REALTIME
========================================================= */

function setupRealtime() {

    db.channel("haico-link-hub-realtime")

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "projects"
            },
            () => {
                loadProjects();
            }
        )

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "services"
            },
            () => {
                loadServices();
            }
        )

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "social_links"
            },
            () => {
                loadSocialLinks();
            }
        )

        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "brand_settings"
            },
            () => {
                loadBrandSettings();
            }
        )

        .subscribe();

}


/* =========================================================
   AUTH ERROR TRANSLATION
========================================================= */

function friendlyAuthError(message) {

    if (!message) {
        return "Something went wrong. Please try again.";
    }


    const text =
        message.toLowerCase();


    if (
        text.includes(
            "invalid login credentials"
        )
    ) {

        return "Incorrect email or password.";

    }


    if (
        text.includes(
            "email not confirmed"
        )
    ) {

        return "Please confirm your email before logging in.";

    }


    if (
        text.includes(
            "user not found"
        )
    ) {

        return "Admin account was not found.";

    }


    if (
        text.includes(
            "rate limit"
        )
    ) {

        return "Too many requests. Please wait and try again.";

    }


    return message;

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    element,
    message,
    type = "info"
) {

    if (!element) return;


    element.textContent =
        message || "";


    element.className =
        `form-message ${type}`;

}


/* =========================================================
   TEXT ELEMENT
========================================================= */

function createTextElement(
    tag,
    text
) {

    const element =
        document.createElement(tag);

    element.textContent =
        text;

    return element;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return escapeHTML(value);

}

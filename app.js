/* =====================================================
   HAICO LINK HUB
   SUPABASE APPLICATION
===================================================== */


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */
const SUPABASE_URL = "https://lhgjvezxmeedbyiibbin.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Nj4CRhnyMm2Psb209Rnq8w_rXiZLBbX";

const SITE_URL =
    "https://mrhaico.github.io/haico-link-hub/";

/* =====================================================
   CREATE SUPABASE CLIENT
===================================================== */

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =====================================================
   STORAGE BUCKETS
===================================================== */

const PROJECT_IMAGE_BUCKET = "project-images";
const ATTACHMENT_BUCKET = "attachments";


/* =====================================================
   GLOBAL STATE
===================================================== */

let projects = [];
let services = [];
let socialLinks = [];
let brandSettings = null;
let currentUser = null;


/* =====================================================
   DOM HELPER
===================================================== */

function $(id) {
    return document.getElementById(id);
}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    setupEventListeners();

    $("year").textContent = new Date().getFullYear();

    try {

        await loadAllData();

        await checkAuthentication();

    } catch (error) {

        console.error("Initialization error:", error);

    }

    setTimeout(() => {

        $("loadingScreen").classList.add("hidden");

    }, 500);

});


/* =====================================================
   EVENT LISTENERS
===================================================== */

function setupEventListeners() {


    /* Public Login */

    $("openLoginBtn").addEventListener(
        "click",
        openLogin
    );


    $("footerAdminBtn").addEventListener(
        "click",
        openLogin
    );


    $("mobileLoginBtn").addEventListener(
        "click",
        () => {

            $("mobileNav").classList.remove("open");

            openLogin();

        }
    );


    /* Mobile menu */

    $("mobileMenuBtn").addEventListener(
        "click",
        () => {

            $("mobileNav").classList.toggle("open");

        }
    );


    /* Login close */

    $("closeLoginBtn").addEventListener(
        "click",
        closeLogin
    );


    /* Login form */

    $("loginForm").addEventListener(
        "submit",
        handleLogin
    );


    /* Password show/hide */

    $("togglePassword").addEventListener(
        "click",
        togglePassword
    );


    /* Forgot password */

    $("forgotPasswordBtn").addEventListener(
        "click",
        openForgotPassword
    );


    $("closeForgotBtn").addEventListener(
        "click",
        closeForgotPassword
    );


    $("backToLoginBtn").addEventListener(
        "click",
        () => {

            closeForgotPassword();

            openLogin();

        }
    );


    $("forgotPasswordForm").addEventListener(
        "submit",
        handleForgotPassword
    );


    /* Reset password */

    $("resetPasswordForm").addEventListener(
        "submit",
        handlePasswordReset
    );


    /* Admin */

    $("closeAdminBtn").addEventListener(
        "click",
        closeAdminDashboard
    );


    $("logoutBtn").addEventListener(
        "click",
        handleLogout
    );


    $("mobileAdminMenu").addEventListener(
        "click",
        () => {

            $("adminSidebar")?.classList.toggle("open");

            document
                .querySelector(".admin-sidebar")
                .classList.toggle("open");

        }
    );


    /* Admin navigation */

    document
        .querySelectorAll(".admin-nav-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const view =
                        button.dataset.view;

                    showAdminView(view);

                    document
                        .querySelector(".admin-sidebar")
                        .classList.remove("open");

                }
            );

        });


    /* Dashboard shortcut */

    document
        .querySelectorAll("[data-go-view]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showAdminView(
                        button.dataset.goView
                    );

                }
            );

        });


    /* Project */

    $("addProjectBtn").addEventListener(
        "click",
        () => openProjectForm()
    );


    $("projectForm").addEventListener(
        "submit",
        handleProjectSubmit
    );


    $("cancelProjectBtn").addEventListener(
        "click",
        closeProjectForm
    );


    $("cancelProjectBtn2").addEventListener(
        "click",
        closeProjectForm
    );


    $("closeProjectModal").addEventListener(
        "click",
        closeProjectDetails
    );


    /* Services */

    $("serviceForm").addEventListener(
        "submit",
        handleServiceSubmit
    );


    $("cancelServiceBtn").addEventListener(
        "click",
        resetServiceForm
    );


    /* Brand */

    $("brandForm").addEventListener(
        "submit",
        handleBrandSubmit
    );


    /* Social */

    $("socialForm").addEventListener(
        "submit",
        handleSocialSubmit
    );


    $("cancelSocialBtn").addEventListener(
        "click",
        resetSocialForm
    );


    /* Search */

    $("searchInput").addEventListener(
        "input",
        renderProjects
    );


    $("categoryFilter").addEventListener(
        "change",
        renderProjects
    );


    /* Overlay clicks */

    $("loginOverlay").addEventListener(
        "click",
        event => {

            if (event.target === $("loginOverlay")) {
                closeLogin();
            }

        }
    );


    $("forgotOverlay").addEventListener(
        "click",
        event => {

            if (event.target === $("forgotOverlay")) {
                closeForgotPassword();
            }

        }
    );


    $("projectModal").addEventListener(
        "click",
        event => {

            if (event.target === $("projectModal")) {
                closeProjectDetails();
            }

        }
    );


}


/* =====================================================
   LOAD ALL DATA
===================================================== */

async function loadAllData() {

    await Promise.all([
        loadBrandSettings(),
        loadServices(),
        loadProjects(),
        loadSocialLinks()
    ]);

    renderEverything();

}


/* =====================================================
   BRAND
===================================================== */

async function loadBrandSettings() {

    const {
        data,
        error
    } = await db
        .from("brand_settings")
        .select("*")
        .limit(1)
        .maybeSingle();


    if (error) {

        console.error(
            "Brand loading error:",
            error
        );

        return;

    }


    brandSettings = data || null;

}


/* =====================================================
   SERVICES
===================================================== */

async function loadServices() {

    const {
        data,
        error
    } = await db
        .from("services")
        .select("*")
        .order("created_at", {
            ascending: true
        });


    if (error) {

        console.error(
            "Services loading error:",
            error
        );

        services = [];

        return;

    }


    services = data || [];

}


/* =====================================================
   PROJECTS
===================================================== */

async function loadProjects() {

    const {
        data,
        error
    } = await db
        .from("projects")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Projects loading error:",
            error
        );

        projects = [];

        return;

    }


    projects = data || [];

}


/* =====================================================
   SOCIAL LINKS
===================================================== */

async function loadSocialLinks() {

    const {
        data,
        error
    } = await db
        .from("social_links")
        .select("*")
        .order("created_at", {
            ascending: true
        });


    if (error) {

        console.error(
            "Social links loading error:",
            error
        );

        socialLinks = [];

        return;

    }


    socialLinks = data || [];

}


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderEverything() {

    renderBrand();

    renderServices();

    renderProjects();

    renderSocialLinks();

    renderAdminProjects();

    renderAdminServices();

    renderAdminSocial();

    updateStats();

}


/* =====================================================
   BRAND RENDER
===================================================== */

function renderBrand() {

    if (!brandSettings) {
        return;
    }


    const brand =
        brandSettings.brand_name ||
        "HAICO TECH & DESIGN";


    const tagline =
        brandSettings.tagline ||
        "Your Idea. Our Creativity. One Digital Solution.";


    const about =
        brandSettings.about_text ||
        "We create practical digital solutions.";


    const phone =
        brandSettings.phone ||
        "+255 718 170 176";


    const email =
        brandSettings.email ||
        "ayoubhafidhi1@gmail.com";


    const whatsapp =
        brandSettings.whatsapp ||
        phone;


    $("heroBrand").textContent = brand;

    $("heroTagline").textContent = tagline;

    $("aboutBrandName").textContent = brand;

    $("aboutText").textContent = about;

    $("phoneText").textContent = phone;

    $("emailText").textContent = email;

    $("contactPhoneText").textContent = phone;

    $("contactEmailText").textContent = email;

    $("footerBrand").textContent = brand;

    $("headerBrand").textContent = brand;


    $("loginBrandName").textContent = brand;

    $("loginBrandTagline").textContent = tagline;


    $("brandName").value = brand;

    $("brandTagline").value = tagline;

    $("brandAbout").value = about;

    $("brandPhone").value = phone;

    $("brandEmail").value = email;

    $("brandWhatsapp").value = whatsapp;

    $("brandLogo").value =
        brandSettings.logo_url || "";


    $("emailContact").href =
        `mailto:${email}`;


    $("whatsappContact").href =
        makeWhatsAppLink(whatsapp);

}


/* =====================================================
   SERVICES RENDER
===================================================== */

function renderServices() {

    const container =
        $("servicesContainer");


    if (!services.length) {

        container.innerHTML = `
            <div class="empty-message">
                No services available yet.
            </div>
        `;

        return;

    }


    container.innerHTML =
        services.map(service => {

            return `
                <article class="service-card">

                    <div class="service-icon">
                        ${escapeHTML(
                            service.icon || "◆"
                        )}
                    </div>

                    <h3>
                        ${escapeHTML(
                            service.name || "Service"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            service.description || ""
                        )}
                    </p>

                </article>
            `;

        }).join("");

}


/* =====================================================
   PROJECT CATEGORIES
===================================================== */

function renderCategoryFilter() {

    const select =
        $("categoryFilter");


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

        ${categories.map(category => `
            <option value="${escapeAttribute(category)}">
                ${escapeHTML(category)}
            </option>
        `).join("")}
    `;


    if (
        categories.includes(current)
    ) {

        select.value = current;

    }

}


/* =====================================================
   PROJECT RENDER
===================================================== */

function renderProjects() {

    renderCategoryFilter();


    const container =
        $("projectsContainer");


    const search =
        $("searchInput")
            .value
            .trim()
            .toLowerCase();


    const category =
        $("categoryFilter").value;


    let filtered =
        projects.filter(project => {

            const text = [
                project.name,
                project.category,
                project.description,
                project.details,
                project.technologies
            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !search ||
                text.includes(search);


            const matchesCategory =
                category === "all" ||
                project.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (!filtered.length) {

        container.innerHTML = `
            <div class="empty-message">
                No projects found.
            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered.map(project => {

            const image =
                project.image_url;


            return `
                <article class="project-card">

                    <div class="project-image">

                        ${
                            image
                            ?
                            `<img
                                src="${escapeAttribute(image)}"
                                alt="${escapeAttribute(project.name || "Project")}"
                            >`
                            :
                            `<div class="project-placeholder">
                                H
                            </div>`
                        }

                    </div>

                    <div class="project-content">

                        <span class="project-category">
                            ${escapeHTML(
                                project.category || "Project"
                            )}
                        </span>

                        <h3>
                            ${escapeHTML(
                                project.name || "Untitled Project"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                project.description || ""
                            )}
                        </p>

                        <div class="project-meta">

                            <span class="status-badge">
                                ${escapeHTML(
                                    project.status || "Completed"
                                )}
                            </span>

                            <button
                                class="view-project-btn"
                                onclick="openProjectDetails('${project.id}')"
                            >
                                View Details →
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }).join("");

}


/* =====================================================
   SOCIAL RENDER
===================================================== */

function renderSocialLinks() {

    const container =
        $("socialContainer");


    if (!socialLinks.length) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML =
        socialLinks.map(link => {

            return `
                <a
                    class="social-link"
                    href="${escapeAttribute(link.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(
                        link.icon || "●"
                    )}
                    ${escapeHTML(
                        link.platform || "Social"
                    )}
                </a>
            `;

        }).join("");

}


/* =====================================================
   AUTH CHECK
===================================================== */

async function checkAuthentication() {

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


    if (data.session) {

        currentUser =
            data.session.user;

    }


    db.auth.onAuthStateChange(
        async (event, session) => {

            console.log(
                "Auth event:",
                event
            );


            if (event === "SIGNED_IN") {

                currentUser =
                    session?.user || null;

                closeLogin();

                closeForgotPassword();

                openAdminDashboard();

                updateAdminUser();

            }


            if (event === "SIGNED_OUT") {

                currentUser = null;

                closeAdminDashboard();

            }


            if (
                event === "PASSWORD_RECOVERY"
            ) {

                currentUser =
                    session?.user || null;

                closeLogin();

                closeForgotPassword();

                $("resetOverlay")
                    .classList.remove("hidden");

                document.body.classList.add(
                    "no-scroll"
                );

            }

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

async function handleLogin(event) {

    event.preventDefault();


    const email =
        $("loginEmail").value.trim();


    const password =
        $("loginPassword").value;


    setMessage(
        $("loginMessage"),
        "Signing in...",
        "success"
    );


    $("loginSubmitBtn").disabled = true;


    try {

        const {
            data,
            error
        } = await db.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            throw error;

        }


        currentUser =
            data.user;


        setMessage(
            $("loginMessage"),
            "Login successful.",
            "success"
        );


        closeLogin();

        openAdminDashboard();

        updateAdminUser();


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        setMessage(
            $("loginMessage"),
            getAuthErrorMessage(error),
            "error"
        );


    } finally {

        $("loginSubmitBtn").disabled = false;

    }

}


/* =====================================================
   FORGOT PASSWORD
   SUPABASE AUTH API
===================================================== */

async function handleForgotPassword(event) {

    event.preventDefault();


    const email =
        $("forgotEmail")
            .value
            .trim();


    if (!email) {

        setMessage(
            $("forgotMessage"),
            "Please enter your email address.",
            "error"
        );

        return;

    }


    const button =
        $("forgotSubmitBtn");


    button.disabled = true;

    button.textContent =
        "Sending...";


    setMessage(
        $("forgotMessage"),
        "Connecting to Supabase Auth...",
        "success"
    );


    try {

        /*
         * THIS IS THE PASSWORD RESET API
         *
         * The user receives a secure email
         * from Supabase.
         */

        const {
            data,
            error
        } = await db.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: SITE_URL
            }
        );


        if (error) {

            throw error;

        }


        console.log(
            "Password reset response:",
            data
        );


        setMessage(
            $("forgotMessage"),
            "Reset link sent. Check your email inbox and spam folder.",
            "success"
        );


    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );


        setMessage(
            $("forgotMessage"),
            getAuthErrorMessage(error),
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Send Reset Link";

    }

}


/* =====================================================
   PASSWORD RESET
===================================================== */

async function handlePasswordReset(event) {

    event.preventDefault();


    const password =
        $("newPassword").value;


    const confirm =
        $("confirmPassword").value;


    if (password.length < 6) {

        setMessage(
            $("resetMessage"),
            "Password must contain at least 6 characters.",
            "error"
        );

        return;

    }


    if (password !== confirm) {

        setMessage(
            $("resetMessage"),
            "Passwords do not match.",
            "error"
        );

        return;

    }


    const button =
        $("resetSubmitBtn");


    button.disabled = true;

    button.textContent =
        "Updating...";


    try {

        const {
            data,
            error
        } = await db.auth.updateUser({

            password: password

        });


        if (error) {

            throw error;

        }


        console.log(
            "Password updated:",
            data
        );


        setMessage(
            $("resetMessage"),
            "Password updated successfully. You can now use your new password.",
            "success"
        );


        $("resetPasswordForm").reset();


        setTimeout(() => {

            $("resetOverlay")
                .classList.add("hidden");

            document.body.classList.remove(
                "no-scroll"
            );

            openLogin();

        }, 1800);


    } catch (error) {

        console.error(
            "Password update error:",
            error
        );


        setMessage(
            $("resetMessage"),
            getAuthErrorMessage(error),
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Update Password";

    }

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

function togglePassword() {

    const input =
        $("loginPassword");


    if (input.type === "password") {

        input.type = "text";

        $("togglePassword").textContent =
            "Hide";

    } else {

        input.type = "password";

        $("togglePassword").textContent =
            "Show";

    }

}


/* =====================================================
   OPEN LOGIN
===================================================== */

function openLogin() {

    $("loginOverlay")
        .classList.remove("hidden");

    document.body.classList.add(
        "no-scroll"
    );

}


/* =====================================================
   CLOSE LOGIN
===================================================== */

function closeLogin() {

    $("loginOverlay")
        .classList.add("hidden");

    document.body.classList.remove(
        "no-scroll"
    );

    setMessage(
        $("loginMessage"),
        "",
        ""
    );

}


/* =====================================================
   FORGOT OPEN
===================================================== */

function openForgotPassword() {

    closeLogin();

    $("forgotOverlay")
        .classList.remove("hidden");

    $("forgotEmail").value =
        $("loginEmail").value.trim();

    document.body.classList.add(
        "no-scroll"
    );

}


/* =====================================================
   FORGOT CLOSE
===================================================== */

function closeForgotPassword() {

    $("forgotOverlay")
        .classList.add("hidden");

    if (
        $("resetOverlay").classList.contains(
            "hidden"
        )
    ) {

        document.body.classList.remove(
            "no-scroll"
        );

    }

}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function openAdminDashboard() {

    $("adminDashboard")
        .classList.remove("hidden");

    document.body.classList.add(
        "no-scroll"
    );

    updateAdminUser();

    updateStats();

}


/* =====================================================
   CLOSE ADMIN DASHBOARD
===================================================== */

function closeAdminDashboard() {

    $("adminDashboard")
        .classList.add("hidden");

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =====================================================
   UPDATE ADMIN USER
===================================================== */

function updateAdminUser() {

    if (!currentUser) {
        return;
    }


    $("adminUserEmail").textContent =
        currentUser.email || "Admin";


    $("adminWelcome").textContent =
        `Welcome, ${currentUser.email || "Admin"}. Manage your HAICO Link Hub here.`;

}


/* =====================================================
   LOGOUT
===================================================== */

async function handleLogout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } = await db.auth.signOut();


    if (error) {

        showToast(
            error.message,
            "error"
        );

        return;

    }


    currentUser = null;

    closeAdminDashboard();

    showToast(
        "You have been logged out.",
        "success"
    );

}


/* =====================================================
   ADMIN NAVIGATION
===================================================== */

function showAdminView(viewId) {

    document
        .querySelectorAll(".admin-view")
        .forEach(view => {

            view.classList.remove("active");

        });


    const target =
        $(viewId);


    if (target) {

        target.classList.add("active");

    }


    document
        .querySelectorAll(".admin-nav-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.view === viewId
            );

        });


    const titles = {

        overviewView:
            "Dashboard Overview",

        projectsView:
            "Manage Projects",

        servicesView:
            "Manage Services",

        brandView:
            "Brand Settings",

        socialView:
            "Social Links"

    };


    $("adminPageTitle").textContent =
        titles[viewId] || "Admin Dashboard";

}


/* =====================================================
   UPDATE STATS
===================================================== */

function updateStats() {

    $("projectCount").textContent =
        projects.length;


    $("serviceCount").textContent =
        services.length;


    $("socialCount").textContent =
        socialLinks.length;


    $("featuredCount").textContent =
        projects.filter(
            project => project.featured === true
        ).length;

}


/* =====================================================
   PROJECT FORM
===================================================== */

function openProjectForm(project = null) {

    $("projectFormModal")
        .classList.remove("hidden");

    document.body.classList.add(
        "no-scroll"
    );


    if (!project) {

        $("projectForm").reset();

        $("projectId").value = "";

        $("projectFormTitle").textContent =
            "Add Project";

        $("projectCreatedBy").value =
            currentUser?.email || "HAICO";

        $("projectBrand").value =
            brandSettings?.brand_name ||
            "HAICO TECH & DESIGN";

        return;

    }


    $("projectFormTitle").textContent =
        "Edit Project";


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


    $("projectBrand").value =
        project.brand ||
        brandSettings?.brand_name ||
        "";


    $("projectTechnologies").value =
        project.technologies || "";


    $("projectStatus").value =
        project.status ||
        "Completed";


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

}


/* =====================================================
   CLOSE PROJECT FORM
===================================================== */

function closeProjectForm() {

    $("projectFormModal")
        .classList.add("hidden");

    document.body.classList.remove(
        "no-scroll"
    );

    $("projectForm").reset();

    setMessage(
        $("projectFormMessage"),
        "",
        ""
    );

}


/* =====================================================
   PROJECT SUBMIT
===================================================== */

async function handleProjectSubmit(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login as administrator first.",
            "error"
        );

        return;

    }


    const button =
        $("saveProjectBtn");


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        const id =
            $("projectId").value.trim();


        const imageFile =
            $("projectImage").files[0];


        const attachmentFile =
            $("projectAttachment").files[0];


        let imageUrl = null;

        let attachmentUrl = null;


        /*
         * EDIT PROJECT
         */

        if (id) {

            const oldProject =
                projects.find(
                    project =>
                        String(project.id) ===
                        String(id)
                );


            imageUrl =
                oldProject?.image_url ||
                null;


            attachmentUrl =
                oldProject?.attachment_url ||
                null;

        }


        /*
         * IMAGE UPLOAD
         */

        if (imageFile) {

            imageUrl =
                await uploadFile(
                    imageFile,
                    PROJECT_IMAGE_BUCKET,
                    "projects"
                );

        }


        /*
         * ATTACHMENT UPLOAD
         */

        if (attachmentFile) {

            attachmentUrl =
                await uploadFile(
                    attachmentFile,
                    ATTACHMENT_BUCKET,
                    "projects"
                );

        }


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
                $("projectCreatedBy").value.trim() ||
                currentUser.email,

            brand:
                $("projectBrand").value.trim() ||
                brandSettings?.brand_name ||
                "HAICO",

            technologies:
                $("projectTechnologies").value.trim(),

            status:
                $("projectStatus").value,

            live_link:
                $("projectLiveLink").value.trim() ||
                null,

            github_link:
                $("projectGithubLink").value.trim() ||
                null,

            whatsapp_link:
                $("projectWhatsappLink").value.trim() ||
                null,

            image_url:
                imageUrl,

            attachment_url:
                attachmentUrl,

            featured:
                $("projectFeatured").checked

        };


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
                    .insert(projectData);

        }


        if (result.error) {

            throw result.error;

        }


        await loadProjects();

        renderProjects();

        renderAdminProjects();

        updateStats();

        closeProjectForm();


        showToast(
            id
                ? "Project updated successfully."
                : "Project added successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Project save error:",
            error
        );


        setMessage(
            $("projectFormMessage"),
            error.message ||
            "Failed to save project.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Save Project";

    }

}


/* =====================================================
   UPLOAD FILE
===================================================== */

async function uploadFile(
    file,
    bucket,
    folder
) {

    const extension =
        file.name.includes(".")
            ? file.name
                .split(".")
                .pop()
                .toLowerCase()
            : "";


    const randomName =
        `${Date.now()}-${crypto.randomUUID()}`;


    const filePath =
        `${folder}/${randomName}${extension ? "." + extension : ""}`;


    const {
        error
    } = await db.storage
        .from(bucket)
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
    } = db.storage
        .from(bucket)
        .getPublicUrl(filePath);


    return data.publicUrl;

}


/* =====================================================
   ADMIN PROJECT LIST
===================================================== */

function renderAdminProjects() {

    const container =
        $("adminProjectsContainer");


    if (!projects.length) {

        container.innerHTML = `
            <div class="admin-form-card">
                No projects have been added yet.
            </div>
        `;

        return;

    }


    container.innerHTML =
        projects.map(project => {

            return `
                <div class="admin-list-item">

                    <div class="admin-item-image">

                        ${
                            project.image_url
                            ?
                            `<img
                                src="${escapeAttribute(project.image_url)}"
                                alt=""
                            >`
                            :
                            `<div
                                style="
                                    width:100%;
                                    height:100%;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    color:white;
                                    font-weight:900;
                                "
                            >
                                H
                            </div>`
                        }

                    </div>


                    <div class="admin-item-info">

                        <strong>
                            ${escapeHTML(
                                project.name || "Untitled"
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                project.category || "Project"
                            )}
                            ·
                            ${escapeHTML(
                                project.status || ""
                            )}
                        </span>

                    </div>


                    <div class="admin-item-actions">

                        <button
                            class="edit-btn"
                            onclick="editProject('${project.id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteProject('${project.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");

}


/* =====================================================
   EDIT PROJECT
===================================================== */

window.editProject = function(id) {

    const project =
        projects.find(
            item =>
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


    openProjectForm(project);

};


/* =====================================================
   DELETE PROJECT
===================================================== */

window.deleteProject = async function(id) {

    const confirmed =
        confirm(
            "Delete this project permanently?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const {
            error
        } = await db
            .from("projects")
            .delete()
            .eq("id", id);


        if (error) {

            throw error;

        }


        await loadProjects();

        renderProjects();

        renderAdminProjects();

        updateStats();


        showToast(
            "Project deleted successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }

};


/* =====================================================
   PROJECT DETAILS
===================================================== */

window.openProjectDetails = function(id) {

    const project =
        projects.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!project) {
        return;
    }


    const links = [];


    if (project.live_link) {

        links.push(`
            <a
                href="${escapeAttribute(project.live_link)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Live Website
            </a>
        `);

    }


    if (project.github_link) {

        links.push(`
            <a
                href="${escapeAttribute(project.github_link)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                GitHub
            </a>
        `);

    }


    if (project.whatsapp_link) {

        links.push(`
            <a
                href="${escapeAttribute(project.whatsapp_link)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                WhatsApp
            </a>
        `);

    }


    if (project.attachment_url) {

        links.push(`
            <a
                href="${escapeAttribute(project.attachment_url)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Download Attachment
            </a>
        `);

    }


    $("projectDetails").innerHTML = `

        ${
            project.image_url
            ?
            `<div class="project-detail-image">
                <img
                    src="${escapeAttribute(project.image_url)}"
                    alt="${escapeAttribute(project.name || "Project")}"
                >
            </div>`
            :
            ""
        }


        <span class="project-detail-category">
            ${escapeHTML(
                project.category || "Project"
            )}
        </span>


        <h2>
            ${escapeHTML(
                project.name || "Untitled Project"
            )}
        </h2>


        <p class="project-detail-description">
            ${escapeHTML(
                project.description || ""
            )}
        </p>


        ${
            project.details
            ?
            `
            <div style="margin-top:20px;">
                <h3>Project Details</h3>

                <p style="color:#6b7280;margin-top:8px;">
                    ${escapeHTML(project.details)}
                </p>
            </div>
            `
            :
            ""
        }


        ${
            project.technologies
            ?
            `
            <div style="margin-top:20px;">
                <h3>Technologies</h3>

                <p style="color:#6b7280;margin-top:8px;">
                    ${escapeHTML(project.technologies)}
                </p>
            </div>
            `
            :
            ""
        }


        ${
            project.created_by
            ?
            `
            <div style="margin-top:20px;">
                <strong>Created by:</strong>
                ${escapeHTML(project.created_by)}
            </div>
            `
            :
            ""
        }


        <div class="project-detail-links">
            ${links.join("")}
        </div>

    `;


    $("projectModal")
        .classList.remove("hidden");

    document.body.classList.add(
        "no-scroll"
    );

};


/* =====================================================
   CLOSE PROJECT DETAILS
===================================================== */

function closeProjectDetails() {

    $("projectModal")
        .classList.add("hidden");

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =====================================================
   SERVICE SUBMIT
===================================================== */

async function handleServiceSubmit(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first.",
            "error"
        );

        return;

    }


    const id =
        $("serviceId").value.trim();


    const serviceData = {

        name:
            $("serviceName").value.trim(),

        icon:
            $("serviceIcon").value.trim() ||
            "◆",

        description:
            $("serviceDescription").value.trim()

    };


    try {

        let result;


        if (id) {

            result =
                await db
                    .from("services")
                    .update(serviceData)
                    .eq("id", id);

        } else {

            result =
                await db
                    .from("services")
                    .insert(serviceData);

        }


        if (result.error) {

            throw result.error;

        }


        await loadServices();

        renderServices();

        renderAdminServices();

        updateStats();

        resetServiceForm();


        showToast(
            id
                ? "Service updated."
                : "Service added.",
            "success"
        );


    } catch (error) {

        console.error(
            "Service save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }

}


/* =====================================================
   SERVICE LIST
===================================================== */

function renderAdminServices() {

    const container =
        $("adminServicesContainer");


    if (!services.length) {

        container.innerHTML = `
            <div class="admin-form-card">
                No services available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        services.map(service => {

            return `
                <div class="admin-list-item">

                    <div class="service-icon">
                        ${escapeHTML(
                            service.icon || "◆"
                        )}
                    </div>

                    <div class="admin-item-info">

                        <strong>
                            ${escapeHTML(
                                service.name || ""
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                service.description || ""
                            )}
                        </span>

                    </div>

                    <div class="admin-item-actions">

                        <button
                            class="edit-btn"
                            onclick="editService('${service.id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteService('${service.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");

}


/* =====================================================
   EDIT SERVICE
===================================================== */

window.editService = function(id) {

    const service =
        services.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!service) {
        return;
    }


    $("serviceId").value =
        service.id;


    $("serviceName").value =
        service.name || "";


    $("serviceIcon").value =
        service.icon || "";


    $("serviceDescription").value =
        service.description || "";


    $("serviceFormTitle").textContent =
        "Edit Service";


    showAdminView("servicesView");

};


/* =====================================================
   DELETE SERVICE
===================================================== */

window.deleteService = async function(id) {

    if (
        !confirm(
            "Delete this service?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await db
            .from("services")
            .delete()
            .eq("id", id);


        if (error) {
            throw error;
        }


        await loadServices();

        renderServices();

        renderAdminServices();

        updateStats();


        showToast(
            "Service deleted.",
            "success"
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

};


/* =====================================================
   RESET SERVICE FORM
===================================================== */

function resetServiceForm() {

    $("serviceForm").reset();

    $("serviceId").value = "";

    $("serviceFormTitle").textContent =
        "Add Service";

}


/* =====================================================
   BRAND SUBMIT
===================================================== */

async function handleBrandSubmit(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first.",
            "error"
        );

        return;

    }


    const brandData = {

        brand_name:
            $("brandName").value.trim(),

        tagline:
            $("brandTagline").value.trim(),

        about_text:
            $("brandAbout").value.trim(),

        logo_url:
            $("brandLogo").value.trim() ||
            null,

        phone:
            $("brandPhone").value.trim(),

        email:
            $("brandEmail").value.trim(),

        whatsapp:
            $("brandWhatsapp").value.trim()

    };


    try {

        let result;


        if (brandSettings?.id) {

            result =
                await db
                    .from("brand_settings")
                    .update(brandData)
                    .eq(
                        "id",
                        brandSettings.id
                    );

        } else {

            result =
                await db
                    .from("brand_settings")
                    .insert(brandData);

        }


        if (result.error) {

            throw result.error;

        }


        await loadBrandSettings();

        renderBrand();


        setMessage(
            $("brandMessage"),
            "Brand settings saved successfully.",
            "success"
        );


        showToast(
            "Brand settings updated.",
            "success"
        );


    } catch (error) {

        console.error(
            "Brand update error:",
            error
        );


        setMessage(
            $("brandMessage"),
            error.message,
            "error"
        );

    }

}


/* =====================================================
   SOCIAL SUBMIT
===================================================== */

async function handleSocialSubmit(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first.",
            "error"
        );

        return;

    }


    const id =
        $("socialId").value.trim();


    const socialData = {

        platform:
            $("socialPlatform").value.trim(),

        url:
            $("socialUrl").value.trim(),

        icon:
            $("socialIcon").value.trim() ||
            "●"

    };


    try {

        let result;


        if (id) {

            result =
                await db
                    .from("social_links")
                    .update(socialData)
                    .eq("id", id);

        } else {

            result =
                await db
                    .from("social_links")
                    .insert(socialData);

        }


        if (result.error) {

            throw result.error;

        }


        await loadSocialLinks();

        renderSocialLinks();

        renderAdminSocial();

        updateStats();

        resetSocialForm();


        showToast(
            id
                ? "Social link updated."
                : "Social link added.",
            "success"
        );


    } catch (error) {

        console.error(
            "Social save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );

    }

}


/* =====================================================
   SOCIAL LIST
===================================================== */

function renderAdminSocial() {

    const container =
        $("adminSocialContainer");


    if (!socialLinks.length) {

        container.innerHTML = `
            <div class="admin-form-card">
                No social links available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        socialLinks.map(link => {

            return `
                <div class="admin-list-item">

                    <div class="service-icon">
                        ${escapeHTML(
                            link.icon || "●"
                        )}
                    </div>

                    <div class="admin-item-info">

                        <strong>
                            ${escapeHTML(
                                link.platform || "Social"
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                link.url || ""
                            )}
                        </span>

                    </div>

                    <div class="admin-item-actions">

                        <button
                            class="edit-btn"
                            onclick="editSocial('${link.id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteSocial('${link.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");

}


/* =====================================================
   EDIT SOCIAL
===================================================== */

window.editSocial = function(id) {

    const link =
        socialLinks.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!link) {
        return;
    }


    $("socialId").value =
        link.id;


    $("socialPlatform").value =
        link.platform || "";


    $("socialUrl").value =
        link.url || "";


    $("socialIcon").value =
        link.icon || "";


    showAdminView("socialView");

};


/* =====================================================
   DELETE SOCIAL
===================================================== */

window.deleteSocial = async function(id) {

    if (
        !confirm(
            "Delete this social link?"
        )
    ) {
        return;
    }


    try {

        const {
            error
        } = await db
            .from("social_links")
            .delete()
            .eq("id", id);


        if (error) {
            throw error;
        }


        await loadSocialLinks();

        renderSocialLinks();

        renderAdminSocial();

        updateStats();


        showToast(
            "Social link deleted.",
            "success"
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

};


/* =====================================================
   RESET SOCIAL FORM
===================================================== */

function resetSocialForm() {

    $("socialForm").reset();

    $("socialId").value = "";

}


/* =====================================================
   WHATSAPP LINK
===================================================== */

function makeWhatsAppLink(value) {

    if (!value) {

        return "#";

    }


    const text =
        String(value).trim();


    if (
        text.startsWith("http://") ||
        text.startsWith("https://")
    ) {

        return text;

    }


    const number =
        text.replace(
            /[^0-9]/g,
            ""
        );


    if (!number) {

        return "#";

    }


    return `https://wa.me/${number}`;

}


/* =====================================================
   AUTH ERROR HANDLING
===================================================== */

function getAuthErrorMessage(error) {

    if (!error) {

        return "An unknown error occurred.";

    }


    const message =
        error.message || "";


    const lower =
        message.toLowerCase();


    if (
        lower.includes("invalid login credentials")
    ) {

        return "Incorrect email or password.";

    }


    if (
        lower.includes("email not confirmed")
    ) {

        return "Please confirm your email address first.";

    }


    if (
        lower.includes("redirect")
    ) {

        return (
            "Password reset redirect URL is not allowed in Supabase. " +
            "Add the GitHub Pages URL to Authentication → URL Configuration."
        );

    }


    if (
        lower.includes("invalid api")
    ) {

        return (
            "Supabase API configuration error. " +
            "Check the Supabase URL and publishable key in app.js."
        );

    }


    return message;

}


/* =====================================================
   MESSAGE
===================================================== */

function setMessage(
    element,
    text,
    type
) {

    element.textContent =
        text || "";


    element.className =
        "form-message";


    if (type) {

        element.classList.add(type);

    }

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(
    message,
    type = "success"
) {

    const toast =
        $("toast");


    toast.textContent =
        message;


    toast.className =
        `toast ${type}`;


    requestAnimationFrame(() => {

        toast.classList.add("show");

    });


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3500);

}


/* =====================================================
   ESCAPE HTML
===================================================== */

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


/* =====================================================
   ESCAPE ATTRIBUTE
===================================================== */

function escapeAttribute(value) {

    return escapeHTML(value);

}

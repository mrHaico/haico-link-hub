/* =====================================================
   HAICO LINK HUB
   APP.JS
===================================================== */


/* =====================================================
   SUPABASE CONFIG
===================================================== */

const SUPABASE_URL =
    "https://lhgjvezxmeedbyiibbin.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Nj4CRhnyMm2Psb209Rnq8w_rXiZLBbX";

const SITE_URL =
    "https://mrhaico.github.io/haico-link-hub/";


/* =====================================================
   GLOBAL STATE
===================================================== */

let db = null;

let currentUser = null;

let brand = null;

let services = [];

let projects = [];

let socialLinks = [];


/* =====================================================
   HELPERS
===================================================== */

function $(id) {
    return document.getElementById(id);
}


function showModal(id) {

    const modal = $(id);

    if (!modal) {
        console.error("Modal not found:", id);
        return;
    }

    modal.classList.add("show");
}


function hideModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("show");
}


function closeAllModals() {

    document
        .querySelectorAll(".modal.show")
        .forEach(modal => {
            modal.classList.remove("show");
        });

}


function setMessage(id, text, type = "error") {

    const element = $(id);

    if (!element) return;

    element.textContent = text;

    element.className =
        "message show " + type;

}


function clearMessage(id) {

    const element = $(id);

    if (!element) return;

    element.textContent = "";

    element.className = "message";

}


function toast(text) {

    const element = $("toast");

    if (!element) return;

    element.textContent = text;

    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 3000);
}


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


function safeUrl(url) {

    if (!url) return "#";

    const value = String(url).trim();

    if (
        value.startsWith("https://") ||
        value.startsWith("http://") ||
        value.startsWith("mailto:") ||
        value.startsWith("tel:")
    ) {
        return value;
    }

    return "#";
}


function normalizeWhatsapp(number) {

    if (!number) return "";

    let value = String(number)
        .replace(/[^\d+]/g, "");

    if (value.startsWith("0")) {
        value = "+255" + value.substring(1);
    }

    value = value.replace("+", "");

    return "https://wa.me/" + value;
}


/* =====================================================
   SUPABASE INITIALIZATION
===================================================== */

function initializeSupabase() {

    if (!window.supabase) {

        console.error(
            "Supabase CDN failed to load."
        );

        toast(
            "Supabase library failed to load. Check internet connection."
        );

        return false;
    }

    try {

        db = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        return true;

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

        toast(
            "Supabase configuration error."
        );

        return false;
    }
}


/* =====================================================
   PUBLIC DATA
===================================================== */

async function loadBrand() {

    try {

        const { data, error } =
            await db
                .from("brand_settings")
                .select("*")
                .limit(1)
                .maybeSingle();

        if (error) {

            console.error(
                "Brand error:",
                error
            );

            return;
        }

        if (!data) return;

        brand = data;

        updateBrandUI();

    } catch (error) {

        console.error(error);
    }
}


function updateBrandUI() {

    if (!brand) return;

    const name =
        brand.brand_name ||
        "HAICO Link Hub";

    const tagline =
        brand.tagline ||
        "Your Idea. Our Creativity. One Digital Solution.";

    const about =
        brand.about_text ||
        "HAICO Link Hub is a professional digital project platform.";


    if ($("headerBrand"))
        $("headerBrand").textContent = name;

    if ($("sidebarBrand"))
        $("sidebarBrand").textContent = name;

    if ($("heroBrand"))
        $("heroBrand").textContent = name;

    if ($("heroTagline"))
        $("heroTagline").textContent = tagline;

    if ($("heroAbout"))
        $("heroAbout").textContent = about;

    if ($("aboutBrand"))
        $("aboutBrand").textContent = name;

    if ($("aboutText"))
        $("aboutText").textContent = about;

    if ($("footerBrand"))
        $("footerBrand").textContent = name;

    if ($("loginBrandName"))
        $("loginBrandName").textContent = name;


    if (brand.phone) {

        $("phoneText").textContent =
            brand.phone;

        $("phoneLink").href =
            "tel:" + brand.phone;
    }


    if (brand.email) {

        $("emailText").textContent =
            brand.email;

        $("emailLink").href =
            "mailto:" + brand.email;
    }


    if (brand.whatsapp) {

        $("whatsappLink").href =
            normalizeWhatsapp(
                brand.whatsapp
            );
    }

}


async function loadServices() {

    try {

        const { data, error } =
            await db
                .from("services")
                .select("*")
                .order("id", {
                    ascending: true
                });

        if (error) {

            console.error(
                "Services error:",
                error
            );

            services = [];

            renderServices();

            return;
        }

        services = data || [];

        renderServices();

    } catch (error) {

        console.error(error);

        services = [];

        renderServices();
    }
}


function renderServices() {

    const grid =
        $("servicesGrid");

    if (!grid) return;

    if (!services.length) {

        grid.innerHTML = `
            <div class="empty">
                No services available yet.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        services.map(service => `

            <article class="service-card">

                <div class="service-icon">
                    ${escapeHTML(
                        service.icon || "🛠"
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        service.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        service.description || ""
                    )}
                </p>

            </article>

        `).join("");
}


async function loadProjects() {

    try {

        const { data, error } =
            await db
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

            projects = [];

            renderProjects();

            return;
        }

        projects = data || [];

        updateCategoryFilter();

        renderProjects();

        renderAdminProjects();

        updateStats();

    } catch (error) {

        console.error(error);

        projects = [];

        renderProjects();
    }
}


function updateCategoryFilter() {

    const select =
        $("categoryFilter");

    if (!select) return;

    const categories =
        [...new Set(
            projects
                .map(project =>
                    project.category
                )
                .filter(Boolean)
        )];

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
}


function renderProjects() {

    const grid =
        $("projectsGrid");

    if (!grid) return;


    const search =
        ($("projectSearch")?.value || "")
            .toLowerCase()
            .trim();

    const category =
        $("categoryFilter")?.value ||
        "all";


    const filtered =
        projects.filter(project => {

            const text = (

                project.name +
                " " +
                project.category +
                " " +
                project.description +
                " " +
                project.technologies

            ).toLowerCase();


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

        grid.innerHTML = `
            <div class="empty">
                No projects found.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        filtered.map(project => {

            const image =
                project.image_url;


            const imageHTML = image
                ? `
                    <img
                        class="project-image"
                        src="${safeUrl(image)}"
                        alt="${escapeHTML(project.name)}"
                        loading="lazy"
                    >
                `
                : `
                    <div class="project-image placeholder">
                        H
                    </div>
                `;


            return `

                <article class="project-card">

                    ${imageHTML}

                    <div class="project-content">

                        <span class="project-category">
                            ${escapeHTML(
                                project.category ||
                                "PROJECT"
                            )}
                        </span>

                        <h3>
                            ${escapeHTML(
                                project.name
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                project.description ||
                                ""
                            )}
                        </p>


                        <div class="project-actions">

                            <button
                                class="primary-action"
                                data-view-project="${project.id}"
                            >
                                View Details
                            </button>


                            ${
                                project.live_link
                                ? `
                                    <a
                                        href="${safeUrl(project.live_link)}"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        Live
                                    </a>
                                `
                                : ""
                            }

                        </div>

                    </div>

                </article>

            `;

        }).join("");
}


function openProjectDetails(id) {

    const project =
        projects.find(
            item => String(item.id) === String(id)
        );

    if (!project) return;


    const image =
        project.image_url
            ? `
                <img
                    class="details-image"
                    src="${safeUrl(project.image_url)}"
                    alt="${escapeHTML(project.name)}"
                >
            `
            : "";


    let links = "";


    if (project.live_link) {

        links += `
            <a
                href="${safeUrl(project.live_link)}"
                target="_blank"
                rel="noopener"
            >
                🌐 Live Website
            </a>
        `;
    }


    if (project.github_link) {

        links += `
            <a
                href="${safeUrl(project.github_link)}"
                target="_blank"
                rel="noopener"
            >
                💻 GitHub
            </a>
        `;
    }


    if (project.whatsapp_link) {

        links += `
            <a
                href="${safeUrl(project.whatsapp_link)}"
                target="_blank"
                rel="noopener"
            >
                💬 WhatsApp
            </a>
        `;
    }


    if (project.attachment_url) {

        links += `
            <a
                href="${safeUrl(project.attachment_url)}"
                target="_blank"
                rel="noopener"
            >
                📎 Attachment
            </a>
        `;
    }


    $("projectDetailsContent").innerHTML = `

        ${image}

        <span class="project-category">
            ${escapeHTML(
                project.category ||
                "PROJECT"
            )}
        </span>

        <h2>
            ${escapeHTML(project.name)}
        </h2>

        <div class="details-meta">

            <strong>Status:</strong>
            ${escapeHTML(
                project.status || "Active"
            )}

            <br>

            ${
                project.brand
                ? `
                    <strong>Brand:</strong>
                    ${escapeHTML(project.brand)}
                    <br>
                `
                : ""
            }

            ${
                project.created_by
                ? `
                    <strong>Created By:</strong>
                    ${escapeHTML(project.created_by)}
                    <br>
                `
                : ""
            }

            ${
                project.technologies
                ? `
                    <strong>Technologies:</strong>
                    ${escapeHTML(project.technologies)}
                `
                : ""
            }

        </div>


        <p>
            ${escapeHTML(
                project.description || ""
            )}
        </p>


        ${
            project.details
            ? `
                <br>

                <h3>
                    Project Details
                </h3>

                <p>
                    ${escapeHTML(
                        project.details
                    )}
                </p>
            `
            : ""
        }


        ${
            links
            ? `
                <div class="details-links">
                    ${links}
                </div>
            `
            : ""
        }

    `;


    showModal(
        "projectDetailsModal"
    );
}


/* =====================================================
   AUTH
===================================================== */

async function checkSession() {

    if (!db) return;

    try {

        const {
            data,
            error
        } = await db.auth.getSession();

        if (error) {

            console.error(error);

            return;
        }

        currentUser =
            data.session?.user ||
            null;

        if (currentUser) {

            $("adminEmailDisplay").textContent =
                currentUser.email || "Admin";

        }

    } catch (error) {

        console.error(error);
    }
}


function openLogin() {

    if (currentUser) {

        showModal(
            "dashboardModal"
        );

        refreshAdminData();

        return;
    }

    clearMessage("loginMessage");

    showModal("loginModal");

    setTimeout(() => {

        $("loginEmail")?.focus();

    }, 100);
}


async function login(event) {

    event.preventDefault();

    clearMessage("loginMessage");


    if (!db) {

        setMessage(
            "loginMessage",
            "Supabase is not ready. Refresh the page.",
            "error"
        );

        return;
    }


    const email =
        $("loginEmail").value.trim();

    const password =
        $("loginPassword").value;


    if (!email || !password) {

        setMessage(
            "loginMessage",
            "Please enter email and password.",
            "error"
        );

        return;
    }


    const button =
        event.submitter ||
        document.querySelector(
            "#loginForm .submit-btn"
        );


    const oldText =
        button?.textContent;


    if (button) {

        button.disabled = true;

        button.textContent =
            "Logging in...";

    }


    try {

        const {
            data,
            error
        } = await db.auth.signInWithPassword({
            email,
            password
        });


        if (error) {

            setMessage(
                "loginMessage",
                error.message,
                "error"
            );

            return;
        }


        currentUser =
            data.user;


        setMessage(
            "loginMessage",
            "Login successful.",
            "success"
        );


        $("adminEmailDisplay").textContent =
            currentUser.email || "Admin";


        setTimeout(() => {

            hideModal("loginModal");

            showModal(
                "dashboardModal"
            );

            refreshAdminData();

        }, 500);


    } catch (error) {

        console.error(error);

        setMessage(
            "loginMessage",
            "Login failed. Please try again.",
            "error"
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                oldText || "Login";

        }

    }
}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

async function sendResetEmail(event) {

    event.preventDefault();

    clearMessage("forgotMessage");


    if (!db) {

        setMessage(
            "forgotMessage",
            "Supabase is not ready.",
            "error"
        );

        return;
    }


    const email =
        $("forgotEmail").value.trim();


    if (!email) {

        setMessage(
            "forgotMessage",
            "Enter your email address.",
            "error"
        );

        return;
    }


    const button =
        event.submitter;


    if (button) {

        button.disabled = true;

        button.textContent =
            "Sending...";

    }


    try {

        const { error } =
            await db.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: SITE_URL
                }
            );


        if (error) {

            console.error(error);

            setMessage(
                "forgotMessage",
                error.message,
                "error"
            );

            return;
        }


        setMessage(
            "forgotMessage",
            "Reset link sent. Check your email.",
            "success"
        );


    } catch (error) {

        console.error(error);

        setMessage(
            "forgotMessage",
            "Unable to send reset email.",
            "error"
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Send Reset Link";

        }

    }
}


/* =====================================================
   RESET PASSWORD
===================================================== */

async function updatePassword(event) {

    event.preventDefault();

    clearMessage("resetMessage");


    const password =
        $("newPassword").value;

    const confirm =
        $("confirmPassword").value;


    if (password.length < 8) {

        setMessage(
            "resetMessage",
            "Password must be at least 8 characters.",
            "error"
        );

        return;
    }


    if (password !== confirm) {

        setMessage(
            "resetMessage",
            "Passwords do not match.",
            "error"
        );

        return;
    }


    try {

        const { error } =
            await db.auth.updateUser({
                password
            });


        if (error) {

            setMessage(
                "resetMessage",
                error.message,
                "error"
            );

            return;
        }


        setMessage(
            "resetMessage",
            "Password updated successfully.",
            "success"
        );


        setTimeout(() => {

            hideModal(
                "resetModal"
            );

            showModal(
                "loginModal"
            );

        }, 1200);


    } catch (error) {

        console.error(error);

        setMessage(
            "resetMessage",
            "Password update failed.",
            "error"
        );
    }
}


/* =====================================================
   LOGOUT
===================================================== */

async function logout() {

    if (!db) return;

    try {

        await db.auth.signOut();

    } catch (error) {

        console.error(error);

    } finally {

        currentUser = null;

        hideModal(
            "dashboardModal"
        );

        toast(
            "You have been logged out."
        );

    }
}


/* =====================================================
   ADMIN DATA
===================================================== */

async function refreshAdminData() {

    await Promise.all([
        loadProjects(),
        loadServices(),
        loadBrand(),
        loadSocialLinks()
    ]);

    fillBrandForm();

    updateStats();

}


/* =====================================================
   STATS
===================================================== */

function updateStats() {

    if ($("statProjects"))
        $("statProjects").textContent =
            projects.length;

    if ($("statServices"))
        $("statServices").textContent =
            services.length;

    if ($("statFeatured"))
        $("statFeatured").textContent =
            projects.filter(
                project => project.featured
            ).length;

}


/* =====================================================
   ADMIN PROJECTS
===================================================== */

function renderAdminProjects() {

    const list =
        $("adminProjectsList");

    if (!list) return;


    if (!projects.length) {

        list.innerHTML = `
            <div class="empty">
                No projects yet.
            </div>
        `;

        return;
    }


    list.innerHTML = `

        <div class="admin-list">

            ${
                projects.map(project => `

                    <div class="admin-item">

                        <div class="admin-item-info">

                            <strong>
                                ${escapeHTML(
                                    project.name
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    project.category || ""
                                )}
                                ·
                                ${escapeHTML(
                                    project.status || ""
                                )}
                            </small>

                        </div>


                        <div class="admin-item-actions">

                            <button
                                data-edit-project="${project.id}"
                            >
                                Edit
                            </button>

                            <button
                                class="delete"
                                data-delete-project="${project.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("")
            }

        </div>

    `;
}


/* =====================================================
   OPEN PROJECT FORM
===================================================== */

function openProjectForm(project = null) {

    $("projectForm").reset();

    $("projectId").value =
        project?.id || "";

    $("projectFormTitle").textContent =
        project
            ? "Edit Project"
            : "Add Project";


    if (project) {

        $("projectName").value =
            project.name || "";

        $("projectCategory").value =
            project.category || "";

        $("projectDescription").value =
            project.description || "";

        $("projectDetails").value =
            project.details || "";

        $("projectCreatedBy").value =
            project.created_by || "";

        $("projectBrand").value =
            project.brand || "";

        $("projectTechnologies").value =
            project.technologies || "";

        $("projectStatus").value =
            project.status || "Completed";

        $("projectLive").value =
            project.live_link || "";

        $("projectGithub").value =
            project.github_link || "";

        $("projectWhatsapp").value =
            project.whatsapp_link || "";

        $("projectImage").value =
            project.image_url || "";

        $("projectAttachment").value =
            project.attachment_url || "";

        $("projectFeatured").checked =
            Boolean(project.featured);

    }


    clearMessage(
        "projectMessage"
    );

    showModal(
        "projectFormModal"
    );
}


/* =====================================================
   SAVE PROJECT
===================================================== */

async function saveProject(event) {

    event.preventDefault();

    clearMessage(
        "projectMessage"
    );


    if (!currentUser) {

        setMessage(
            "projectMessage",
            "Please login first.",
            "error"
        );

        return;
    }


    const id =
        $("projectId").value;


    const payload = {

        name:
            $("projectName").value.trim(),

        category:
            $("projectCategory").value.trim(),

        description:
            $("projectDescription").value.trim(),

        details:
            $("projectDetails").value.trim(),

        created_by:
            $("projectCreatedBy").value.trim(),

        brand:
            $("projectBrand").value.trim(),

        technologies:
            $("projectTechnologies").value.trim(),

        status:
            $("projectStatus").value,

        live_link:
            $("projectLive").value.trim(),

        github_link:
            $("projectGithub").value.trim(),

        whatsapp_link:
            $("projectWhatsapp").value.trim(),

        image_url:
            $("projectImage").value.trim(),

        attachment_url:
            $("projectAttachment").value.trim(),

        featured:
            $("projectFeatured").checked

    };


    if (!payload.name ||
        !payload.category) {

        setMessage(
            "projectMessage",
            "Project name and category are required.",
            "error"
        );

        return;
    }


    const button =
        event.submitter;

    const oldText =
        button?.textContent;


    if (button) {

        button.disabled = true;

        button.textContent =
            "Saving...";

    }


    try {

        let result;


        if (id) {

            result =
                await db
                    .from("projects")
                    .update(payload)
                    .eq("id", id);

        } else {

            result =
                await db
                    .from("projects")
                    .insert([
                        payload
                    ]);

        }


        if (result.error) {

            throw result.error;

        }


        setMessage(
            "projectMessage",
            "Project saved successfully.",
            "success"
        );


        await loadProjects();


        setTimeout(() => {

            hideModal(
                "projectFormModal"
            );

        }, 700);


    } catch (error) {

        console.error(error);

        setMessage(
            "projectMessage",
            error.message ||
            "Could not save project.",
            "error"
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                oldText || "Save Project";

        }

    }
}


/* =====================================================
   DELETE PROJECT
===================================================== */

async function deleteProject(id) {

    if (!currentUser) return;


    const project =
        projects.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!project) return;


    const confirmed =
        confirm(
            `Delete "${project.name}"?`
        );


    if (!confirmed) return;


    try {

        const { error } =
            await db
                .from("projects")
                .delete()
                .eq("id", id);


        if (error) throw error;


        toast(
            "Project deleted."
        );


        await loadProjects();


    } catch (error) {

        console.error(error);

        toast(
            "Could not delete project."
        );

    }
}


/* =====================================================
   SERVICES ADMIN
===================================================== */

function renderAdminServices() {

    const list =
        $("adminServicesList");

    if (!list) return;


    if (!services.length) {

        list.innerHTML = `
            <div class="empty">
                No services yet.
            </div>
        `;

        return;
    }


    list.innerHTML = `

        <div class="admin-list">

            ${
                services.map(service => `

                    <div class="admin-item">

                        <div class="admin-item-info">

                            <strong>
                                ${
                                    escapeHTML(
                                        service.icon ||
                                        "🛠"
                                    )
                                }
                                ${
                                    escapeHTML(
                                        service.name
                                    )
                                }
                            </strong>

                            <small>
                                ${
                                    escapeHTML(
                                        service.description ||
                                        ""
                                    )
                                }
                            </small>

                        </div>


                        <div class="admin-item-actions">

                            <button
                                data-edit-service="${service.id}"
                            >
                                Edit
                            </button>

                            <button
                                class="delete"
                                data-delete-service="${service.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("")
            }

        </div>

    `;
}


function openServiceForm(service = null) {

    $("serviceForm").reset();

    $("serviceId").value =
        service?.id || "";


    if (service) {

        $("serviceName").value =
            service.name || "";

        $("serviceIcon").value =
            service.icon || "";

        $("serviceDescription").value =
            service.description || "";

    }


    clearMessage(
        "serviceMessage"
    );

    showModal(
        "serviceFormModal"
    );
}


async function saveService(event) {

    event.preventDefault();

    clearMessage(
        "serviceMessage"
    );


    const id =
        $("serviceId").value;


    const payload = {

        name:
            $("serviceName").value.trim(),

        icon:
            $("serviceIcon").value.trim(),

        description:
            $("serviceDescription").value.trim()

    };


    if (!payload.name) {

        setMessage(
            "serviceMessage",
            "Service name is required.",
            "error"
        );

        return;
    }


    try {

        let result;


        if (id) {

            result =
                await db
                    .from("services")
                    .update(payload)
                    .eq("id", id);

        } else {

            result =
                await db
                    .from("services")
                    .insert([
                        payload
                    ]);

        }


        if (result.error)
            throw result.error;


        setMessage(
            "serviceMessage",
            "Service saved successfully.",
            "success"
        );


        await loadServices();


        setTimeout(() => {

            hideModal(
                "serviceFormModal"
            );

        }, 700);


    } catch (error) {

        console.error(error);

        setMessage(
            "serviceMessage",
            error.message ||
            "Could not save service.",
            "error"
        );

    }
}


async function deleteService(id) {

    if (!confirm(
        "Delete this service?"
    )) return;


    try {

        const { error } =
            await db
                .from("services")
                .delete()
                .eq("id", id);


        if (error) throw error;


        toast(
            "Service deleted."
        );


        await loadServices();


    } catch (error) {

        console.error(error);

        toast(
            "Could not delete service."
        );

    }
}


/* =====================================================
   BRAND ADMIN
===================================================== */

function fillBrandForm() {

    if (!brand) return;


    $("brandNameInput").value =
        brand.brand_name || "";

    $("brandTaglineInput").value =
        brand.tagline || "";

    $("brandAboutInput").value =
        brand.about_text || "";

    $("brandPhoneInput").value =
        brand.phone || "";

    $("brandEmailInput").value =
        brand.email || "";

    $("brandWhatsappInput").value =
        brand.whatsapp || "";

    $("brandLogoInput").value =
        brand.logo_url || "";
}


async function saveBrand(event) {

    event.preventDefault();

    clearMessage(
        "brandMessage"
    );


    const payload = {

        brand_name:
            $("brandNameInput").value.trim(),

        tagline:
            $("brandTaglineInput").value.trim(),

        about_text:
            $("brandAboutInput").value.trim(),

        phone:
            $("brandPhoneInput").value.trim(),

        email:
            $("brandEmailInput").value.trim(),

        whatsapp:
            $("brandWhatsappInput").value.trim(),

        logo_url:
            $("brandLogoInput").value.trim()

    };


    try {

        let result;


        if (brand?.id) {

            result =
                await db
                    .from("brand_settings")
                    .update(payload)
                    .eq("id", brand.id);

        } else {

            result =
                await db
                    .from("brand_settings")
                    .insert([
                        payload
                    ]);

        }


        if (result.error)
            throw result.error;


        await loadBrand();


        setMessage(
            "brandMessage",
            "Brand settings saved successfully.",
            "success"
        );


        toast(
            "Brand updated."
        );


    } catch (error) {

        console.error(error);

        setMessage(
            "brandMessage",
            error.message ||
            "Could not save brand settings.",
            "error"
        );

    }
}


/* =====================================================
   SOCIAL LINKS
===================================================== */

async function loadSocialLinks() {

    try {

        const { data, error } =
            await db
                .from("social_links")
                .select("*")
                .order("id", {
                    ascending: true
                });


        if (error) {

            console.error(error);

            socialLinks = [];

            renderAdminSocial();

            return;
        }


        socialLinks =
            data || [];

        renderAdminSocial();


    } catch (error) {

        console.error(error);

    }
}


function renderAdminSocial() {

    const list =
        $("adminSocialList");

    if (!list) return;


    if (!socialLinks.length) {

        list.innerHTML = `
            <div class="empty">
                No social links yet.
            </div>
        `;

        return;
    }


    list.innerHTML = `

        <div class="admin-list">

            ${
                socialLinks.map(link => `

                    <div class="admin-item">

                        <div class="admin-item-info">

                            <strong>
                                ${
                                    escapeHTML(
                                        link.icon || "🔗"
                                    )
                                }

                                ${
                                    escapeHTML(
                                        link.platform
                                    )
                                }
                            </strong>

                            <small>
                                ${
                                    escapeHTML(
                                        link.url
                                    )
                                }
                            </small>

                        </div>


                        <div class="admin-item-actions">

                            <button
                                data-edit-social="${link.id}"
                            >
                                Edit
                            </button>

                            <button
                                class="delete"
                                data-delete-social="${link.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("")
            }

        </div>

    `;
}


function openSocialForm(link = null) {

    $("socialForm").reset();

    $("socialId").value =
        link?.id || "";


    if (link) {

        $("socialPlatform").value =
            link.platform || "";

        $("socialIcon").value =
            link.icon || "";

        $("socialUrl").value =
            link.url || "";

    }


    clearMessage(
        "socialMessage"
    );

    showModal(
        "socialFormModal"
    );
}


async function saveSocial(event) {

    event.preventDefault();

    clearMessage(
        "socialMessage"
    );


    const id =
        $("socialId").value;


    const payload = {

        platform:
            $("socialPlatform").value.trim(),

        icon:
            $("socialIcon").value.trim(),

        url:
            $("socialUrl").value.trim()

    };


    if (!payload.platform ||
        !payload.url) {

        setMessage(
            "socialMessage",
            "Platform and URL are required.",
            "error"
        );

        return;
    }


    try {

        let result;


        if (id) {

            result =
                await db
                    .from("social_links")
                    .update(payload)
                    .eq("id", id);

        } else {

            result =
                await db
                    .from("social_links")
                    .insert([
                        payload
                    ]);

        }


        if (result.error)
            throw result.error;


        await loadSocialLinks();


        setMessage(
            "socialMessage",
            "Social link saved.",
            "success"
        );


        setTimeout(() => {

            hideModal(
                "socialFormModal"
            );

        }, 700);


    } catch (error) {

        console.error(error);

        setMessage(
            "socialMessage",
            error.message ||
            "Could not save social link.",
            "error"
        );

    }
}


async function deleteSocial(id) {

    if (!confirm(
        "Delete this social link?"
    )) return;


    try {

        const { error } =
            await db
                .from("social_links")
                .delete()
                .eq("id", id);


        if (error) throw error;


        toast(
            "Social link deleted."
        );


        await loadSocialLinks();


    } catch (error) {

        console.error(error);

        toast(
            "Could not delete social link."
        );

    }
}


/* =====================================================
   SIDEBAR
===================================================== */

function openSidebar() {

    $("sidebar")?.classList.add(
        "open"
    );

    $("sidebarOverlay")?.classList.add(
        "show"
    );
}


function closeSidebar() {

    $("sidebar")?.classList.remove(
        "open"
    );

    $("sidebarOverlay")?.classList.remove(
        "show"
    );
}


/* =====================================================
   DASHBOARD TABS
===================================================== */

function switchDashboardTab(tabName) {

    document
        .querySelectorAll(".dash-tab")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tab === tabName
            );

        });


    document
        .querySelectorAll(".dashboard-tab")
        .forEach(section => {

            section.classList.toggle(
                "active",
                section.id ===
                "tab-" + tabName
            );

        });

}


/* =====================================================
   EVENT DELEGATION
   THIS PREVENTS ADMIN LOGIN BUTTON ISSUES
===================================================== */

function setupEvents() {


    /* ADMIN LOGIN BUTTONS */

    document.addEventListener(
        "click",
        event => {

            const loginButton =
                event.target.closest(
                    "#adminLoginBtn, #sidebarAdminBtn, #footerAdminBtn"
                );


            if (loginButton) {

                event.preventDefault();

                closeSidebar();

                openLogin();

                return;
            }


            /* CLOSE MODALS */

            const closeButton =
                event.target.closest(
                    "[data-close]"
                );


            if (closeButton) {

                hideModal(
                    closeButton.dataset.close
                );

                return;
            }


            /* VIEW PROJECT */

            const viewProject =
                event.target.closest(
                    "[data-view-project]"
                );


            if (viewProject) {

                openProjectDetails(
                    viewProject.dataset.viewProject
                );

                return;
            }


            /* EDIT PROJECT */

            const editProject =
                event.target.closest(
                    "[data-edit-project]"
                );


            if (editProject) {

                const project =
                    projects.find(
                        item =>
                            String(item.id) ===
                            String(
                                editProject.dataset.editProject
                            )
                    );

                if (project)
                    openProjectForm(project);

                return;
            }


            /* DELETE PROJECT */

            const deleteProjectButton =
                event.target.closest(
                    "[data-delete-project]"
                );


            if (deleteProjectButton) {

                deleteProject(
                    deleteProjectButton.dataset.deleteProject
                );

                return;
            }


            /* EDIT SERVICE */

            const editService =
                event.target.closest(
                    "[data-edit-service]"
                );


            if (editService) {

                const service =
                    services.find(
                        item =>
                            String(item.id) ===
                            String(
                                editService.dataset.editService
                            )
                    );

                if (service)
                    openServiceForm(service);

                return;
            }


            /* DELETE SERVICE */

            const deleteServiceButton =
                event.target.closest(
                    "[data-delete-service]"
                );


            if (deleteServiceButton) {

                deleteService(
                    deleteServiceButton.dataset.deleteService
                );

                return;
            }


            /* EDIT SOCIAL */

            const editSocial =
                event.target.closest(
                    "[data-edit-social]"
                );


            if (editSocial) {

                const link =
                    socialLinks.find(
                        item =>
                            String(item.id) ===
                            String(
                                editSocial.dataset.editSocial
                            )
                    );

                if (link)
                    openSocialForm(link);

                return;
            }


            /* DELETE SOCIAL */

            const deleteSocialButton =
                event.target.closest(
                    "[data-delete-social]"
                );


            if (deleteSocialButton) {

                deleteSocial(
                    deleteSocialButton.dataset.deleteSocial
                );

                return;
            }


            /* DASHBOARD TABS */

            const tab =
                event.target.closest(
                    ".dash-tab"
                );


            if (tab) {

                switchDashboardTab(
                    tab.dataset.tab
                );

                return;
            }

        }
    );


    /* MENU */

    $("menuBtn")?.addEventListener(
        "click",
        openSidebar
    );


    $("closeSidebarBtn")?.addEventListener(
        "click",
        closeSidebar
    );


    $("sidebarOverlay")?.addEventListener(
        "click",
        closeSidebar
    );


    /* SIDEBAR LINKS */

    document
        .querySelectorAll(
            ".sidebar-nav a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                closeSidebar
            );

        });


    /* LOGIN FORM */

    $("loginForm")?.addEventListener(
        "submit",
        login
    );


    /* FORGOT */

    $("forgotPasswordBtn")?.addEventListener(
        "click",
        () => {

            hideModal("loginModal");

            $("forgotEmail").value =
                $("loginEmail").value || "";

            clearMessage(
                "forgotMessage"
            );

            showModal(
                "forgotModal"
            );

        }
    );


    $("forgotForm")?.addEventListener(
        "submit",
        sendResetEmail
    );


    /* RESET */

    $("resetForm")?.addEventListener(
        "submit",
        updatePassword
    );


    /* PASSWORD TOGGLE */

    $("togglePassword")?.addEventListener(
        "click",
        () => {

            const input =
                $("loginPassword");

            if (!input) return;

            input.type =
                input.type === "password"
                    ? "text"
                    : "password";

        }
    );


    /* LOGOUT */

    $("logoutBtn")?.addEventListener(
        "click",
        logout
    );


    /* ADD PROJECT */

    $("addProjectBtn")?.addEventListener(
        "click",
        () => openProjectForm()
    );


    /* PROJECT FORM */

    $("projectForm")?.addEventListener(
        "submit",
        saveProject
    );


    /* ADD SERVICE */

    $("addServiceBtn")?.addEventListener(
        "click",
        () => openServiceForm()
    );


    /* SERVICE FORM */

    $("serviceForm")?.addEventListener(
        "submit",
        saveService
    );


    /* BRAND FORM */

    $("brandForm")?.addEventListener(
        "submit",
        saveBrand
    );


    /* ADD SOCIAL */

    $("addSocialBtn")?.addEventListener(
        "click",
        () => openSocialForm()
    );


    /* SOCIAL FORM */

    $("socialForm")?.addEventListener(
        "submit",
        saveSocial
    );


    /* SEARCH */

    $("projectSearch")?.addEventListener(
        "input",
        renderProjects
    );


    /* CATEGORY */

    $("categoryFilter")?.addEventListener(
        "change",
        renderProjects
    );


    /* CLOSE MODAL BY BACKDROP */

    document.addEventListener(
        "click",
        event => {

            if (
                event.target.classList.contains(
                    "modal"
                )
            ) {

                event.target.classList.remove(
                    "show"
                );

            }

        }
    );


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeAllModals();

                closeSidebar();

            }

        }
    );

}


/* =====================================================
   AUTH STATE
===================================================== */

function setupAuthListener() {

    if (!db) return;


    db.auth.onAuthStateChange(
        (event, session) => {

            currentUser =
                session?.user ||
                null;


            if (currentUser) {

                if ($("adminEmailDisplay")) {

                    $("adminEmailDisplay")
                        .textContent =
                        currentUser.email ||
                        "Admin";

                }

            }

        }
    );

}


/* =====================================================
   PASSWORD RECOVERY DETECTION
===================================================== */

async function checkPasswordRecovery() {

    if (!db) return;


    try {

        const {
            data: {
                session
            }
        } = await db.auth.getSession();


        const hash =
            window.location.hash;


        if (
            hash.includes(
                "type=recovery"
            ) &&
            session
        ) {

            showModal(
                "resetModal"
            );

        }

    } catch (error) {

        console.error(error);

    }

}


/* =====================================================
   INITIAL LOAD
===================================================== */

async function initializeApp() {

    console.log(
        "HAICO Link Hub starting..."
    );


    if (!initializeSupabase()) {

        return;
    }


    setupEvents();

    setupAuthListener();


    await checkSession();


    await Promise.all([
        loadBrand(),
        loadServices(),
        loadProjects(),
        loadSocialLinks()
    ]);


    await checkPasswordRecovery();


    if ($("year")) {

        $("year").textContent =
            new Date().getFullYear();

    }


    console.log(
        "HAICO Link Hub ready."
    );

}


/* =====================================================
   START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}

/* =========================================================
   HAICO LINK HUB
   Supabase + Auth + Storage + Database
   ========================================================= */

const SUPABASE_URL =
    "https://lhgjvezxmeedbyiibbin.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Nj4CRhnyMm2Psb209Rnq8w_rXiZLBbX";

/*
 IMPORTANT:
 This URL must also exist in:
 Supabase > Authentication > URL Configuration
*/
const SITE_URL =
    "https://mrhaico.github.io/haico-link-hub/";

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   STATE
   ========================================================= */

let projects = [];
let services = [];
let socialLinks = [];
let brandSettings = null;
let currentUser = null;


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

function showModal(id) {
    $(id).classList.add("show");
}

function hideModal(id) {
    $(id).classList.remove("show");
}

function message(id, text, success = false) {
    const el = $(id);

    if (!el) return;

    el.textContent = text;
    el.style.color = success
        ? "#16855b"
        : "#d64545";
}

function toast(text) {
    const el = $("toast");

    el.textContent = text;
    el.classList.add("show");

    setTimeout(() => {
        el.classList.remove("show");
    }, 3000);
}

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normalizeWhatsapp(number = "") {
    return String(number)
        .replace(/\D/g, "");
}


/* =========================================================
   PUBLIC BRAND
   ========================================================= */

function renderBrand() {

    const brand =
        brandSettings || {};

    const name =
        brand.brand_name ||
        "HAICO Link Hub";

    const tagline =
        brand.tagline ||
        "Your Idea. Our Creativity. One Digital Solution.";

    $("heroBrand").textContent = name;
    $("headerBrand").textContent = name;
    $("footerBrand").textContent = name;

    $("heroTagline").textContent = tagline;
    $("authTagline").textContent = tagline;

    $("aboutText").textContent =
        brand.about_text ||
        "Welcome to HAICO Link Hub. Discover digital projects, websites, applications, management systems and creative digital solutions.";

    if (brand.phone) {

        $("phoneText").textContent =
            brand.phone;

        $("phoneText").href =
            "tel:" + brand.phone;
    }

    if (brand.email) {

        $("emailContact").textContent =
            brand.email;

        $("emailContact").href =
            "mailto:" + brand.email;
    }

    if (brand.whatsapp) {

        const number =
            normalizeWhatsapp(brand.whatsapp);

        $("whatsappContact").href =
            "https://wa.me/" + number;

        $("whatsappContact").textContent =
            "Chat on WhatsApp";
    }
}


/* =========================================================
   LOAD BRAND
   ========================================================= */

async function loadBrand() {

    const { data, error } =
        await db
            .from("brand_settings")
            .select("*")
            .limit(1)
            .maybeSingle();

    if (error) {

        console.error("Brand error:", error);

        return;
    }

    brandSettings = data;

    renderBrand();

    if (brandSettings) {

        $("brandName").value =
            brandSettings.brand_name || "";

        $("brandTagline").value =
            brandSettings.tagline || "";

        $("brandAbout").value =
            brandSettings.about_text || "";

        $("brandLogo").value =
            brandSettings.logo_url || "";

        $("brandPhone").value =
            brandSettings.phone || "";

        $("brandEmail").value =
            brandSettings.email || "";

        $("brandWhatsapp").value =
            brandSettings.whatsapp || "";
    }
}


/* =========================================================
   SERVICES
   ========================================================= */

async function loadServices() {

    const { data, error } =
        await db
            .from("services")
            .select("*")
            .order("id", { ascending: true });

    if (error) {

        console.error("Services error:", error);

        return;
    }

    services = data || [];

    renderServices();
    renderAdminServices();
    updateStats();
}

function renderServices() {

    const container =
        $("servicesContainer");

    if (!services.length) {

        container.innerHTML = `
            <div class="about-card">
                No services available yet.
            </div>
        `;

        return;
    }

    container.innerHTML =
        services.map(service => `

            <article class="service-card">

                <div class="service-icon">
                    ${escapeHTML(service.icon || "🛠")}
                </div>

                <h3>
                    ${escapeHTML(service.name)}
                </h3>

                <p>
                    ${escapeHTML(service.description || "")}
                </p>

            </article>

        `).join("");
}

function renderAdminServices() {

    const container =
        $("adminServicesContainer");

    if (!services.length) {

        container.innerHTML =
            "<p>No services found.</p>";

        return;
    }

    container.innerHTML =
        services.map(service => `

            <div class="admin-item">

                <div class="admin-item-info">

                    <h3>
                        ${escapeHTML(service.icon || "🛠")}
                        ${escapeHTML(service.name)}
                    </h3>

                    <p>
                        ${escapeHTML(service.description || "")}
                    </p>

                </div>

                <div class="admin-item-actions">

                    <button
                        class="small-btn"
                        onclick="editService('${service.id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="small-btn danger"
                        onclick="deleteService('${service.id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");
}


/* =========================================================
   PROJECTS
   ========================================================= */

async function loadProjects() {

    const { data, error } =
        await db
            .from("projects")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error("Projects error:", error);

        $("projectsContainer").innerHTML = `
            <div class="about-card">
                Unable to load projects.
            </div>
        `;

        return;
    }

    projects = data || [];

    renderCategoryFilter();
    renderProjects();
    renderAdminProjects();
    updateStats();
}


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

    select.innerHTML =
        `<option value="">All Categories</option>` +
        categories.map(category => `
            <option value="${escapeHTML(category)}">
                ${escapeHTML(category)}
            </option>
        `).join("");

    select.value = current;
}


function renderProjects() {

    const container =
        $("projectsContainer");

    const search =
        $("searchInput").value
            .toLowerCase()
            .trim();

    const category =
        $("categoryFilter").value;

    const filtered =
        projects.filter(project => {

            const searchable = `
                ${project.name || ""}
                ${project.category || ""}
                ${project.description || ""}
                ${project.technologies || ""}
                ${project.brand || ""}
            `.toLowerCase();

            const matchSearch =
                !search ||
                searchable.includes(search);

            const matchCategory =
                !category ||
                project.category === category;

            return matchSearch && matchCategory;
        });


    if (!filtered.length) {

        container.innerHTML = `
            <div class="about-card">
                No projects found.
            </div>
        `;

        return;
    }


    container.innerHTML =
        filtered.map(project => {

            const image =
                project.image_url
                    ? `
                        <img
                            class="project-image"
                            src="${escapeHTML(project.image_url)}"
                            alt="${escapeHTML(project.name)}"
                        >
                    `
                    : `
                        <div class="project-no-image">
                            🚀
                        </div>
                    `;

            return `

                <article class="project-card">

                    ${image}

                    <div class="project-content">

                        <span class="project-category">
                            ${escapeHTML(project.category || "Project")}
                        </span>

                        <h3>
                            ${escapeHTML(project.name)}
                        </h3>

                        <p>
                            ${escapeHTML(project.description || "")}
                        </p>

                        <div class="project-actions">

                            <button
                                class="small-btn primary"
                                onclick="viewProject('${project.id}')"
                            >
                                View Details
                            </button>

                            ${
                                project.live_link
                                ? `
                                    <a
                                        class="small-btn"
                                        href="${escapeHTML(project.live_link)}"
                                        target="_blank"
                                    >
                                        Live
                                    </a>
                                `
                                : ""
                            }

                            ${
                                project.whatsapp_link
                                ? `
                                    <a
                                        class="small-btn"
                                        href="${escapeHTML(project.whatsapp_link)}"
                                        target="_blank"
                                    >
                                        WhatsApp
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


function renderAdminProjects() {

    const container =
        $("adminProjectsContainer");

    if (!projects.length) {

        container.innerHTML =
            "<p>No projects found.</p>";

        return;
    }

    container.innerHTML =
        projects.map(project => `

            <div class="admin-item">

                <div class="admin-item-info">

                    <h3>
                        ${escapeHTML(project.name)}
                    </h3>

                    <p>
                        ${escapeHTML(project.category || "")}
                        ·
                        ${escapeHTML(project.status || "")}
                    </p>

                </div>

                <div class="admin-item-actions">

                    <button
                        class="small-btn"
                        onclick="viewProject('${project.id}')"
                    >
                        View
                    </button>

                    <button
                        class="small-btn"
                        onclick="editProject('${project.id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="small-btn danger"
                        onclick="deleteProject('${project.id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");
}


/* =========================================================
   PROJECT DETAILS
   ========================================================= */

function viewProject(id) {

    const project =
        projects.find(p => String(p.id) === String(id));

    if (!project) return;

    const image =
        project.image_url
            ? `
                <img
                    src="${escapeHTML(project.image_url)}"
                    class="detail-image"
                    alt="${escapeHTML(project.name)}"
                >
            `
            : "";

    $("projectDetails").innerHTML = `

        ${image}

        <span class="project-category">
            ${escapeHTML(project.category || "")}
        </span>

        <h1>
            ${escapeHTML(project.name)}
        </h1>

        <div class="detail-meta">

            ${
                project.status
                ? `<span>Status: ${escapeHTML(project.status)}</span>`
                : ""
            }

            ${
                project.brand
                ? `<span>Brand: ${escapeHTML(project.brand)}</span>`
                : ""
            }

            ${
                project.created_by
                ? `<span>Created by: ${escapeHTML(project.created_by)}</span>`
                : ""
            }

            ${
                project.technologies
                ? `<span>Tech: ${escapeHTML(project.technologies)}</span>`
                : ""
            }

        </div>

        <h3>Description</h3>

        <p>
            ${escapeHTML(project.description || "No description.")}
        </p>

        ${
            project.details
            ? `
                <br>
                <h3>Details</h3>
                <p>
                    ${escapeHTML(project.details)}
                </p>
            `
            : ""
        }

        <div class="detail-links">

            ${
                project.live_link
                ? `
                    <a
                        href="${escapeHTML(project.live_link)}"
                        target="_blank"
                    >
                        🌐 Live Website
                    </a>
                `
                : ""
            }

            ${
                project.github_link
                ? `
                    <a
                        href="${escapeHTML(project.github_link)}"
                        target="_blank"
                    >
                        💻 GitHub
                    </a>
                `
                : ""
            }

            ${
                project.whatsapp_link
                ? `
                    <a
                        href="${escapeHTML(project.whatsapp_link)}"
                        target="_blank"
                    >
                        💬 WhatsApp
                    </a>
                `
                : ""
            }

            ${
                project.attachment_url
                ? `
                    <a
                        href="${escapeHTML(project.attachment_url)}"
                        target="_blank"
                        download
                    >
                        📎 Download
                    </a>
                `
                : ""
            }

        </div>
    `;

    showModal("projectModal");
}


/* =========================================================
   IMAGE / FILE UPLOAD
   ========================================================= */

async function uploadFile(
    file,
    bucket,
    folder
) {

    if (!file) return null;

    const extension =
        file.name.includes(".")
            ? file.name.split(".").pop()
            : "file";

    const fileName =
        `${folder}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${extension}`;

    const { error } =
        await db.storage
            .from(bucket)
            .upload(fileName, file, {
                upsert: false
            });

    if (error) {
        throw error;
    }

    const { data } =
        db.storage
            .from(bucket)
            .getPublicUrl(fileName);

    return data.publicUrl;
}


/* =========================================================
   ADD / EDIT PROJECT
   ========================================================= */

function openNewProjectForm() {

    $("projectForm").reset();

    $("projectId").value = "";

    $("projectFormTitle").textContent =
        "Add Project";

    $("projectFormMessage").textContent = "";

    showModal("projectFormModal");
}


function editProject(id) {

    const project =
        projects.find(p => String(p.id) === String(id));

    if (!project) return;

    $("projectId").value =
        project.id;

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
        project.brand || "";

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
        !!project.featured;

    $("projectFormTitle").textContent =
        "Edit Project";

    $("projectFormMessage").textContent = "";

    showModal("projectFormModal");
}


$("projectForm").addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (!currentUser) {
            toast("Please login first.");
            return;
        }

        const button =
            $("saveProjectBtn");

        button.disabled = true;
        button.textContent = "Saving...";

        try {

            const id =
                $("projectId").value;

            let imageUrl = null;
            let attachmentUrl = null;

            const imageFile =
                $("projectImage").files[0];

            const attachmentFile =
                $("projectAttachment").files[0];


            if (imageFile) {

                imageUrl =
                    await uploadFile(
                        imageFile,
                        "project-images",
                        "projects"
                    );
            }


            if (attachmentFile) {

                attachmentUrl =
                    await uploadFile(
                        attachmentFile,
                        "attachments",
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
                    $("projectCreatedBy").value.trim(),

                brand:
                    $("projectBrand").value.trim() ||
                    brandSettings?.brand_name ||
                    "HAICO",

                technologies:
                    $("projectTechnologies").value.trim(),

                status:
                    $("projectStatus").value,

                live_link:
                    $("projectLiveLink").value.trim() || null,

                github_link:
                    $("projectGithubLink").value.trim() || null,

                whatsapp_link:
                    $("projectWhatsappLink").value.trim() || null,

                featured:
                    $("projectFeatured").checked
            };


            if (imageUrl) {
                projectData.image_url =
                    imageUrl;
            }

            if (attachmentUrl) {
                projectData.attachment_url =
                    attachmentUrl;
            }


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


            hideModal("projectFormModal");

            $("projectForm").reset();

            toast(
                id
                    ? "Project updated successfully."
                    : "Project added successfully."
            );

            await loadProjects();

        } catch (error) {

            console.error(error);

            message(
                "projectFormMessage",
                error.message
            );

        } finally {

            button.disabled = false;
            button.textContent = "Save Project";
        }
    }
);


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(id) {

    if (!currentUser) return;

    if (!confirm("Delete this project?")) {
        return;
    }

    const { error } =
        await db
            .from("projects")
            .delete()
            .eq("id", id);

    if (error) {

        toast(error.message);

        return;
    }

    toast("Project deleted.");

    await loadProjects();
}


/* =========================================================
   SERVICES CRUD
   ========================================================= */

$("serviceForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const id =
            $("serviceId").value;

        const serviceData = {

            name:
                $("serviceName").value.trim(),

            icon:
                $("serviceIcon").value.trim(),

            description:
                $("serviceDescription").value.trim()
        };


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
                    .insert([
                        serviceData
                    ]);
        }


        if (result.error) {

            message(
                "serviceMessage",
                result.error.message
            );

            return;
        }


        message(
            "serviceMessage",
            "Service saved successfully.",
            true
        );

        $("serviceForm").reset();
        $("serviceId").value = "";

        await loadServices();
    }
);


function editService(id) {

    const service =
        services.find(
            s => String(s.id) === String(id)
        );

    if (!service) return;

    $("serviceId").value =
        service.id;

    $("serviceName").value =
        service.name || "";

    $("serviceIcon").value =
        service.icon || "";

    $("serviceDescription").value =
        service.description || "";

    $("servicesTab").scrollIntoView();
}


async function deleteService(id) {

    if (!confirm("Delete this service?")) {
        return;
    }

    const { error } =
        await db
            .from("services")
            .delete()
            .eq("id", id);

    if (error) {

        toast(error.message);

        return;
    }

    toast("Service deleted.");

    await loadServices();
}


/* =========================================================
   BRAND UPDATE
   ========================================================= */

$("brandForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const brandData = {

            brand_name:
                $("brandName").value.trim(),

            tagline:
                $("brandTagline").value.trim(),

            about_text:
                $("brandAbout").value.trim(),

            logo_url:
                $("brandLogo").value.trim() || null,

            phone:
                $("brandPhone").value.trim(),

            email:
                $("brandEmail").value.trim(),

            whatsapp:
                $("brandWhatsapp").value.trim()
        };


        let result;


        if (brandSettings?.id) {

            result =
                await db
                    .from("brand_settings")
                    .update(brandData)
                    .eq("id", brandSettings.id);

        } else {

            result =
                await db
                    .from("brand_settings")
                    .insert([
                        brandData
                    ]);
        }


        if (result.error) {

            message(
                "brandMessage",
                result.error.message
            );

            return;
        }


        message(
            "brandMessage",
            "Brand settings saved successfully.",
            true
        );

        await loadBrand();

        toast("Brand updated.");
    }
);


/* =========================================================
   SOCIAL LINKS
   ========================================================= */

async function loadSocialLinks() {

    const { data, error } =
        await db
            .from("social_links")
            .select("*")
            .order("id", {
                ascending: true
            });

    if (error) {

        console.error(error);

        return;
    }

    socialLinks = data || [];

    renderSocialLinks();
    renderAdminSocialLinks();

    updateStats();
}


function renderSocialLinks() {

    const container =
        $("socialContainer");

    if (!socialLinks.length) {

        container.innerHTML = "";

        return;
    }

    container.innerHTML =
        socialLinks.map(link => `

            <a
                class="social-link"
                href="${escapeHTML(link.url)}"
                target="_blank"
                rel="noopener"
            >
                ${escapeHTML(link.icon || "🔗")}
                ${escapeHTML(link.platform)}
            </a>

        `).join("");
}


function renderAdminSocialLinks() {

    const container =
        $("adminSocialContainer");

    if (!socialLinks.length) {

        container.innerHTML =
            "<p>No social links found.</p>";

        return;
    }

    container.innerHTML =
        socialLinks.map(link => `

            <div class="admin-item">

                <div class="admin-item-info">

                    <h3>
                        ${escapeHTML(link.icon || "🔗")}
                        ${escapeHTML(link.platform)}
                    </h3>

                    <p>
                        ${escapeHTML(link.url)}
                    </p>

                </div>

                <div class="admin-item-actions">

                    <button
                        class="small-btn"
                        onclick="editSocial('${link.id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="small-btn danger"
                        onclick="deleteSocial('${link.id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");
}


$("socialForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

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

            message(
                "socialMessage",
                result.error.message
            );

            return;
        }


        message(
            "socialMessage",
            "Social link saved successfully.",
            true
        );

        $("socialForm").reset();
        $("socialId").value = "";

        await loadSocialLinks();
    }
);


function editSocial(id) {

    const link =
        socialLinks.find(
            s => String(s.id) === String(id)
        );

    if (!link) return;

    $("socialId").value =
        link.id;

    $("socialPlatform").value =
        link.platform || "";

    $("socialUrl").value =
        link.url || "";

    $("socialIcon").value =
        link.icon || "";
}


async function deleteSocial(id) {

    if (!confirm("Delete this social link?")) {
        return;
    }

    const { error } =
        await db
            .from("social_links")
            .delete()
            .eq("id", id);

    if (error) {

        toast(error.message);

        return;
    }

    toast("Social link deleted.");

    await loadSocialLinks();
}


/* =========================================================
   AUTH - LOGIN
   ========================================================= */

$("loginForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        message(
            "loginMessage",
            "Signing in...",
            true
        );

        const email =
            $("loginEmail").value.trim();

        const password =
            $("loginPassword").value;


        const { data, error } =
            await db.auth.signInWithPassword({

                email,
                password
            });


        if (error) {

            message(
                "loginMessage",
                error.message
            );

            return;
        }


        currentUser =
            data.user;

        message(
            "loginMessage",
            "Login successful.",
            true
        );

        hideModal("loginModal");

        showAdminDashboard();

        toast("Welcome to Admin Dashboard.");
    }
);


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

$("forgotPasswordBtn").addEventListener(
    "click",
    () => {

        $("forgotEmail").value =
            $("loginEmail").value.trim();

        $("forgotMessage").textContent = "";

        hideModal("loginModal");

        showModal("forgotModal");
    }
);


$("forgotPasswordForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const email =
            $("forgotEmail").value.trim();


        if (!email) {

            message(
                "forgotMessage",
                "Enter your email address."
            );

            return;
        }


        message(
            "forgotMessage",
            "Sending reset link...",
            true
        );


        const { error } =
            await db.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: SITE_URL
                }
            );


        if (error) {

            console.error(
                "Password reset error:",
                error
            );

            message(
                "forgotMessage",
                error.message
            );

            return;
        }


        message(
            "forgotMessage",
            "Reset link sent. Check your email inbox or spam folder.",
            true
        );

        toast("Password reset email sent.");
    }
);


/* =========================================================
   PASSWORD RECOVERY
   ========================================================= */

db.auth.onAuthStateChange(
    (event, session) => {

        currentUser =
            session?.user || null;


        if (event === "PASSWORD_RECOVERY") {

            setTimeout(() => {

                showModal("resetModal");

            }, 300);
        }
    }
);


/* =========================================================
   UPDATE PASSWORD
   ========================================================= */

$("resetForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const password =
            $("resetNewPassword").value;

        const confirmPassword =
            $("resetConfirmPassword").value;


        if (password.length < 8) {

            message(
                "resetMessage",
                "Password must contain at least 8 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            message(
                "resetMessage",
                "Passwords do not match."
            );

            return;
        }


        message(
            "resetMessage",
            "Updating password...",
            true
        );


        const { error } =
            await db.auth.updateUser({
                password
            });


        if (error) {

            console.error(
                "Update password error:",
                error
            );

            message(
                "resetMessage",
                error.message
            );

            return;
        }


        message(
            "resetMessage",
            "Password updated successfully.",
            true
        );

        toast("Password changed successfully.");

        setTimeout(async () => {

            hideModal("resetModal");

            await db.auth.signOut();

            currentUser = null;

            showModal("loginModal");

        }, 1500);
    }
);


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

$("togglePassword").addEventListener(
    "click",
    () => {

        const input =
            $("loginPassword");

        input.type =
            input.type === "password"
                ? "text"
                : "password";
    }
);


$("toggleResetPassword").addEventListener(
    "click",
    () => {

        const input =
            $("resetNewPassword");

        input.type =
            input.type === "password"
                ? "text"
                : "password";
    }
);


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function showAdminDashboard() {

    if (!currentUser) {

        showModal("loginModal");

        return;
    }

    $("adminUserEmail").textContent =
        currentUser.email || "";

    showModal("adminModal");
}


async function checkExistingSession() {

    const { data } =
        await db.auth.getSession();

    currentUser =
        data.session?.user || null;
}


/* =========================================================
   LOGOUT
   ========================================================= */

$("logoutBtn").addEventListener(
    "click",
    async () => {

        const { error } =
            await db.auth.signOut();

        if (error) {

            toast(error.message);

            return;
        }

        currentUser = null;

        hideModal("adminModal");

        toast("Logged out successfully.");
    }
);


/* =========================================================
   ADMIN TABS
   ========================================================= */

document
    .querySelectorAll(".admin-tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".admin-tab")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                document
                    .querySelectorAll(".admin-tab-content")
                    .forEach(tab =>
                        tab.classList.remove("active")
                    );


                button.classList.add("active");

                const target =
                    $(button.dataset.tab);

                if (target) {
                    target.classList.add("active");
                }
            }
        );
    });


/* =========================================================
   OPEN LOGIN
   ========================================================= */

function openLogin() {

    if (currentUser) {

        showAdminDashboard();

        return;
    }

    showModal("loginModal");
}


$("openLoginBtn").addEventListener(
    "click",
    openLogin
);

$("footerAdminBtn").addEventListener(
    "click",
    openLogin
);

$("sidebarLoginBtn").addEventListener(
    "click",
    () => {

        closeSidebar();

        openLogin();
    }
);


/* =========================================================
   MODAL CLOSE BUTTONS
   ========================================================= */

$("closeLoginModal").addEventListener(
    "click",
    () => hideModal("loginModal")
);

$("closeForgotModal").addEventListener(
    "click",
    () => {

        hideModal("forgotModal");

        showModal("loginModal");
    }
);

$("closeResetModal").addEventListener(
    "click",
    () => hideModal("resetModal")
);

$("closeAdminModal").addEventListener(
    "click",
    () => hideModal("adminModal")
);

$("closeProjectModal").addEventListener(
    "click",
    () => hideModal("projectModal")
);

$("cancelProjectBtn").addEventListener(
    "click",
    () => hideModal("projectFormModal")
);

$("addProjectBtn").addEventListener(
    "click",
    openNewProjectForm
);

$("cancelServiceBtn").addEventListener(
    "click",
    () => {

        $("serviceForm").reset();
        $("serviceId").value = "";
    }
);

$("cancelSocialBtn").addEventListener(
    "click",
    () => {

        $("socialForm").reset();
        $("socialId").value = "";
    }
);


/* =========================================================
   CLICK OUTSIDE MODAL
   ========================================================= */

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {
                    modal.classList.remove("show");
                }
            }
        );
    });


/* =========================================================
   SIDEBAR
   ========================================================= */

function openSidebar() {

    $("sidebar").classList.add("open");

    $("overlay").classList.add("show");
}

function closeSidebar() {

    $("sidebar").classList.remove("open");

    $("overlay").classList.remove("show");
}

$("menuBtn").addEventListener(
    "click",
    openSidebar
);

$("closeBtn").addEventListener(
    "click",
    closeSidebar
);

$("overlay").addEventListener(
    "click",
    closeSidebar
);

document
    .querySelectorAll(".sidebar nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeSidebar
        );
    });


/* =========================================================
   SEARCH
   ========================================================= */

$("searchInput").addEventListener(
    "input",
    renderProjects
);

$("categoryFilter").addEventListener(
    "change",
    renderProjects
);


/* =========================================================
   STATS
   ========================================================= */

function updateStats() {

    $("statProjects").textContent =
        projects.length;

    $("statServices").textContent =
        services.length;

    $("statSocial").textContent =
        socialLinks.length;
}


/* =========================================================
   REALTIME
   ========================================================= */

db.channel("haico-link-hub")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "projects"
        },
        () => loadProjects()
    )
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "services"
        },
        () => loadServices()
    )
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "social_links"
        },
        () => loadSocialLinks()
    )
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "brand_settings"
        },
        () => loadBrand()
    )
    .subscribe();


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeApp() {

    $("year").textContent =
        new Date().getFullYear();

    try {

        await checkExistingSession();

        await Promise.all([
            loadBrand(),
            loadServices(),
            loadProjects(),
            loadSocialLinks()
        ]);

    } catch (error) {

        console.error(
            "Initialization error:",
            error
        );

        toast(
            "Some data could not be loaded."
        );
    }
}


initializeApp();

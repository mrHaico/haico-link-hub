/* =========================================================
   HAICO LINK HUB
   ONLINE VERSION
   HTML + CSS + JAVASCRIPT + SUPABASE
   NO LOCALSTORAGE
   ========================================================= */


/* =========================================================
   1. SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL =
    "https://lhgjvezxmeedbyiibbin.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Nj4CRhnyMm2Psb209Rnq8w_rXiZLBbX";


const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   2. GLOBAL VARIABLES
   ========================================================= */

let projects = [];
let services = [];
let socialLinks = [];
let brandSettings = null;
let currentUser = null;


/* =========================================================
   3. BASIC HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);


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


function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


function openModal(id) {

    $(id).classList.add("show");

    document.body.classList.add("no-scroll");
}


function closeModal(id) {

    $(id).classList.remove("show");

    if (!document.querySelector(".modal.show")) {
        document.body.classList.remove("no-scroll");
    }
}


function setMessage(id, message, success = false) {

    const element = $(id);

    if (!element) return;

    element.textContent = message;

    element.style.color =
        success ? "#12b76a" : "#d92d20";
}


function safeUrl(url) {

    if (!url) return "#";

    try {

        const parsed = new URL(url);

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {
            return parsed.href;
        }

    } catch (error) {}

    return "#";
}


/* =========================================================
   4. INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    $("year").textContent = new Date().getFullYear();

    setupNavigation();
    setupModals();
    setupAdminTabs();
    setupForms();
    setupSearch();

    await loadAllData();

    await checkCurrentUser();

});


/* =========================================================
   5. LOAD ALL ONLINE DATA
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
   6. BRAND SETTINGS
   ========================================================= */

async function loadBrandSettings() {

    const { data, error } = await db
        .from("brand_settings")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();


    if (error) {

        console.error(error);

        return;
    }


    brandSettings = data;


    if (!data) return;


    $("heroBrand").textContent =
        data.brand_name ||
        "HAICO TECH & DESIGN";


    $("heroTagline").textContent =
        data.tagline ||
        "Your Idea. Our Creativity. One Digital Solution.";


    $("aboutText").textContent =
        data.about || "";


    $("phoneText").textContent =
        data.phone || "";


    $("emailText").textContent =
        data.email || "";


    if (data.email) {

        $("emailContact").href =
            `mailto:${data.email}`;
    }


    if (data.whatsapp) {

        let number =
            data.whatsapp.replace(/\D/g, "");

        $("whatsappContact").href =
            `https://wa.me/${number}`;
    }

}


/* =========================================================
   7. LOAD SERVICES
   ========================================================= */

async function loadServices() {

    const { data, error } = await db
        .from("services")
        .select("*")
        .order("id", { ascending: true });


    if (error) {

        console.error(error);

        $("servicesContainer").innerHTML =
            `<div class="error-state">
                Failed to load services.
             </div>`;

        return;
    }


    services = data || [];

    renderServices();
    renderAdminServices();

}


/* =========================================================
   8. RENDER SERVICES PUBLIC
   ========================================================= */

function renderServices() {

    const container =
        $("servicesContainer");


    if (!services.length) {

        container.innerHTML =
            `<div class="empty-state">
                No services available yet.
             </div>`;

        return;
    }


    container.innerHTML =
        services.map(service => `

            <article class="service-card">

                <div class="service-icon">
                    ${escapeHTML(service.icon || "🛠️")}
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


/* =========================================================
   9. LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    const { data, error } = await db
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });


    if (error) {

        console.error(error);

        $("projectsContainer").innerHTML =
            `<div class="error-state">
                Failed to load projects.
             </div>`;

        return;
    }


    projects = data || [];

    populateCategories();
    renderProjects();
    renderAdminProjects();

}


/* =========================================================
   10. CATEGORY FILTER
   ========================================================= */

function populateCategories() {

    const select =
        $("categoryFilter");


    const current =
        select.value;


    const categories = [
        ...new Set(
            projects
                .map(project => project.category)
                .filter(Boolean)
        )
    ];


    select.innerHTML = `
        <option value="all">
            All Categories
        </option>

        ${categories.map(category => `
            <option value="${escapeHTML(category)}">
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


/* =========================================================
   11. RENDER PROJECTS
   ========================================================= */

function renderProjects() {

    const container =
        $("projectsContainer");


    const search =
        $("searchInput").value
            .trim()
            .toLowerCase();


    const category =
        $("categoryFilter").value;


    const filtered =
        projects.filter(project => {

            const text = `
                ${project.name || ""}
                ${project.category || ""}
                ${project.description || ""}
                ${project.details || ""}
                ${project.technologies || ""}
                ${project.created_by || ""}
            `.toLowerCase();


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

        container.innerHTML =
            `<div class="empty-state">
                No projects found.
             </div>`;

        return;
    }


    container.innerHTML =
        filtered.map(project =>
            projectCard(project)
        ).join("");


    container
        .querySelectorAll(".view-project")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    openProjectDetails(id);

                }
            );

        });

}


/* =========================================================
   12. PROJECT CARD
   ========================================================= */

function projectCard(project) {

    const image =
        project.image_url;


    const imageHTML = image
        ? `
            <img
                src="${safeUrl(image)}"
                class="project-image"
                alt="${escapeHTML(project.name)}"
                loading="lazy"
            >
          `
        : `
            <div class="project-placeholder">
                💻
            </div>
          `;


    return `

        <article
            class="project-card
            ${project.featured ? "featured" : ""}"
        >

            <div class="project-top">

                ${project.featured
                    ? `<div class="featured-label">
                        ⭐ FEATURED
                       </div>`
                    : ""
                }

                ${imageHTML}

            </div>


            <div class="project-body">

                <span class="project-category">
                    ${escapeHTML(
                        project.category ||
                        "Digital Project"
                    )}
                </span>


                <h3>
                    ${escapeHTML(project.name)}
                </h3>


                <p>
                    ${escapeHTML(
                        project.description || ""
                    )}
                </p>


                <div class="project-meta">

                    ${
                        project.status
                        ? `
                            <span class="meta-badge">
                                ${escapeHTML(
                                    project.status
                                )}
                            </span>
                          `
                        : ""
                    }


                    ${
                        project.technologies
                        ? `
                            <span class="meta-badge">
                                ${escapeHTML(
                                    project.technologies
                                )}
                            </span>
                          `
                        : ""
                    }

                </div>


                <div class="project-actions">

                    <button
                        class="small-btn view-project"
                        data-id="${project.id}"
                    >
                        View Details
                    </button>


                    ${
                        project.live_link
                        ? `
                            <a
                                class="small-btn"
                                href="${safeUrl(
                                    project.live_link
                                )}"
                                target="_blank"
                                rel="noopener"
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
                                href="${safeUrl(
                                    project.whatsapp_link
                                )}"
                                target="_blank"
                                rel="noopener"
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
}


/* =========================================================
   13. PROJECT DETAILS
   ========================================================= */

function openProjectDetails(id) {

    const project =
        projects.find(
            item => Number(item.id) === Number(id)
        );


    if (!project) return;


    const imageHTML =
        project.image_url
        ? `
            <img
                src="${safeUrl(project.image_url)}"
                class="project-detail-image"
                alt="${escapeHTML(project.name)}"
            >
          `
        : "";


    $("projectDetails").innerHTML = `

        <div class="project-detail">

            ${imageHTML}


            <span class="detail-category">
                ${escapeHTML(
                    project.category ||
                    "Digital Project"
                )}
            </span>


            <h2>
                ${escapeHTML(project.name)}
            </h2>


            <div class="detail-section">

                <h4>
                    Description
                </h4>

                <p class="detail-description">
                    ${escapeHTML(
                        project.description || ""
                    )}
                </p>

            </div>


            ${
                project.details
                ? `
                    <div class="detail-section">

                        <h4>
                            Project Details
                        </h4>

                        <p>
                            ${escapeHTML(
                                project.details
                            )}
                        </p>

                    </div>
                  `
                : ""
            }


            ${
                project.technologies
                ? `
                    <div class="detail-section">

                        <h4>
                            Technologies
                        </h4>

                        <p>
                            ${escapeHTML(
                                project.technologies
                            )}
                        </p>

                    </div>
                  `
                : ""
            }


            ${
                project.created_by
                ? `
                    <div class="detail-section">

                        <h4>
                            Created By
                        </h4>

                        <p>
                            ${escapeHTML(
                                project.created_by
                            )}
                        </p>

                    </div>
                  `
                : ""
            }


            ${
                project.status
                ? `
                    <div class="detail-section">

                        <h4>
                            Status
                        </h4>

                        <p>
                            ${escapeHTML(
                                project.status
                            )}
                        </p>

                    </div>
                  `
                : ""
            }


            <div class="detail-links">

                ${
                    project.live_link
                    ? `
                        <a
                            class="detail-link"
                            href="${safeUrl(
                                project.live_link
                            )}"
                            target="_blank"
                            rel="noopener"
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
                            class="detail-link"
                            href="${safeUrl(
                                project.github_link
                            )}"
                            target="_blank"
                            rel="noopener"
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
                            class="detail-link"
                            href="${safeUrl(
                                project.whatsapp_link
                            )}"
                            target="_blank"
                            rel="noopener"
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
                            class="detail-link"
                            href="${safeUrl(
                                project.attachment_url
                            )}"
                            target="_blank"
                            rel="noopener"
                        >
                            📎 Download File
                        </a>
                      `
                    : ""
                }

            </div>

        </div>

    `;


    openModal("projectModal");
}


/* =========================================================
   14. SOCIAL LINKS
   ========================================================= */

async function loadSocialLinks() {

    const { data, error } = await db
        .from("social_links")
        .select("*")
        .order("id", { ascending: true });


    if (error) {

        console.error(error);

        return;
    }


    socialLinks = data || [];

    renderSocialLinks();
    renderAdminSocialLinks();

}


/* =========================================================
   15. PUBLIC SOCIAL LINKS
   ========================================================= */

function renderSocialLinks() {

    const container =
        $("socialContainer");


    if (!socialLinks.length) {

        container.innerHTML =
            `<div class="empty-state">
                Social links will appear here.
             </div>`;

        return;
    }


    container.innerHTML =
        socialLinks.map(social => `

            <a
                href="${safeUrl(social.url)}"
                target="_blank"
                rel="noopener"
                class="social-card"
            >

                <div>
                    ${escapeHTML(
                        social.icon || "🌐"
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        social.platform
                    )}
                </h3>

                <p>
                    Visit our ${escapeHTML(
                        social.platform
                    )}
                </p>

            </a>

        `).join("");
}


/* =========================================================
   16. AUTH - CHECK CURRENT USER
   ========================================================= */

async function checkCurrentUser() {

    const {
        data: {
            user
        }
    } = await db.auth.getUser();


    currentUser = user || null;

}


/* =========================================================
   17. ADMIN LOGIN
   ========================================================= */

async function loginAdmin(event) {

    event.preventDefault();


    const email =
        $("loginEmail").value.trim();


    const password =
        $("loginPassword").value;


    setMessage(
        "loginMessage",
        "Logging in...",
        true
    );


    const {
        data,
        error
    } = await db.auth.signInWithPassword({
        email,
        password
    });


    if (error) {

        console.error(error);

        setMessage(
            "loginMessage",
            error.message
        );

        return;
    }


    currentUser =
        data.user;


    $("loginForm").reset();


    setMessage(
        "loginMessage",
        "",
        true
    );


    closeModal("loginModal");

    openModal("adminModal");

    await loadAdminData();

    showToast(
        "Admin login successful."
    );

}


/* =========================================================
   18. LOGOUT
   ========================================================= */

async function logoutAdmin() {

    const {
        error
    } = await db.auth.signOut();


    if (error) {

        showToast(
            "Logout failed."
        );

        return;
    }


    currentUser = null;

    closeModal("adminModal");

    showToast(
        "You have logged out."
    );

}


/* =========================================================
   19. ADMIN DATA
   ========================================================= */

async function loadAdminData() {

    await Promise.all([
        loadProjects(),
        loadServices(),
        loadBrandSettings(),
        loadSocialLinks()
    ]);

}


/* =========================================================
   20. ADD PROJECT
   ========================================================= */

async function saveProject(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    const id =
        $("projectId").value;


    const name =
        $("projectName").value.trim();


    const category =
        $("projectCategory").value.trim();


    const description =
        $("projectDescription").value.trim();


    const details =
        $("projectDetailsText").value.trim();


    const createdBy =
        $("projectCreatedBy").value.trim();


    const technologies =
        $("projectTechnologies").value.trim();


    const status =
        $("projectStatus").value;


    const liveLink =
        $("projectLiveLink").value.trim();


    const githubLink =
        $("projectGithubLink").value.trim();


    const whatsappLink =
        $("projectWhatsappLink").value.trim();


    const featured =
        $("projectFeatured").checked;


    const imageFile =
        $("projectImage").files[0];


    const attachmentFile =
        $("projectAttachment").files[0];


    const saveButton =
        $("saveProjectBtn");


    saveButton.disabled = true;

    saveButton.textContent =
        "Saving...";


    try {

        let imageUrl = null;
        let attachmentUrl = null;


        /* Existing project data */

        if (id) {

            const existing =
                projects.find(
                    project =>
                        Number(project.id) ===
                        Number(id)
                );


            if (existing) {

                imageUrl =
                    existing.image_url || null;

                attachmentUrl =
                    existing.attachment_url || null;

            }

        }


        /* Upload image */

        if (imageFile) {

            imageUrl =
                await uploadFile(
                    imageFile,
                    "project-images"
                );

        }


        /* Upload attachment */

        if (attachmentFile) {

            attachmentUrl =
                await uploadFile(
                    attachmentFile,
                    "attachments"
                );

        }


        const projectData = {

            name,

            category,

            description,

            details,

            image_url:
                imageUrl,

            created_by:
                createdBy ||
                "HAICO TECH & DESIGN",

            brand:
                brandSettings?.brand_name ||
                "HAICO TECH & DESIGN",

            technologies,

            status,

            live_link:
                liveLink || null,

            github_link:
                githubLink || null,

            whatsapp_link:
                whatsappLink || null,

            attachment_url:
                attachmentUrl,

            featured,

            updated_at:
                new Date().toISOString()

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


        $("projectForm").reset();

        $("projectId").value = "";

        $("projectFormTitle").textContent =
            "Add Project";


        closeModal(
            "projectFormModal"
        );


        await loadProjects();


        showToast(
            id
                ? "Project updated successfully."
                : "Project added successfully."
        );

    } catch (error) {

        console.error(error);

        setMessage(
            "projectFormMessage",
            error.message
        );

    } finally {

        saveButton.disabled = false;

        saveButton.textContent =
            "Save Project";

    }

}


/* =========================================================
   21. FILE UPLOAD
   ========================================================= */

async function uploadFile(file, bucket) {

    if (!file) return null;


    const extension =
        file.name.includes(".")
            ? file.name.split(".").pop()
            : "";


    const randomName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;


    const filePath =
        `${randomName}${extension ? "." + extension : ""}`;


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


/* =========================================================
   22. EDIT PROJECT
   ========================================================= */

function editProject(id) {

    const project =
        projects.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


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


    $("projectTechnologies").value =
        project.technologies || "";


    $("projectStatus").value =
        project.status || "Active";


    $("projectLiveLink").value =
        project.live_link || "";


    $("projectGithubLink").value =
        project.github_link || "";


    $("projectWhatsappLink").value =
        project.whatsapp_link || "";


    $("projectFeatured").checked =
        Boolean(project.featured);


    $("projectFormTitle").textContent =
        "Edit Project";


    $("projectFormMessage").textContent =
        "";


    openModal(
        "projectFormModal"
    );

}


/* =========================================================
   23. DELETE PROJECT
   ========================================================= */

async function deleteProject(id) {

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    const project =
        projects.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!project) return;


    const confirmed =
        confirm(
            `Delete "${project.name}"?`
        );


    if (!confirmed) return;


    const {
        error
    } = await db
        .from("projects")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        showToast(
            error.message
        );

        return;
    }


    await loadProjects();


    showToast(
        "Project deleted."
    );

}


/* =========================================================
   24. ADMIN PROJECT LIST
   ========================================================= */

function renderAdminProjects() {

    const container =
        $("adminProjectsContainer");


    if (!container) return;


    if (!projects.length) {

        container.innerHTML =
            `<div class="empty-state">
                No projects yet.
             </div>`;

        return;
    }


    container.innerHTML =
        projects.map(project => `

            <div class="admin-item">

                <div class="admin-item-info">

                    <h4>
                        ${escapeHTML(
                            project.name
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            project.category ||
                            "No category"
                        )}

                        •

                        ${escapeHTML(
                            project.status ||
                            ""
                        )}
                    </p>

                </div>


                <div class="admin-actions">

                    <button
                        class="small-btn edit-btn"
                        data-edit-project="${project.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="small-btn delete-btn"
                        data-delete-project="${project.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");


    container
        .querySelectorAll(
            "[data-edit-project]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editProject(
                        button.dataset.editProject
                    );

                }
            );

        });


    container
        .querySelectorAll(
            "[data-delete-project]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteProject(
                        button.dataset.deleteProject
                    );

                }
            );

        });

}


/* =========================================================
   25. SERVICES ADMIN
   ========================================================= */

function renderAdminServices() {

    const container =
        $("adminServicesContainer");


    if (!container) return;


    if (!services.length) {

        container.innerHTML =
            `<div class="empty-state">
                No services.
             </div>`;

        return;
    }


    container.innerHTML =
        services.map(service => `

            <div class="admin-item">

                <div class="admin-item-info">

                    <h4>
                        ${escapeHTML(
                            service.icon || "🛠️"
                        )}

                        ${escapeHTML(
                            service.name
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            service.description || ""
                        )}
                    </p>

                </div>


                <div class="admin-actions">

                    <button
                        class="small-btn edit-btn"
                        data-edit-service="${service.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="small-btn delete-btn"
                        data-delete-service="${service.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");


    container
        .querySelectorAll(
            "[data-edit-service]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editService(
                        button.dataset.editService
                    );

                }
            );

        });


    container
        .querySelectorAll(
            "[data-delete-service]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteService(
                        button.dataset.deleteService
                    );

                }
            );

        });

}


/* =========================================================
   26. SAVE SERVICE
   ========================================================= */

async function saveService(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    const id =
        $("serviceId").value;


    const serviceData = {

        name:
            $("serviceName").value.trim(),

        description:
            $("serviceDescription").value.trim(),

        icon:
            $("serviceIcon").value.trim() ||
            "🛠️"

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
                .insert(serviceData);

    }


    if (result.error) {

        console.error(result.error);

        showToast(
            result.error.message
        );

        return;
    }


    $("serviceForm").reset();

    $("serviceId").value = "";


    await loadServices();


    showToast(
        id
            ? "Service updated."
            : "Service added."
    );

}


/* =========================================================
   27. EDIT SERVICE
   ========================================================= */

function editService(id) {

    const service =
        services.find(
            item =>
                Number(item.id) ===
                Number(id)
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

}


/* =========================================================
   28. DELETE SERVICE
   ========================================================= */

async function deleteService(id) {

    if (!confirm(
        "Delete this service?"
    )) {
        return;
    }


    const {
        error
    } = await db
        .from("services")
        .delete()
        .eq("id", id);


    if (error) {

        showToast(
            error.message
        );

        return;
    }


    await loadServices();


    showToast(
        "Service deleted."
    );

}


/* =========================================================
   29. SAVE BRAND
   ========================================================= */

async function saveBrand(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    const brandData = {

        brand_name:
            $("brandName").value.trim(),

        tagline:
            $("brandTagline").value.trim(),

        about:
            $("brandAbout").value.trim(),

        logo_url:
            $("brandLogo").value.trim() ||
            null,

        phone:
            $("brandPhone").value.trim(),

        email:
            $("brandEmail").value.trim(),

        whatsapp:
            $("brandWhatsapp").value.trim(),

        updated_at:
            new Date().toISOString()

    };


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

        console.error(result.error);

        setMessage(
            "brandMessage",
            result.error.message
        );

        return;
    }


    await loadBrandSettings();


    setMessage(
        "brandMessage",
        "Brand settings saved successfully.",
        true
    );


    showToast(
        "Brand settings updated."
    );

}


/* =========================================================
   30. LOAD BRAND INTO ADMIN FORM
   ========================================================= */

function fillBrandForm() {

    if (!brandSettings) return;


    $("brandName").value =
        brandSettings.brand_name || "";


    $("brandTagline").value =
        brandSettings.tagline || "";


    $("brandAbout").value =
        brandSettings.about || "";


    $("brandLogo").value =
        brandSettings.logo_url || "";


    $("brandPhone").value =
        brandSettings.phone || "";


    $("brandEmail").value =
        brandSettings.email || "";


    $("brandWhatsapp").value =
        brandSettings.whatsapp || "";

}


/* =========================================================
   31. SOCIAL ADMIN LIST
   ========================================================= */

function renderAdminSocialLinks() {

    const container =
        $("adminSocialContainer");


    if (!container) return;


    if (!socialLinks.length) {

        container.innerHTML =
            `<div class="empty-state">
                No social links.
             </div>`;

        return;
    }


    container.innerHTML =
        socialLinks.map(social => `

            <div class="admin-item">

                <div class="admin-item-info">

                    <h4>
                        ${escapeHTML(
                            social.icon || "🌐"
                        )}

                        ${escapeHTML(
                            social.platform
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            social.url
                        )}
                    </p>

                </div>


                <div class="admin-actions">

                    <button
                        class="small-btn edit-btn"
                        data-edit-social="${social.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="small-btn delete-btn"
                        data-delete-social="${social.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");


    container
        .querySelectorAll(
            "[data-edit-social]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editSocial(
                        button.dataset.editSocial
                    );

                }
            );

        });


    container
        .querySelectorAll(
            "[data-delete-social]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSocial(
                        button.dataset.deleteSocial
                    );

                }
            );

        });

}


/* =========================================================
   32. SAVE SOCIAL
   ========================================================= */

async function saveSocial(event) {

    event.preventDefault();


    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    const id =
        $("socialId").value;


    const socialData = {

        platform:
            $("socialPlatform").value.trim(),

        url:
            $("socialUrl").value.trim(),

        icon:
            $("socialIcon").value.trim() ||
            "🌐"

    };


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

        showToast(
            result.error.message
        );

        return;
    }


    $("socialForm").reset();

    $("socialId").value = "";


    await loadSocialLinks();


    showToast(
        id
            ? "Social link updated."
            : "Social link added."
    );

}


/* =========================================================
   33. EDIT SOCIAL
   ========================================================= */

function editSocial(id) {

    const social =
        socialLinks.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!social) return;


    $("socialId").value =
        social.id;


    $("socialPlatform").value =
        social.platform || "";


    $("socialUrl").value =
        social.url || "";


    $("socialIcon").value =
        social.icon || "";

}


/* =========================================================
   34. DELETE SOCIAL
   ========================================================= */

async function deleteSocial(id) {

    if (!confirm(
        "Delete this social link?"
    )) {
        return;
    }


    const {
        error
    } = await db
        .from("social_links")
        .delete()
        .eq("id", id);


    if (error) {

        showToast(
            error.message
        );

        return;
    }


    await loadSocialLinks();


    showToast(
        "Social link deleted."
    );

}


/* =========================================================
   35. ADMIN TABS
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
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );


                    document
                        .querySelectorAll(
                            ".admin-tab-content"
                        )
                        .forEach(content =>
                            content.classList.remove(
                                "active"
                            )
                        );


                    tab.classList.add(
                        "active"
                    );


                    const target =
                        $(tab.dataset.tab);


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


                    if (
                        tab.dataset.tab ===
                        "brandTab"
                    ) {

                        fillBrandForm();

                    }

                }
            );

        });

}


/* =========================================================
   36. NAVIGATION
   ========================================================= */

function setupNavigation() {

    $("menuBtn")
        .addEventListener(
            "click",
            () => {

                $("sidebar")
                    .classList.add("open");

                $("overlay")
                    .classList.add("show");

            }
        );


    $("closeBtn")
        .addEventListener(
            "click",
            closeSidebar
        );


    $("overlay")
        .addEventListener(
            "click",
            closeSidebar
        );


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeSidebar
            );

        });

}


function closeSidebar() {

    $("sidebar")
        .classList.remove("open");

    $("overlay")
        .classList.remove("show");

}


/* =========================================================
   37. MODALS
   ========================================================= */

function setupModals() {

    $("openLoginBtn")
        .addEventListener(
            "click",
            () => {

                closeSidebar();

                openModal(
                    "loginModal"
                );

            }
        );


    $("footerAdminBtn")
        .addEventListener(
            "click",
            () => {

                if (currentUser) {

                    openModal(
                        "adminModal"
                    );

                    loadAdminData();

                } else {

                    openModal(
                        "loginModal"
                    );

                }

            }
        );


    $("closeLoginModal")
        .addEventListener(
            "click",
            () =>
                closeModal("loginModal")
        );


    $("closeAdminModal")
        .addEventListener(
            "click",
            () =>
                closeModal("adminModal")
        );


    $("closeProjectModal")
        .addEventListener(
            "click",
            () =>
                closeModal("projectModal")
        );


    $("closeProjectFormModal")
        .addEventListener(
            "click",
            () =>
                closeModal(
                    "projectFormModal"
                )
        );


    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeModal(
                            modal.id
                        );

                    }

                }
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal.show"
                    )
                    .forEach(modal => {

                        closeModal(
                            modal.id
                        );

                    });

            }

        }
    );

}


/* =========================================================
   38. FORMS
   ========================================================= */

function setupForms() {

    $("loginForm")
        .addEventListener(
            "submit",
            loginAdmin
        );


    $("logoutBtn")
        .addEventListener(
            "click",
            logoutAdmin
        );


    $("projectForm")
        .addEventListener(
            "submit",
            saveProject
        );


    $("serviceForm")
        .addEventListener(
            "submit",
            saveService
        );


    $("brandForm")
        .addEventListener(
            "submit",
            saveBrand
        );


    $("socialForm")
        .addEventListener(
            "submit",
            saveSocial
        );


    $("addProjectBtn")
        .addEventListener(
            "click",
            () => {

                resetProjectForm();

                openModal(
                    "projectFormModal"
                );

            }
        );


    $("cancelProjectBtn")
        .addEventListener(
            "click",
            () => {

                resetProjectForm();

                closeModal(
                    "projectFormModal"
                );

            }
        );


    $("cancelServiceBtn")
        .addEventListener(
            "click",
            () => {

                $("serviceForm").reset();

                $("serviceId").value = "";

            }
        );


    $("cancelSocialBtn")
        .addEventListener(
            "click",
            () => {

                $("socialForm").reset();

                $("socialId").value = "";

            }
        );

}


/* =========================================================
   39. RESET PROJECT FORM
   ========================================================= */

function resetProjectForm() {

    $("projectForm").reset();

    $("projectId").value = "";

    $("projectCreatedBy").value =
        "HAICO TECH & DESIGN";

    $("projectStatus").value =
        "Active";

    $("projectFormTitle").textContent =
        "Add Project";

    $("projectFormMessage").textContent =
        "";

}


/* =========================================================
   40. SEARCH
   ========================================================= */

function setupSearch() {

    $("searchInput")
        .addEventListener(
            "input",
            renderProjects
        );


    $("categoryFilter")
        .addEventListener(
            "change",
            renderProjects
        );

}


/* =========================================================
   41. REALTIME REFRESH
   ========================================================= */

/*
   This listens for changes in Supabase.
   If another admin changes projects/services,
   the public page can refresh its information.
*/

db.channel(
    "haico-link-hub-changes"
)
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "projects"
    },
    async () => {

        await loadProjects();

    }
)
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "services"
    },
    async () => {

        await loadServices();

    }
)
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "social_links"
    },
    async () => {

        await loadSocialLinks();

    }
)
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "brand_settings"
    },
    async () => {

        await loadBrandSettings();

    }
)
.subscribe();


/* =========================================================
   END
   ========================================================= */

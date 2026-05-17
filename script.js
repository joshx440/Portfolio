document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = [...document.querySelectorAll("section[id], header[id]")];
    const revealTargets = document.querySelectorAll(
        ".about-image-wrapper, .about-content, .work-header, .portfolio-item, .contact-header, .contact-card, .contact-action"
    );
    const portfolioImages = [...document.querySelectorAll(".portfolio-item img")];

    revealTargets.forEach((element) => element.classList.add("reveal"));

    const sectionById = new Map(
        sections.map((section) => [section.id, section])
    );

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href")?.slice(1);
            const target = targetId ? sectionById.get(targetId) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const visibleSections = new Map();
    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                visibleSections.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
            });

            let activeId = "home";
            let maxRatio = 0;

            visibleSections.forEach((ratio, id) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    activeId = id;
                }
            });

            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${activeId}`;
                link.classList.toggle("active", isActive);
            });
        },
        {
            threshold: [0.2, 0.35, 0.5, 0.7]
        }
    );

    sections.forEach((section) => navObserver.observe(section));

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18
        }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
            <img class="lightbox-image" alt="">
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    const openLightbox = (image) => {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.alt;
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    portfolioImages.forEach((image) => {
        image.addEventListener("click", () => openLightbox(image));
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });
});

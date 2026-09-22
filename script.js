// =========================================================
// ESBD
// MAIN JAVASCRIPT
// ALTO LAB / STAGE 2
// =========================================================

const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mobileDrawer = document.getElementById("mobileDrawer");
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress");
const currentYear = document.getElementById("currentYear");
const heroVideo = document.querySelector(".hero-video");
const ambientVideos = document.querySelectorAll(".ambient-video");
const heroDashboard = document.getElementById("heroDashboard");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// =========================================================
// CURRENT YEAR
// =========================================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// =========================================================
// HEADER HIDE / SHOW
// =========================================================

let previousScrollY = window.scrollY;
let scrollAccumulator = 0;
let previousDirection = null;

function updateHeader() {
    if (!header) {
        return;
    }

    const currentScrollY = Math.max(window.scrollY, 0);

    const drawerOpen =
        mobileDrawer &&
        mobileDrawer.classList.contains("open");

    if (currentScrollY > 35) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    if (drawerOpen) {
        header.classList.remove("hidden");
        previousScrollY = currentScrollY;
        return;
    }

    if (currentScrollY < 120) {
        header.classList.remove("hidden");
        scrollAccumulator = 0;
        previousScrollY = currentScrollY;
        return;
    }

    const difference =
        currentScrollY -
        previousScrollY;

    if (difference === 0) {
        return;
    }

    const direction =
        difference > 0
            ? "down"
            : "up";

    if (direction !== previousDirection) {
        scrollAccumulator = 0;
    }

    scrollAccumulator += Math.abs(difference);

    if (
        direction === "down" &&
        scrollAccumulator > 28
    ) {
        header.classList.add("hidden");
        scrollAccumulator = 0;
    }

    if (
        direction === "up" &&
        scrollAccumulator > 10
    ) {
        header.classList.remove("hidden");
        scrollAccumulator = 0;
    }

    previousDirection = direction;
    previousScrollY = currentScrollY;
}


// =========================================================
// SCROLL PROGRESS
// =========================================================

function updateScrollProgress() {
    if (!scrollProgress) {
        return;
    }

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (documentHeight <= 0) {
        scrollProgress.style.width = "0%";
        return;
    }

    const percentage =
        (window.scrollY / documentHeight) * 100;

    scrollProgress.style.width =
        `${percentage}%`;
}


// =========================================================
// BACK TO TOP
// =========================================================

function updateBackToTop() {
    if (!backToTop) {
        return;
    }

    if (window.scrollY > 650) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}

if (backToTop) {
    backToTop.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior:
                    prefersReducedMotion
                        ? "auto"
                        : "smooth"
            });
        }
    );
}


// =========================================================
// MOBILE MENU
// =========================================================

function openMenu() {
    if (
        !menuButton ||
        !mobileDrawer
    ) {
        return;
    }

    menuButton.classList.add("active");
    mobileDrawer.classList.add("open");
    document.body.classList.add("menu-open");

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    menuButton.setAttribute(
        "aria-label",
        "Close navigation"
    );

    if (header) {
        header.classList.remove("hidden");
    }
}

function closeMenu() {
    if (
        !menuButton ||
        !mobileDrawer
    ) {
        return;
    }

    menuButton.classList.remove("active");
    mobileDrawer.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        "Open navigation"
    );
}

function toggleMenu() {
    if (!mobileDrawer) {
        return;
    }

    const isOpen =
        mobileDrawer.classList.contains("open");

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

if (menuButton) {
    menuButton.addEventListener(
        "click",
        toggleMenu
    );
}

if (mobileDrawer) {
    const drawerLinks =
        mobileDrawer.querySelectorAll("a");

    drawerLinks.forEach(
        (link) => {
            link.addEventListener(
                "click",
                closeMenu
            );
        }
    );
}

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    }
);


// =========================================================
// VIDEO PLAYBACK
// =========================================================

function attemptVideoPlayback(video) {
    if (!video) {
        return;
    }

    video.muted = true;

    const playPromise =
        video.play();

    if (playPromise !== undefined) {
        playPromise.catch(
            () => {
                // Browser autoplay fallback.
            }
        );
    }
}

if (heroVideo) {
    if (heroVideo.readyState >= 2) {
        attemptVideoPlayback(heroVideo);
    } else {
        heroVideo.addEventListener(
            "loadeddata",
            () => {
                attemptVideoPlayback(heroVideo);
            },
            {
                once: true
            }
        );
    }

    heroVideo.addEventListener(
        "error",
        () => {
            console.error(
                "Could not load images/esbd-hero.mp4"
            );
        }
    );
}

ambientVideos.forEach(
    (video) => {
        if (video.readyState >= 2) {
            attemptVideoPlayback(video);
        } else {
            video.addEventListener(
                "loadeddata",
                () => {
                    attemptVideoPlayback(video);
                },
                {
                    once: true
                }
            );
        }

        video.addEventListener(
            "error",
            () => {
                console.error(
                    "Could not load images/w-background.mp4"
                );
            }
        );
    }
);


// =========================================================
// SCROLL REVEALS
// =========================================================

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

if ("IntersectionObserver" in window) {
    const revealObserver =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {
                entries.forEach(
                    (entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("in");
                            observer.unobserve(entry.target);
                        }
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    revealElements.forEach(
        (element) => {
            revealObserver.observe(element);
        }
    );
} else {
    revealElements.forEach(
        (element) => {
            element.classList.add("in");
        }
    );
}


// =========================================================
// ALTO LAB / CINEMATIC PAGE TRANSITIONS
// =========================================================

function createPageTransition() {
    if (
        document.querySelector(
            ".alto-page-transition"
        )
    ) {
        return;
    }

    const transition =
        document.createElement("div");

    transition.className =
        "alto-page-transition";

    transition.innerHTML = `
        <div class="alto-transition-inner">
            <span class="alto-transition-index">
                ESBD / COLD CHAIN SYSTEM
            </span>

            <strong class="alto-transition-title">
                Taking your packaging further.
            </strong>

            <span class="alto-transition-line"></span>
        </div>
    `;

    document.body.appendChild(transition);
}

createPageTransition();

const pageTransition =
    document.querySelector(
        ".alto-page-transition"
    );

function revealCurrentPage() {
    if (
        !pageTransition ||
        prefersReducedMotion
    ) {
        return;
    }

    pageTransition.classList.add(
        "is-entering"
    );

    requestAnimationFrame(
        () => {
            requestAnimationFrame(
                () => {
                    setTimeout(
                        () => {
                            pageTransition.classList.add(
                                "is-leaving"
                            );

                            pageTransition.classList.remove(
                                "is-entering"
                            );
                        },
                        160
                    );
                }
            );
        }
    );

    setTimeout(
        () => {
            pageTransition.classList.remove(
                "is-leaving"
            );
        },
        900
    );
}

window.addEventListener(
    "pageshow",
    revealCurrentPage
);

function shouldTransitionLink(
    link,
    event
) {
    if (
        prefersReducedMotion ||
        !pageTransition
    ) {
        return false;
    }

    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return false;
    }

    if (
        link.hasAttribute("download") ||
        link.target === "_blank"
    ) {
        return false;
    }

    const rawHref =
        link.getAttribute("href");

    if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
    ) {
        return false;
    }

    let destination;

    try {
        destination =
            new URL(
                link.href,
                window.location.href
            );
    } catch {
        return false;
    }

    if (
        destination.origin !==
        window.location.origin
    ) {
        return false;
    }

    if (
        destination.pathname ===
            window.location.pathname &&
        destination.hash
    ) {
        return false;
    }

    return true;
}

document.addEventListener(
    "click",
    (event) => {
        const link =
            event.target.closest("a");

        if (!link) {
            return;
        }

        if (
            !shouldTransitionLink(
                link,
                event
            )
        ) {
            return;
        }

        event.preventDefault();

        const transitionTitle =
            pageTransition.querySelector(
                ".alto-transition-title"
            );

        const readableLabel =
            link.textContent
                .replace(/\s+/g, " ")
                .trim();

        if (
            transitionTitle &&
            readableLabel
        ) {
            transitionTitle.textContent =
                readableLabel;
        }

        pageTransition.classList.remove(
            "is-leaving"
        );

        pageTransition.classList.add(
            "is-entering"
        );

        setTimeout(
            () => {
                window.location.href =
                    link.href;
            },
            470
        );
    }
);


// =========================================================
// ALTO LAB / HERO GLASS LIGHT — NO TILT
// =========================================================

if (heroDashboard) {
    heroDashboard.style.setProperty(
        "transform",
        "none",
        "important"
    );

    heroDashboard.style.setProperty(
        "rotate",
        "0deg",
        "important"
    );

    let pointerFrame = null;

    heroDashboard.addEventListener(
        "pointermove",
        (event) => {
            if (
                prefersReducedMotion ||
                window.innerWidth <= 820
            ) {
                return;
            }

            if (pointerFrame) {
                cancelAnimationFrame(
                    pointerFrame
                );
            }

            pointerFrame =
                requestAnimationFrame(
                    () => {
                        const rect =
                            heroDashboard
                                .getBoundingClientRect();

                        const x =
                            (
                                (
                                    event.clientX -
                                    rect.left
                                ) /
                                rect.width
                            ) * 100;

                        const y =
                            (
                                (
                                    event.clientY -
                                    rect.top
                                ) /
                                rect.height
                            ) * 100;

                        heroDashboard.style.setProperty(
                            "--lab-x",
                            `${x}%`
                        );

                        heroDashboard.style.setProperty(
                            "--lab-y",
                            `${y}%`
                        );
                    }
                );
        }
    );

    heroDashboard.addEventListener(
        "pointerleave",
        () => {
            heroDashboard.style.setProperty(
                "--lab-x",
                "50%"
            );

            heroDashboard.style.setProperty(
                "--lab-y",
                "50%"
            );
        }
    );
}


// =========================================================
// ALTO LAB / LIVE THERMAL TELEMETRY
// VISUAL SIMULATION ONLY
// =========================================================

function createThermalTelemetry() {
    if (!heroDashboard) {
        return;
    }

    if (
        heroDashboard.querySelector(
            ".lab-live-telemetry"
        )
    ) {
        return;
    }

    const telemetry =
        document.createElement("div");

    telemetry.className =
        "lab-live-telemetry";

    telemetry.innerHTML = `
        <div class="lab-live-temp">
            <span class="lab-live-temp-label">
                LIVE SIMULATION
            </span>

            <strong class="lab-live-temp-value">
                <em>4.2</em>°C
            </strong>
        </div>

        <div
            class="lab-temp-trace"
            aria-hidden="true"
        ></div>
    `;

    heroDashboard.appendChild(telemetry);

    const trace =
        telemetry.querySelector(
            ".lab-temp-trace"
        );

    if (!trace) {
        return;
    }

    for (
        let i = 0;
        i < 22;
        i += 1
    ) {
        const bar =
            document.createElement("span");

        bar.style.height =
            `${6 + Math.random() * 14}px`;

        trace.appendChild(bar);
    }
}

createThermalTelemetry();


// =========================================================
// ALTO LAB / COLD CHAIN JOURNEY
// =========================================================

const journeySection =
    document.getElementById(
        "coldChainJourney"
    );

const journeyViewport =
    journeySection
        ? journeySection.querySelector(
            ".journey-viewport"
        )
        : null;

const journeyButtons =
    journeySection
        ? Array.from(
            journeySection.querySelectorAll(
                "[data-journey-stage]"
            )
        )
        : [];

const journeyPanels =
    journeySection
        ? Array.from(
            journeySection.querySelectorAll(
                "[data-journey-panel]"
            )
        )
        : [];

const journeyImages =
    journeySection
        ? Array.from(
            journeySection.querySelectorAll(
                "[data-journey-image]"
            )
        )
        : [];

const journeyStageCounter =
    document.getElementById(
        "journeyStageCounter"
    );

const journeyStageName =
    document.getElementById(
        "journeyStageName"
    );

const journeySystemState =
    document.getElementById(
        "journeySystemState"
    );

const journeyTemperature =
    document.getElementById(
        "journeyTemperature"
    );

const journeyMiniTrace =
    document.getElementById(
        "journeyMiniTrace"
    );

const journeyStageNames = [
    "PACK",
    "LOAD",
    "TRANSPORT",
    "MONITOR",
    "DELIVER"
];

const journeySystemStates = [
    "PREPARED",
    "LOADED",
    "IN TRANSIT",
    "MEASURABLE",
    "REUSABLE"
];

let journeyActiveStage = 0;
let journeyStart = 0;
let journeyDistance = 1;
let journeyFrame = null;


// =========================================================
// HELPERS
// =========================================================

function clamp(
    value,
    minimum,
    maximum
) {
    return Math.min(
        maximum,
        Math.max(
            minimum,
            value
        )
    );
}


// =========================================================
// JOURNEY TRACE
// =========================================================

function createJourneyTrace() {
    if (!journeyMiniTrace) {
        return;
    }

    if (journeyMiniTrace.children.length) {
        return;
    }

    for (
        let i = 0;
        i < 34;
        i += 1
    ) {
        const bar =
            document.createElement("span");

        bar.style.height =
            `${5 + Math.random() * 13}px`;

        journeyMiniTrace.appendChild(
            bar
        );
    }
}

createJourneyTrace();


// =========================================================
// JOURNEY STAGE
// =========================================================

function setJourneyStage(
    stageIndex,
    positionOverride = null
) {
    if (!journeySection) {
        return;
    }

    const index =
        clamp(
            Number(stageIndex) || 0,
            0,
            journeyStageNames.length - 1
        );

    journeyActiveStage = index;

    journeyButtons.forEach(
        (
            button,
            buttonIndex
        ) => {
            const isActive =
                buttonIndex === index;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive
                    ? "true"
                    : "false"
            );
        }
    );

    journeyPanels.forEach(
        (
            panel,
            panelIndex
        ) => {
            panel.classList.toggle(
                "active",
                panelIndex === index
            );
        }
    );

    journeyImages.forEach(
        (
            image,
            imageIndex
        ) => {
            image.classList.toggle(
                "active",
                imageIndex === index
            );
        }
    );

    if (journeyViewport) {
        journeyViewport.dataset.journeyActive =
            String(index);
    }

    if (journeyStageCounter) {
        journeyStageCounter.textContent =
            `${String(index + 1).padStart(2, "0")} / 05`;
    }

    if (journeyStageName) {
        journeyStageName.textContent =
            journeyStageNames[index];
    }

    if (journeySystemState) {
        journeySystemState.textContent =
            journeySystemStates[index];
    }

    if (positionOverride !== null) {
        journeySection.style.setProperty(
            "--journey-position",
            `${positionOverride}%`
        );
    }
}


// =========================================================
// JOURNEY MEASUREMENT
// =========================================================

function measureJourney() {
    if (!journeySection) {
        return;
    }

    const rect =
        journeySection
            .getBoundingClientRect();

    journeyStart =
        window.scrollY +
        rect.top;

    journeyDistance =
        Math.max(
            1,
            journeySection.offsetHeight -
            window.innerHeight
        );
}


// =========================================================
// JOURNEY SCROLL
// =========================================================

function updateJourneyFromScroll() {
    if (!journeySection) {
        return;
    }

    const progress =
        clamp(
            (
                window.scrollY -
                journeyStart
            ) /
            journeyDistance,
            0,
            0.9999
        );

    const position =
        10 +
        progress * 80;

    const stageIndex =
        Math.min(
            journeyStageNames.length - 1,
            Math.floor(
                progress *
                journeyStageNames.length
            )
        );

    journeySection.style.setProperty(
        "--journey-position",
        `${position}%`
    );

    if (
        stageIndex !==
        journeyActiveStage
    ) {
        setJourneyStage(stageIndex);
    }
}

function requestJourneyUpdate() {
    if (
        !journeySection ||
        journeyFrame
    ) {
        return;
    }

    journeyFrame =
        requestAnimationFrame(
            () => {
                updateJourneyFromScroll();
                journeyFrame = null;
            }
        );
}


// =========================================================
// JOURNEY BUTTONS
// =========================================================

journeyButtons.forEach(
    (
        button,
        index
    ) => {
        button.addEventListener(
            "click",
            () => {
                if (!journeySection) {
                    return;
                }

                const targetProgress =
                    (
                        index +
                        0.5
                    ) /
                    journeyStageNames.length;

                const targetScroll =
                    journeyStart +
                    journeyDistance *
                    targetProgress;

                window.scrollTo({
                    top: targetScroll,
                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"
                });
            }
        );
    }
);

if (journeySection) {
    measureJourney();
    setJourneyStage(0, 10);
    updateJourneyFromScroll();
}


// =========================================================
// ALTO LAB / REACTIVE CARD LIGHT
// =========================================================

const reactiveCards =
    document.querySelectorAll(
        [
            ".solution-card",
            ".benefit-card",
            ".product-card",
            ".client-card",
            ".company-contact-card",
            ".contact-form-card"
        ].join(",")
    );

reactiveCards.forEach(
    (card) => {
        card.classList.add(
            "alto-reactive-card"
        );

        card.addEventListener(
            "pointermove",
            (event) => {
                if (
                    prefersReducedMotion ||
                    window.innerWidth <= 820
                ) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    (
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width
                    ) * 100;

                const y =
                    (
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height
                    ) * 100;

                card.style.setProperty(
                    "--card-x",
                    `${x}%`
                );

                card.style.setProperty(
                    "--card-y",
                    `${y}%`
                );
            }
        );

        card.addEventListener(
            "pointerleave",
            () => {
                card.style.setProperty(
                    "--card-x",
                    "50%"
                );

                card.style.setProperty(
                    "--card-y",
                    "50%"
                );
            }
        );
    }
);


// =========================================================
// ALTO LAB / SHARED TELEMETRY TICK
// =========================================================

const thermalValue =
    document.querySelector(
        ".lab-live-temp-value em"
    );

const thermalBars =
    Array.from(
        document.querySelectorAll(
            ".lab-temp-trace span"
        )
    );

const journeyTraceBars =
    journeyMiniTrace
        ? Array.from(
            journeyMiniTrace.querySelectorAll(
                "span"
            )
        )
        : [];

let simulatedTemperature = 4.2;


// =========================================================
// TRACE ANIMATION
// =========================================================

function updateTraceBars(
    bars,
    temperature
) {
    if (!bars.length) {
        return;
    }

    bars.forEach(
        (
            bar,
            index
        ) => {
            const phase =
                (
                    index /
                    bars.length
                ) *
                Math.PI *
                2;

            const base =
                10 +
                Math.sin(phase) * 4;

            const temperatureOffset =
                (
                    temperature -
                    4.2
                ) * 9;

            const noise =
                Math.random() * 5;

            const height =
                clamp(
                    base +
                    temperatureOffset +
                    noise,
                    4,
                    24
                );

            bar.style.height =
                `${height}px`;
        }
    );
}


// =========================================================
// TEMPERATURE SIMULATION
// =========================================================

function updateThermalTelemetry() {
    const movement =
        (
            Math.random() -
            0.5
        ) * 0.26;

    simulatedTemperature += movement;

    simulatedTemperature =
        clamp(
            simulatedTemperature,
            3.8,
            4.8
        );

    if (thermalValue) {
        thermalValue.textContent =
            simulatedTemperature.toFixed(1);
    }

    if (journeyTemperature) {
        journeyTemperature.textContent =
            `${simulatedTemperature.toFixed(1)}°C`;
    }

    updateTraceBars(
        thermalBars,
        simulatedTemperature
    );

    updateTraceBars(
        journeyTraceBars,
        simulatedTemperature
    );
}

if (
    (
        thermalValue ||
        journeyTemperature
    ) &&
    !prefersReducedMotion
) {
    setInterval(
        updateThermalTelemetry,
        1350
    );
}


// =========================================================
// GLOBAL SCROLL / RESIZE EVENTS
// =========================================================

function handleScroll() {
    updateHeader();
    updateScrollProgress();
    updateBackToTop();
    requestJourneyUpdate();
}

window.addEventListener(
    "scroll",
    handleScroll,
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }

        if (journeySection) {
            measureJourney();
            updateJourneyFromScroll();
        }
    }
);

window.addEventListener(
    "load",
    () => {
        if (journeySection) {
            measureJourney();
            updateJourneyFromScroll();
        }
    }
);


// =========================================================
// INITIAL STATE
// =========================================================

updateHeader();
updateScrollProgress();
updateBackToTop();
// =========================================================
// ESBD
// MAIN JAVASCRIPT
// ALTO LAB BUILD
// =========================================================


// =========================================================
// ELEMENTS
// =========================================================

const header =
    document.getElementById("siteHeader");

const menuButton =
    document.getElementById("menuButton");

const mobileDrawer =
    document.getElementById("mobileDrawer");

const backToTop =
    document.getElementById("backToTop");

const scrollProgress =
    document.getElementById("scrollProgress");

const currentYear =
    document.getElementById("currentYear");

const heroVideo =
    document.querySelector(".hero-video");

const ambientVideos =
    document.querySelectorAll(".ambient-video");

const heroDashboard =
    document.getElementById("heroDashboard");

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


// =========================================================
// CURRENT YEAR
// =========================================================

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}


// =========================================================
// HEADER HIDE / SHOW
// =========================================================

let previousScrollY =
    window.scrollY;

let scrollAccumulator =
    0;

let previousDirection =
    null;


function updateHeader() {

    if (!header) {
        return;
    }

    const currentScrollY =
        Math.max(
            window.scrollY,
            0
        );

    const drawerOpen =
        mobileDrawer &&
        mobileDrawer.classList.contains(
            "open"
        );

    if (currentScrollY > 35) {

        header.classList.add(
            "scrolled"
        );

    } else {

        header.classList.remove(
            "scrolled"
        );

    }

    if (drawerOpen) {

        header.classList.remove(
            "hidden"
        );

        previousScrollY =
            currentScrollY;

        return;
    }

    if (currentScrollY < 120) {

        header.classList.remove(
            "hidden"
        );

        scrollAccumulator =
            0;

        previousScrollY =
            currentScrollY;

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

    if (
        direction !==
        previousDirection
    ) {

        scrollAccumulator =
            0;
    }

    scrollAccumulator +=
        Math.abs(difference);

    if (
        direction === "down" &&
        scrollAccumulator > 28
    ) {

        header.classList.add(
            "hidden"
        );

        scrollAccumulator =
            0;
    }

    if (
        direction === "up" &&
        scrollAccumulator > 10
    ) {

        header.classList.remove(
            "hidden"
        );

        scrollAccumulator =
            0;
    }

    previousDirection =
        direction;

    previousScrollY =
        currentScrollY;
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

        scrollProgress.style.width =
            "0%";

        return;
    }

    const percentage =
        (
            window.scrollY /
            documentHeight
        ) * 100;

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

        backToTop.classList.add(
            "visible"
        );

    } else {

        backToTop.classList.remove(
            "visible"
        );
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
// SCROLL EVENTS
// =========================================================

window.addEventListener(
    "scroll",
    () => {

        updateHeader();
        updateScrollProgress();
        updateBackToTop();

    },
    {
        passive: true
    }
);


updateHeader();
updateScrollProgress();
updateBackToTop();


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

    menuButton.classList.add(
        "active"
    );

    mobileDrawer.classList.add(
        "open"
    );

    document.body.classList.add(
        "menu-open"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    menuButton.setAttribute(
        "aria-label",
        "Close navigation"
    );

    if (header) {

        header.classList.remove(
            "hidden"
        );
    }
}


function closeMenu() {

    if (
        !menuButton ||
        !mobileDrawer
    ) {
        return;
    }

    menuButton.classList.remove(
        "active"
    );

    mobileDrawer.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "menu-open"
    );

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
        mobileDrawer.classList.contains(
            "open"
        );

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


// =========================================================
// MOBILE DRAWER LINKS
// =========================================================

if (mobileDrawer) {

    const drawerLinks =
        mobileDrawer.querySelectorAll(
            "a"
        );

    drawerLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        }
    );
}


// =========================================================
// ESCAPE CLOSES MENU
// =========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            closeMenu();
        }

    }
);


// =========================================================
// DESKTOP RESET
// =========================================================

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            820
        ) {

            closeMenu();
        }

    }
);


// =========================================================
// VIDEO PLAYBACK HELPER
// =========================================================

function attemptVideoPlayback(video) {

    if (!video) {
        return;
    }

    video.muted =
        true;

    const playPromise =
        video.play();

    if (
        playPromise !==
        undefined
    ) {

        playPromise.catch(
            () => {
                // Autoplay fallback.
            }
        );
    }
}


// =========================================================
// HERO VIDEO
// =========================================================

if (heroVideo) {

    if (
        heroVideo.readyState >=
        2
    ) {

        attemptVideoPlayback(
            heroVideo
        );

    } else {

        heroVideo.addEventListener(
            "loadeddata",
            () => {

                attemptVideoPlayback(
                    heroVideo
                );

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


// =========================================================
// WHITE TEXTURE VIDEOS
// =========================================================

ambientVideos.forEach(
    (video) => {

        if (
            video.readyState >=
            2
        ) {

            attemptVideoPlayback(
                video
            );

        } else {

            video.addEventListener(
                "loadeddata",
                () => {

                    attemptVideoPlayback(
                        video
                    );

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


if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "in"
                            );

                            observer.unobserve(
                                entry.target
                            );
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

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                "in"
            );

        }
    );
}


// =========================================================
// ALTO LAB
// RUNTIME EXPERIENCE STYLES
// =========================================================

function installAltoLabStyles() {

    if (
        document.getElementById(
            "altoLabRuntimeStyles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "altoLabRuntimeStyles";

    style.textContent = `

        /* =============================================
           CINEMATIC PAGE TRANSITION
        ============================================== */

        .alto-page-transition {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: grid;
            place-items: center;
            pointer-events: none;
            background:
                radial-gradient(
                    circle at 72% 35%,
                    rgba(25, 197, 232, 0.18),
                    transparent 34%
                ),
                linear-gradient(
                    135deg,
                    #02141f 0%,
                    #03293b 52%,
                    #041b29 100%
                );
            transform: translateY(101%);
            transition:
                transform 0.62s cubic-bezier(.76, 0, .24, 1);
        }

        .alto-page-transition.is-entering {
            transform: translateY(0);
        }

        .alto-page-transition.is-leaving {
            transform: translateY(-101%);
        }

        .alto-transition-inner {
            position: relative;
            display: grid;
            gap: 14px;
            text-align: center;
            color: white;
        }

        .alto-transition-index {
            color: rgba(255, 255, 255, 0.40);
            font-family: "Inter", sans-serif;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.20em;
            text-transform: uppercase;
        }

        .alto-transition-title {
            font-family: "Space Grotesk", sans-serif;
            font-size: clamp(30px, 5vw, 58px);
            font-weight: 500;
            letter-spacing: -0.055em;
            line-height: 0.95;
        }

        .alto-transition-line {
            width: 84px;
            height: 1px;
            margin: 10px auto 0;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.14);
        }

        .alto-transition-line::after {
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            background: #19c5e8;
            transform: translateX(-100%);
            animation:
                altoTransitionLine 0.72s
                cubic-bezier(.76, 0, .24, 1)
                forwards;
        }

        @keyframes altoTransitionLine {
            to {
                transform: translateX(100%);
            }
        }


        /* =============================================
           HERO THERMAL GLASS
        ============================================== */

        #heroDashboard {
            --lab-x: 50%;
            --lab-y: 50%;
            transform: none !important;
            rotate: 0deg !important;
            transform-style: flat !important;
            isolation: isolate;
        }

        #heroDashboard::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 8;
            pointer-events: none;
            border-radius: inherit;
            opacity: 0;
            background:
                radial-gradient(
                    circle 180px
                    at var(--lab-x) var(--lab-y),
                    rgba(255, 255, 255, 0.17),
                    rgba(255, 255, 255, 0.045) 36%,
                    transparent 70%
                );
            transition:
                opacity 0.28s ease;
        }

        #heroDashboard:hover::after {
            opacity: 1;
        }


        /* =============================================
           LIVE TEMPERATURE
        ============================================== */

        .lab-live-telemetry {
            position: absolute;
            left: 50%;
            bottom: 17px;
            z-index: 9;
            width: calc(100% - 48px);
            transform: translateX(-50%);
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 18px;
            pointer-events: none;
        }

        .lab-live-temp {
            display: grid;
            gap: 4px;
        }

        .lab-live-temp-label {
            color: rgba(255,255,255,0.28);
            font-size: 6px;
            font-weight: 800;
            letter-spacing: 0.15em;
        }

        .lab-live-temp-value {
            color: rgba(255,255,255,0.88);
            font-family: "Space Grotesk", sans-serif;
            font-size: 13px;
            font-weight: 500;
        }

        .lab-live-temp-value em {
            color: #74dbef;
            font-style: normal;
        }

        .lab-temp-trace {
            height: 25px;
            flex: 1;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            gap: 3px;
            opacity: 0.72;
        }

        .lab-temp-trace span {
            width: 2px;
            min-height: 3px;
            border-radius: 999px;
            background:
                linear-gradient(
                    180deg,
                    #8ce5f3,
                    rgba(25,197,232,0.18)
                );
            transform-origin: bottom;
            transition:
                height 0.65s
                cubic-bezier(.22, 1, .36, 1);
        }


        /* =============================================
           INTERACTIVE CARD LIGHT
        ============================================== */

        .alto-reactive-card {
            --card-x: 50%;
            --card-y: 50%;
            position: relative;
            isolation: isolate;
        }

        .alto-reactive-card::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 20;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
            background:
                radial-gradient(
                    circle 220px
                    at var(--card-x) var(--card-y),
                    rgba(25, 197, 232, 0.105),
                    transparent 68%
                );
            transition:
                opacity 0.3s ease;
        }

        .alto-reactive-card:hover::after {
            opacity: 1;
        }


        /* =============================================
           MOTION ACCESSIBILITY
        ============================================== */

        @media (prefers-reduced-motion: reduce) {

            .alto-page-transition,
            .alto-transition-line::after,
            .lab-temp-trace span {
                animation: none !important;
                transition: none !important;
            }

        }

    `;

    document.head.appendChild(
        style
    );
}


installAltoLabStyles();


// =========================================================
// ALTO LAB
// CINEMATIC PAGE TRANSITIONS
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
        document.createElement(
            "div"
        );

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

    document.body.appendChild(
        transition
    );
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
    () => {

        revealCurrentPage();

    }
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

        const destination =
            link.href;

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
                    destination;

            },
            470
        );

    }
);


// =========================================================
// ALTO LAB
// HERO DASHBOARD GLASS LIGHT
// NO TILT
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


    let pointerFrame =
        null;


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
                            heroDashboard.getBoundingClientRect();

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
// ALTO LAB
// LIVE THERMAL TELEMETRY
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
        document.createElement(
            "div"
        );

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

    heroDashboard.appendChild(
        telemetry
    );

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
            document.createElement(
                "span"
            );

        bar.style.height =
            `${6 + Math.random() * 14}px`;

        trace.appendChild(
            bar
        );
    }
}


createThermalTelemetry();


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


let simulatedTemperature =
    4.2;


function updateThermalTelemetry() {

    if (
        !thermalValue ||
        prefersReducedMotion
    ) {
        return;
    }

    const movement =
        (
            Math.random() -
            0.5
        ) * 0.26;

    simulatedTemperature +=
        movement;

    simulatedTemperature =
        Math.min(
            4.8,
            Math.max(
                3.8,
                simulatedTemperature
            )
        );

    thermalValue.textContent =
        simulatedTemperature.toFixed(1);

    if (
        thermalBars.length
    ) {

        const firstBar =
            thermalBars.shift();

        thermalBars.push(
            firstBar
        );

        thermalBars.forEach(
            (
                bar,
                index
            ) => {

                const phase =
                    (
                        index /
                        thermalBars.length
                    ) * Math.PI * 2;

                const base =
                    10 +
                    Math.sin(phase) * 4;

                const temperatureOffset =
                    (
                        simulatedTemperature -
                        4.2
                    ) * 9;

                const noise =
                    Math.random() * 5;

                const height =
                    Math.max(
                        4,
                        Math.min(
                            24,
                            base +
                            temperatureOffset +
                            noise
                        )
                    );

                bar.style.height =
                    `${height}px`;

            }
        );
    }
}


if (
    thermalValue &&
    !prefersReducedMotion
) {

    setInterval(
        updateThermalTelemetry,
        1350
    );
}


// =========================================================
// ALTO LAB
// REACTIVE CARD LIGHT
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
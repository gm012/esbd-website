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
// ALTO LAB / FIND YOUR SOLUTION
// =========================================================

const finderShell =
    document.getElementById(
        "solutionFinderShell"
    );

const finderSteps =
    finderShell
        ? Array.from(
            finderShell.querySelectorAll(
                "[data-finder-step]"
            )
        )
        : [];

const finderProgressSteps =
    finderShell
        ? Array.from(
            finderShell.querySelectorAll(
                "[data-finder-progress]"
            )
        )
        : [];

const finderOptions =
    finderShell
        ? Array.from(
            finderShell.querySelectorAll(
                ".finder-option"
            )
        )
        : [];

const finderBack =
    document.getElementById(
        "finderBack"
    );

const finderStepStatus =
    document.getElementById(
        "finderStepStatus"
    );

const finderAnalysis =
    document.getElementById(
        "finderAnalysis"
    );

const finderResult =
    document.getElementById(
        "finderResult"
    );

const finderRestart =
    document.getElementById(
        "finderRestart"
    );

const finderLiveStatus =
    document.getElementById(
        "finderLiveStatus"
    );

const finderPreviewImage =
    document.getElementById(
        "finderPreviewImage"
    );

const finderSummaryCargo =
    document.getElementById(
        "finderSummaryCargo"
    );

const finderSummaryTemperature =
    document.getElementById(
        "finderSummaryTemperature"
    );

const finderSummaryLoad =
    document.getElementById(
        "finderSummaryLoad"
    );

const finderSummaryPriority =
    document.getElementById(
        "finderSummaryPriority"
    );

const finderResultTitle =
    document.getElementById(
        "finderResultTitle"
    );

const finderResultReason =
    document.getElementById(
        "finderResultReason"
    );

const finderResultImage =
    document.getElementById(
        "finderResultImage"
    );

const finderResultProductLink =
    document.getElementById(
        "finderResultProductLink"
    );

const finderResultSupport =
    document.getElementById(
        "finderResultSupport"
    );

const finderSupportTitle =
    document.getElementById(
        "finderSupportTitle"
    );

const finderSupportLink =
    document.getElementById(
        "finderSupportLink"
    );


const finderLabels = {

    cargo: {
        pharma: "PHARMACEUTICALS",
        food: "HIGH VALUE FOODS",
        chemicals: "CHEMICALS",
        general: "GENERAL COLD CHAIN"
    },

    temperature: {
        "2-8": "2–8°C",
        chilled: "CHILLED",
        ambient: "AMBIENT PROTECTION",
        unknown: "NOT SURE YET"
    },

    load: {
        single: "INDIVIDUAL SHIPMENTS",
        boxes: "MULTIPLE BOXES",
        pallet: "FULL PALLETS",
        oversized: "VARIABLE / OVERSIZED"
    },

    priority: {
        reuse: "REUSABILITY",
        monitoring: "MONITORING & REPORTING",
        compliance: "QUALITY / COMPLIANCE",
        branding: "BRANDING / CUSTOMISATION"
    }

};


const finderProducts = {

    topLoader: {
        title: "Top Loader Boxes",
        image: "images/top-loader-boxes.png",
        page: "top-loader-boxes.html"
    },

    pallet: {
        title: "Full Pallet Loader",
        image: "images/forklift.png",
        page: "full-pallet-loader.html"
    },

    blanket: {
        title: "Eco Thermal Blankets",
        image: "images/thermometer-2.png",
        page: "eco-thermal-blankets.html"
    },

    customised: {
        title: "Customised Solutions",
        image: "images/brand.png",
        page: "customised-solutions.html"
    },

    quality: {
        title: "Quality Control",
        image: "images/box-2.png",
        page: "quality-control.html"
    },

    reporting: {
        title: "Reporting",
        image: "images/financial-report.png",
        page: "reporting.html"
    }

};


const finderAnswers = {
    cargo: null,
    temperature: null,
    load: null,
    priority: null
};


let finderCurrentStep = 0;
let finderAdvanceTimer = null;
let finderAnalysisTimer = null;


// =========================================================
// FINDER / STEP STATE
// =========================================================

function updateFinderProgress(
    activeIndex
) {

    finderProgressSteps.forEach(
        (
            step,
            index
        ) => {

            step.classList.toggle(
                "active",
                index === activeIndex
            );

            step.classList.toggle(
                "complete",
                index < activeIndex
            );

        }
    );

}


function setFinderStep(
    index
) {

    if (
        !finderShell ||
        !finderSteps.length
    ) {
        return;
    }

    finderCurrentStep =
        clamp(
            index,
            0,
            finderSteps.length - 1
        );

    finderSteps.forEach(
        (
            step,
            stepIndex
        ) => {

            step.classList.toggle(
                "active",
                stepIndex === finderCurrentStep
            );

            step.classList.remove(
                "exiting"
            );

        }
    );

    updateFinderProgress(
        finderCurrentStep
    );

    if (finderBack) {

        finderBack.disabled =
            finderCurrentStep === 0;

    }

    if (finderStepStatus) {

        finderStepStatus.textContent =
            `STEP ${String(
                finderCurrentStep + 1
            ).padStart(
                2,
                "0"
            )} OF 04`;

    }

    if (finderLiveStatus) {

        finderLiveStatus.textContent =
            "CAPTURING";

    }

}


// =========================================================
// FINDER / LIVE SUMMARY
// =========================================================

function setFinderSummaryValue(
    element,
    value
) {

    if (!element) {
        return;
    }

    element.textContent =
        value || "AWAITING INPUT";

    element.classList.toggle(
        "has-value",
        Boolean(value)
    );

}


function updateFinderPreview() {

    if (!finderPreviewImage) {
        return;
    }

    let product =
        finderProducts.topLoader;

    if (
        finderAnswers.load ===
        "pallet"
    ) {

        product =
            finderProducts.pallet;

    } else if (
        finderAnswers.load ===
        "oversized"
    ) {

        product =
            finderProducts.blanket;

    }

    finderPreviewImage.classList.add(
        "changing"
    );

    window.setTimeout(
        () => {

            finderPreviewImage.src =
                product.image;

            finderPreviewImage.classList.remove(
                "changing"
            );

        },
        prefersReducedMotion
            ? 0
            : 170
    );

}


function updateFinderSummary() {

    setFinderSummaryValue(
        finderSummaryCargo,
        finderAnswers.cargo
            ? finderLabels.cargo[
                finderAnswers.cargo
            ]
            : null
    );

    setFinderSummaryValue(
        finderSummaryTemperature,
        finderAnswers.temperature
            ? finderLabels.temperature[
                finderAnswers.temperature
            ]
            : null
    );

    setFinderSummaryValue(
        finderSummaryLoad,
        finderAnswers.load
            ? finderLabels.load[
                finderAnswers.load
            ]
            : null
    );

    setFinderSummaryValue(
        finderSummaryPriority,
        finderAnswers.priority
            ? finderLabels.priority[
                finderAnswers.priority
            ]
            : null
    );

    updateFinderPreview();

}


// =========================================================
// FINDER / RECOMMENDATION
// =========================================================

function getFinderRecommendation() {

    let primary =
        finderProducts.topLoader;

    if (
        finderAnswers.load ===
        "pallet"
    ) {

        primary =
            finderProducts.pallet;

    } else if (
        finderAnswers.load ===
        "oversized"
    ) {

        primary =
            finderProducts.blanket;

    }


    let support = null;

    if (
        finderAnswers.priority ===
        "monitoring"
    ) {

        support =
            finderProducts.reporting;

    } else if (
        finderAnswers.priority ===
        "compliance"
    ) {

        support =
            finderProducts.quality;

    } else if (
        finderAnswers.priority ===
        "branding"
    ) {

        support =
            finderProducts.customised;

    }


    const cargoLabel =
        finderLabels.cargo[
            finderAnswers.cargo
        ] || "YOUR PRODUCT";

    const temperatureLabel =
        finderLabels.temperature[
            finderAnswers.temperature
        ] || "YOUR THERMAL REQUIREMENT";

    const loadLabel =
        finderLabels.load[
            finderAnswers.load
        ] || "YOUR LOAD FORMAT";


    let reason =
        `Based on ${loadLabel.toLowerCase()} as the load format, ` +
        `${primary.title} is the most relevant ESBD solution to discuss first. ` +
        `Your ${temperatureLabel.toLowerCase()} requirement and ${cargoLabel.toLowerCase()} ` +
        `profile can then be validated with ESBD before a final specification is made.`;


    if (
        finderAnswers.priority ===
        "reuse"
    ) {

        reason +=
            " Reusability should remain a core requirement during that validation.";

    }


    return {
        primary,
        support,
        reason
    };

}


// =========================================================
// FINDER / RESULT RENDER
// =========================================================

function renderFinderResult() {

    const recommendation =
        getFinderRecommendation();

    if (finderResultTitle) {

        finderResultTitle.textContent =
            recommendation.primary.title;

    }

    if (finderResultReason) {

        finderResultReason.textContent =
            recommendation.reason;

    }

    if (finderResultImage) {

        finderResultImage.src =
            recommendation.primary.image;

        finderResultImage.alt =
            recommendation.primary.title;

    }

    if (finderResultProductLink) {

        finderResultProductLink.href =
            recommendation.primary.page;

    }


    if (
        finderResultSupport &&
        finderSupportTitle &&
        finderSupportLink
    ) {

        if (recommendation.support) {

            finderResultSupport.hidden =
                false;

            finderSupportTitle.textContent =
                recommendation.support.title;

            finderSupportLink.href =
                recommendation.support.page;

        } else {

            finderResultSupport.hidden =
                true;

        }

    }

}


// =========================================================
// FINDER / ANALYSIS → RESULT
// =========================================================

function runFinderAnalysis() {

    if (
        !finderShell ||
        !finderAnalysis ||
        !finderResult
    ) {
        return;
    }

    window.clearTimeout(
        finderAnalysisTimer
    );

    finderShell.classList.add(
        "is-analysing"
    );

    finderShell.classList.remove(
        "has-result"
    );

    finderAnalysis.classList.add(
        "active"
    );

    finderAnalysis.setAttribute(
        "aria-hidden",
        "false"
    );

    finderResult.classList.remove(
        "active"
    );

    finderResult.setAttribute(
        "aria-hidden",
        "true"
    );

    updateFinderProgress(4);

    if (finderLiveStatus) {

        finderLiveStatus.textContent =
            "ANALYSING";

    }


    finderAnalysisTimer =
        window.setTimeout(
            () => {

                renderFinderResult();

                finderAnalysis.classList.remove(
                    "active"
                );

                finderAnalysis.setAttribute(
                    "aria-hidden",
                    "true"
                );

                finderShell.classList.remove(
                    "is-analysing"
                );

                finderShell.classList.add(
                    "has-result"
                );

                finderResult.classList.add(
                    "active"
                );

                finderResult.setAttribute(
                    "aria-hidden",
                    "false"
                );

                if (finderLiveStatus) {

                    finderLiveStatus.textContent =
                        "MATCH FOUND";

                }

            },
            prefersReducedMotion
                ? 0
                : 1050
        );

}


// =========================================================
// FINDER / OPTION SELECTION
// =========================================================

finderOptions.forEach(
    (option) => {

        option.addEventListener(
            "click",
            () => {

                if (!finderShell) {
                    return;
                }

                const question =
                    option.dataset
                        .finderQuestion;

                const value =
                    option.dataset
                        .finderValue;

                if (
                    !question ||
                    !value
                ) {
                    return;
                }


                finderAnswers[
                    question
                ] = value;


                finderOptions
                    .filter(
                        (candidate) =>
                            candidate.dataset
                                .finderQuestion ===
                            question
                    )
                    .forEach(
                        (candidate) => {

                            candidate.classList.toggle(
                                "selected",
                                candidate === option
                            );

                        }
                    );


                updateFinderSummary();


                window.clearTimeout(
                    finderAdvanceTimer
                );


                if (
                    finderCurrentStep <
                    finderSteps.length - 1
                ) {

                    finderAdvanceTimer =
                        window.setTimeout(
                            () => {

                                setFinderStep(
                                    finderCurrentStep + 1
                                );

                            },
                            prefersReducedMotion
                                ? 0
                                : 260
                        );

                } else {

                    finderAdvanceTimer =
                        window.setTimeout(
                            runFinderAnalysis,
                            prefersReducedMotion
                                ? 0
                                : 280
                        );

                }

            }
        );

    }
);


// =========================================================
// FINDER / BACK
// =========================================================

if (finderBack) {

    finderBack.addEventListener(
        "click",
        () => {

            if (
                finderCurrentStep >
                0
            ) {

                setFinderStep(
                    finderCurrentStep - 1
                );

            }

        }
    );

}


// =========================================================
// FINDER / RESTART
// =========================================================

function resetFinder() {

    window.clearTimeout(
        finderAdvanceTimer
    );

    window.clearTimeout(
        finderAnalysisTimer
    );


    Object.keys(
        finderAnswers
    ).forEach(
        (key) => {

            finderAnswers[key] =
                null;

        }
    );


    finderOptions.forEach(
        (option) => {

            option.classList.remove(
                "selected"
            );

        }
    );


    if (finderShell) {

        finderShell.classList.remove(
            "is-analysing",
            "has-result"
        );

    }


    if (finderAnalysis) {

        finderAnalysis.classList.remove(
            "active"
        );

        finderAnalysis.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (finderResult) {

        finderResult.classList.remove(
            "active"
        );

        finderResult.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    updateFinderSummary();
    setFinderStep(0);


    if (finderLiveStatus) {

        finderLiveStatus.textContent =
            "READY";

    }

}


if (finderRestart) {

    finderRestart.addEventListener(
        "click",
        resetFinder
    );

}


if (finderShell) {

    updateFinderSummary();
    setFinderStep(0);

}



// =========================================================
// ALTO LAB / STAGE 4
// PRODUCT LAB + EFFICIENCY MODEL + END SEQUENCE
// =========================================================


// =========================================================
// PRODUCT LAB / ENHANCED PRODUCT CARDS
// =========================================================

const productLabProfiles = {
    "Top Loader Boxes": {
        left: "REUSABLE / PARCEL",
        right: "THERMAL PACKAGING"
    },
    "Full Pallet Loader": {
        left: "PALLET / VOLUME",
        right: "REUSABLE SYSTEM"
    },
    "Eco Thermal Blankets": {
        left: "THERMAL / COVERAGE",
        right: "FLEXIBLE PROTECTION"
    },
    "Customised & Branded": {
        left: "CUSTOM / BRAND",
        right: "TAILORED SYSTEM"
    },
    "Quality Control": {
        left: "VERIFY / ASSURE",
        right: "QUALITY CONTROL"
    },
    "Reporting": {
        left: "DATA / TRACE",
        right: "MEASURABLE"
    }
};

const productLabCards =
    Array.from(
        document.querySelectorAll(
            ".solution-card"
        )
    );

productLabCards.forEach(
    (card) => {
        const visual =
            card.querySelector(
                ".solution-visual"
            );

        const titleElement =
            card.querySelector(
                ".solution-text h3"
            );

        if (
            !visual ||
            !titleElement
        ) {
            return;
        }

        const title =
            titleElement.textContent
                .replace(/\s+/g, " ")
                .trim();

        const profile =
            productLabProfiles[title] || {
                left: "ESBD / PRODUCT",
                right: "OPEN SYSTEM"
            };

        if (
            !visual.querySelector(
                ".product-lab-axis"
            )
        ) {
            visual.insertAdjacentHTML(
                "beforeend",
                `
                    <span class="product-lab-axis" aria-hidden="true"></span>
                    <span class="product-lab-corner product-lab-corner-one" aria-hidden="true"></span>
                    <span class="product-lab-corner product-lab-corner-two" aria-hidden="true"></span>

                    <span class="product-lab-meta product-lab-meta-a" aria-hidden="true">
                        <span>PROFILE</span>
                        <strong>${profile.left}</strong>
                    </span>

                    <span class="product-lab-meta product-lab-meta-b" aria-hidden="true">
                        <span>SYSTEM</span>
                        <strong>${profile.right}</strong>
                    </span>
                `
            );
        }

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

                const normalizedX =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width -
                    0.5;

                const normalizedY =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height -
                    0.5;

                card.style.setProperty(
                    "--product-x",
                    `${normalizedX * 10}px`
                );

                card.style.setProperty(
                    "--product-y",
                    `${normalizedY * 8}px`
                );

                card.style.setProperty(
                    "--product-ring-x",
                    `${normalizedX * -8}px`
                );

                card.style.setProperty(
                    "--product-ring-y",
                    `${normalizedY * -6}px`
                );
            }
        );

        card.addEventListener(
            "pointerleave",
            () => {
                card.style.setProperty(
                    "--product-x",
                    "0px"
                );

                card.style.setProperty(
                    "--product-y",
                    "0px"
                );

                card.style.setProperty(
                    "--product-ring-x",
                    "0px"
                );

                card.style.setProperty(
                    "--product-ring-y",
                    "0px"
                );
            }
        );
    }
);

if (
    productLabCards.length &&
    "IntersectionObserver" in window
) {
    const productLabObserver =
        new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => {
                        entry.target.classList.toggle(
                            "product-lab-active",
                            entry.isIntersecting
                        );
                    }
                );
            },
            {
                threshold: 0.48,
                rootMargin:
                    "-8% 0px -8% 0px"
            }
        );

    productLabCards.forEach(
        (card) => {
            productLabObserver.observe(card);
        }
    );
}


// =========================================================
// EFFICIENCY MODEL
// USER-ENTERED ASSUMPTIONS ONLY
// =========================================================

const calcShipments =
    document.getElementById(
        "calcShipments"
    );

const calcCurrentCost =
    document.getElementById(
        "calcCurrentCost"
    );

const calcReusableCost =
    document.getElementById(
        "calcReusableCost"
    );

const calcReuseCycles =
    document.getElementById(
        "calcReuseCycles"
    );

const calcRecoveryRate =
    document.getElementById(
        "calcRecoveryRate"
    );

const calcCurrentMonthly =
    document.getElementById(
        "calcCurrentMonthly"
    );

const calcReusableMonthly =
    document.getElementById(
        "calcReusableMonthly"
    );

const calcMonthlyDifference =
    document.getElementById(
        "calcMonthlyDifference"
    );

const calcAnnualDifference =
    document.getElementById(
        "calcAnnualDifference"
    );

const calcPerUse =
    document.getElementById(
        "calcPerUse"
    );

const calcEffectiveUses =
    document.getElementById(
        "calcEffectiveUses"
    );

const calcUnitsAvoided =
    document.getElementById(
        "calcUnitsAvoided"
    );

const calcDifferenceLabel =
    document.getElementById(
        "calcDifferenceLabel"
    );

const calcDifferenceContext =
    document.getElementById(
        "calcDifferenceContext"
    );

const calcModelStatus =
    document.getElementById(
        "calcModelStatus"
    );

const calculatorTrace =
    document.getElementById(
        "calculatorTrace"
    );

const calculatorInputs = [
    calcShipments,
    calcCurrentCost,
    calcReusableCost,
    calcReuseCycles,
    calcRecoveryRate
].filter(Boolean);

let calculatorEdited = false;

function calculatorNumber(
    input,
    fallback = 0
) {
    if (!input) {
        return fallback;
    }

    const value =
        Number.parseFloat(
            input.value
        );

    return Number.isFinite(value)
        ? value
        : fallback;
}

function formatRand(
    value
) {
    const safeValue =
        Number.isFinite(value)
            ? value
            : 0;

    return new Intl.NumberFormat(
        "en-ZA",
        {
            style: "currency",
            currency: "ZAR",
            maximumFractionDigits: 0
        }
    ).format(safeValue);
}

function formatWholeNumber(
    value
) {
    const safeValue =
        Number.isFinite(value)
            ? value
            : 0;

    return new Intl.NumberFormat(
        "en-ZA",
        {
            maximumFractionDigits: 0
        }
    ).format(
        Math.max(
            0,
            Math.round(safeValue)
        )
    );
}

function createCalculatorTrace() {
    if (
        !calculatorTrace ||
        calculatorTrace.children.length
    ) {
        return;
    }

    for (
        let i = 0;
        i < 36;
        i += 1
    ) {
        const bar =
            document.createElement(
                "span"
            );

        calculatorTrace.appendChild(
            bar
        );
    }
}

function updateCalculatorTrace(
    differenceRatio
) {
    if (!calculatorTrace) {
        return;
    }

    const bars =
        Array.from(
            calculatorTrace.children
        );

    bars.forEach(
        (
            bar,
            index
        ) => {
            const progress =
                index /
                Math.max(
                    1,
                    bars.length - 1
                );

            const wave =
                Math.sin(
                    progress *
                    Math.PI *
                    2.5
                ) * 4;

            const growth =
                clamp(
                    differenceRatio,
                    -1,
                    1
                ) *
                progress *
                13;

            const height =
                clamp(
                    9 +
                    wave +
                    growth +
                    Math.random() * 3,
                    4,
                    29
                );

            bar.style.height =
                `${height}px`;
        }
    );
}

function updateEfficiencyCalculator() {
    if (!calculatorInputs.length) {
        return;
    }

    const shipments =
        Math.max(
            1,
            calculatorNumber(
                calcShipments,
                1
            )
        );

    const currentCost =
        Math.max(
            0,
            calculatorNumber(
                calcCurrentCost
            )
        );

    const reusableCost =
        Math.max(
            0,
            calculatorNumber(
                calcReusableCost
            )
        );

    const reuseCycles =
        Math.max(
            1,
            calculatorNumber(
                calcReuseCycles,
                1
            )
        );

    const recoveryRate =
        clamp(
            calculatorNumber(
                calcRecoveryRate,
                100
            ),
            1,
            100
        );

    const effectiveUses =
        Math.max(
            1,
            reuseCycles *
            (
                recoveryRate /
                100
            )
        );

    const reusablePerUse =
        reusableCost /
        effectiveUses;

    const currentMonthly =
        shipments *
        currentCost;

    const reusableMonthly =
        shipments *
        reusablePerUse;

    const monthlyDifference =
        currentMonthly -
        reusableMonthly;

    const annualDifference =
        monthlyDifference *
        12;

    const currentAnnualUnits =
        shipments *
        12;

    const reusableAnnualEquivalentUnits =
        currentAnnualUnits /
        effectiveUses;

    const unitsAvoided =
        Math.max(
            0,
            currentAnnualUnits -
            reusableAnnualEquivalentUnits
        );

    if (calcCurrentMonthly) {
        calcCurrentMonthly.textContent =
            formatRand(
                currentMonthly
            );
    }

    if (calcReusableMonthly) {
        calcReusableMonthly.textContent =
            formatRand(
                reusableMonthly
            );
    }

    if (calcPerUse) {
        calcPerUse.textContent =
            formatRand(
                reusablePerUse
            );
    }

    if (calcEffectiveUses) {
        calcEffectiveUses.textContent =
            effectiveUses.toFixed(1);
    }

    if (calcUnitsAvoided) {
        calcUnitsAvoided.textContent =
            formatWholeNumber(
                unitsAvoided
            );
    }

    if (calcMonthlyDifference) {
        calcMonthlyDifference.textContent =
            formatRand(
                Math.abs(
                    monthlyDifference
                )
            );
    }

    if (calcAnnualDifference) {
        calcAnnualDifference.textContent =
            `${
                monthlyDifference >= 0
                    ? "+"
                    : "−"
            }${formatRand(
                Math.abs(
                    annualDifference
                )
            )}`;
    }

    if (calcDifferenceLabel) {
        calcDifferenceLabel.textContent =
            monthlyDifference >= 0
                ? "INDICATIVE MONTHLY DIFFERENCE"
                : "INDICATIVE MONTHLY ADDITIONAL COST";
    }

    if (calcDifferenceContext) {
        calcDifferenceContext.textContent =
            monthlyDifference >= 0
                ? "The reusable scenario is lower under the assumptions entered."
                : "The reusable scenario is higher under the assumptions entered.";
    }

    if (calcModelStatus) {
        calcModelStatus.textContent =
            calculatorEdited
                ? "YOUR ASSUMPTIONS"
                : "EXAMPLE SCENARIO";
    }

    const differenceRatio =
        currentMonthly > 0
            ? monthlyDifference /
                currentMonthly
            : 0;

    updateCalculatorTrace(
        differenceRatio
    );
}

createCalculatorTrace();
updateEfficiencyCalculator();

calculatorInputs.forEach(
    (input) => {
        input.addEventListener(
            "input",
            () => {
                calculatorEdited = true;
                updateEfficiencyCalculator();
            }
        );

        input.addEventListener(
            "change",
            () => {
                calculatorEdited = true;
                updateEfficiencyCalculator();
            }
        );
    }
);


// =========================================================
// END SEQUENCE / FINALE
// =========================================================

const finaleSection =
    document.getElementById(
        "altoFinale"
    );

const finalePayload =
    document.getElementById(
        "finalePayload"
    );

const finaleSteps =
    finaleSection
        ? Array.from(
            finaleSection.querySelectorAll(
                "[data-finale-step]"
            )
        )
        : [];

const finaleStageCounter =
    document.getElementById(
        "finaleStageCounter"
    );

const finaleStageName =
    document.getElementById(
        "finaleStageName"
    );

const finaleStageNames = [
    "PROTECT",
    "DELIVER",
    "RETURN",
    "REUSE"
];

let finaleStart = 0;
let finaleDistance = 1;
let finaleFrame = null;
let finaleActiveStage = 0;

function measureFinale() {
    if (!finaleSection) {
        return;
    }

    const rect =
        finaleSection.getBoundingClientRect();

    finaleStart =
        window.scrollY +
        rect.top;

    finaleDistance =
        Math.max(
            1,
            finaleSection.offsetHeight -
            window.innerHeight
        );
}

function setFinaleStage(
    index
) {
    const stageIndex =
        clamp(
            index,
            0,
            finaleStageNames.length - 1
        );

    finaleActiveStage =
        stageIndex;

    finaleSteps.forEach(
        (
            step,
            stepIndex
        ) => {
            step.classList.toggle(
                "active",
                stepIndex === stageIndex
            );
        }
    );

    if (finaleStageCounter) {
        finaleStageCounter.textContent =
            `${String(
                stageIndex + 1
            ).padStart(
                2,
                "0"
            )} / 04`;
    }

    if (finaleStageName) {
        finaleStageName.textContent =
            finaleStageNames[
                stageIndex
            ];
    }
}

function updateFinaleFromScroll() {
    if (!finaleSection) {
        return;
    }

    const progress =
        clamp(
            (
                window.scrollY -
                finaleStart
            ) /
            finaleDistance,
            0,
            0.9999
        );

    const stageIndex =
        Math.min(
            finaleStageNames.length - 1,
            Math.floor(
                progress *
                finaleStageNames.length
            )
        );

    finaleSection.style.setProperty(
        "--finale-progress",
        progress.toFixed(4)
    );

    if (
        stageIndex !==
        finaleActiveStage
    ) {
        setFinaleStage(
            stageIndex
        );
    }

    if (finalePayload) {
        const angle =
            -90 +
            progress *
            420;

        const radius =
            window.innerWidth <= 820
                ? Math.min(
                    118,
                    window.innerWidth * 0.28
                )
                : Math.min(
                    205,
                    window.innerWidth * 0.16
                );

        finalePayload.style.transform =
            `rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`;
    }
}

function requestFinaleUpdate() {
    if (
        !finaleSection ||
        finaleFrame
    ) {
        return;
    }

    finaleFrame =
        requestAnimationFrame(
            () => {
                updateFinaleFromScroll();
                finaleFrame = null;
            }
        );
}

if (finaleSection) {
    measureFinale();
    setFinaleStage(0);
    updateFinaleFromScroll();
}


// =========================================================

// GLOBAL SCROLL / RESIZE EVENTS

// =========================================================



function handleScroll() {

    updateHeader();

    updateScrollProgress();

    updateBackToTop();

    requestJourneyUpdate();

    requestFinaleUpdate();

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



        if (finaleSection) {

            measureFinale();

            updateFinaleFromScroll();

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



        if (finaleSection) {

            measureFinale();

            updateFinaleFromScroll();

        }

    }

);





// =========================================================

// INITIAL STATE

// =========================================================



updateHeader();

updateScrollProgress();

updateBackToTop();
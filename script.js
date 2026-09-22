// =========================================================
// ESBD
// MAIN JAVASCRIPT
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
                behavior: "smooth"
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

                /*
                 * Autoplay fallback.
                 */

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



// =========================================================
// HERO DASHBOARD POINTER MOVEMENT
// =========================================================

function handleHeroPointer(
    event
) {

    if (
        !heroDashboard ||
        window.innerWidth <= 820
    ) {
        return;
    }


    const x =
        (
            event.clientX /
            window.innerWidth
        ) - 0.5;


    const y =
        (
            event.clientY /
            window.innerHeight
        ) - 0.5;


    const rotateY =
        x * 2.6;


    const rotateX =
        y * -1.8;


    heroDashboard.style.transform =
        `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(1.5deg)
        `;

}



function resetHeroPointer() {

    if (!heroDashboard) {
        return;
    }


    heroDashboard.style.transform =
        "rotate(1.5deg)";

}



window.addEventListener(
    "mousemove",
    handleHeroPointer
);


window.addEventListener(
    "mouseleave",
    resetHeroPointer
);
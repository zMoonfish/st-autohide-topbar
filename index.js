(function () {
    console.log("[auto-hide] final stable version");

    function waitForElements() {
        const TOP_BAR = document.getElementById("top-bar");
        const SETTINGS = document.getElementById("top-settings-holder");

        if (!TOP_BAR || !SETTINGS) {
            requestAnimationFrame(waitForElements);
            return;
        }

        let HIDE_OFFSET = 0;
        let visible = false;
        let hideTimeout = null;

        function getBook() {
            return document.querySelector(".stwii--trigger.fa-book-atlas");
        }

        function applyTransform(y) {
            const BOOK = getBook();

            [TOP_BAR, SETTINGS, BOOK].forEach(el => {
                if (!el) return;

                if (!el.dataset.autohideStyled) {
                    el.style.setProperty("transition", "transform 0.2s ease", "important");
                    el.style.setProperty("will-change", "transform", "important");
                    el.dataset.autohideStyled = "true";
                }

                el.style.setProperty("transform", `translate3d(0, ${y}px, 0)`, "important");
            });
        }

        function recalc() {
            const height = Math.max(
                TOP_BAR.offsetHeight,
                SETTINGS.offsetHeight
            );

            HIDE_OFFSET = -height;

            if (!visible) {
                applyTransform(HIDE_OFFSET);
            }
        }

        function show() {
            if (visible) return;
            visible = true;
            clearTimeout(hideTimeout);
            applyTransform(0);
        }

        function scheduleHide() {
            if (!visible) return;
            if (hideTimeout) return;

            hideTimeout = setTimeout(() => {
                visible = false;
                hideTimeout = null;
                applyTransform(HIDE_OFFSET);
            }, 120);
        }

        // stabilize layout behavior
        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.setProperty("position", "relative", "important");
            el.style.setProperty("z-index", "1000", "important");
            el.style.setProperty("contain", "layout style", "important");
        });

        // smart hover detection
        document.addEventListener("mousemove", (e) => {
            const showZone = Math.max(20, window.innerHeight * 0.02);
            const hideZone = showZone + 40;

            if (e.clientY <= showZone) {
                show();
            } else if (e.clientY > hideZone) {
                scheduleHide();
            }
        });

        // 🔧 FIX: handle fullscreen / resize properly
        window.addEventListener("resize", () => {
            setTimeout(recalc, 50);
        });

        // initial setup
        recalc();

        console.log("[auto-hide] initialized (fully stable)");
    }

    waitForElements();
})();
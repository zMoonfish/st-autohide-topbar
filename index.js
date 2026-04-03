(function () {
    console.log("[auto-hide] stable + simple book fix");

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

        // 👇 SIMPLE BOOK FIX (no wrapping, no DOM surgery)
        const style = document.createElement("style");
        style.textContent = `
        .stwii--trigger.fa-book-atlas {
            opacity: 0.2;
            transition: opacity 0.2s ease;
        }

        .stwii--trigger.fa-book-atlas:hover {
            opacity: 1;
        }

        /* slightly bigger hover zone */
        .stwii--trigger.fa-book-atlas::before {
            content: "";
            position: absolute;
            inset: -15px;
        }
        `;
        document.head.appendChild(style);

        // stabilize layout (safe)
        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.setProperty("position", "relative", "important");
            el.style.setProperty("z-index", "1000", "important");
        });

        // smooth hover logic
        document.addEventListener("mousemove", (e) => {
            const showZone = Math.max(20, window.innerHeight * 0.02);
            const hideZone = showZone + 40;

            if (e.clientY <= showZone) {
                show();
            } else if (e.clientY > hideZone) {
                scheduleHide();
            }
        });

        window.addEventListener("resize", () => {
            setTimeout(recalc, 50);
        });

        recalc();

        console.log("[auto-hide] initialized");
    }

    waitForElements();
})();
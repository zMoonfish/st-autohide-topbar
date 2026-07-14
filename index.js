(function () {
    console.log("[auto-hide] smooth version + badge toggle");

    // 👇 toggle here
    const AUTOHIDE_HIDE_BADGE = true;

    function waitForElements() {
        const TOP_BAR = document.getElementById("top-bar");
        const SETTINGS = document.getElementById("top-settings-holder");

        if (!TOP_BAR || !SETTINGS) {
            requestAnimationFrame(waitForElements);
            return;
        }

        const height = Math.max(
            TOP_BAR.offsetHeight,
            SETTINGS.offsetHeight
        );

        const HIDE_OFFSET = -height;

        let visible = false;
        let hideTimeout = null;

        function getBook() {
            return document.querySelector(".stwii--trigger.fa-book-atlas");
        }

        function applyTransform(val) {
            const BOOK = getBook();
        
            [TOP_BAR, SETTINGS, BOOK].forEach(el => {
                if (!el) return;
        
                if (!el.dataset.autohideStyled) {
                    el.style.setProperty("transition", "transform 0.2s ease", "important");
                    el.style.setProperty("will-change", "transform", "important");
                    el.dataset.autohideStyled = "true";
                }
        
                el.style.setProperty("transform", val, "important");
            });
        }

        function show() {
            if (visible) return;
            visible = true;
            clearTimeout(hideTimeout);
            applyTransform("translateY(0)");
        }

        function scheduleHide() {
            if (!visible) return;
            if (hideTimeout) return;

            hideTimeout = setTimeout(() => {
                visible = false;
                hideTimeout = null;
                applyTransform(`translateY(${HIDE_OFFSET}px)`);
            }, 120);
        }

        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.setProperty("transition", "transform 0.2s ease", "important");
            el.style.setProperty("will-change", "transform", "important");
        });

        // 👇 smooth hover logic
        document.addEventListener("mousemove", (e) => {
            const showZone = Math.max(20, window.innerHeight * 0.02);
            const hideZone = showZone + 40;

            if (e.clientY <= showZone) {
                show();
            } else if (e.clientY > hideZone) {
                scheduleHide();
            }
        });

        // 👇 badge (dot) override — NON-DESTRUCTIVE
        if (AUTOHIDE_HIDE_BADGE) {
            const style = document.createElement("style");
            style.textContent = `
            .stwii--trigger[data-autohide-hidebadge="true"]::after {
                display: none !important;
            }

            .stwii--trigger[data-autohide-hidebadge="true"]:hover::after {
                display: block !important;
            }

            `;
            document.head.appendChild(style);

            setInterval(() => {
                const el = document.querySelector(".stwii--trigger");
                if (!el) return;

                el.setAttribute("data-autohide-hidebadge", "true");
            }, 500);
        }

        // initial state
        applyTransform(`translateY(${HIDE_OFFSET}px)`);

        console.log("[auto-hide] initialized (with toggle)");
    }

    // 👇 STMemoryBooks "jump to unprocessed message" button — hover-hotzone reveal
    // (this button has no always-visible parent to hover, unlike the badge dot,
    // so we build an invisible box that tracks its real position and reveals it)
    function initMemoryBoundaryHotzone() {
        const SELECTOR = ".stmb_memory_boundary_button";
        const PAD = 10; // extra margin around the button, easier to find with the mouse

        let hotzone = null;
        let currentBtn = null;
        let hideTimer = null;

        function ensureHotzone() {
            if (hotzone) return hotzone;
            hotzone = document.createElement("div");
            hotzone.style.position = "fixed";
            hotzone.style.zIndex = "99999";
            hotzone.style.background = "transparent";
            hotzone.style.pointerEvents = "auto";
            document.body.appendChild(hotzone);

            hotzone.addEventListener("mouseenter", () => {
                clearTimeout(hideTimer);
                if (currentBtn) currentBtn.style.setProperty("opacity", "1", "important");
            });
            hotzone.addEventListener("mouseleave", () => {
                hideTimer = setTimeout(() => {
                    if (currentBtn) currentBtn.style.setProperty("opacity", "0", "important");
                }, 150);
            });

            return hotzone;
        }

        function sync() {
            const btn = document.querySelector(SELECTOR);
            if (!btn) {
                requestAnimationFrame(sync);
                return;
            }
            currentBtn = btn;

            if (!btn.dataset.autohideHotzoneStyled) {
                btn.style.setProperty("opacity", "0", "important");
                btn.style.setProperty("transition", "opacity 0.2s ease", "important");
                btn.dataset.autohideHotzoneStyled = "true";
            }

            const hz = ensureHotzone();
            const rect = btn.getBoundingClientRect();
            hz.style.left = (rect.left - PAD) + "px";
            hz.style.top = (rect.top - PAD) + "px";
            hz.style.width = (rect.width + PAD * 2) + "px";
            hz.style.height = (rect.height + PAD * 2) + "px";

            requestAnimationFrame(sync);
        }

        sync();
    }

    waitForElements();
    initMemoryBoundaryHotzone();
})();
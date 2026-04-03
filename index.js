(function () {
    console.log("[auto-hide] smooth version");

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

        // 👇 HYSTERESIS ZONES
        document.addEventListener("mousemove", (e) => {
            const showZone = Math.max(20, window.innerHeight * 0.02);
            const hideZone = showZone + 40; // buffer zone

            if (e.clientY <= showZone) {
                show();
            } else if (e.clientY > hideZone) {
                scheduleHide();
            }
            // in-between zone = do nothing (prevents jitter)
        });

        // initial state
        applyTransform(`translateY(${HIDE_OFFSET}px)`);

        console.log("[auto-hide] initialized (smooth)");
    }

    waitForElements();
})();
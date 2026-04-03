(function () {
    console.log("[auto-hide] smooth version + dot fix");

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

        // 👇 HYSTERESIS ZONES
        document.addEventListener("mousemove", (e) => {
            const showZone = Math.max(20, window.innerHeight * 0.02);
            const hideZone = showZone + 40;

            if (e.clientY <= showZone) {
                show();
            } else if (e.clientY > hideZone) {
                scheduleHide();
            }
        });

        // 👇 ONLY NEW PART: bottom dot fade fix
        const style = document.createElement("style");
style.textContent = `
/* target small bottom circle-like element */
.stwii--trigger div {
    transition: opacity 0.2s ease;
}

/* hide only small elements near bottom */
.stwii--trigger div[style*="bottom"],
.stwii--trigger div[class*="bottom"] {
    opacity: 0;
}

/* show on hover */
.stwii--trigger:hover div[style*="bottom"],
.stwii--trigger:hover div[class*="bottom"] {
    opacity: 1;
}
`;
document.head.appendChild(style);

        // initial state
        applyTransform(`translateY(${HIDE_OFFSET}px)`);

        console.log("[auto-hide] initialized (smooth + dot fix)");
    }

    waitForElements();
})();
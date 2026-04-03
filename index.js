(function () {
    console.log("[auto-hide] running (dynamic)");

    function waitForElements() {
        const TOP_BAR = document.getElementById("top-bar");
        const SETTINGS = document.getElementById("top-settings-holder");

        if (!TOP_BAR || !SETTINGS) {
            requestAnimationFrame(waitForElements);
            return;
        }

        console.log("[auto-hide] elements found");

        const height = Math.max(
            TOP_BAR.offsetHeight,
            SETTINGS.offsetHeight
        );

        const HIDE_OFFSET = -height;

        let visible = false;
        let timeout;

        const trigger = document.createElement("div");
        Object.assign(trigger.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "12px",
            zIndex: "999999"
        });

        document.body.appendChild(trigger);

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
            clearTimeout(timeout);
            if (visible) return;
            visible = true;
            applyTransform("translateY(0)");
        }

        function hide() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                visible = false;
                applyTransform(`translateY(${HIDE_OFFSET}px)`);
            }, 80);
        }

        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.setProperty("transition", "transform 0.25s ease", "important");
            el.style.setProperty("will-change", "transform", "important");
        });

        trigger.addEventListener("pointerenter", show);
        trigger.addEventListener("pointerleave", hide);
        TOP_BAR.addEventListener("pointerenter", show);
        TOP_BAR.addEventListener("pointerleave", hide);
        SETTINGS.addEventListener("pointerenter", show);
        SETTINGS.addEventListener("pointerleave", hide);

        hide();

        console.log("[auto-hide] initialized");
    }

    waitForElements();
})();
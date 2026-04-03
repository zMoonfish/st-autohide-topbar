// st-autohide-topbar index.js

(function () {
    console.log("[auto-hide] script injected");

    function start() {
        console.log("[auto-hide] waiting for elements...");

        function waitForElements() {
            const TOP_BAR = document.getElementById("top-bar");
            const SETTINGS = document.getElementById("top-settings-holder");

            if (!TOP_BAR || !SETTINGS) {
                requestAnimationFrame(waitForElements);
                return;
            }

            console.log("[auto-hide] elements found");

            init(TOP_BAR, SETTINGS);
        }

        waitForElements();
    }

    function init(TOP_BAR, SETTINGS) {
        const TRIGGER_HEIGHT = 12;

        let visible = false;
        let hideTimeout = null;

        const height = Math.max(
            TOP_BAR.offsetHeight,
            SETTINGS.offsetHeight
        );

        const HIDE_OFFSET = -height;

        console.log("[auto-hide] height:", height);

        // create trigger
        const trigger = document.createElement("div");
        Object.assign(trigger.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: TRIGGER_HEIGHT + "px",
            zIndex: "999999",
            background: "transparent"
        });

        document.body.appendChild(trigger);

        // apply styles
        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.setProperty("transition", "transform 0.25s ease", "important");
            el.style.setProperty("will-change", "transform", "important");
        });

        function show() {
            clearTimeout(hideTimeout);
            if (visible) return;
            visible = true;

            TOP_BAR.style.setProperty("transform", "translateY(0)", "important");
            SETTINGS.style.setProperty("transform", "translateY(0)", "important");
        }

        function hide() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                visible = false;

                const val = `translateY(${HIDE_OFFSET}px)`;
                TOP_BAR.style.setProperty("transform", val, "important");
                SETTINGS.style.setProperty("transform", val, "important");
            }, 80);
        }

        trigger.addEventListener("pointerenter", show);
        trigger.addEventListener("pointerleave", hide);

        TOP_BAR.addEventListener("pointerenter", show);
        TOP_BAR.addEventListener("pointerleave", hide);

        SETTINGS.addEventListener("pointerenter", show);
        SETTINGS.addEventListener("pointerleave", hide);

        hide();

        console.log("[auto-hide] initialized");
    }

    // ensure execution after full load
    if (document.readyState === "complete") {
        start();
    } else {
        window.addEventListener("load", start);
    }
})();
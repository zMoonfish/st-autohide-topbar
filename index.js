// SillyTavern extension entry point
export async function init() {
    console.log("[auto-hide] init called");

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

        function show() {
            clearTimeout(timeout);
            if (visible) return;
            visible = true;

            TOP_BAR.style.transform = "translateY(0)";
            SETTINGS.style.transform = "translateY(0)";
        }

        function hide() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                visible = false;
                const val = `translateY(${HIDE_OFFSET}px)`;
                TOP_BAR.style.transform = val;
                SETTINGS.style.transform = val;
            }, 80);
        }

        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.transition = "transform 0.25s ease";
        });

        trigger.addEventListener("pointerenter", show);
        trigger.addEventListener("pointerleave", hide);
        TOP_BAR.addEventListener("pointerenter", show);
        TOP_BAR.addEventListener("pointerleave", hide);
        SETTINGS.addEventListener("pointerenter", show);
        SETTINGS.addEventListener("pointerleave", hide);

        hide();
    }

    waitForElements();
}
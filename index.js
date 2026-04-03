(function () {
    const TOP_BAR = document.getElementById("top-bar");
    const SETTINGS = document.getElementById("top-settings-holder");

    if (!TOP_BAR || !SETTINGS) return;

    const HIDE_OFFSET = -60; // adjust if your bar height differs
    const TRIGGER_HEIGHT = 12;

    let visible = false;
    let hideTimeout = null;

    // Create invisible trigger zone
    const trigger = document.createElement("div");
    trigger.style.position = "fixed";
    trigger.style.top = "0";
    trigger.style.left = "0";
    trigger.style.width = "100%";
    trigger.style.height = TRIGGER_HEIGHT + "px";
    trigger.style.zIndex = "9999";
    trigger.style.pointerEvents = "auto";
    trigger.style.background = "transparent";

    document.body.appendChild(trigger);

    function applyStyles() {
        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.transition = "transform 0.25s ease";
            el.style.willChange = "transform";
        });
    }

    function show() {
        clearTimeout(hideTimeout);
        if (visible) return;
        visible = true;
        TOP_BAR.style.transform = "translateY(0)";
        SETTINGS.style.transform = "translateY(0)";
    }

    function hide() {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            visible = false;
            TOP_BAR.style.transform = `translateY(${HIDE_OFFSET}px)`;
            SETTINGS.style.transform = `translateY(${HIDE_OFFSET}px)`;
        }, 80);
    }

    function init() {
        applyStyles();
        hide();

        trigger.addEventListener("pointerenter", show);
        trigger.addEventListener("pointerleave", hide);

        TOP_BAR.addEventListener("pointerenter", show);
        TOP_BAR.addEventListener("pointerleave", hide);

        SETTINGS.addEventListener("pointerenter", show);
        SETTINGS.addEventListener("pointerleave", hide);
    }

    // Wait for DOM just in case
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
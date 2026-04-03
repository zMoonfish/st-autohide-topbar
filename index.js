function waitForElements() {
    const TOP_BAR = document.getElementById("top-bar");
    const SETTINGS = document.getElementById("top-settings-holder");

    if (!TOP_BAR || !SETTINGS) {
        requestAnimationFrame(waitForElements);
        return;
    }

    init(TOP_BAR, SETTINGS);
}

function init(TOP_BAR, SETTINGS) {
    const HIDE_OFFSET = -60;
    const TRIGGER_HEIGHT = 12;

    let visible = false;
    let hideTimeout = null;

    const trigger = document.createElement("div");
    Object.assign(trigger.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: TRIGGER_HEIGHT + "px",
        zIndex: "9999",
        background: "transparent"
    });

    document.body.appendChild(trigger);

    [TOP_BAR, SETTINGS].forEach(el => {
        el.style.transition = "transform 0.25s ease";
        el.style.willChange = "transform";
    });

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

    trigger.addEventListener("pointerenter", show);
    trigger.addEventListener("pointerleave", hide);
    TOP_BAR.addEventListener("pointerenter", show);
    TOP_BAR.addEventListener("pointerleave", hide);
    SETTINGS.addEventListener("pointerenter", show);
    SETTINGS.addEventListener("pointerleave", hide);

    hide();
}

waitForElements();
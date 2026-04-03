(function () {
    console.log("[auto-hide] running (final sane version)");

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
            }, 150);
        }

        [TOP_BAR, SETTINGS].forEach(el => {
            el.style.setProperty("transition", "transform 0.25s ease", "important");
            el.style.setProperty("will-change", "transform", "important");
        });

        // 👇 hover detection via mouse position (no overlay blocking clicks)
        document.addEventListener("mousemove", (e) => {
            const triggerHeight = Math.max(20, window.innerHeight * 0.02);

            if (e.clientY <= triggerHeight) {
                show();
            } else {
                hide();
            }
        });

        hide();

        console.log("[auto-hide] initialized");
    }

    waitForElements();
})();
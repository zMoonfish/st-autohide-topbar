(function () {
    console.log("[auto-hide] final + book wrapper");

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

        function wrapBook() {
            const book = getBook();
            if (!book || book.parentElement.classList.contains("autohide-book-wrapper")) return;

            const wrapper = document.createElement("div");
            wrapper.className = "autohide-book-wrapper";

            book.parentNode.insertBefore(wrapper, book);
            wrapper.appendChild(book);
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

        // inject styles once
        const style = document.createElement("style");
        style.textContent = `
        .autohide-book-wrapper {
            position: fixed;
            bottom: 0;
            right: 0;
            width: 60px;
            height: 60px;
            z-index: 9999;
        }

        .stwii--trigger.fa-book-atlas {
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .autohide-book-wrapper:hover .stwii--trigger.fa-book-atlas {
            opacity: 1;
        }
        `;
        document.head.appendChild(style);

        // keep trying to wrap (in case it's injected later)
        setInterval(wrapBook, 1000);

        // stabilize layout
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

        // resize / fullscreen fix
        window.addEventListener("resize", () => {
            setTimeout(recalc, 50);
        });

        recalc();

        console.log("[auto-hide] initialized");
    }

    waitForElements();
})();
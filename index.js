id="st-autohide-topbar"
(function () {
    function init() {
        const bar = document.querySelector('#top-bar');
        const settings = document.querySelector('#top-settings-holder');

        if (!bar || !settings) {
            setTimeout(init, 500);
            return;
        }

        // create trigger zone
        const trigger = document.createElement('div');
        trigger.style.position = 'fixed';
        trigger.style.top = '0';
        trigger.style.left = '0';
        trigger.style.width = '100%';
        trigger.style.height = '12px';
        trigger.style.zIndex = '10001';
        document.body.appendChild(trigger);

        // base styles
        [bar, settings].forEach(el => {
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.width = '100%';
            el.style.transform = 'translateY(-100%)';
            el.style.transition = 'transform 0.2s ease';
            el.style.zIndex = '9999';
        });

        settings.style.zIndex = '10000';

        function show() {
            bar.style.transform = 'translateY(0)';
            settings.style.transform = 'translateY(0)';
        }

        function hide() {
            bar.style.transform = 'translateY(-100%)';
            settings.style.transform = 'translateY(-100%)';
        }

        trigger.addEventListener('mouseenter', show);
        bar.addEventListener('mouseenter', show);
        settings.addEventListener('mouseenter', show);

        bar.addEventListener('mouseleave', hide);
        settings.addEventListener('mouseleave', hide);
    }

    init();
})();
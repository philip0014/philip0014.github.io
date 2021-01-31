import anime from './anime.es.js';

$(document).ready(_ => {
    function init() {
        initAnimations();
        initActionEvents();
    }

    function initAnimations() {
        anime({
            targets: document.getElementsByClassName('animate-intro'),
            translateX: [-50, 0],
            opacity: 1,
            easing: 'linear',
            duration: 500,
            delay: anime.stagger(300, {start: 200})
        });

        anime({
            targets: document.getElementsByClassName('arrow-intro'),
            keyframes: [
                {translateY: 12},
                {translateY: 0},
            ],
            loop: true,
            easing: 'linear',
            duration: 1000
        });
    }

    function initActionEvents() {
        // TODO add on scroll event to show and hide #scroll-arrow

        $('#scroll-arrow').click(_ => {
            // TODO scroll down
        });
    }

    init();
});

import anime from './anime.es.js';
import constants from './constants.js';

$(document).ready(_ => {
    let containerShown = {};
    let containerClass = {};
    containerClass[constants.ABOUT_CONTAINER] = constants.ANIMATE_ABOUT;
    containerClass[constants.EXPERIENCE_CONTAINER] = constants.ANIMATE_EXPERIENCE;

    function init() {
        initAnimations();
        initActionItems();
    }

    function initAnimations() {
        anime({
            targets: document.getElementsByClassName(constants.ANIMATE_INTRO),
            translateY: [25, 0],
            opacity: 1,
            easing: 'linear',
            duration: 500,
            delay: anime.stagger(300, {start: 200})
        });

        let observer = new IntersectionObserver(function (entries, _) {
            entries.forEach(entry => {
                if (!containerShown[entry.target.id] && entry.isIntersecting) {
                    console.log(entry.target.id);
                    anime({
                        targets: document.getElementsByClassName(containerClass[entry.target.id]),
                        opacity: 1,
                        easing: 'linear',
                        duration: 500,
                        delay: anime.stagger(300, {start: 200})
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });

        observer.observe(document.getElementById(constants.ABOUT_CONTAINER));
        // observer.observe(document.getElementById(constants.EXPERIENCE_CONTAINER));
    }

    function initActionItems() {
        let experienceBlibli = $('#experience-blibli');
        let experienceBinus = $('#experience-binus');

        let blibliStory = $('#blibli-story');
        let binusStory = $('#binus-story');

        experienceBlibli.click(() => {
            experienceBinus.removeClass(constants.SELECTED_STORY);
            experienceBlibli.addClass(constants.SELECTED_STORY);

            binusStory.removeClass(constants.ACTIVE_STORY);
            blibliStory.addClass(constants.ACTIVE_STORY);
        });

        experienceBinus.click(() => {
            experienceBlibli.removeClass(constants.SELECTED_STORY);
            experienceBinus.addClass(constants.SELECTED_STORY);

            blibliStory.removeClass(constants.ACTIVE_STORY);
            binusStory.addClass(constants.ACTIVE_STORY);
        });
    }

    init();
});

let animationId = null;
let subscribers = [];

function notifyAll() {
    subscribers.forEach(subscriber => {
        subscriber();
    });
}

const animate = function () {
    animationId = window.requestAnimationFrame(animate);
    notifyAll();
};

export default {
    subscribe: function (subscriber) {
        subscribers.push(subscriber);
    },
    startAnimation: function () {
        if (animationId !== null) {
            window.cancelAnimationFrame(animationId);
        }
        animationId = window.requestAnimationFrame(animate);
    }
}

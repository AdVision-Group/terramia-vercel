window.onscroll = () => {
    animate();
}

window.onload = () => {
    animate();
}

function animate() {
    var height = window.innerHeight;

    var fadeIn = document.getElementsByClassName("fade-in");

    [].forEach.call(fadeIn, function(element) {
        if (element.getBoundingClientRect().top <= height) {
            element.classList.add("animate__animated");
            element.classList.add("animate__fadeIn");
        } else {
            element.classList.remove("animate__animated");
            element.classList.remove("animate__fadeIn");
        }
    });

    var fadeInUp = document.getElementsByClassName("fade-in-up");

    [].forEach.call(fadeInUp, function(element) {
        if (element.getBoundingClientRect().top <= height) {
            element.classList.add("animate__animated");
            element.classList.add("animate__fadeInUp");
        } else {
            element.classList.remove("animate__animated");
            element.classList.remove("animate__fadeInUp");
        }
    });

    var fadeInLeft = document.getElementsByClassName("fade-in-left");

    [].forEach.call(fadeInLeft, function(element) {
        if (element.getBoundingClientRect().top <= height) {
            element.classList.add("animate__animated");
            element.classList.add("animate__fadeInLeft");
        } else {
            element.classList.remove("animate__animated");
            element.classList.remove("animate__fadeInLeft");
        }
    });

    var fadeInRight = document.getElementsByClassName("fade-in-right");

    [].forEach.call(fadeInRight, function(element) {
        if (element.getBoundingClientRect().top <= height) {
            element.classList.add("animate__animated");
            element.classList.add("animate__fadeInRight");
        } else {
            element.classList.remove("animate__animated");
            element.classList.remove("animate__fadeInRight");
        }
    });
}
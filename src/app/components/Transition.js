import React from "react";

import "../styles/transition.css";

import Loading from "./Loading";

export default function Transition() {
    return(
        <div id="transition">
            <Loading />
        </div>
    )
}

export const showTransition = () => {
    var transition = document.getElementById("transition");

    if (transition) {
        transition.style.transition = "none";
        transition.style.display = "flex";
        transition.style.opacity = "1";
    }
}

export const hideTransition = () => {
    var transition = document.getElementById("transition");

    if (transition) {
        transition.style.transition = "all 500ms";
        setTimeout(() => {
            transition.style.opacity = "0";
            setTimeout(() => {
                transition.style.display = "none";
            }, 510);
        }, 510);
    }
}
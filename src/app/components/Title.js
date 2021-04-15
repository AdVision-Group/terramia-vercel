import React from "react";

import "../styles/title.css";

export default function Title(props) {
    const image = props.image;
    const title = props.title;

    return(
        <div className="title-panel" style={props.style}>
            <img className="image" src={require("../assets/" + image)} loading="lazy" />

            <div className="title">{title}</div>
        </div>
    )
}
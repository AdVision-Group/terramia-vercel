import React from "react";
import { Link } from "react-router-dom";

import "../styles/dropdown.css";

export default function Dropdown(props) {
    if (props.active) {
        if (props.type === "e-shop") {
            return(
                <div id="dropdown" style={{ top: props.offset }} onMouseEnter={() => props.setActive(true)}  onMouseLeave={() => props.setActive(false)}>
                    <div className="title">Esenciálne oleje</div>
                    <Link className="link">Single Oils</Link>
                    <Link className="link">Proprietary Blends</Link>
                    <Link className="link">Roll-on Essentials</Link>
                </div>
            )
        }
    }

    return null
}
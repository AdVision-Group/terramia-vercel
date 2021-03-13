import React from "react";
import { Link } from "react-router-dom";

import "../styles/404.css";

export default class NotFound extends React.Component {
    render() {
        return(
            <div className="screen" id="not-found">
                <div className="image-panel">
                    <img className="image" src={require("../assets/family-business-1.png")} />
                </div>

                <div className="text-panel">
                    <div className="heading">404</div>
                    <div className="title">Stránka neexistuje</div>
                    <div className="text">
                        Stránka na zadanom URL neexistuje. Skontrolujte, či je zadané URL správne alebo sa vráťte na domovskú stránku.
                    </div>
                    <Link className="button-filled" to="/">Domosvká stránka</Link>
                </div>
            </div>
        )
    }
}
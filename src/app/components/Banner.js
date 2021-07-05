import React from "react";
import { Link } from "react-router-dom";

import "../styles/banner.css";

export default function Banner(props) {
    const width = window.innerWidth

    return(
        <div id="banner" className={width > 900 ? "animate__animated animate__bounceInRight" : "animate__animated animate__slideInUp"}>
            <div className="body">
                <div className="info-panel">
                    <div className="title">{props.title}</div>
                    <p className="text">{props.text}</p>

                    <div style={{ flex: 1 }}></div>

                    {props.business ? <Link className="button-filled" to="/prihlasenie">Prihlásiť sa</Link> : null}
                    {props.url ? <a href={props.url} className="button-filled">{props.button}</a> : <Link className="button-filled" to={props.location ? props.location : "/stan-sa-clenom"} style={{ marginTop: 10 }}>{props.button}</Link>}
                </div>

                <div className="image-panel">
                    <img className="image" src={props.image ? props.image : require("../assets/family-business-1.png")} loading="lazy" />
                </div>

                <img className="cancel" src={require("../assets/cancel.png")} onClick={() => props.closeBanner()} loading="lazy" />
            </div>
        </div>
    )
}
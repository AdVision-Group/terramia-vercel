import React from "react";
import { Link } from "react-router-dom";

import "../styles/banner.css";

export default function Banner(props) {
    const width = window.innerWidth

    return(
        <div id="banner" className={width > 900 ? "animate__animated animate__bounceInRight" : "animate__animated animate__slideInUp"}>
            <div className="content">
                <div className="info-panel">
                    <div className="title">Získaj vzorku zadarmo</div>
                    <p className="text">
                        Zaregistruj sa na našej webstránke a získaj zľavy pri nakupovaní, ako aj skúšobnú vzorku úplne zadarmo!
                    </p>

                    <div style={{ flex: 1 }}></div>

                    <Link className="button-filled" to="/registracia">Staň sa členom</Link>
                </div>

                <div className="image-panel">
                    <img className="image" src={require("../assets/family.png")} />
                </div>

                <img className="cancel" src={require("../assets/cancel.png")} onClick={() => props.closeBanner()} />
            </div>
        </div>
    )
}
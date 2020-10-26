import React from "react";

import "../styles/banner.css";

export default function Banner(props) {
    return(
        <div id="banner" className="animate__animated animate__bounceInRight">
            <div className="content">
                <div className="info-panel">
                    <div className="title">Staň sa členom</div>
                    <p className="text">
                        Zaregistruj sa na našej webstránke a získaj zľavy pri nakupovaní, ako aj skúšobnú vzorku úplne zadarmo!
                    </p>

                    <div style={{ flex: 1 }}></div>

                    <div className="button-filled">Staň sa členom</div>
                </div>

                <div className="image-panel">
                    <img className="image" src={require("../assets/family.png")} />
                </div>

                <img className="cancel" src={require("../assets/cancel.png")} onClick={() => props.closeBanner()} />
            </div>
        </div>
    )
}
import React from "react";
import { Link } from "react-router-dom";

import "../styles/header.css";

export default function Header() {
    return(
        <div id="header">
            <div className="left-panel">
                <Link to="/"><img id="logo-header-large" className="logo" src={require("../assets/logo.png")} /></Link>
            </div>

            <div className="middle-panel">
                <div className="contact-panel">
                    <Link to="/"><img id="logo-header-medium" className="logo" src={require("../assets/logo.png")} /></Link>
                    <div id="contact-header-1" className="item">Email:<span style={{ color: "#A161B3", marginLeft: 8 }}>info@terramia.sk</span></div>
                    <div id="contact-header-2" className="item">Telefón:<span style={{ color: "#A161B3", marginLeft: 8 }}>+421 902 626 353</span></div>
                    <div id="button-header-medium" className="button-filled">Staň sa členom</div>
                </div>

                <div className="menu-panel" id="menu-header">
                    <Link className="item" to="/e-shop">E-shop</Link>
                    <span className="divider"></span>
                    <Link className="item" to="/aromaterapia">Aromaterapia</Link>
                    <span className="divider"></span>
                    <Link className="item" to="/podnikanie">Podnikanie</Link>
                    <span className="divider"></span>
                    <Link className="item" to="/novinky">Novinky</Link>
                    <span className="divider"></span>
                    <Link className="item" to="/blog">Blog</Link>
                    <span className="divider"></span>
                    <Link className="item" to="/o-nas">O nás</Link>
                    <span className="divider"></span>
                    <Link className="item" to="/kontakt">Kontakt</Link>
                    <span className="divider"></span>
                    <ion-icon name="cart"></ion-icon>
                    <span className="divider"></span>
                    <ion-icon name="person"></ion-icon>
                </div>
            </div>

            <div className="right-panel">
                <div id="button-header-large" className="button-filled">Staň sa členom</div>
            </div>
        </div>
    )
}
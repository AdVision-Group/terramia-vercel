import React from "react";
import { Link } from "react-router-dom";

import "../styles/footer.css";

export default function Footer() {
    return(
        <div id="footer">
            {/*
            <div className="button-panel">
                <div className="button-filled">Kontaktuje nás</div>
                <div className="button-outline">Ponuka olejov</div>
            </div>
            */}

            <div className="wrapper">
                <div className="logo-panel">
                    <Link to="/"><img className="logo" src={require("../assets/logo.png")} /></Link>
                </div>

                <div className="top-panel">
                    <div className="column">
                        <div className="title">Navigácia</div>
                        <Link className="info" to="/e-shop">E-shop</Link>
                        <Link className="info" to="/aromaterapia">Aromaterapia</Link>
                        <Link className="info" to="/podnikanie">Podnikanie</Link>
                        <Link className="info" to="/novinky">Novinky</Link>
                        <Link className="info" to="/blog">Blog</Link>
                        <Link className="info" to="/o-nas">O nás</Link>
                        <Link className="info" to="/kontakt">Kontakt</Link>
                    </div>

                    <div className="column">
                        <div className="title">Esenciálne oleje</div>
                        <div className="info">Aromatické oleje</div>
                        <div className="info">Ovocné oleje</div>
                        <div className="info">Bylinkové oleje</div>
                        <div className="info">Zdravotné oleje</div>
                        <div className="info">Rekreačné oleje</div>
                    </div>

                    <div className="column">
                        <div className="title">Kontakt</div>
                        <div className="info">Bratislavská 18</div>
                        <div className="info">842 50 Bratislava</div>
                        <div className="info">Slovenská republika</div>
                        <br />
                        <div className="info">info@terramia.sk</div>
                        <div className="info">+421 902 626 353</div>
                    </div>

                    <div className="column">
                        <div className="title">Súkromie</div>
                        <div className="info">Cookies</div>
                        <div className="info">Ochrana osobných údajov</div>
                        <div className="info">Podnikanie</div>
                    </div>

                    <div className="column">
                        <div className="title">Pomoc</div>
                        <div className="info">Kontakt</div>
                        <div className="info">Technická podpora</div>
                        <div className="info">Zákaznícka podpora</div>
                        <br />
                        <br />
                        <div className="button-filled">Napíšte nám</div>
                    </div>
                </div>

                <div className="bottom-panel">
                    <div className="text">© 2020 terramia.sk | Web created by <a href="https://advision.sk" style={{ color: "#A161B3", fontWeight: "bold", textDecoration: "none" }}>AdVision Digital Marketing</a></div>
                </div>
            </div>
        </div>
    )
}
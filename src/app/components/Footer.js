import React from "react";

import "../styles/footer.css";

export default function Footer() {
    return(
        <div id="footer">
            <div className="button-panel">
                <div className="button-filled">Kontaktuje nás</div>
                <div className="button-outline">Ponuka olejov</div>
            </div>

            <div className="top-panel">
                <div className="column">
                    <div className="title">Navigácia</div>
                    <div className="info">E-shop</div>
                    <div className="info">Aromaterapia</div>
                    <div className="info">Podnikanie</div>
                    <div className="info">Novinky</div>
                    <div className="info">Blog</div>
                    <div className="info">O nás</div>
                    <div className="info">Kontakt</div>
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
                <div class="space">
                    <img className="logo" src={require("../assets/logo.png")} />
                </div>

                <div class="middle">
                    <div className="top">
                        <div className="item">Cookies</div>
                        <span className="divider"></span>
                        <div className="item">Ochrana osobných údajov</div>
                        <span className="divider"></span>
                        <div className="item">Podnikanie</div>
                    </div>

                    <div className="bottom">
                        <ion-icon name="logo-facebook"></ion-icon>
                        <ion-icon name="logo-instagram"></ion-icon>
                        <ion-icon name="logo-twitter"></ion-icon>
                    </div>
                </div>

                <div className="space"></div>
            </div>
        </div>
    )
}
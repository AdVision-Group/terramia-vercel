import React from "react";
import { Link, withRouter } from "react-router-dom";

import { showCookies } from "./Cookies";
import { setStorageItem, shop } from "../config/config";

import doc1 from "../documents/gdpr.pdf";
import doc2 from "../documents/obchodne-podmienky.pdf";

import "../styles/footer.css";

function Footer(props) {
    return(
        <div id="footer">
            <div className="wrapper">
                <div className="logo-panel">
                    <Link to="/"><img className="logo" src={require("../assets/logo.png")} loading="lazy" alt="Footer" /></Link>
                </div>

                <div className="top-panel">
                    <div className="column">
                        <div className="title">Navigácia</div>
                        <Link className="info" to="/e-shop">E-shop</Link>
                        <Link className="info" to="/aromavzdelavanie">Aromavzdelávanie</Link>
                        <Link className="info" to="/podnikanie">Podnikanie</Link>
                        <Link className="info" to="/novinky">Novinky</Link>
                        <Link className="info" to="/blog">Blog</Link>
                        <Link className="info" to="/o-nas">O nás</Link>
                        <Link className="info" to="/kontakt">Kontakt</Link>
                    </div>

                    <div className="column">
                        <div className="title">Produkty</div>
                        {shop.map((item, index) => <Link className="info" to={"/e-shop?typ=" + index + "&kategoria=0&zoradenie=az"} key={index}>{item.type}</Link>)}
                    </div>

                    <div className="column">
                        <div className="title">Kontakt</div>
                        <div className="info">Mierová 83</div>
                        <div className="info">821 05 Bratislava</div>
                        <div className="info">Slovenská republika</div>
                        <div className="info">info@terramia.sk</div>
                        <div className="info">+421 903 856 851</div>
                    </div>

                    <div className="column">
                        <div className="title">Súkromie</div>
                        <a className="info" href={doc1} target="_blank">Ochrana osobných údajov</a>
                        <a className="info" href={doc2} target="_blank">Obchodné podmienky</a>
                        <div className="info" style={{ cursor: "pointer" }} onClick={() => {
                            setStorageItem("cookies", "disabled");
                            showCookies();
                        }}>Cookies</div>

                        <br />

                        <Link className="button-filled" to="/kontakt">Napíšte nám</Link>
                    </div>
                </div>

                <div className="bottom-panel">
                    <div className="text">© 2020 terramia.sk | Designed and created by <a href="https://advision.sk" style={{ color: "#A161B3", fontWeight: "bold", textDecoration: "none" }}>AdVision Digital Marketing</a></div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Footer);
import React from "react";
import { Link, withRouter } from "react-router-dom";

import { getStorageItem, removeStorageItem } from "../config/config";
import { showCookies } from "../components/Cookies";

import MenuButton from "./MenuButton";

import "../styles/header.css";

class Header extends React.Component {

    state = {
        active: false,
        type: "",
        offset: 0,
    }

    constructor() {
        super();

        this.setActive = this.setActive.bind(this);
    }

    setActive(active) {
        this.setState({ active: active });
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });

        showCookies();
    }

    render() {
        return(
            <div id="header">
                <div className="top-panel">
                    <p className="text">
                        Chcete nakúpiť, čo najvýhodnejšie a získať hodnotné darčeky od nás? Neviete ako na to? <Link to="/kontakt" style={{ color: "white" }}>Kontaktujte nás, radi Vám pomôžeme.</Link>
                    </p>
                </div>

                <div className="border-panel">
                    <div className="border" />

                    <div className="wrapper">
                        <div className="logo-panel">
                            <Link to="/"><img className="logo" src={require("../assets/logo.png")} loading="lazy" /></Link>
                        </div>

                        <div style={{ flex: 1 }} />

                        <div className="info-panel">
                            <div className="contact-panel">
                                <div className="item">Email:<a href="mailto: info@terramia.sk" style={{ color: "#A161B3", textDecoration: "none", marginLeft: 8 }}>info@terramia.sk</a></div>
                                <div className="break"></div>
                                <div className="item">Telefón:<a href="tel: +421-903-856-851" style={{ color: "#A161B3", textDecoration: "none", marginLeft: 8 }}>+421 903 856 851</a></div>
                                
                                <div style={{ flex: 1 }} />

                                <div className="button-filled" onClick={getStorageItem("token") ? () => {
                                    removeStorageItem("token");
                                    window.location.reload();
                                } : () => this.props.history.push("/stan-sa-clenom")}>{getStorageItem("token") ? "Odhlásiť sa" : "Staň sa členom klubu"}</div>
                            </div>

                            <div className="menu-panel">
                                <Link to="/e-shop" className="item" to="/e-shop">E-shop</Link>
                                <div className="divider" />
                                <Link to="/aromavzdelavanie" className="item">Aromavzdelávanie</Link>
                                <div className="divider" />
                                <Link to="/podnikanie" className="item">Podnikanie</Link>
                                <div className="divider" />
                                
                                <Link to="/webinare" className="item">Webináre</Link>
                                <div className="divider" />
                            
                                <Link className="item" to="/novinky">Novinky</Link>
                                <div className="divider" />
                                <Link to="/blog" className="item">Blog</Link>
                                <div className="divider" />
                                <Link to="/o-nas" className="item">O nás</Link>
                                <div className="divider" />
                                <Link to="/kontakt" className="item">Kontakt</Link>
                                <div className="divider" />
                                <Link to="/kosik" className="item"><ion-icon name="cart"></ion-icon>{/*Košík*/}{getStorageItem("cart") && getStorageItem("cart").length > 0 && <div className="count">{getStorageItem("cart").length}</div>}</Link>
                                <div className="divider" />
                                <Link to={getStorageItem("token") ? "/profil" : "/prihlasenie"} className="item"><ion-icon name="person"></ion-icon>{/*getStorageItem("token") ? getStorageItem("username") : "Prihlásenie"*/}</Link>
                            </div>
                        </div>

                        <MenuButton />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);
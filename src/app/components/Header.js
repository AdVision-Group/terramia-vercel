import React from "react";
import { Link } from "react-router-dom";

import MenuButton from "./MenuButton";
import Dropdown from "./Dropdown";

import "../styles/header.css";

export default class Header extends React.Component {

    state = {
        active: false,
        type: "",
        offset: 0
    }

    constructor() {
        super();

        this.setActive = this.setActive.bind(this);
    }

    setActive(active) {
        this.setState({ active: active })
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight })
    }

    render() {
        return(
            <div id="header">
                <div className="border-panel">
                    <div className="border"></div>

                    <div className="wrapper">
                        <div className="left-panel">
                            <Link to="/"><img className="logo" src={require("../assets/logo.png")} /></Link>
                        </div>

                        <div className="middle-panel">
                            <div className="contact-panel">
                                <div className="left-panel">
                                    <Link to="/"><img className="logo" src={require("../assets/logo.png")} /></Link>
                                </div>

                                <div className="middle-panel">
                                    <div className="item">Email:<span style={{ color: "#A161B3", marginLeft: 8 }}>info@terramia.sk</span></div>
                                    <div className="break"></div>
                                    <div className="item">Telefón:<span style={{ color: "#A161B3", marginLeft: 8 }}>+421 902 626 353</span></div>
                                    <div className="break"></div>
                                    <ion-icon name="logo-facebook"></ion-icon>
                                    <div className="break" style={{ width: 10 }}></div>
                                    <ion-icon name="logo-instagram"></ion-icon>
                                </div>

                                <div className="right-panel">
                                    <Link className="button-filled" to="/registracia-vzorky-zadarmo">Staň sa členom</Link>
                                </div>
                            </div>

                            <div className="menu-panel">
                                <Link
                                    onMouseEnter={() => this.setState({ active: true, type: "e-shop" })}
                                    onMouseLeave={() => this.setState({ active: false })}
                                    className="item"
                                    to="/e-shop">
                                        E-shop
                                </Link>
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
                                <Link to="/kosik"><ion-icon name="cart"></ion-icon></Link>
                                <span className="divider"></span>
                                <Link to="/prihlasenie"><ion-icon name="person"></ion-icon></Link>
                            </div>
                        </div>

                        <div className="right-panel">
                            <Link className="button-filled" to="/registracia-vzorky-zadarmo">Staň sa členom</Link>
                        </div>

                        <MenuButton />
                    </div>
                </div>

                {/*<Dropdown setActive={this.setActive} active={this.state.active} type={this.state.type} offset={this.state.offset} />*/}
            </div>
        )
    }
}
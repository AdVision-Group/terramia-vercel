import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { setStorageItem, removeStorageItem, getStorageItem } from "../config/config";

import "../styles/success.css";
import { hideTransition, showTransition } from "../components/Transition";

class Success extends React.Component {

    state = {
        user: null,
        offset: 0,
    }

    constructor() {
        super();
    }

    componentDidMount() {
        showTransition();

        setStorageItem("cart", []);
        removeStorageItem("doterra");
        removeStorageItem("temp");

        const user = getStorageItem("order-user-data") ? JSON.parse(getStorageItem("order-user-data")) : null;

        if (user) {
            this.setState({ user: user });
        }

        hideTransition();
    }

    render() {
        if (this.props.type == null) {
            return(
                <div className="screen" id="success">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Ďakujeme za nákup | TerraMia</title>
                        <meta name="robots" content="noindex, nofollow"></meta>
                    </Helmet>

                    <div className="content">
                        <div className="title">Ďakujeme Vám za Váš nákup!</div>
                        <p className="description">
                            Platba prebehla úspešne, o Vašej objednávke Vás budeme ďalej informovať e-mailom. Ďakujeme Vám za Váš nákup!
                        </p>

                        {this.state.user && this.state.user.email && this.state.user.phone &&
                            <p>
                                <b>E-mail: </b>{this.state.user.email}
                                <br />
                                <b>Telefónne číslo: </b>{this.state.user.phone}
                                <br />
                                <b>Adresa: </b>{this.state.user.address}, {this.state.user.psc} {this.state.user.city}, {this.state.user.country}
                            </p>
                        }

                        <Link className="button-filled" to="/">Domovská stránka</Link>
                    </div>
                </div>
            )
        } else if (this.props.type === "contest") {
            return(
                <div className="screen" id="success">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Ďakujeme za registráciu do súťaže | TerraMia</title>
                        <meta name="robots" content="noindex, nofollow"></meta>
                    </Helmet>

                    <div className="content">
                        <div className="title">Ďakujeme Vám za zapojenie sa do súťaže</div>
                        <p className="description">
                            Ďakujeme za zapojenie do súťaže, čoskoro Vám príde potvrdzovací mail. Sledujte prosím svoju mailovú schránku, aby Vám neunikla prípadná výhra.
                        </p>

                        {this.state.user && this.state.user.email &&
                            <p>
                                <b>E-mail: </b>{this.state.user.email}
                            </p>
                        }

                        <Link className="button-filled" to="/">Domovská stránka</Link>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(Success);
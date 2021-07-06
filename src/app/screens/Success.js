import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { setStorageItem, removeStorageItem } from "../config/config";

import "../styles/success.css";
import { hideTransition, showTransition } from "../components/Transition";

class Success extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        showTransition();

        setStorageItem("cart", []);
        removeStorageItem("doterra");
        removeStorageItem("temp");

        hideTransition();
    }

    render() {
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
                    <Link className="button-filled" to="/">Domovská stránka</Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Success);
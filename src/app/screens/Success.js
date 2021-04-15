import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, getStorageItem, removeStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/success.css";

class Success extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        setStorageItem("cart", []);
        removeStorageItem("doterra");
        removeStorageItem("temp");
    }

    render() {
        return(
            <div className="screen" id="success">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Ďakujeme za nákup </title>
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
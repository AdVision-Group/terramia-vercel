import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { setStorageItem, getStorageItem, removeStorageItem } from "../config/config";
import Api from "../config/Api";

import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/register1.css";

class RegisterSuccess extends React.Component {

    state = {
        email: "",

        passwordCode: "",
        password: "",
        repeatPassword: "",

        popup: false,
        type: "info",
        message: "",
        loading: false,
    }

    constructor() {
        super();
    }

    async componentDidMount() {
        showTransition();

        removeStorageItem("register");

        hideTransition();
    }

    render() {
        return(
            <div className="screen register" id="register-3">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Vytajte v klube TerraMia | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                <div className="content">
                    <div className="left-panel">
                        <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                    </div>

                    <div className="right-panel">
                        <div className="title">
                            Vitajte v klube TerraMia
                        </div>
                        <p className="text">
                            Vitajte v klube TerraMia! Vaša vzorka Vám bude zaslaná na zadanú adresu v priebehu niekoľkých dní.
                        </p>

                        <div className="button-filled" onClick={() => this.props.history.push("/")}>Domov</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterSuccess);
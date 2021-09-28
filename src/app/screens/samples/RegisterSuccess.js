import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { removeStorageItem } from "../../config/config";
import Api from "../../config/Api";

import { showTransition, hideTransition } from "../../components/Transition";

import "../../styles/register1.css";

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

        troubleshooting: false
    }

    constructor() {
        super();

        this.sendHelp = this.sendHelp.bind(this);
    }

    async sendHelp(email, message, error, browser) {
        this.setState({
            troubleshooting: false,
            popup: true,
            loading: true
        });

        const call = await Api.help({
            email: email.trim(),
            message: "Chyba: " + error + ", prehliadač: " + browser + ", správa: " + message,

            name: "Nezadané",
            phone: "0000000000"
        });

        if (call.error) {
            this.setState({
                loading: false,
                message: "Zadaný e-mail je nesprávny"
            });
        } else {
            this.setState({
                loading: false,
                message: "Správa úspešne odoslaná, čoskoro Vás budeme kontaktovať"
            });
        }
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
                        <img className="icon" src={require("../../assets/family-business-1.png")} loading="lazy" alt="Register" />
                    </div>

                    <div className="right-panel">
                        <div className="title">
                            Vzorka úspešne objednaná
                        </div>

                        <div style={{ height: 30 }} />

                        <p className="text">
                            Ďakujeme Vám za objednanie si vzorky esenciálnych olejov. Dúfame, že Vám bude vyhovovať!
                        </p>

                        <div style={{ height: 20 }} />

                        <div className="button-filled" onClick={() => this.props.history.push("/")}>Domov</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterSuccess);
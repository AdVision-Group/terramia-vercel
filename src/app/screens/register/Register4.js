import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";

import Popup from "../../components/Popup";
import { hideTransition, showTransition } from "../../components/Transition";
import { API_URL, getStorageItem, removeStorageItem, setStorageItem } from "../../config/config";
import Api from "../../config/Api";

import "../../styles/register-new.css";

class Register4 extends React.Component {

    state = {
        
    }

    constructor() {
        super();

        this.login = this.login.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
    }

    async componentDidMount() {
        showTransition();

        await this.login();

        hideTransition();
    }

    async login() {
        const regUser = getStorageItem("regUser");

        if (!regUser || !regUser.email || !regUser.password) this.props.history.push("/stranka-sa-nenasla");

        const call = await Api.login({
            email: regUser.email.trim(),
            password: regUser.password.trim()
        });

        if (call.error) {
            this.props.history.push("/stranka-sa-nenasla");
        } else {
            setStorageItem("token", call.token);
        }
    }

    saveAndContinue() {
        removeStorageItem("regUser");
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="screen register-new">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Vytvorenie členstva v klube TerraMia | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}

                <div className="content">
                    <div className="left-panel">
                        <img className="icon" src={require("../../assets/family-business-1.png")} loading="lazy" />
                    </div>

                    <div className="right-panel">
                        <div className="title">
                            Vitajte v klube TerraMia
                        </div>
                        <p className="text">
                            Ďakujeme za vytvorenie členstva v klube TerraMia! Teraz budete mocť naplno využívať všetky výhody členstva.
                        </p>

                        <div style={{ height: 40 }} />

                        <div className="button-filled" onClick={() => this.saveAndContinue()}>Domov</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Register4);
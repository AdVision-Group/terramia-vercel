import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";

import Popup from "../../components/Popup";
import { hideTransition, showTransition } from "../../components/Transition";
import { API_URL, getStorageItem, setStorageItem } from "../../config/config";

import "../../styles/register-new.css";
import Api from "../../config/Api";

class Register3 extends React.Component {

    state = {
        code: "",
        password: "",
        repeatPassword: "",

        popup: false,
        message: "",
        loading: false
    }

    constructor() {
        super();

        this.sendCode = this.sendCode.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
    }

    async componentDidMount() {
        showTransition();
        hideTransition();
    }

    async sendCode() {
        this.setState({ popup: true, loading: true });

        const regUser = getStorageItem("regUser");

        if (!regUser || !regUser.email || !regUser.name || !regUser.phone || !regUser.address || !regUser.psc || !regUser.city || !regUser.country) this.props.history.push("/stranka-sa-nenasla");

        const call = await Api.codeRegister({
            email: regUser.email.trim()
        });

        if (call.error) {
            this.props.history.push("/stranka-sa-nenasla");
        }

        this.setState({
            loading: false,
            message: "Overovací kód Vám bol preposlaný na Váš e-mail"
        });
    }

    async saveAndContinue() {
        this.setState({ popup: true, loading: true });

        const { code, password, repeatPassword } = this.state;

        const regUser = getStorageItem("regUser");

        if (code.trim() === "" || password.trim() === "" || repeatPassword.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        if (password.trim() !== repeatPassword.trim()) {
            this.setState({
                loading: false,
                message: "Heslá sa nezhodujú"
            });

            return;
        }

        const call = await Api.passwordRegister({
            email: regUser.email.trim(),
            code: code.trim(),
            password: password.trim()
        });

        if (!call.error) {
            setStorageItem("regUser", {
                ...regUser,
                password: password
            });

            this.props.history.push("/stan-sa-clenom/vitajte");
        } else {
            if (call.error === "invalid-code") {
                this.setState({
                    loading: false,
                    message: "Overovací kód je neplatný"
                });
            } else {
                this.setState({
                    loading: false,
                    message: "Nastala serverová chyba, skúste znovu neskôr prosím"
                });
            }
        }
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
                            Vytvorenie hesla
                        </div>
                        <p className="text">
                            Na e-mail sme Vám poslali overovací kód, ktorý je potrebný na overenie Vašej totožnosti a vytvorenie hesla.
                        </p>

                        <div style={{ height: 30 }} />

                        <div className="button-outline" onClick={() => this.sendCode()}>Poslať znovu</div>

                        <div style={{ height: 40 }} />

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.code} placeholder="Overovací kód" onChange={(event) => this.setState({ code: event.target.value})} />

                        <div style={{ height: 20 }} />

                        <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.repeatPassword} placeholder="Zopakovať heslo" onChange={(event) => this.setState({ repeatPassword: event.target.value})} />

                        <div style={{ height: 60 }} />

                        <div className="button-filled" onClick={() => this.saveAndContinue()}>Pokračovať</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Register3);
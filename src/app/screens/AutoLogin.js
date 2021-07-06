import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { getStorageItem, setStorageItem } from "../config/config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/autologin.css";
import "../styles/welcome.css";

class AutoLogin extends React.Component {

    state = {
        popup: false,
        message: "",
        popupLoading: false,
        onClick: () => this.setState({ popup: false }),

        loading: true,
        success: false,

        newPassword: "",
        repeatNewPassword: ""
    }

    constructor() {
        super();

        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    async login() {
        this.setState({ loading: true });

        const email = this.props.match.params.email;
        const password = this.props.match.params.password;

        const call = await Api.login({
            email: email,
            password: password
        });

        if (call.token) {
            setStorageItem("token", call.token)
            this.setState({ loading: false, success: true });
        } else {
            this.setState({ loading: false, success: false });
        }
    }

    async changePassword() {
        this.setState({ popup: true, popupLoading: true });

        const token = getStorageItem("token");

        const { newPassword, repeatNewPassword } = this.state;
        const oldPassword = this.props.match.params.password;

        if (newPassword.trim() !== repeatNewPassword.trim()) {
            this.setState({ popupLoading: false, message: "Heslá sa nezhodujú" });
            return;
        }

        const call = await Api.changePassword({
            oldPassword: oldPassword,
            password: newPassword
        }, token);

        if (call.message === "Password is in an invalid format") {
            this.setState({ popupLoading: false, message: "Heslo je príliš jednoduché. Heslo musí byť dlhé aspoň 8 znakov a obsahovať aspoň jedno veľké písmeno a aspoň jedno číslo." });
        } else if (call.message === "Password changed successfully") {
            this.setState({
                popupLoading: false,
                message: "Členstvo v klube TerraMia bolo úspešne aktivované",
                onClick: () => this.props.history.push("/")
            });
        }
    }

    async componentDidMount() {
        showTransition();
        
        await this.login();

        hideTransition();
    }

    render() {
        if (this.state.loading) {
            return(
                <div className="screen" id="autologin">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>TerraMia | Načítava sa</title>
                        <meta name="robots" content="noindex, nofollow"></meta>
                    </Helmet>

                    <Loading />
                </div>
            )
        }

        return(
            <div className="screen" id="welcome">
                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.popupLoading}
                        onClick={this.state.onClick}
                    />
                ) : null}

                <div className="image-panel">
                    <img className="image" src={require("../assets/family-business-1.png")} loading="lazy" alt="Obrazok" />
                </div>

                {this.state.success ? (
                    <div className="text-panel">
                        <Helmet>
                            <meta charSet="utf-8" />
                            <title>TerraMia | Vitajte v klube TerraMia</title>
                            <meta name="robots" content="noindex, nofollow"></meta>
                        </Helmet>

                        <div className="title-large">Vitajte v klube TerraMia</div>
                        <div className="text">
                            Ako nášmu dobrému zákazníkovi sme si dovolili vytvoriť Vám členstvo v klube Terramia, aby sme Vám uľahčili robotu s vytváraním členstva nanovo.
                        </div>

                        <div className="heading">Vytvorte si nové heslo</div>
                        <div className="description">
                            Heslo sme Vám vygenerovali automaticky. Vytvorte si nové, vlastné heslo, ktoré budete používať na prihlasovanie sa do klubu TerraMia.
                        </div>

                        <div className="form">
                            <input className="field" type="password" placeholder="Nové heslo" value={this.state.newPassword} onChange={(event) => this.setState({ newPassword: event.target.value })} />
                            <input className="field" type="password" placeholder="Zopakujte heslo" value={this.state.repeatNewPassword} onChange={(event) => this.setState({ repeatNewPassword: event.target.value })} />
                        </div>

                        <div className="button-filled" onClick={() => this.changePassword()}>Dokončiť</div>
                    </div>
                ) : (
                    <div className="text-panel" style={{ alignSelf: "center" }}>
                        <Helmet>
                            <meta charSet="utf-8" />
                            <title>TerraMia | Nastala chyba pri prihlasovaní</title>
                        </Helmet>

                        <div className="title-large">Nastala chyba pri prihlasovaní</div>
                        <div className="text">
                            Nastala chyba pri overovaní Vášho členstva v klube TerraMia. Vygenerovaný link z Vášho e-mailu je pravdepodobne chybný. Kontaktujte nás prosím telefonicky, e-mailom, alebo pomocou nášho kontaktného formulára ohľadom tohoto problému a my Vám pošleme nový link na vytvorenie členstva v klube TerraMia.
                        </div>

                        <Link className="button-filled" to="/kontakt">Kontaktujte nás</Link>
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(AutoLogin);
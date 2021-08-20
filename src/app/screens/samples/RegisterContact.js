import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { getStorageItem } from "../../config/config";
import Api from "../../config/Api";

import Popup from "../../components/Popup";

import doc1 from "../../documents/gdpr.pdf";
import doc2 from "../../documents/obchodne-podmienky.pdf";

import { showTransition, hideTransition } from "../../components/Transition";

import "../../styles/register1.css";

class RegisterContact extends React.Component {

    state = {
        email: "",

        name: "",
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: "",

        agree1: false,
        agree2: false,

        popup: false,
        message: "",
        loading: false,
        onPopupClose: () => {}
    }

    constructor() {
        super();

        this.billingRegister = this.billingRegister.bind(this);
    }

    async componentDidMount() {
        showTransition();

        const registerData = getStorageItem("register");

        if (!registerData || !registerData.email) {
            this.props.history.push("/stranka-sa-nenasla");
        } else {
            this.setState({ email: registerData.email });
        }

        hideTransition();
    }

    async billingRegister() {
        this.setState({ popup: true, loading: true });

        const { email, name, phone, address, psc, city, country } = this.state;
        const { agree1, agree2 } = this.state;

        if (name.trim() === "" || phone.trim() === "" || address.trim() === "" || psc.trim() === "" || city.trim() === "" || country.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené",
                onPopupClose: () => this.setState({ popup: false })
            });

            return;
        }

        if (!agree1 || !agree2) {
            this.setState({
                loading: false,
                message: "Pre členstvo v klube TerraMia je povinný súhlas s obchodnými podmienkami a spracovaním osobných údajov",
                onPopupClose: () => this.setState({ popup: false })
            });

            return;
        }

        const call = await Api.billingRegister({
            email: email.trim(),
            name: name.trim(),
            address: address.trim(),
            psc: psc.trim().replace(/\s/g,''),
            city: city.trim(),
            country: country.trim(),
            phone: phone.trim().replace(/\s/g,'')
        });

        if (!call.error) {
            const sendCode = await Api.codeRegister({ email: email.trim() });

            if (!sendCode.error) {
                this.props.history.push("/vzorka-zadarmo/vytvorenie-hesla");
            } else {
                this.setState({
                    loading: false,
                    message: "Nastala serverová chyba, skúste to znovu neskôr prosím",
                    onPopupClose: () => this.setState({ popup: false })
                });
            }
        } else {
            this.setState({
                loading: false,
                message: "Už ste úspešne zaregistrovaný",
                onPopupClose: () => this.props.history.push("/")
            });
        }
    }

    render() {
        return(
            <div className="screen register" id="register-2">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Fakturačné údaje | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={() => this.state.onPopupClose()}
                    />
                ) : null}

                <div className="content">
                    <div className="left-panel">
                        <img className="icon" src={require("../../assets/family-business-1.png")} loading="lazy" alt="Register" />
                    </div>

                    <div className="right-panel">
                        <div className="title">
                            Fakturačné údaje
                        </div>
                        <p className="text">
                            Zadajte fakturačné údaje pre korektné doručenie vzorky.
                        </p>

                        <div className="form">
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value})} />
                            <br />
                            <input className="field" style={{ marginBottom: 10 }} onKeyPress={this.handleKeyPress} type="text" required value={this.state.phone} placeholder="Telefónne číslo" onChange={(event) => this.setState({ phone: event.target.value})} />
                            <br />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.address} placeholder="Adresa a číslo domu" onChange={(event) => this.setState({ address: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value})} />
                        </div>

                        <br />
                        <br />

                        <div className="checkbox" onClick={() => this.setState((state) => ({ agree1: !state.agree1 }))}>
                            <div className="bullet" style={this.state.agree1 ? { backgroundColor: "#A161B3" } : null}></div>
                            <div className="item-title">Súhlasím s <a href={doc2} target="_blank" style={{ textDecoration: "none", fontWeight: 700, color: "#383838" }}>obchodnými podmienkami</a></div>
                        </div>

                        <div className="checkbox" onClick={() => this.setState((state) => ({ agree2: !state.agree2 }))}>
                            <div className="bullet" style={this.state.agree2 ? { backgroundColor: "#A161B3" } : null}></div>
                            <div className="item-title">Súhlasím so <a href={doc1} target="_blank" style={{ textDecoration: "none", fontWeight: 700, color: "#383838" }}>spracovaním osobných údajov</a></div>
                        </div>

                        <br />
                        <br />

                        <div className="button-filled" onClick={() => this.billingRegister()} id="register-button-step-2">Pokračovať</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterContact);
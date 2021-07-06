import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";

import Popup from "../../components/Popup";
import { hideTransition, showTransition } from "../../components/Transition";
import { getStorageItem, setStorageItem } from "../../config/config";

import doc1 from "../../documents/gdpr.pdf";
import doc2 from "../../documents/obchodne-podmienky.pdf";

import "../../styles/register-new.css";
import Api from "../../config/Api";

class Register2 extends React.Component {

    state = {
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: "",

        agree1: false,
        agree2: false,

        popup: false,
        message: "",
        loading: false
    }

    constructor() {
        super();

        this.saveAndContinue = this.saveAndContinue.bind(this);
    }

    componentDidMount() {
        showTransition();

        hideTransition();
    }

    async saveAndContinue() {
        this.setState({ popup: true, loading: true });

        const { phone, address, psc, city, country, agree1, agree2 } = this.state;
        const regUser = getStorageItem("regUser");

        if (!regUser || !regUser.email || !regUser.name) this.props.history.push("/stranka-sa-nenasla");

        if (phone.trim() === "" || address.trim() === "" || psc.trim() === "" || city.trim() === "" || country.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        if (!agree1 || !agree2) {
            this.setState({
                loading: false,
                message: "Pre vytvorenie členstva v klube TerraMia je povinný súhlas s obchodnými podmienkami a spracovaním osobných údajov"
            });

            return;
        }

        const call = await Api.billingRegister({
            email: regUser.email.trim(),
            name: regUser.name.trim(),
            address: address.trim(),
            psc: psc.trim().replace(/\s/g,''),
            city: city.trim(),
            country: country.trim(),
            phone: phone.trim().replace(/\s/g,'')
        });

        if (!call.error) {
            setStorageItem("regUser", {
                ...regUser,
                phone: phone.trim().replace(/\s/g,''),
                address: address.trim(),
                psc: psc.trim().replace(/\s/g,''),
                city: city.trim(),
                country: country.trim()
            });

            const sendCode = await Api.codeRegister({
                email: regUser.email.trim()
            });
    
            if (sendCode.error) {
                this.props.history.push("/stranka-sa-nenasla");
            } else {
                this.props.history.push("/stan-sa-clenom/vytvorenie-hesla");
            }
        } else {
            this.setState({
                loading: false,
                message: "Niektoré údaje sú v zlom formáte (tel. číslo alebo adresa)"
            });
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
                            Fakturačné údaje
                        </div>
                        <p className="text">
                            Vyplňte Vaše fakturačné údaje, aby bolo objednávanie v budúcnosti jednoduchšie a rýchlejšie.
                        </p>

                        <div style={{ height: 40 }} />

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.phone} placeholder="Telefónne číslo (vo formáte '0902123456')" onChange={(event) => this.setState({ phone: event.target.value})} />

                        <div style={{ height: 20 }} />

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.address} placeholder="Adresa a číslo domu (vo formáte 'Brečtanová 2')" onChange={(event) => this.setState({ address: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value})} />

                        <div style={{ height: 40 }} />

                        <div className="checkbox" onClick={() => this.setState((state) => ({ agree1: !state.agree1 }))}>
                                <div className="bullet" style={this.state.agree1 ? { backgroundColor: "#A161B3" } : null}></div>
                                <div className="title">Súhlasím s <a href={doc2} target="_blank" style={{ textDecoration: "none", fontWeight: 700, color: "#383838" }}>obchodnými podmienkami</a></div>
                            </div>

                            <div className="checkbox" onClick={() => this.setState((state) => ({ agree2: !state.agree2 }))}>
                                <div className="bullet" style={this.state.agree2 ? { backgroundColor: "#A161B3" } : null}></div>
                                <div className="title">Súhlasím so <a href={doc1} target="_blank" style={{ textDecoration: "none", fontWeight: 700, color: "#383838" }}>spracovaním osobných údajov</a></div>
                            </div>

                        <div style={{ height: 60 }} />

                        <div className="button-filled" onClick={() => this.saveAndContinue()}>Pokračovať</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Register2);
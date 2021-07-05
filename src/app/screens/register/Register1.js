import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";

import Popup from "../../components/Popup";
import { hideTransition, showTransition } from "../../components/Transition";
import { API_URL, removeStorageItem, setStorageItem } from "../../config/config";
import Api from "../../config/Api";

import "../../styles/register-new.css";

class Register1 extends React.Component {

    state = {
        name: "",
        email: "",

        registeredInDoTerra: false,

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

        removeStorageItem("regUser");

        hideTransition();
    }


    async saveAndContinue() {
        this.setState({ popup: true, loading: true });

        const { name, email, registeredInDoTerra } = this.state;

        if (email.trim() === "" || name.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        const call = await Api.preRegister({
            email: email.trim(),
            registeredInDoTerra: registeredInDoTerra
        });

        if (!call.error) {
            setStorageItem("regUser", {
                email: email.trim(),
                name: name.trim(),
                registeredInDoTerra: registeredInDoTerra
            });

            this.props.history.push("/stan-sa-clenom/fakturacne-udaje");
        } else {
            if (call.regStep != null || call.regStep != undefined) {
                setStorageItem("regUser", {
                    email: email.trim(),
                    name: name.trim(),
                    registeredInDoTerra: registeredInDoTerra
                });

                if (call.regStep === 0) {
                    this.props.history.push("/stan-sa-clenom/fakturacne-udaje");
                } else if (call.regStep === 2) {
                    const sendCode = await Api.codeRegister({
                        email: email.trim()
                    });

                    if (sendCode.error) {
                        this.props.history.push("/stranka-sa-nenasla");
                    } else {
                        this.props.history.push("/stan-sa-clenom/vytvorenie-hesla");
                    }
                }
            } else {
                this.setState({
                    loading: false,
                    message: "Zadaný e-mail neexistuje"
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
                            Staň sa členom
                        </div>
                        <p className="text">
                            Staňte sa členom klubu TerraMia a získajte všetky výhody členstva.
                        </p>

                        <div style={{ height: 40 }} />

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />

                        <div style={{ height: 40 }} />

                        <div className="heading">Máte otvorený účet v doTERRA?</div>
                        <div className="choice">
                            <div className="item" style={this.state.registeredInDoTerra ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ registeredInDoTerra: true })}>Áno</div>
                            <div className="item" style={!this.state.registeredInDoTerra ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ registeredInDoTerra: false })}>Nie</div>
                        </div>

                        <div style={{ height: 60 }} />

                        <div className="button-filled" onClick={() => this.saveAndContinue()}>Pokračovať</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Register1);
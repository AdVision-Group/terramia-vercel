import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { setStorageItem, getStorageItem } from "../../config/config";
import Api from "../../config/Api";

import Popup from "../../components/Popup";

import { showTransition, hideTransition } from "../../components/Transition";

import "../../styles/register1.css";

class RegisterPassword extends React.Component {

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

        this.order = this.order.bind(this);
        this.passwordRegister = this.passwordRegister.bind(this);
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

    async passwordRegister() {
        this.setState({ popup: true, loading: true })

        const { email, passwordCode, password, repeatPassword } = this.state;

        if (password.trim() === "" || repeatPassword.trim() === "" || passwordCode.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        if (password.trim() === repeatPassword.trim()) {
            const call = await Api.passwordRegister({
                email: email.trim(),
                code: passwordCode.trim(),
                password: password.trim()
            });

            if (!call.error) {
                setStorageItem("register", {
                    ...getStorageItem("register"),
                    password: password
                });
                
                this.order();
            } else {
                this.setState({
                    loading: false,
                    message: "Nastala serverová chyba, skúste to znovu neskôr prosím"
                });
            }
        } else {
            this.setState({ loading: false, message: "Heslá sa nezhodujú" })
        }
    }

    async order() {
        this.setState({ popup: true, loading: true });

        const registerData = getStorageItem("register");
        const email = registerData.email || this.state.email;
        const password = registerData.password || this.state.password;
        const sampleId = registerData.sampleId;

        const login = await Api.login({
            email: email.trim(),
            password: password.trim()
        });

        if (login.token) {
            setStorageItem("token", login.token);

            const order = await Api.createOrder({
                products: [ sampleId ],
                applyDiscount: false
            }, login.token);

            const pay = await Api.skipPayment({ orderId: order.orderId });

            if (pay.message === "Payment skipped successfully") {
                this.props.history.push("/vzorka-zadarmo/suhrn-clenstva");
            } else if (pay.message === "Tento použivateľ nemá nárok na vzorku zadarmo") {
                this.setState({
                    loading: false,
                    message: pay.message
                });
            }
        } else {
            this.setState({
                loading: false,
                message: "Nastala neočakávaná chyba, skúste znovu neskôr prosím"
            });
        }
    }

    render() {
        return(
            <div className="screen register" id="register-3">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Vytvorenie hesla | TerraMia</title>
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
                            Zadajte overovací kód a vytvorte si heslo
                        </div>
                        <p className="text">
                            Pre zaslanie vzoriek a vytvorenie členstva v klube TerraMia zadajte overovací kód, ktorý sme Vám zaslali na e-mail a vytvorte si heslo. Heslo musí byť dlhé aspon 6 znakov a obsahovať aspon jedno číslo a jedno veľké písmeno.
                        </p>

                        <div className="form">
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.passwordCode} placeholder="Kód, ktorý Vám prišiel mailom" onChange={(event) => this.setState({ passwordCode: event.target.value })} />
                            <div style={{ height: 20 }} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value.trim() })} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.repeatPassword} placeholder="Zopakovať heslo" onChange={(event) => this.setState({ repeatPassword: event.target.value.trim() })} />
                        </div>

                        <div style={{ height: 40 }} />

                        <div className="button-filled" onClick={() => this.passwordRegister()} id="register-button-step-3">Vytvoriť členstvo v klube TerraMia</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterPassword);
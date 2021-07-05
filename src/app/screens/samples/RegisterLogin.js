import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { setStorageItem, getStorageItem } from "../../config/config";
import Api from "../../config/Api";

import Popup from "../../components/Popup";

import doc1 from "../../documents/gdpr.pdf";
import doc2 from "../../documents/obchodne-podmienky.pdf";

import { showTransition, hideTransition } from "../../components/Transition";

import "../../styles/login.css";

class RegisterLogin extends React.Component {

    state = {
        email: "",
        password: "",

        popup: false,
        message: "",
        loading: false,
    }

    constructor() {
        super();
        
        this.order = this.order.bind(this);
    }

    async order() {
        this.setState({ popup: true, loading: true });

        const { email, password } = this.state;

        const registerData = getStorageItem("register");
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
            this.props.history.push("/stranka-sa-nenasla");
        }
    }

    componentDidMount() {
        showTransition();

        const registerData = getStorageItem("register");

        if (!registerData || !registerData.email) {
            this.props.history.push("/stranka-sa-nenasla");
        } else {
            this.setState({ email: registerData.email });
        }

        hideTransition();
    }

    componentDidUpdate() {
        const token = getStorageItem("token");

        if (token) {
            this.props.history.push("/profil")
        }
    }

    render() {
        return(
            <div className="screen" id="login">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Prihlásenie | TerraMia</title>
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
                        <div className="title">Prihlásiť sa</div>
                        <p className="text">
                            Po prihlásení budete môcť využívať benefity klubu TerraMia. Ak máte vlastný účet doTERRA, vzorky zadarmo už nepotrebujte. Ak ešte nemáte vlastný účet doTERRA, môžete si ho vytvoriť <a style={{ textDecoration: "none", fontWeight: "700", color: "#A161B3" }} href="https://www.mydoterra.com/Application/index.cfm?EnrollerID=756332">na tomto linku</a> a využívať výhody členstva.
                        </p>

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value})} />
                        
                        <div className="button-filled" onClick={() => this.order()}>Prihlásiť sa</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterLogin);
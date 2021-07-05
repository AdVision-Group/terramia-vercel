import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, evaluateLogin, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/login.css";

class Login extends React.Component {

    state = {
        offset: 0,

        email: "",
        password: "",

        popup: false,
        type: "info",
        title: "",
        loading: false,
    }

    constructor() {
        super();
        
        this.login = this.login.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    async login() {
        this.setState({ popup: true, loading: true, type: "info" });

        const { email, password } = this.state

        const login = await Api.login({
            email: email.trim(),
            password: password
        })

        if (login.token) {
            setStorageItem("token", login.token);

            const call = await Api.getUser(login.token);

            if (call.user) {
                setStorageItem("username", call.user.name);
                this.props.history.push("/");
            }
        } else {
            const message = evaluateLogin(login.message);
            this.setState({ popup: true, loading: false, title: message });
        }
    }

    async resetPassword(email) {
        this.setState({ type: "info", loading: true });
        
        const forgot = await Api.forgotPassword(email);

        if (forgot.message === "A password reset link has been sent to the email provided") {
            this.setState({ type: "info", loading: false, title: "Link na resetovanie hesla bol poslaný na Váš email" })
        } else {
            this.setState({ type: "info", loading: false, title: "E-mailová adresa je neplatná" })
        }
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.login();
        }
    }

    componentDidMount() {
        showTransition();

        const token = getStorageItem("token");

        if (token) {
            this.props.history.push("/profil")
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
                        type={this.state.type}
                        title={this.state.title}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                        resetPassword={this.resetPassword}
                    />
                ) : null}

                <div className="content">
                    <div className="left-panel">
                        <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                    </div>

                    <div className="right-panel">
                        <div className="title">Prihlásiť sa do klubu TerraMia</div>
                        <p className="text">
                            Po prihlásení budete môcť využívať benefity klubu TerraMia. Ak máte vlastný účet doTERRA, vzorky zadarmo už nepotrebujte. Ak ešte nemáte vlastný účet doTERRA, môžete si ho vytvoriť <a style={{ textDecoration: "none", fontWeight: "700", color: "#A161B3" }} href="https://www.mydoterra.com/Application/index.cfm?EnrollerID=756332">na tomto linku</a> a využívať výhody členstva.
                        </p>

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value})} />
                        <div style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: 16, cursor: "pointer" }} onClick={() => {
                            this.setState({ popup: true, loading: false, type: "forgot" })
                        }}>Zabudnuté heslo?</div>
                        
                        <div className="button-filled" onClick={() => this.login()}>Prihlásiť sa</div>

                        <div className="text" style={{ margin: "30px 0 0 0" }}>Nie ste ešte členom klubu TerraMia? Staňte sa členom <span onClick={() => this.props.history.push("/stan-sa-clenom")} style={{ fontWeight: "700", color: "#A161B3", cursor: "pointer" }}>tu</span>.</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);
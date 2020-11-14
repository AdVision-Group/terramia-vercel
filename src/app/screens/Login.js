import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, evaluateLogin, setStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import "../styles/login.css";

class Login extends React.Component {

    state = {
        offset: 0,

        email: "",
        password: "",

        message: "",

        popup: false,
        type: "info",
        title: "",
        loading: false
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
            setStorageItem("token", login.token)
            this.setState({ popup: false });
            this.props.history.push("/");
        } else {
            const message = evaluateLogin(login.message);
            this.setState({ popup: false, message: message });
        }
    }

    async resetPassword(email) {
        this.setState({ type: "info", loading: true });
        
        const forgot = await Api.forgotPassword(email);

        console.log(forgot);

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
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        if (isLogged()) {
            this.props.history.push("/profil")
        }
    }
    
    componentDidUpdate() {
        if (isLogged()) {
            this.props.history.push("/profil")
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        return(
            <div className="screen" id="login">
                <Header />

                {this.state.popup ? (
                    <Popup
                        type={this.state.type}
                        title={this.state.title}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                        resetPassword={this.resetPassword}
                    />
                ) : null}

                <div className="content" style={{ paddingTop: this.state.offset }}>
                    <div className="left-panel">
                        <img className="icon" src={require("../assets/family.png")} />
                    </div>

                    <div className="right-panel">
                        <div className="title">Prihlásiť sa do TerraMia</div>
                        <div className="text">
                            Po prihlásení sa do tímu TerraMia budete môcť nakupovať omnoho výhodnejšie, ako keby ste nakupovali anonýmne. Keď ešte nieste členom TerraMia, vytvorte si svoj účet.
                        </div>

                        <input className="field" onKeyPress={this.handleKeyPress} type="text" value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />
                        <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value})} />
                        <div style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: 16, cursor: "pointer" }} onClick={() => {
                            this.setState({ popup: true, loading: false, type: "forgot" })
                        }}>Zabudnuté heslo?</div>

                        <div className="error-message">{this.state.message}</div>
                        
                        <div className="button-filled" onClick={() => this.login()}>Prihlásiť sa</div>
                        <Link className="button-outline" to="/registracia-vzorky-zadarmo">Staň sa členom</Link>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Login);
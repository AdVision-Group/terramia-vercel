import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import Api from "../config/Api";

import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/reset.css";

class Reset extends React.Component {

    state = {
        newPassword: "",
        repeatNewPassword: "",

        popup: false,
        title: "",
        loading: true
    }

    constructor() {
        super();

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.reset = this.reset.bind(this);
    }

    async reset() {
        this.setState({ popup: true, loading: true })

        const { newPassword, repeatNewPassword } = this.state

        if (newPassword.trim() === repeatNewPassword.trim()) {
            const secret = this.props.match.params.secret;

            const reset = await Api.resetPassword(newPassword, secret);

            if (reset.message === "Password was reset successfully") {
                this.props.history.push("/");
            } else {
                this.setState({
                    loading: false,
                    title: "Heslo je príliš jednoduché. Heslo musí byť dlhé aspoň 8 znakov a obsahovať aspoň jedno veľké písmeno a aspoň jedno číslo."
                });
            }
        } else {
            this.setState({
                loading: false,
                title: "Heslá sa nezhodujú"
            });
        }
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.reset();
        }
    }

    componentDidMount() {
        showTransition();
        hideTransition();
    }

    render() {
        return(
            <div className="screen" id="reset">
                <Helmet>
                        <meta charSet="utf-8" />
                        <title>Resetovanie hesla | TerraMia</title>
                        <meta name="robots" content="noindex, nofollow"></meta>
                    </Helmet>

                {this.state.popup ? (
                    <Popup
                        title={this.state.title}
                        type="info"
                        onClick={() => this.setState({ popup: false })}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Resetovať heslo</div>
                    <div className="text">
                        Zresetujte si heslo ku Vášmu účtu, aby ste ho mohli aj naďalej používať. Toto nové heslo bude po resetovaní platné okamžite, neskôr si ho môžete znovu zmeniť v nastaveniach.
                    </div>

                    <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.newPassword} placeholder="Nové heslo" onChange={(event) => this.setState({ newPassword: event.target.value})} />
                    <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.repeatNewPassword} placeholder="Zopakovať nové heslo" onChange={(event) => this.setState({ repeatNewPassword: event.target.value})} />
                    <div className="button-filled" onClick={() => this.reset()}>Resetovať heslo</div>
                </div>
            </div>
        )
    }
}

export default withRouter(Reset);
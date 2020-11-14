import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import "../styles/reset.css";

class Reset extends React.Component {

    state = {
        offset: 0,

        newPassword: "",
        repeatNewPassword: "",

        popup: false,
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

            console.log(reset)

            if (reset.message === "Password was reset successfully") {
                //this.props.history.push("/prihlasenie");
                this.setState({ loading: false })
            } else {
                this.setState({ popup: false, loading: true })
            }
        }
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.reset();
        }
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));
    }
    
    componentDidUpdate() {
        
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
            <div className="screen" id="reset">
                <Header />

                {this.state.popup ? (
                    <Popup
                        title="Heslo bolo zresetované"
                        onClick={() => {
                            this.setState({ popup: false })
                            this.props.history.push("/prihlasenie")
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Resetovať heslo</div>
                    <div className="text">
                        Zresetujte si heslo ku Vášmu účtu, aby ste ho mohli aj naďalej používať. Toto nové heslo bude po resetovaní platné okamžite, neskôr si ho môžete znovu zmeniť v nastaveniach.
                    </div>

                    <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.newPassword} placeholder="Nové heslo" onChange={(event) => this.setState({ newPassword: event.target.value})} />
                    <input className="field" onKeyPress={this.handleKeyPress} type="password" value={this.state.repeatNewPassword} placeholder="Zopakovať nové heslo" onChange={(event) => this.setState({ repeatNewPassword: event.target.value})} />
                    <div className="button-filled" onClick={() => this.reset()}>Resetovať heslo</div>
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Reset);
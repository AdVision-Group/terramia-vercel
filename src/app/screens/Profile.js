import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, getStorageItem, removeStorageItem, setStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import Loading from "../components/Loading";

import "../styles/profile.css";

class Profile extends React.Component {

    state = {
        offset: 0,

        user: null,

        name: "",
        email: "",
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: "",

        password: "",
        newPassword: "",
        repeatNewPassword: "",

        loading: true,
        popup: false
    }

    constructor() {
        super();

        this.logout = this.logout.bind(this);
        this.init = this.init.bind(this);

        this.savePersonalInfo = this.savePersonalInfo.bind(this);
        this.saveOrderInfo = this.saveOrderInfo.bind(this);
        this.savePasswordInfo = this.savePasswordInfo.bind(this);
    }

    async init() {
        const token = getStorageItem("token")
        const getUser = await Api.getUser(token);

        if (getUser.user) {
            const user = getUser.user

            this.setState({
                user: user,

                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                psc: user.psc,
                city: user.city,
                country: user.country
            })
        }
    }

    logout() {
        removeStorageItem("token");
        window.location.reload()
        //this.props.history.push("/prihlasenie")
    }

    async savePersonalInfo() {
        this.setState({ popup: true, loading: true })

        const token = getStorageItem("token");

        const edit = await Api.editUser({
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone
        }, token);

        if (edit.message === "Records updated successfully") {
            var user = await Api.getUser(token);
        
            if (user.message === "User info retrieved successfully") {
                this.setState({ user: user.user, loading: false })
            }

            //window.location.reload();
        } else {
            this.setState({ popup: false, loading: true })
        }
    }

    async saveOrderInfo() {
        this.setState({ popup: true, loading: true })

        const token = getStorageItem("token");

        const edit = await Api.editUser({
            address: this.state.address,
            psc: this.state.psc,
            city: this.state.city,
            country: this.state.country
        }, token);

        if (edit.message === "Records updated successfully") {
            var user = await Api.getUser(token);
        
            if (user.message === "User info retrieved successfully") {
                this.setState({ user: user.user, loading: false })
            }

            //window.location.reload();
        } else {
            this.setState({ popup: false, loading: true })
        }
    }

    async savePasswordInfo() {
        this.setState({ popup: true, loading: true })

        const token = getStorageItem("token");

        if (this.state.newPassword.trim() === this.state.repeatNewPassword.trim()) {
            const change = await Api.changePassword({
                oldPassword: this.state.password,
                password: this.state.newPassword
            }, token);

            if (change.message === "Password changed successfully") {
                //window.location.reload();
                this.setState({ loading: false })
            } else {
                this.setState({ popup: false, loading: true })
            }
        }
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        } else {
            this.init();
        }
    }

    /*
    componentDidUpdate(prevProps) {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }
    */

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        const user = this.state.user

        return(
            <div className="screen" id="profile">
                <Header />

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title="Osobné údaje boli úspešne zmenené"
                        onClick={() => {
                            this.setState({ popup: false })
                            window.location.reload()
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title-panel">
                        <div className="title">Môj profil</div>

                        <div style={{ flex: 1 }}></div>

                        {user && user.admin === 1 ? <Link className="button-filled" to="/admin" style={{ marginRight: 20 }}>Admin</Link> : null}
                        <div className="button-filled" onClick={() => this.logout()}>Odhlásiť sa</div>
                    </div>

                    {!this.state.user ? <Loading /> : (
                    <div className="content" style={{ padding: 0 }}>
                        <div className="section">Detaily o účte</div>
                        <div className="text">
                            Tu sú detaily o Vašom účte. V prípade zmeny fakturačných údajov pri objednávke si ich môžete zmeniť upravením údajov uvedených nižšie. 
                        </div>

                        <div className="details">
                            <div className="heading">Meno a priezvisko</div>
                            <input className="field" type="text" value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value })} />
                            <div className="heading">E-mail</div>
                            <input className="field" type="text" value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value })} />
                            <div className="heading">Telefónne číslo</div>
                            <input className="field" type="text" value={this.state.phone} placeholder="Telefónne číslo" onChange={(event) => this.setState({ phone: event.target.value })} />
                        </div>

                        <div className="button-filled" onClick={() => this.savePersonalInfo()}>Uložiť zmeny</div>

                        <br />
                        <br />
                        <br />

                        <div className="section">Fakturačné údaje</div>
                        <div className="text">
                            Tu sú detaily o Vašom účte. V prípade zmeny fakturačných údajov pri objednávke si ich môžete zmeniť upravením údajov uvedených nižšie. 
                        </div>

                        <div className="details">
                            <div className="heading">Ulica</div>
                            <input className="field" type="text" value={this.state.address} placeholder="Adresa a číslo domu" onChange={(event) => this.setState({ address: event.target.value })} />
                            <div className="heading">PSČ</div>
                            <input className="field" type="text" value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value })} />
                            <div className="heading">Mesto</div>
                            <input className="field" type="text" value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value })} />
                            <div className="heading">Krajina</div>
                            <input className="field" type="text" value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value })} />
                        </div>

                        <div className="button-filled" onClick={() => this.saveOrderInfo()}>Uložiť zmeny</div>

                        <br />
                        <br />
                        <br />

                        <div className="section">Zmena hesla</div>
                        <div className="text">
                            Tu sú detaily o Vašom účte. V prípade zmeny fakturačných údajov pri objednávke si ich môžete zmeniť upravením údajov uvedených nižšie. 
                        </div>

                        <div className="details">
                            <div className="heading">Aktuálne heslo</div>
                            <input className="field" type="password" value={this.state.password} placeholder="Aktuálne heslo" onChange={(event) => this.setState({ password: event.target.value })} />
                            <div className="heading">Nové heslo</div>
                            <input className="field" type="password" value={this.state.newPassword} placeholder="Nové heslo" onChange={(event) => this.setState({ newPassword: event.target.value })} />
                            <div className="heading">Zopakovať nové heslo</div>
                            <input className="field" type="password" value={this.state.repeatNewPassword} placeholder="Zopakovať nové heslo" onChange={(event) => this.setState({ repeatNewPassword: event.target.value })} />
                        </div>

                        <div className="button-filled" onClick={() => this.savePasswordInfo()}>Zmeniť heslo</div>
                    </div>
                    )}
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Profile);
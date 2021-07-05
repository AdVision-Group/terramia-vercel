import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, getStorageItem, removeStorageItem, setStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

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
        popup: false,
        message: "Osobné údaje boli úspešne zmenené"
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
        const token = getStorageItem("token");
        const getUser = await Api.getUser(token);

        if (getUser.user) {
            const user = getUser.user;

            this.setState({
                user: user,

                name: user.name ?? "",
                email: user.email ?? "",
                phone: user.phone ?? "",
                address: user.address ?? "",
                psc: user.psc ?? "",
                city: user.city ?? "",
                country: user.country ?? ""
            });
        } else {
            removeStorageItem("token");
            this.props.history.push("/prihlasenie");
        }
    }

    logout() {
        removeStorageItem("token");
        window.location.reload()
    }

    async savePersonalInfo() {
        this.setState({ popup: true, loading: true })

        const { name, email, phone } = this.state;

        const token = getStorageItem("token");

        const edit = await Api.editUser({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim()
        }, token);

        if (edit.message === "Records updated successfully") {
            const user = await Api.getUser(token);
        
            if (user.message === "User info retrieved successfully") {
                this.setState({ user: user.user, loading: false, message: "Osobné údaje boli úspešne zmenené" });
            }

            //window.location.reload();
        } else {
            this.setState({ popup: false, loading: true })
        }
    }

    async saveOrderInfo() {
        this.setState({ popup: true, loading: true })

        const { address, psc, city, country } = this.state;

        const token = getStorageItem("token");

        const edit = await Api.editUser({
            address: address.trim(),
            psc: psc.trim(),
            city: city.trim(),
            country: country.trim()
        }, token);

        if (edit.message === "Records updated successfully") {
            const user = await Api.getUser(token);
        
            if (user.message === "User info retrieved successfully") {
                this.setState({ user: user.user, loading: false, message: "Osobné údaje boli úspešne zmenené" })
            }
        } else {
            this.setState({ popup: false, loading: true })
        }
    }

    async savePasswordInfo() {
        this.setState({ popup: true, loading: true })

        const { password, newPassword, repeatNewPassword } = this.state

        const token = getStorageItem("token");

        if (newPassword.trim() === repeatNewPassword.trim()) {
            const change = await Api.changePassword({
                oldPassword: password.trim(),
                password: newPassword.trim()
            }, token);

            if (change.message === "Password changed successfully") {
                //window.location.reload();
                this.setState({ loading: false, message: "Osobné údaje boli úspešne zmenené" })
            } else {
                this.setState({ popup: false, loading: true })
            }
        } else {
            this.setState({ loading: false, message: "Heslá sa nezhodujú" })
        }
    }

    async componentDidMount() {
        showTransition();

        const token = getStorageItem("token");

        if (!token) {
            this.props.history.push("/prihlasenie");
        } else {
            await this.init();
        }

        hideTransition();
    }

    render() {
        const user = this.state.user;

        return(
            <div className="screen" id="profile">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Profil | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        onClick={() => {
                            this.setState({ popup: false })
                            window.location.reload()
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content">
                    <div className="header">
                        <div className="title">Môj profil</div>

                        <div style={{ flex: 1 }}></div>

                        <div className="button-panel">
                            {user != null && user != undefined && user.admin != null && user.admin != undefined && user.admin === 1 ? <Link className="button-filled" to="/admin/analytika" style={{ marginRight: 20 }}>Analytika</Link> : null}
                            {user != null && user != undefined && user.admin != null && user.admin != undefined && user.admin === 1 ? <Link className="button-filled" to="/admin/registracia-novych-clenov" style={{ marginRight: 20 }}>Emaily</Link> : null}
                            {user != null && user != undefined && user.admin != null && user.admin != undefined && user.admin === 1 ? <Link className="button-filled" to="/admin/objednavky" style={{ marginRight: 20 }}>Objednávky</Link> : null}
                            {user != null && user != undefined && user.admin != null && user.admin != undefined && user.admin === 1 ? <Link className="button-filled" to="/admin/pridat-produkt" style={{ marginRight: 20 }}>Pridať produkt</Link> : null}
                            {user != null && user != undefined && user.admin != null && user.admin != undefined && user.admin === 1 ? <Link className="button-filled" to="/admin/pridat-prispevok" style={{ marginRight: 20 }}>Pridať príspevok</Link> : null}
                            <div className="button-filled" onClick={() => this.logout()}>Odhlásiť sa</div>
                        </div>
                    </div>

                    {this.state.user === null ? <Loading /> : (
                    <div className="content" style={{ padding: 0 }}>
                        <div className="section">Detaily o účte</div>
                        <p className="text">
                            Tu sú detaily o Vašom účte. V prípade zmeny fakturačných údajov pri objednávke si ich môžete zmeniť upravením údajov uvedených nižšie. 
                        </p>

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
                        <p className="text">
                            Tu sú detaily o Vašom účte. V prípade zmeny fakturačných údajov pri objednávke si ich môžete zmeniť upravením údajov uvedených nižšie. 
                        </p>

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
                        <p className="text">
                            Tu sú detaily o Vašom účte. V prípade zmeny fakturačných údajov pri objednávke si ich môžete zmeniť upravením údajov uvedených nižšie. 
                        </p>

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
            </div>
        )
    }
}

export default withRouter(Profile);
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, getStorageItem, removeStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Banner from "../components/Banner";

import Loading from "../components/Loading";
import CheckoutForm from "../components/CheckoutForm";

import "../styles/checkoutold.css";
import { timers } from "jquery";
import Popup from "../components/Popup";

const promise = loadStripe("pk_test_51Hc5rMFGDIXHKcdbAeI9FeG5b2rAXAu6ATFBsoxB3bBCA7ajJ8UhroPzGVq3eOBDtKqRxVNMr4wKPFnP9zP8Zkts00jnc80SNN");

class Checkout extends React.Component {

    state = {
        offset: 0,

        popup: false,
        popupTitle: "Všetky polia musia byť vyplnené",
        popupLoading: true,

        loading: true,

        name: "",
        email: "",
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: "",

        company: false,

        companyName: "",
        companyIco: "",
        compadyDic: "",
        companyIcdph: "",
        companyAddress: "",
        companyPsc: "",
        companyCity: "",
        companyCountry: "",

        registeredInDoTerra: false,

        doterra: true,
        birth: "",

        totalPoints: 0
    }

    constructor() {
        super();

        this.autofill = this.autofill.bind(this);
        this.goToPayment = this.goToPayment.bind(this);
        this.getTotalPoints = this.getTotalPoints.bind(this);
    }

    async goToPayment() {
        this.setState({ popup: true, popupLoading: true });

        const token = getStorageItem("token");

        const { name, email, phone, address, psc, city, country, doterra, birth } = this.state;

        if (name.trim() === "" || email.trim() === "" || phone.trim() === "" || address.trim() === "" || psc.trim() === "" || city.trim() === "" || country.trim() === "") {
            this.setState({
                popupLoading: false,
                popupTitle: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        if (doterra && birth.trim() === "") {
            this.setState({
                popupLoading: false,
                popupTitle: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        if (!token) {
            const user = {
                name: name,
                email: email,
                phone: phone,
                address: address,
                psc: psc,
                city: city,
                country: country,
            }

            if (this.state.company) {
                setStorageItem("temp", {
                    ...user,
                    company: {
                        name: this.state.companyName,
                        ico: this.state.companyIco,
                        dic: this.state.companyDic,
                        icdph: this.state.companyIcdph,
                        address: this.state.companyAddress,
                        psc: this.state.companyPsc,
                        city: this.state.companyCity,
                        country: this.state.companyCountry
                    }
                });

                setStorageItem("company", true);
            } else {
                setStorageItem("temp", user);
                removeStorageItem("company");
            }
        } else {
            const call = await Api.editUser({
                name: name,
                email: email,
                phone: phone,
                address: address,
                psc: psc,
                city: city,
                country: country
            }, token);

            if (call.error) {
                this.setState({
                    popupLoading: false,
                    popupTitle: "Telefónne číslo alebo adresa sa už používa"
                })
                return;
            }

            if (this.state.company) {
                const call2 = await Api.editUser({
                    company: {
                        name: this.state.companyName,
                        ico: this.state.companyIco,
                        dic: this.state.companyDic,
                        icdph: this.state.companyIcdph,
                        address: this.state.companyAddress,
                        psc: this.state.companyPsc,
                        city: this.state.companyCity,
                        country: this.state.companyCountry
                    }
                }, token);

                removeStorageItem("temp");
                setStorageItem("company", true);
            } else {
                removeStorageItem("company");
            }
        }

       if (doterra) {
           setStorageItem("doterra", true);
           setStorageItem("birthDate", birth);
       } else {
           setStorageItem("doterra", false);
           removeStorageItem("birthDate");
       }

        this.props.history.push("/platba");
    }

    async autofill() {
        this.setState({ loading: true })

        const token = getStorageItem("token");

        if (token) {
            const getUser = await Api.getUser(token);
            const user = getUser.user;

            if (user) {
                this.setState({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                    psc: user.psc || "",
                    city: user.city || "",
                    country: user.country || "",

                    companyName: user.company.name ? user.company.name : "",
                    companyIco: user.company.ico ? user.company.ico : "",
                    companyDic: user.company.dic ? user.company.dic : "",
                    companyIcdph: user.company.icdph ? user.company.icdph : "",
                    companyAddress: user.company.address ? user.company.address : "",
                    companyPsc: user.company.psc ? user.company.psc : "",
                    companyCity: user.company.city ? user.company.city : "",
                    companyCountry: user.company.country ? user.company.country : "",

                    registeredInDoTerra: user.registeredInDoTerra
                });
            }
        }

        this.setState({ loading: false });
    }

    async componentDidMount() {
        this.autofill();

        const totalPoints = await this.getTotalPoints();
        this.setState({ totalPoints: totalPoints });

        if (this.state.registeredInDoTerra || this.state.totalPoints < 100) {
            this.setState({ doterra: false });
        }
    }

    async getTotalPoints() {
        const cart = getStorageItem("cart");
        var totalPoints = 0;

        for (let i = 0; i < cart.length; i++) {
            const call = await Api.getProduct(cart[i]._id);

            if (call.product) {
                totalPoints += call.product.points * cart[i].amount;
            }
        }

        return totalPoints;
    }

    render() {
        return(
            <div className="screen" id="checkout">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Fakturačné údaje</title>
                </Helmet>

                <div className="content">
                    <div className="title">Fakturačné údaje</div>
                    <p className="description">
                        {getStorageItem("token") ? "Zadajte Vaše fakturačné a kontaktné údaje, aby sme vedeli, kam Vám odošleme objednávku." : "Ak ste členom klubu TerraMia, prihláste sa a nakupujte výhodnejšie. Vaše fakturačné údaje sa vyplnia automaticky."}
                    </p>
                    {!getStorageItem("token") ? <div id="checkout-button-login" className="button-filled">Prihlásiť sa</div> : null}

                    {this.state.loading ? <Loading /> : (
                        <div className="panel">
                            <input className="field" type="text" required value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value})} />
                            <br />
                            <input className="field" type="text" required value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />
                            <input className="field" type="text" required value={this.state.phone} placeholder="Telefónne číslo" onChange={(event) => this.setState({ phone: event.target.value})} />
                            <br />
                            <input className="field" type="text" required value={this.state.address} placeholder="Adresa a číslo domu" onChange={(event) => this.setState({ address: event.target.value})} />
                            <input className="field" type="text" required value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value})} />
                            <input className="field" type="text" required value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value})} />
                            <input className="field" type="text" required value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value})} />

                            <br />
                            <br />

                            <div className="choice">
                                <div className="item" style={!this.state.company ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ company: false })}>Kúpiť ako fyzická osoba</div>
                                <div className="item" style={this.state.company ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ company: true })}>Kúpiť na firmu</div>
                            </div>

                            {this.state.company ? (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <input className="field" type="text" required value={this.state.companyName} placeholder="Názov firmy" onChange={(event) => this.setState({ companyName: event.target.value})} />
                                    <input className="field" type="text" required value={this.state.companyIco} placeholder="IČO" onChange={(event) => this.setState({ companyIco: event.target.value})} />
                                    <input className="field" type="text" required value={this.state.companyDic} placeholder="DIČ" onChange={(event) => this.setState({ companyDic: event.target.value})} />
                                    <input className="field" type="text" required value={this.state.companyIcdph} placeholder="IČDPH" onChange={(event) => this.setState({ companyIcdph: event.target.value})} />

                                    <input className="field" type="text" required value={this.state.companyAddress} placeholder="Adresa firmy" onChange={(event) => this.setState({ companyAddress: event.target.value})} />
                                    <input className="field" type="text" required value={this.state.companyPsc} placeholder="PSČ firmy" onChange={(event) => this.setState({ companyPsc: event.target.value})} />
                                    <input className="field" type="text" required value={this.state.companyCity} placeholder="Mesto" onChange={(event) => this.setState({ companyCity: event.target.value})} />
                                    <input className="field" type="text" required value={this.state.companyCountry} placeholder="Krajina" onChange={(event) => this.setState({ companyCountry: event.target.value})} />
                                </div>
                            ) : null}

                            <br />
                            <br />

                            {!this.state.registeredInDoTerra && this.state.totalPoints >= 100 ? (
                                <div>
                                    <div className="heading">Zaregistrovať sa v doTERRA</div>
                                    <div className="text">
                                        Ak ešte nemáte vytvorený účet v doTERRA, my ho s radosťou vytvoríme za Vás a pri tomto nákupe hneď dostanete zľavu 25% na všetky produkty rady doTERRA. Takisto Vám odpustíme registračný poplatok, ktorý by ste zaplatili, keby ste si účet založili sami.
                                    </div>

                                    <div className="choice">
                                        <div className="item" style={this.state.doterra ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ doterra: true })}>Chcem účet doTERRA</div>
                                        <div className="item" style={!this.state.doterra ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ doterra: false })}>Nechcem účet doTERRA</div>
                                    </div>

                                    {this.state.doterra ? (
                                            <div className="text">
                                                Zadajte svoj dátum narodenia a my Vám vytvoríme Váš doTERRA účet a dáme Vám 25% zľavu na Váš nákup doTERRA produktov.
                                        </div>
                                    ) : null}
                                    {this.state.doterra ? <input className="field" type="text" required value={this.state.birth} placeholder="Dátum narodenia" onChange={(event) => this.setState({ birth: event.target.value})} /> : null}
                                </div>
                            ) : null}

                            <div className="button-filled" id="checkout-button-next" onClick={() => this.goToPayment()}>Prejsť na platbu</div>
                        </div>
                    )}
                </div>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.popupTitle}
                        loading={this.state.popupLoading}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Checkout);
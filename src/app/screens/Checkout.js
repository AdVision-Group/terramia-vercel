import React from "react";
import { Link, withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, getStorageItem, removeStorageItem } from "../config/config";
import Api from "../config/Api";

import Banner from "../components/Banner";

import Loading from "../components/Loading";
import CheckoutForm from "../components/CheckoutForm";

import "../styles/checkout.css";
import { timers } from "jquery";
import Popup from "../components/Popup";
import Summary from "../components/Summary";

import { showTransition, hideTransition } from "../components/Transition";

const promise = loadStripe("pk_test_51Hc5rMFGDIXHKcdbAeI9FeG5b2rAXAu6ATFBsoxB3bBCA7ajJ8UhroPzGVq3eOBDtKqRxVNMr4wKPFnP9zP8Zkts00jnc80SNN");

class Checkout extends React.Component {

    state = {
        popup: false,
        message: "Všetky polia musia byť vyplnené",
        loading: true,

        name: "",
        email: "",
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: "",

        company: false,
        companyData: {
            name: "",
            ico: "",
            dic: "",
            icdph: "",
            address: "",
            psc: "",
            city: "",
            country: ""
        },

        totalPrice: 0,
        totalPoints: 0
    }

    constructor() {
        super();

        this.autofill = this.autofill.bind(this);
        this.getTotalPoints = this.getTotalPoints.bind(this);
        this.saveDataAndContinue = this.saveDataAndContinue.bind(this);
    }

    async saveDataAndContinue() {
        this.setState({ popup: true, loading: true });

        const orderData = getStorageItem("order");

        const { name, email, phone, address, psc, city, country, company, companyData } = this.state;

        if (name.trim() === "" || email.trim() === "" || phone.trim() === "" || address.trim() === "" || psc.trim() === "" || city.trim() === "" || country.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        if (name.length < 6) {
            this.setState({ loading: false, message: "Meno musí byť dlhšie ako 6 znakov" });
            return;
        }

        if (email.length < 6) {
            this.setState({ loading: false, message: "Email musí byť dlhší ako 6 znakov" });
            return;
        }

        if (phone.length < 6) {
            this.setState({ loading: false, message: "Telefónne číslo musí byť dlhšie ako 6 znakov" });
            return;
        }

        if (address.length < 6) {
            this.setState({ loading: false, message: "Adresa musí byť dlhšia ako 6 znakov" });
            return;
        }

        if (psc.length < 6) {
            this.setState({ loading: false, message: "PSČ musí byť dlhšie ako 6 znakov" });
            return;
        }

        if (city.length < 6) {
            this.setState({ loading: false, message: "Mesto musí byť dlhšie ako 6 znakov" });
            return;
        }

        if (country.length < 6) {
            this.setState({ loading: false, message: "Krajina musí byť dlhšia ako 6 znakov" });
            return;
        }

        if (company && (companyData.name.trim() === "" || companyData.ico.trim() === "" || companyData.dic.trim() === "" || companyData.icdph.trim() === "" || companyData.address.trim() === "" || companyData.psc.trim() === "" || companyData.city.trim() === "" || companyData.country.trim() === "")) {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        const token = getStorageItem("token");

        if (token) {
            var data = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                psc: psc.trim(),
                city: city.trim(),
                country: country.trim()
            }

            if (company) data["company"] = {
                name: companyData.name.trim(),
                ico: companyData.ico.trim(),
                dic: companyData.dic.trim(),
                icdph: companyData.icdph.trim(),
                address: companyData.address.trim(),
                psc: companyData.psc.trim(),
                city: companyData.city.trim(),
                country: companyData.country.trim()
            };

            const call = await Api.editUser(data, token);

            if (call.message === "Records updated successfully") {
                const getUser = await Api.getUser(token);

                if (getUser.user) {
                    const order = {
                        ...orderData,
                        userId: getUser.user._id,
                        buyingAsCompany: company
                    }

                    setStorageItem("order", order);

                    if (getUser.user.registeredInDoTerra) {
                        this.props.history.push("/doprava-a-platba");
                    } else {
                        if (orderData.totalPoints >= 100) {
                            this.props.history.push("/ziskajte-25-percentnu-zlavu");
                        } else {
                            this.props.history.push("/doprava-a-platba");
                        }
                    }
                } else {
                    this.setState({
                        loading: false,
                        message: "Server neodpovedá, skúste to znovu neskôr prosím"
                    });
        
                    return;
                }
            } else {
                this.setState({
                    loading: false,
                    message: "Skontrolujte si zadané údaje, niektoré nemusia byť správne"
                });
    
                return;
            }
        } else {
            var tempUser = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                psc: psc.trim(),
                city: city.trim(),
                country: country.trim()
            }

            if (company) tempUser["company"] = {
                name: companyData.name.trim(),
                ico: companyData.ico.trim(),
                dic: companyData.dic.trim(),
                icdph: companyData.icdph.trim(),
                address: companyData.address.trim(),
                psc: companyData.psc.trim(),
                city: companyData.city.trim(),
                country: companyData.country.trim()
            };

            var order = {
                ...orderData,
                tempUser: tempUser,
                buyingAsCompany: company
            }

            setStorageItem("order", order);
            
            if (orderData.totalPoints >= 100) {
                this.props.history.push("/ziskajte-25-percentnu-zlavu");
            } else {
                this.props.history.push("/doprava-a-platba");
            }
        }
    }

    async autofill() {
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
                });

                if (user.company && Object.keys(user.company).length > 0) {
                    this.setState({ companyData: user.company });
                }
            }
        }

        hideTransition();
    }

    async componentDidMount() {
        showTransition();

        await this.autofill();

        const totalPoints = await this.getTotalPoints();
        this.setState({ totalPoints: totalPoints });

        hideTransition();
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
                    <title>Fakturačné údaje | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                <div className="content">
                    <div className="body">
                        <div className="heading">Fakturačné údaje</div>

                        <div className="section">
                            <div className="heading">Osobné údaje</div>

                            <div className="row">
                                <div className="item">
                                    <div className="heading">Meno a priezvisko</div>
                                    <input className="field" type="text" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} placeholder="Meno a priezvisko" />
                                </div>

                                <div className="item">
                                    <div className="heading">E-mail</div>
                                    <input className="field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="E-mail" />
                                </div>

                                <div className="item">
                                    <div className="heading">Telefónne číslo</div>
                                    <input className="field" type="text" value={this.state.phone} onChange={(event) => this.setState({ phone: event.target.value })} placeholder="Telefónne číslo" />
                                </div>
                            </div>
                        </div>

                        <div style={{ height: 60 }} />

                        <div className="section">
                            <div className="heading">Fakturačné údaje</div>
                            
                            <div className="row">
                                <div className="item">
                                    <div className="heading">Ulica</div>
                                    <input className="field" type="text" value={this.state.address} onChange={(event) => this.setState({ address: event.target.value })} placeholder="Ulica" />
                                </div>

                                <div className="item">
                                    <div className="heading">PSČ</div>
                                    <input className="field" type="text" value={this.state.psc} onChange={(event) => this.setState({ psc: event.target.value })} placeholder="PSČ" />
                                </div>

                                <div className="item">
                                    <div className="heading">Mesto</div>
                                    <input className="field" type="text" value={this.state.city} onChange={(event) => this.setState({ city: event.target.value })} placeholder="Mesto" />
                                </div>

                                <div className="item">
                                    <div className="heading">Krajina</div>
                                    <input className="field" type="text" value={this.state.country} onChange={(event) => this.setState({ country: event.target.value })} placeholder="Krajina" />
                                </div>
                            </div>
                        </div>

                        <div style={{ height: 60 }} />

                        <div className="section">
                            <div className="heading">
                                Objednávka na firmu
                                <div style={{ flex: 1 }} />
                                <div className="item" onClick={() => this.setState({ company: true })} style={this.state.company ? { backgroundColor: "#A161B3", color: "white" } : null}>Áno</div>
                                <div style={{ width: 10 }} />
                                <div className="item" onClick={() => this.setState({ company: false })} style={!this.state.company ? { backgroundColor: "#A161B3", color: "white" } : null}>Nie</div>
                            </div>
                            
                            {this.state.company &&
                            <div className="row">
                                <div className="item">
                                    <div className="heading">Názov firmy</div>
                                    <input className="field" type="text" value={this.state.companyData.name} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, name: event.target.value } }))} placeholder="Názov firmy" />
                                </div>

                                <div className="item">
                                    <div className="heading">IČO</div>
                                    <input className="field" type="text" value={this.state.companyData.ico} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, ico: event.target.value } }))} placeholder="IČO" />
                                </div>

                                <div className="item">
                                    <div className="heading">DIČ</div>
                                    <input className="field" type="text" value={this.state.companyData.dic} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, dic: event.target.value } }))} placeholder="DIČ" />
                                </div>

                                <div className="item">
                                    <div className="heading">IČDPH</div>
                                    <input className="field" type="text" value={this.state.companyData.icdph} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, icdph: event.target.value } }))} placeholder="IČDPH" />
                                </div>

                                <div className="item">
                                    <div className="heading">Ulica</div>
                                    <input className="field" type="text" value={this.state.companyData.address} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, address: event.target.value } }))} placeholder="Ulica" />
                                </div>

                                <div className="item">
                                    <div className="heading">PSČ</div>
                                    <input className="field" type="text" value={this.state.companyData.psc} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, psc: event.target.value } }))} placeholder="PSČ" />
                                </div>

                                <div className="item">
                                    <div className="heading">Mesto</div>
                                    <input className="field" type="text" value={this.state.companyData.city} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, city: event.target.value } }))} placeholder="Mesto" />
                                </div>

                                <div className="item">
                                    <div className="heading">Krajina</div>
                                    <input className="field" type="text" value={this.state.companyData.country} onChange={(event) => this.setState((state) => ({ companyData: { ...state.companyData, country: event.target.value } }))} placeholder="Krajina" />
                                </div>
                            </div>
                            }
                        </div>
                    </div>

                    <Summary
                        onContinue={() => this.saveDataAndContinue()}
                    />
                </div>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Checkout);
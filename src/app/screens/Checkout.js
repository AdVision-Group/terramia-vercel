import React from "react";
import { Link, withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { isLogged, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Loading from "../components/Loading";
import CheckoutForm from "../components/CheckoutForm";

import "../styles/checkout.css";

const promise = loadStripe("pk_test_51HizHLDe4E0hIPO5AyorGcJoePu3x9ej7Vg2uDTACZn4GriE52RIvC77OS7jqZGMiBdKvVbVCHniMjUtcqULe2j000E1Gf9a77");

class Checkout extends React.Component {

    state = {
        offset: 0,

        loading: true,

        name: "",
        email: "",
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: ""
    }

    constructor() {
        super();

        this.autofill = this.autofill.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }

    async createOrder() {
        const { user } = this.state
        const { name, email, phone, address, psc, city, country } = this.state

        const cart = getStorageItem("cart")
        var ids = []

        // create an array of cart product ids
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].amount > 1) {
                for (let j = 0; j < cart[i].amount; j++) {
                    ids.push(cart[i]._id);
                }
            } else {
                ids.push(cart[i]._id);
            }
        }

        var order = null;

        if (!user) {
            const temp = await Api.tempUser({
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                psc: psc,
                country: country
            });

            if (temp.message === "Temporary user created successfully") {
                order = await Api.createOrder(ids, temp.id, "temp", null)
            } else {
                console.log("ERROR temp user")
            }
        } else {
            const user = getStorageItem("user")
            const token = getStorageItem("token")
            order = await Api.createOrder(ids, null, "logged", token)
        }

        if (order.message === "New order created successfully") {
            const orderId = order.orderId;
            this.props.history.push("/platba-" + orderId)
        }
    }

    async autofill() {
        this.setState({ loading: true })

        const token = getStorageItem("token")
        const getUser = await Api.getUser(token)
        const user = getUser.user

        if (user) {
            this.setState({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                psc: user.psc,
                city: user.city,
                country: user.country
            })
        }

        this.setState({ loading: false });
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        this.autofill()
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
            <div className="screen" id="checkout">
                <Header />

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Fakturačné údaje</div>
                    <div className="description">
                        Prihláste sa a nakupujte výhodnejšie. Vaše fakturačné údaje sa vyplnia automaticky.
                    </div>
                    {!getStorageItem("token") ? <div id="checkout-button-login" className="button-filled">Prihlásiť sa</div> : null}

                    {this.state.loading ? <Loading /> : (
                        <div className="content" style={{ padding: 0 }}>
                            <input className="field" type="text" required value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value})} />
                            <br />
                            <input className="field" type="text" required value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />
                            <input className="field" type="text" required value={this.state.phone} placeholder="Telefónne číslo" onChange={(event) => this.setState({ phone: event.target.value})} />
                            <br />
                            <input className="field" type="text" required value={this.state.address} placeholder="Adresa a číslo domu" onChange={(event) => this.setState({ address: event.target.value})} />
                            <input className="field" type="text" required value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value})} />
                            <input className="field" type="text" required value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value})} />
                            <input className="field" type="text" required value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value})} />
                        
                            <div className="button-filled" id="checkout-button-next" onClick={() => this.createOrder()}>Prejsť na platbu</div>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Checkout);
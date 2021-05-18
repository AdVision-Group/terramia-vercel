import React from "react";
import { Link, withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, removeStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";

import CheckoutForm from "../components/CheckoutForm";

import Banner from "../components/Banner";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

import "../styles/paymentold.css";

const promise = loadStripe("pk_live_51HrnXkAeUp0KWc2H8PIYeKHCbVq9oOQttDTGoMmHWgYLnnaZRMl16RHnHTohmfHCnFibyyP8y0DKkx5HxcEnw5iI006IZDTVLh");

class Payment extends React.Component {

    state = {
        offset: 0,

        products: [],

        onlyDoTerraProducts: true,

        price: 0,
        discount: 0,
        delivery: 0,

        pickup: false,
        payment: "card",

        loading: false,
        processing: false,

        banner: false
    }

    constructor() {
        super();

        this.skipPayment = this.skipPayment.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.loadData = this.loadData.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    async skipPayment() {
        const orderId = await this.createOrder();
        const token = getStorageItem("token");

        const pay = await Api.skipPayment(orderId, token);

        if (pay.message === "Payment skipped successfully") {
            this.redirect();
        }
    }

    async createOrder() {
        this.setState({ processing: true });

        const token = getStorageItem("token");
        const temp = getStorageItem("temp");
        const doterra = getStorageItem("doterra");
        const birthDate = getStorageItem("birthDate");
        const cart = getStorageItem("cart");
        const company = getStorageItem("company");

        var ids = []

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

        if (temp) {
            const tempUser = await Api.tempUser({
                name: temp.name,
                email: temp.email,
                phone: temp.phone,
                address: temp.address,
                city: temp.city,
                psc: temp.psc,
                country: temp.country
            });

            const orderData = {
                products: ids,
                tempId: tempUser.id,
                applyDiscount: false,
                buyingAsCompany: false,
                shouldDeliver: !this.state.pickup,
            }

            if (doterra) {
                orderData["applyDiscount"] = true;
                orderData["birthDate"] = birthDate;
            }

            if (company) {
                orderData["buyingAsCompany"] = true;
            }

            order = await Api.createOrder(orderData, "temp");
        } else {
            const orderData = {
                products: ids,
                applyDiscount: false,
                buyingAsCompany: false,
                shouldDeliver: !this.state.pickup,
                token: token
            }

            if (doterra) {
                orderData["applyDiscount"] = true;
                orderData["birthDate"] = birthDate;
            }

            if (company) {
                orderData["buyingAsCompany"] = true;
            }

            order = await Api.createOrder(orderData, "logged");
        }

        removeStorageItem("company");
        removeStorageItem("temp");
        removeStorageItem("doterra");
        removeStorageItem("birthDate");

        this.setState({ processing: false });
        return order.orderId;
    }

    async loadData() {
        //this.setState({ loading: true });

        const doterra = getStorageItem("doterra");

        const cart = getStorageItem("cart");

        var products = [];
        var price = 0;
        var discount = 0;
        var points = 0;
        
        for (let i = 0; i < cart.length; i++) {
            const id = cart[i]._id;
            const amount = cart[i].amount;

            const product = await Api.getProduct(id);
            
            if (product.product) {
                products.push({
                    ...product.product,
                    amount: amount
                });

                if (!product.product.isDoTerraProduct) this.setState({ onlyDoTerraProducts: false, payment: "cash" });

                price += (product.product.price / 100).toFixed(2) * amount;
                
                if (doterra) {
                    discount -= (product.product.price * amount / 100 * 0.25).toFixed(2);
                }
                
                points += product.product.points * amount;
            }
        }

        var delivery = 0;

        if (!this.state.pickup) {
            if (doterra) {
                delivery = 8.4;
            } else {
                if (points >= 100) {
                    delivery = 0;
                } else {
                    delivery = 7;
                }
            }
        }

        this.setState({
            products: products,
            price: price,
            discount: discount,
            delivery: delivery,
            //loading: false
        })
    }

    redirect() {
        this.props.history.push("/uspech");
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return(
            <div className="screen" id="payment">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Platba</title>
                </Helmet>

                {this.state.processing ? (
                    <Popup
                        type="info"
                        title={""}
                        loading={true}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Súhrn a platba</div>
                    <p className="description">
                        Prihláste sa a nakupujte výhodnejšie. Vaše fakturačné údaje sa vyplnia automaticky.
                    </p>

                    {this.state.loading ? <Loading /> : (
                        <table className="summary">
                            <tr>
                                <td style={{ backgroundColor: "#A161B3", color: "white" }}>Názov</td>
                                <td style={{ backgroundColor: "#A161B3", color: "white" }}>Fotka</td>
                                <td style={{ backgroundColor: "#A161B3", color: "white" }}>Počet</td>
                                <td style={{ backgroundColor: "#A161B3", color: "white" }}>Cena za kus</td>
                                <td style={{ backgroundColor: "#A161B3", color: "white" }}>Cena dokopy</td>
                            </tr>

                            {this.state.products.map((product) => <Product product={product} />)}

                            {getStorageItem("doterra") ? (
                                <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
                                    <td>doTERRA zľava</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                <td style={{ textAlign: "right" }}>{this.state.discount.toFixed(2)}€</td>
                            </tr>
                            ) : null}

                            <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
                                <td style={{ textAlign: "left" }}>Doprava</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "right" }}>{this.state.delivery.toFixed(2)}€</td>
                            </tr>

                            {this.state.payment === "cash" && !this.state.pickup ? (
                                <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
                                    <td style={{ textAlign: "left" }}>Dobierka</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                <td style={{ textAlign: "right" }}>2.00€</td>
                            </tr>
                            ) : null}

                            <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
                                <td style={{ textAlign: "left" }}>Spolu</td>
                                <td></td>
                                <td style={{ textAlign: "center" }}></td>
                                <td></td>
                                <td style={{ textAlign: "right" }}>{(this.state.price + this.state.discount + this.state.delivery + (this.state.payment === "cash" && !this.state.pickup ? 2 : 0)).toFixed(2)}€</td>
                            </tr>
                        </table>
                    )}

                    <p className="description">
                        Po platbe kartou Vám bude tovar doručený kuriérom DPD. Kuriér Vás bude telefonicky kontaktovať ohľadne času doručenia na zvolenú adresu,
                    </p>

                    <div className="payment-choice">
                        {this.state.onlyDoTerraProducts ? <div className="item" style={this.state.payment === "card" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ payment: "card" })}>Platba kartou</div> : null}
                        {!getStorageItem("doterra") ? <div className="item" style={this.state.payment === "cash" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ payment: "cash" })}>Dobierka</div> : null}
                    </div>

                    <div className="payment-choice">
                        <div className="item" style={!this.state.pickup ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ pickup: false }, () => this.loadData())}>Doprava kuriérom</div>
                        {!getStorageItem("doterra") ? <div className="item" style={this.state.pickup ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ pickup: true }, () => this.loadData())}>Osobný odber</div> : null}
                    </div>

                    {this.state.payment === "card" ? (
                        <Elements stripe={promise} style={{ width: "100%" }}>
                            <CheckoutForm createOrder={this.createOrder} redirect={this.redirect} />
                        </Elements>
                    ) : <div className="button-filled" style={{ marginTop: 50 }} onClick={() => this.skipPayment()}>Dokončiť objednávku</div>}

                    {this.state.banner && getStorageItem("doterra") === false ? (
                        <Banner
                            title="Chcete produkty doTERRA kúpiť s 25% zľavou a získať ďalšie darčeky?"
                            text="Otvorte si vlastný účet doTERRA a získavajte pravidelné výhody podľa vášho výberu a nakupujte produkty doTERRA oveľa výhodnejšie!"
                            button="Otvorenie účtu v doTERRA"
                            url="https://www.mydoterra.com/Application/index.cfm?EnrollerID=756332"
                            closeBanner={this.closeBanner}
                        />
                    ) : null}
                </div>
            </div>
        )
    }
}

function Product(props) {
    const product = props.product;
    const src = API_URL + "/uploads/" + product.imagePath;

    return(
        <tr className="product">
            <td className="product-td">{product.name}</td>
            <td className="product-td" style={{ textAlign: "center" }}><img className="image" src={src} /></td>
            <td className="product-td" style={{ textAlign: "center" }}>{product.amount}x</td>
            <td className="product-td" style={{ textAlign: "right" }}>{(product.price / 100).toFixed(2)}€</td>
            <td className="product-td" style={{ textAlign: "right" }}>{((product.amount / 100) * product.price).toFixed(2)}€</td>
        </tr>
    )
}

export default withRouter(Payment);
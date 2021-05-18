import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, removeStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";

import CheckoutForm from "../components/CheckoutForm";

import Banner from "../components/Banner";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import Summary from "../components/Summary";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/confirm.css";
import PaymentPanel from "../components/PaymentPanel";

class Confirm extends React.Component {

    state = {
        user: {},
        order: {},
        products: [],

        popup: false,
        message: "",
        loading: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.payWithCash = this.payWithCash.bind(this);
    }

    async loadData() {
        const orderData = getStorageItem("order");

        var user = null;
        var order = null;

        if (orderData.userId) {
            const token = getStorageItem("token");

            if (token) {
                const call = await Api.getUser(token);

                if (call.user) {
                    user = call.user;
                }
            }
        } else if (orderData.tempUser) {
            user = orderData.tempUser;
        }

        order = {
            deliveryType: orderData.deliveryType,
            paymentType: orderData.paymentType,

            totalPrice: orderData.totalPrice,
            totalPoints: orderData.totalPoints,

            applyDiscount: orderData.applyDiscount || null,
            totalDiscount: orderData.totalDiscount || 0,

            buyingAsCompany: orderData.buyingAsCompany
        }

        const cart = getStorageItem("cart");

        var products = [];

        for (let i = 0; i < cart.length; i++) {
            var product = await Api.getProduct(cart[i]._id);

            if (product.product) {
                products.push({
                    product: product.product,
                    amount: cart[i].amount
                });
            }
        }

        this.setState({
            user: user,
            order: order,
            products: products
        });
    }

    async createOrder() {
        const orderData = getStorageItem("order");
        const cart = getStorageItem("cart");
        const token = getStorageItem("token");

        var products = [];
        var userId = null;
        var applyDiscount = orderData.dateOfBirth ? true : false;

        if (orderData.tempUser && !orderData.userId) {
            const createTempUser = await Api.tempUser(orderData.tempUser);
            console.log(createTempUser);

            if (createTempUser.id) {
                userId = createTempUser.id;
            } else {
                this.setState({
                    loading: false,
                    message: "Server nereaguje, skúste znovu neskôr prosím"
                });

                return;
            }
        }

        for (let i = 0; i < cart.length; i++) {
            for (let j = 0; j < cart[i].amount; j++) {
                products.push(cart[i]._id);
            }
        }

        var order = {
            products: products,
            buyingAsCompany: orderData.buyingAsCompany,
            applyDiscount: applyDiscount
        }

        if (userId) order["userId"] = userId;
        if (applyDiscount) order["birthDate"] = orderData.dateOfBirth;
        if (orderData.deliveryType.value === "courier") {
            order["shouldDeliver"] = true;
        } else if (orderData.deliveryType.value === "pickup") {
            order["shouldDeliver"] = false;
        }

        const createOrder = await Api.createOrder(order, userId ? null : token);

        if (createOrder.orderId) return createOrder.orderId;

        return null;
    }

    async payWithCash() {
        this.setState({ popup: true, loading: true });

        const orderId = await this.createOrder();

        if (!orderId) {
            this.setState({
                loading: false,
                message: "Server nereaguje, skúste znovu neskôr prosím"
            });

            return;
        }

        const createPayment = await Api.skipPayment({
            orderId: orderId
        });

        if (createPayment.message === "Payment skipped successfully") {
            setStorageItem("cart", []);
            this.props.history.push("/dakujeme-za-objednavku");
        } else {
            this.setState({
                loading: false,
                message: "Server nereaguje, skúste znovu neskôr prosím"
            });
        }
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        hideTransition();
    }

    render() {
        const order = getStorageItem("order");

        return(
            <div className="screen" id="confirm">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Potvrdenie objednávky | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                <div className="content">
                    <div className="body">
                        <div className="heading">Potvrdenie objednávky</div>

                        <div className="section">
                            <div className="heading">Osobné údaje</div>

                            <div className="grid">
                                <div className="label">Meno a priezvisko</div>
                                <div className="value">{this.state.user.name}</div>

                                <div className="label">E-mail</div>
                                <div className="value">{this.state.user.email}</div>

                                <div className="label">Telefónne číslo</div>
                                <div className="value">{this.state.user.phone}</div>

                                <div className="label">Adresa</div>
                                <div className="value">{this.state.user.address}</div>

                                <div className="label">PSČ</div>
                                <div className="value">{this.state.user.psc}</div>

                                <div className="label">Mesto</div>
                                <div className="value">{this.state.user.city}</div>

                                <div className="label">Krajina</div>
                                <div className="value">{this.state.user.country}</div>
                            </div>
                        </div>

                        {this.state.order.buyingAsCompany &&
                        <div className="section" style={{ marginTop: 50 }}>
                            <div className="heading">Objednávka na firmu</div>

                            <div className="grid">
                                <div className="label">Názov firmy</div>
                                <div className="value">{this.state.user.company.name}</div>

                                <div className="label">IČO</div>
                                <div className="value">{this.state.user.company.ico}</div>

                                <div className="label">DIČ</div>
                                <div className="value">{this.state.user.company.dic}</div>

                                <div className="label">IČDPH</div>
                                <div className="value">{this.state.user.company.icdph}</div>

                                <div className="label">Adresa</div>
                                <div className="value">{this.state.user.company.address}</div>

                                <div className="label">PSČ</div>
                                <div className="value">{this.state.user.company.psc}</div>

                                <div className="label">Mesto</div>
                                <div className="value">{this.state.user.company.city}</div>

                                <div className="label">Krajina</div>
                                <div className="value">{this.state.user.company.country}</div>
                            </div>
                        </div>
                        }

                        <div style={{ height: 50 }} />

                        <div className="section">
                            <div className="heading">Produkty</div>

                            <div className="products">
                               {this.state.products.map(product => <Item product={product} />)}
                            </div>
                        </div>

                        <div style={{ height: 50 }} />

                        <div className="section">
                            <div className="heading">Súhrn</div>

                            <div className="grid">
                                <div className="label">Produkty</div>
                                <div className="value">{(this.state.order.totalPrice / 100).toFixed(2)}</div>

                                <div className="label">Spôsob dopravy</div>
                                <div className="value">{this.state.order.deliveryType ? this.state.order.deliveryType.name + " (" + (this.state.order.deliveryType.price / 100).toFixed(2) + "€)" : "-"}</div>

                                <div className="label">Spôsob platby</div>
                                <div className="value">{this.state.order.paymentType ? this.state.order.paymentType.name + " (" + (this.state.order.paymentType.price / 100).toFixed(2) + "€)" : "-"}</div>

                                {this.state.order.applyDiscount ?
                                    this.state.order.applyDiscount === true ?
                                        <div className="label">Zľava 25%</div>
                                    :
                                        null
                                : null}

                                {this.state.order.applyDiscount ?
                                    this.state.order.applyDiscount === true ?
                                    <div className="value">{this.state.order.totalDiscount ? (this.state.order.totalDiscount / 100).toFixed(2) + "€" : "-"}</div>
                                    :
                                        null
                                : null}

                                <div className="label" style={{ marginTop: 20 }}>Celková suma</div>
                                <div className="value" style={{ marginTop: 20 }}>{this.state.order.deliveryType && this.state.order.paymentType ? ((this.state.order.totalPrice + this.state.order.deliveryType.price + this.state.order.paymentType.price + this.state.order.totalDiscount) / 100).toFixed(2) + "€" : ""}</div>
                            </div>
                        </div>
                    </div>

                    <PaymentPanel
                        order={this.state.order}
                        onClick={() => this.payWithCash()}
                        createOrder={this.createOrder}
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

function Item(props) {
    const src = API_URL + "/uploads/" + props.product.product.imagePath;

    return(
        <Link className="product" to={"/e-shop/" + props.product.product.link}>
            <img className="image" src={src} loading="lazy" />

            <h3 className="name">{props.product.product.name}</h3>

            <div className="amount">{props.product.amount}x</div>

            <div className="amount">{props.product.product.points ? props.product.product.points + "b" : "-"}</div>

            <div className="price">{(props.product.product.price / 100).toFixed(2)}€</div>

            <div className="total">{(props.product.product.price / 100 * props.product.amount).toFixed(2)}€</div>
        </Link>
    )
}

export default withRouter(Confirm);
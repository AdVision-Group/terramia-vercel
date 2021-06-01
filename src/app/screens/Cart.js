import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";
import Banner from "../components/Banner";
import Popup from "../components/Popup";

import Summary from "../components/Summary";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/cart.css";
import { get, timers } from "jquery";

class Cart extends React.Component {

    state = {
        products: [],

        totalPoints: 0,
        totalPrice: 0,

        couponCode: "",
        couponDiscount: 0,
        
        banner: false,

        popup: false,
        message: "",
        loading: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
        this.evaluateCoupon = this.evaluateCoupon.bind(this);
        this.calculateCouponDiscount = this.calculateCouponDiscount.bind(this);
    }

    async loadData() {
        const currentCart = getStorageItem("cart");

        var products = [];
        var totalPoints = 0;
        var totalPrice = 0;

        var terramiaProductCount = 0;
        var doterraProductCount = 0;

        var productsType = "";
        var containsPack = false;

        const packData = { type: 4, category: 1 };

        for (let i = 0; i < currentCart.length; i++) {
            if (currentCart[i]._id != null && currentCart[i].amount != null && currentCart[i].points != null) {
                const getProduct = await Api.getProduct(currentCart[i]._id);

                if (getProduct.product && getProduct.product.available) {
                    products.push({
                        product: getProduct.product,
                        amount: currentCart[i].amount
                    });

                    totalPoints += getProduct.product.points * currentCart[i].amount;
                    totalPrice += getProduct.product.price * currentCart[i].amount;

                    if (getProduct.product.isDoTerraProduct) {
                        doterraProductCount += 1;
                    } else {
                        terramiaProductCount += 1;
                    }

                    if (getProduct.product.type === packData.type && getProduct.product.category === packData.category) containsPack = true;
                }
            }
        }

        if (terramiaProductCount > 0 && doterraProductCount > 0) productsType = "mixed";
        if (terramiaProductCount > 0 && doterraProductCount === 0) productsType = "terramia";
        if (terramiaProductCount === 0 && doterraProductCount > 0) productsType = "doterra";

        const orderData = {
            totalPoints: totalPoints,
            totalPrice: totalPrice,

            productsType: productsType,
            containsPack: containsPack
        }

        setStorageItem("order", orderData);

        this.setState({
            products: products,
            totalPoints: totalPoints
        });
    }

    async evaluateCoupon() {
        this.setState({ popup: true, loading: true });

        const { couponCode } = this.state;

        if (couponCode.trim() === "") {
            this.setState({ popup: false });
            return;
        }

        const call = await Api.getCoupon(couponCode.trim());

        if (call.coupon) {
            const orderData = getStorageItem("order");

            const couponDiscount = this.calculateCouponDiscount(call.coupon);

            var order = {
                ...orderData,
                coupon: call.coupon,
                couponDiscount: couponDiscount
            }

            setStorageItem("order", order);

            this.setState({
                loading: false,
                message: "Kupón úspešne pridaný",
                couponCode: "",

                couponDiscount: couponDiscount
            });
        } else {
            this.setState({
                loading: false,
                message: "Zadaný kupón neexistuje"
            });
        }
    }

    calculateCouponDiscount(coupon) {
        const orderData = getStorageItem("order");
        var discount = 0;

        if (coupon.type === "flat") {
            discount = -coupon.value;
        } else if (coupon.type === "percentage") {
            discount = orderData.totalPrice * (coupon.value / 100);
        }

        return discount;
    }

    async changeAmount(product, action) {
        var cart = getStorageItem("cart");

        for (let i = 0; i < cart.length; i++) {
            if (cart[i]._id === product._id) {
                if (cart[i].amount + action <= 0) {
                    cart.splice(i, 1);
                } else {
                    cart[i].amount = cart[i].amount + action;
                }

                break
            }
        }

        setStorageItem("cart", cart);

        showTransition();
        await this.loadData();
        hideTransition();
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        hideTransition();

        setTimeout(() => {
            this.setState({ banner: true });
        }, 2000);
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    render() {
        const products = this.state.products;

        return(
            <div className="screen" id="cart">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Košík | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                <div className="content">
                    <div className="body">
                        <div className="heading">Košík</div>

                        {products.length === 0 ?
                            <div className="empty-panel">
                                <div className="message">Košík je prázdny</div>
                                <Link className="button-filled" to="/e-shop">Nakupovať</Link>
                            </div>
                        :
                            <div className="products">
                                <div className="header">
                                    <div className="item">Fotka</div>
                                    <div className="item">Názov</div>
                                    <div className="item">Počet</div>
                                    <div className="item">Cena</div>
                                    <div className="item">Dokopy</div>
                                </div>

                                {products.map(product => <Item product={product} changeAmount={this.changeAmount} />)}

                                <Link className="button-outline" to="/e-shop" style={{ marginTop: 30, alignSelf: "flex-start" }}>Nakupovať</Link>
                            </div>
                        }

                        {/*
                        <div className="coupon-panel">
                            <div className="heading">Zľavový kupón</div>

                            <div className="input-panel">
                                <input className="field" type="text" value={this.state.couponCode} onChange={(event) => this.setState({ couponCode: event.target.value.trim() })} placeholder="Zľavový kupón" />
                                <div className="button-filled" onClick={() => this.evaluateCoupon()}>Použiť</div>
                            </div>
                        </div>
                        */}
                    </div>

                    <Summary
                        onContinue={() => this.props.history.push("/fakturacne-udaje")}
                    />
                </div>

                {this.state.banner ? (
                    <Banner
                        title={this.state.totalPoints > 100 ? "Získaj zľavu 25% na celý nákup vďaka tvojmu nákupu nad 100 bodov" : "Nakúp ešte za " + (100 - this.state.totalPoints) + " bodov a získaj 25% zľavu"}
                        text={this.state.totalPoints > 100 ? "Otvorte si účet v doTERRA a získajte 25% zľavu na celý nákup." : "Ak nakúpite produkty ešte za " + (100 - this.state.totalPoints) + " bodov, získate možnosť OTVORENIA ÚČTU v doTERRA a dostanete 25% zľavu na Váš nákup"}
                        button={this.state.totalPoints > 100 ? "Zisti viac" : "Nakupovať"}
                        location={this.state.totalPoints > 100 ? "/sutaz-o-vstupny-balicek" : "/e-shop"}
                        image={this.state.totalPoints > 100 ? require("../assets/nakupil-si-za-100-bodov.png") : require("../assets/nakup-este-za-x-bodov.png")}
                        closeBanner={this.closeBanner}
                    />
                ) : null}

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
        <div className="product">
            <img className="image" src={src} loading="lazy" />

            <h3 className="name">
                {props.product.product.name}
                <br />
                <div className="points">{props.product.product.points} bodov</div>
            </h3>

            <div className="controls">
                <div className="button" onClick={() => props.changeAmount(props.product.product, -1)}>-</div>
                <div className="amount">{props.product.amount}</div>
                <div className="button" onClick={() => props.changeAmount(props.product.product, 1)}>+</div>
            </div>

            <div className="price">{(props.product.product.price / 100).toFixed(2)}€</div>

            <div className="total">{(props.product.product.price / 100 * props.product.amount).toFixed(2)}€</div>
        </div>
    )
}

export default withRouter(Cart);
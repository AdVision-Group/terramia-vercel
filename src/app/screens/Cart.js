import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, setStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";
import Banner from "../components/Banner";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/cart.css";

class Cart extends React.Component {

    state = {
        offset: 0,

        cart: [],
        products: [],
        totalPoints: 0,
        
        banner: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.getTotalPoints = this.getTotalPoints.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
    }

    async loadData() {
        const cart = this.state.cart;
        var products = [];
        var totalPoints = 0

        for (let i = 0; i < cart.length; i++) {
            var product = await Api.getProduct(cart[i]._id);

            if (product.message === "Retrieved successfully") {
                products.push({
                    product: product.product,
                    amount: cart[i].amount
                });

                totalPoints += product.product.points * cart[i].amount;
            }
        }

        this.setState({ products: products, totalPoints: totalPoints });
    }

    changeAmount(product, action) {
        const cart = this.state.cart;

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

        window.location.reload();
        setStorageItem("cart", cart);
    }

    componentDidMount() {
        this.loadData();

        setTimeout(() => {
            this.setState({ banner: true });
        }, 2000);
    }
    
    componentDidUpdate() {
        const cart = getStorageItem("cart");

        if (cart.length !== this.state.cart.length) {
            this.setState({ cart: cart }, () => {
                this.loadData();
            })
        }
    }

    getTotalPoints() {
        const cart = getStorageItem("cart");
        var points = 0;

        for (let i = 0; i < cart.length; i++) {
            points += cart[i].points * cart[i].amount;
        }

        return points;
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
                    <title>TerraMia | Košík</title>
                </Helmet>

                <div className="content">
                    <div className="title">Košík</div>

                    {products.length === 0 ? <div className="empty-message">Košík je prázdny</div> : null}

                    {products.map((product) => <CartItem product={product} changeAmount={this.changeAmount} /> )}

                    <div className="button-panel">
                        {products.length === 0 ? <Link className="button-filled" to="/e-shop">Začnite nakupovať</Link> : null}

                        {products.length !== 0 ? <Link className="button-outline" to="/e-shop">Pokračovať v nákupe</Link> : null}
                        {products.length !== 0 ? <Link className="button-filled" to={{ pathname: "/fakturacne-udaje", state: { totalPoints: this.state.totalPoints }}}>Prejsť ku platbe</Link> : null}
                    </div>
                </div>

                {this.state.banner ? (
                    <Banner
                        title={this.getTotalPoints() > 100 ? "Získaj zľavu 25% na celý nákup vďaka tvojmu nákupu nad 100 bodov" : "Nakúp ešte za " + (100 - this.getTotalPoints()) + " bodov a získaj 25% zľavu"}
                        text={this.getTotalPoints() > 100 ? "Otvorte si účet v doTERRA a získajte 25% zľavu na celý nákup." : "Ak nakúpite produkty ešte za " + (100 - this.getTotalPoints()) + " bodov, získaťe možnosť OTVORENIA ÚČTU v doTERRA a dostanete 25% zľavu na Váš nákup"}
                        button={this.getTotalPoints() > 100 ? "Zisti viac" : "Nakupovať"}
                        location={this.getTotalPoints() > 100 ? "/sutaz-o-vstupny-balicek" : "/e-shop"}
                        image={this.getTotalPoints() > 100 ? require("../assets/nakupil-si-za-100-bodov.png") : require("../assets/nakup-este-za-x-bodov.png")}
                        closeBanner={this.closeBanner}
                    />
                ) : null}
            </div>
        )
    }
}

function CartItem(props) {
    const src = API_URL + "/uploads/" + props.product.product.imagePath;

    return(
        <div className="product">
            <img className="image" src={src} loading="lazy" />

            <div className="info">
                <h3 className="name">{props.product.product.name}</h3>
                <p className="description">{props.product.product.description}</p>

                <div style={{ flex: 1 }}></div>

                <div className="bottom-panel">
                    <div className="controls">
                        <div className="button" onClick={() => props.changeAmount(props.product.product, -1)}>-</div>
                        <div className="amount">{props.product.amount}</div>
                        <div className="button" onClick={() => props.changeAmount(props.product.product, 1)}>+</div>
                    </div>

                    <div style={{ flex: 1 }}></div>

                    <div className="price">{(props.product.product.price / 100 * props.product.amount).toFixed(2)}€</div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Cart);
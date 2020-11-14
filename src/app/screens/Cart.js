import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/cart.css";

class Cart extends React.Component {

    state = {
        offset: 0,

        cart: [],
        products: []
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
    }

    async loadData() {
        const cart = this.state.cart;
        var products = [];

        for (let i = 0; i < cart.length; i++) {
            var product = await Api.getProduct(cart[i]._id);

            if (product.message === "Retrieved successfully") {
                products.push({
                    product: product.product,
                    amount: cart[i].amount
                });
            }
        }

        this.setState({ products: products })
    }

    changeAmount(id, action) {
        const cart = this.state.cart;

        for (let i = 0; i < cart.length; i++) {
            if (cart[i]._id === id) {
                if (cart[i].amount + action <= 0) {
                    cart.splice(i, 1);
                } else {
                    cart[i].amount = cart[i].amount + action
                }

                break
            }
        }

        setStorageItem("cart", cart);
        this.setState({ cart: cart }, () => {
            this.loadData();
        });
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        this.loadData();
    }
    
    componentDidUpdate() {
        const cart = getStorageItem("cart");

        if (cart.length !== this.state.cart.length) {
            this.setState({ cart: cart }, () => {
                this.loadData();
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        const products = this.state.products;

        return(
            <div className="screen" id="cart">
                <Header />

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Košík</div>

                    {products.length === 0 ? <div className="empty-message">Košík je prázdny</div> : null}

                    {products.map((product) => <CartItem product={product} changeAmount={this.changeAmount} /> )}

                    {products.length !== 0 ? <Link className="button-filled" to="/fakturacne-udaje">Pokračovať ku platbe</Link> : <Link className="button-filled" to="/e-shop">Začnite nakupovať</Link>}
                </div>

                <Footer />
            </div>
        )
    }
}

function CartItem(props) {
    return(
        <div className="product">
            <img className="image" src={require("../assets/oil-3.png")} />

            <div className="info">
                <div className="name">{props.product.product.name}</div>
                <div className="description">{props.product.product.description}</div>

                <div style={{ flex: 1 }}></div>

                <div className="controls">
                    <div className="button" onClick={() => props.changeAmount(props.product.product._id, -1)}>-</div>
                    <div className="amount">{props.product.amount}</div>
                    <div className="button" onClick={() => props.changeAmount(props.product.product._id, 1)}>+</div>
                </div>

                <div style={{ flex: 1 }}></div>

                <div className="price">{props.product.product.price / 100}€</div>
            </div>
        </div>
    )
}

export default withRouter(Cart);
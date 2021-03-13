import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, setStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/cart.css";

class Cart extends React.Component {

    state = {
        offset: 0,

        cart: [],
        products: [],
        totalPoints: 0
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
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

    render() {
        const products = this.state.products;

        return(
            <div className="screen" id="cart">
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
            </div>
        )
    }
}

function CartItem(props) {
    const src = API_URL + "/uploads/" + props.product.product.imagePath;

    return(
        <div className="product">
            <img className="image" src={src} />

            <div className="info">
                <h3 className="name">{props.product.product.name}</h3>
                <p className="description">{props.product.product.description}</p>

                <div style={{ flex: 1 }}></div>

                <div className="bottom-panel">
                    <div className="controls">
                        <div className="button" onClick={() => props.changeAmount(props.product.product._id, -1)}>-</div>
                        <div className="amount">{props.product.amount}</div>
                        <div className="button" onClick={() => props.changeAmount(props.product.product._id, 1)}>+</div>
                    </div>

                    <div style={{ flex: 1 }}></div>

                    <div className="price">{(props.product.product.price / 100 * props.product.amount).toFixed(2)}€</div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Cart);
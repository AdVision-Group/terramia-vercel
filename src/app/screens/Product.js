import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, addToCart, API_URL } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/product.css";

class Product extends React.Component {

    state = {
        offset: 0,

        product: null,
        amount: 1
    }

    constructor() {
        super();
        
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        const product = await Api.getProduct(this.props.match.params.id);
        this.setState({ product: product.product });
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        this.loadData()
    }

    componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
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
        const product = this.state.product ? this.state.product : {};
        const src = API_URL + "/uploads/" + product.imagePath

        return(
            <div className="screen" id="product">
                <Header />

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <img className="image" src={src} />

                    <div className="info-panel">
                        <div className="name">{product.name}</div>
                        <div className="description">{product.description}</div>

                        <div className="pricing">
                            <div className="heading">Bežná cena</div>
                            <div className="price">{product.price / 100}€</div>
                            <div className="heading">Cena pre člena TerraMia</div>
                            <div className="price">{product.price / 100}€</div>
                        </div>


                        <div className="controls">
                            <div className="button" onClick={() => this.state.amount > 1 ? this.setState({ amount: this.state.amount - 1 }) : null}>-</div>
                            <div className="amount">{this.state.amount}</div>
                            <div className="button" onClick={() => this.setState({ amount: this.state.amount + 1 })}>+</div>
                        </div>

                        <div className="button-filled" onClick={() => addToCart(this.state.product._id, this.state.amount, this)}>Pridať do košíka</div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Product);
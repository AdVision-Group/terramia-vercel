import React from "react";
import { Link, withRouter } from "react-router-dom";

import { addToCart, API_URL } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/shop.css";

class Shop extends React.Component {

    state = {
        offset: 0,
        category: null,

        search: "",

        filters: {
            limit: 8
        },

        products: null
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this)
        this.showMore = this.showMore.bind(this)
        this.search = this.search.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    async loadData() {
        let products = await Api.getProducts(this.state.filters)

        if (this.state.products != products) {
            this.setState({ products: products })
        }
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.search();
        }
    }

    search() {
        if (this.state.search.trim() === "") {
            this.setState({ filters: {
                limit: 8
            } }, () => {
                this.loadData()
            })
        } else {
            this.setState({ filters: {
                limit: 8,
                query: this.state.search
            } }, () => {
                this.loadData()
            })
        }
    }

    showMore() {
        const limit = this.state.filters.limit

        this.setState({ filters: {
            limit: limit + 4
        } }, () => {
            this.loadData();
        })
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        this.setState({ category: this.props.match.params.category });
        this.loadData();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        const products = this.state.products ? this.state.products.products : []
        const count = this.state.products ? this.state.products.count : 0;

        return(
            <div className="screen" id="shop">
                <Header />

                <div className="upper-panel" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Esenciálne oleje</div>
                    <div className="text">
                        Vyberte si z našej širokej ponuky esenciálnych olejov, ktoré Vám nielen pomôžu prekonať množstvo ochorení, ale taktiež Vám spríjemnia Váš každodenný život.
                    </div>
                </div>

                <div className="filters">
                    <input className="field" type="text" onKeyPress={this.handleKeyPress} value={this.state.search} placeholder="Vyhľadávanie" onChange={(event) => this.setState({ search: event.target.value })} />
                    <div className="button-filled" onClick={() => this.search()}>Hľadať</div>
                </div>

                {count > 0 ? (
                    <div className="products">
                        {products.map((product) => <Product category={this.props.match.params.category} product={product} parent={this} /> )}
                    </div>
                ) : (
                    <div className="empty-message">Nenašli sa žiadne výsledky</div>
                )}

                {this.state.filters.limit <= count ? (<div className="button-filled" id="more-button" onClick={() => this.showMore()}>Zobraziť viac</div>) : null}

                <Footer />
            </div>
        )
    }
}

function Product(props) {

    const src = API_URL + "/uploads/" + props.product.imagePath

    return(
        <div className="product">
            <Link to={"/e-shop/" + props.category + "/" + props.product.name + "-" + props.product._id}><img className="image" src={src} /></Link>
            <div className="name">{props.product.name}</div>
            <div className="description">{props.product.description}</div>

            <div className="panel">
                <div className="price">{props.product.price / 100}€</div>
                <div className="button-filled" onClick={() => addToCart(props.product._id, 1, props.parent)}>Do košíka</div>
            </div>
        </div>
    )
}

export default withRouter(Shop);
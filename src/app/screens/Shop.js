import React from "react";
import { Link, withRouter } from "react-router-dom";

import { addToCart, API, API_URL, getStorageItem, shop, createURLName, setStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Categories from "../components/Categories";

import ShopMenu from "../components/ShopMenu";

import "../styles/shop.css";

class Shop extends React.Component {

    state = {
        offset: 0,

        products: null,

        title: "",

        type: -2,
        category: 0,
        price: 0,
        abc: 1,
        problem: 0,
        limit: 12,
        search: "",

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.showFilters = this.showFilters.bind(this);
        this.setQuery = this.setQuery.bind(this);
        this.setType = this.setType.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setAbc = this.setAbc.bind(this);
        this.setProblem = this.setProblem.bind(this);
    }

    showFilters() {
        document.getElementById("shop-menu").style.left = "0px";
    }
    
    setQuery(query) {
        this.setState({ search: query });
        setStorageItem("shop-query", query);
    }

    setType(type) {
        this.setState({ type: type, category: 0 }, () => this.loadData());
        setStorageItem("shop-type", type);
        setStorageItem("shop-category", 0);
    }

    setCategory(category) {
        this.setState({ category: category }, () => this.loadData());
        setStorageItem("shop-category", category);
    }

    setPrice(price) {
        this.setState({ price: price, abc: 0 }, () => this.loadData());
        setStorageItem("shop-price", price);
        setStorageItem("shop-abc", 0);
    }

    setAbc(abc) {
        this.setState({ abc: abc, price: 0 }, () => this.loadData());
        setStorageItem("shop-price", 0);
        setStorageItem("shop-abc", abc);
    }

    setProblem(problem) {
        this.setState({ problem: problem }, () => this.loadData());
        setStorageItem("shop-problem", problem);
    }

    async loadData() {
        this.setState({ loading: true });

        const { type, category, price, abc, problem, search, limit } = this.state;

        var filterBy = {};
        var sortBy = {};

        var filters = {};

        if (price !== 0) sortBy["price"] = price;
        if (abc !== 0) sortBy["abc"] = abc;

        if (type >= 0) filterBy["type"] = type + 1;
        if (type >= 0) filterBy["category"] = category + 1;

        if (type === -1) sortBy["soldAmount"] = 1;
        if (type === -2) filterBy["topProduct"] = true;

        if (problem !== 0) {
            filterBy["problemType"] = problem;

            delete filterBy["type"];
            delete filterBy["category"];
        }

        if (search.trim() !== "") {
            filters["query"] = search;

            delete filterBy["type"];
            delete filterBy["category"];
        }

        filterBy["eshop"] = true;

        filters["filters"] = filterBy;
        filters["sortBy"] = sortBy;

        if (type >= 0) this.setState({ title: shop[type].categories[category] });
        if (type == -1) this.setState({ title: "Najpredávanejšie" });
        if (type == -2) this.setState({ title: "Top 12 esenciálnych olejov" });

        const products = await Api.getProducts(filters);

        if (products.products) {
            this.setState({ products: products, loading: false });
        }
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.loadData();
        }
    }

    componentDidUpdate(prevProps) {
        const type = this.props.location.type;
        const category = this.props.location.category;

        if (type !== prevProps.location.type) {
            this.setState({ type: type, category: category }, () => this.loadData());
        }
    }

    componentDidMount() {
        const type = this.props.location.type;
        const category = this.props.location.category;

        const linkType = this.props.match.params.type;
        const linkCategory = this.props.match.params.category;

        if (linkType !== null && linkCategory !== null) {
            this.setState({ type: parseInt(linkType), category: parseInt(linkCategory) }, () => this.loadData());
            return;
        } else if (type != null && category != null) {
            this.setState({ type: type, category: category }, () => this.loadData());
            return;
        }

        if (getStorageItem("shop-query") !== null) {
            this.setState({ search: getStorageItem("shop-query") }, () => this.loadData());
        } 
        if (getStorageItem("shop-type") !== null) {
            this.setState({ type: getStorageItem("shop-type")}, () => this.loadData());
        }
        if (getStorageItem("shop-category") !== null) {
            this.setState({ category: getStorageItem("shop-category")}, () => this.loadData());
        }
        if (getStorageItem("shop-price") !== null && getStorageItem("shop-price") !== 0) {
            this.setState({ price: getStorageItem("shop-price"), abc: 0 }, () => this.loadData());
        }
        if (getStorageItem("shop-abc") !== null && getStorageItem("shop-abc") !== 0) {
            this.setState({ abc: getStorageItem("shop-abc"), price: 0 }, () => this.loadData());
        }
        if (getStorageItem("shop-problem") !== null) {
            this.setState({ problem: getStorageItem("shop-problem")}, () => this.loadData());
        }

        this.loadData();
    }
    
    render() {
        const products = this.state.products ? this.state.products.products : []
        const count = this.state.products ? this.state.products.count : 0;

        return(
            <div className="screen" id="shop">
                <div className="content">
                    <ShopMenu
                        type={this.state.type}
                        category={this.state.category}
                        price={this.state.price}
                        abc={this.state.abc}
                        problem={this.state.problem}
                        
                        setType={this.setType}
                        setCategory={this.setCategory}
                        setPrice={this.setPrice}
                        setAbc={this.setAbc}
                        setProblem={this.setProblem}
                    />

                    <div className="product-panel">
                        <div className="upper-panel">
                            <div className="title">{this.state.title}</div>
                            <p className="text">
                                Vyberte si z našej širokej ponuky esenciálnych olejov, ktoré Vám nielen pomôžu prekonať množstvo ochorení, ale taktiež Vám spríjemnia Váš každodenný život.
                            </p>
                        </div>

                        <div className="filters">
                            <input className="field" type="text" onKeyPress={this.handleKeyPress} value={this.state.search} placeholder="Vyhľadávanie" onChange={(event) => this.setQuery(event.target.value)} />
                            <div className="button-filled" onClick={() => this.loadData()}>Hľadať</div>
                        </div>

                        <div className="button-filters" onClick={() => this.showFilters()}><ion-icon name="filter-outline"></ion-icon>Filtrovať</div>

                        {this.state.loading ? (<div className="products"><Loading /></div>) : (
                            <div>
                                {count > 0 ? (
                                    <div className="products">
                                        {products.map((product) => <Product product={product} parent={this} /> )}
                                    </div>
                                ) : (
                                    <div className="empty-message">Nenašli sa žiadne výsledky</div>
                                )}
                            </div>
                        )}

                        {/*this.state.limit <= count ? (<div className="button-filled" id="more-button" onClick={() => this.setState((state) => ({ limit: state.limit + 8 }), () => this.loadData())}>Zobraziť viac</div>) : null*/}
                    </div>
                </div>
            </div>
        )
    }
}

function Product(props) {

    const src = API_URL + "/uploads/resized/" + props.product.imagePath

    return(
        <Link className="product" to={"/e-shop/" + props.product.link} style={!props.product.available ? { opacity: 0.7 } : null}>
            <img className="image" src={src} />
            <h3 className="name">{props.product.name}</h3>
            <p className="description">{props.product.description}</p>

            <div style={{ flex: 1 }} />

            {props.product.available ? (
                <div className="panel">
                    <div className="price">{(props.product.price / 100).toFixed(2)}€</div>
                    <div className="button-filled" /*onClick={() => addToCart(props.product._id, 1, props.parent)}*/>Do košíka</div>
                </div>
            ) : (
                <div className="panel">
                    <div className="sold-message">Vypredané</div>
                </div>
            )}

            {props.product.topProduct ? <img className="top-12" src={require("../assets/top12.png")} /> : null}
        </Link>
    )
}

export default withRouter(Shop);
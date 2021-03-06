import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { API_URL, shop } from "../config/config";
import Api from "../config/Api";

import Loading from "../components/Loading";

import ShopMenu from "../components/ShopMenu";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/shop.css";

class Shop extends React.Component {

    state = {
        offset: 0,

        products: null,

        title: "",
        search: "",

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.showFilters = this.showFilters.bind(this);

        this.setQuery = this.setQuery.bind(this);
        this.getQuery = this.getQuery.bind(this);
    }

    async loadData() {
        this.setState({ loading: true, products: [] });

        const query = new URLSearchParams(this.props.location.search);
        const type = query.get("typ");
        const category = query.get("kategoria");
        const sort = query.get("zoradenie");
        const problem = query.get("problem");
        const search = query.get("vyhladavanie");

        var filterBy = {};
        var sortBy = {};

        var filters = {};

        if (sort) {
            if (sort === "az") sortBy["name"] = 1;
            if (sort === "za") sortBy["name"] = -1;
            if (sort === "najlacnejsie") sortBy["price"] = 1;
            if (sort === "najdrahsie") sortBy["price"] = -1;
        }

        if (parseInt(type) >= 0) filterBy["type"] = parseInt(type) + 1;
        if (parseInt(type) >= 0) filterBy["category"] = parseInt(category) + 1;

        if (parseInt(type) === -1) sortBy["soldAmount"] = 1;
        if (parseInt(type) === -2) filterBy["topProduct"] = true;

        if (problem) {
            filterBy["problemType"] = parseInt(problem);

            //delete filterBy["type"];
            //delete filterBy["category"];
        }

        if (search) {
            filters["query"] = search;

            //delete filterBy["type"];
            //delete filterBy["category"];
        }

        filterBy["eshop"] = true;

        filters["filters"] = filterBy;
        filters["sortBy"] = sortBy;

        if (parseInt(type) >= 0) this.setState({ title: shop[parseInt(type)].categories[parseInt(category)] });
        if (parseInt(type) == -1) this.setState({ title: "Najpred??vanej??ie" });
        if (parseInt(type) == -2) this.setState({ title: "Top 12 esenci??lnych olejov" });

        //filters["filters"]["eshop"] = false;

        const products = await Api.getProducts(filters);

        if (products.products) {
            this.setState({ products: products, loading: false });
        }
    }

    showFilters() {
        document.getElementById("shop-menu").style.left = "0px";
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.setQuery([[ "vyhladavanie", this.state.search.trim() ]]);
        }
    }

    setQuery(queries) {
        var query = new URLSearchParams(this.props.location.search);

        for (let i = 0; i < queries.length; i++) {
            var element = queries[i];

            if (query.get(element[0])) {
                query.set(element[0], element[1]);
            } else {
                query.append(element[0], element[1]);
            }

            if (element[0] === "vyhladavanie" && element[1] === "") {
                query.delete("vyhladavanie");
                query.set("typ", -1);
                //query.set("kategoria", 0);
            } else if (element[0] === "vyhladavanie" && element[1] !== "") {
                query.delete("typ");
                query.delete("kategoria");

                query.set("typ", -1);
            }
        }

        this.props.history.replace("/e-shop?" + query.toString());
    }

    getQuery(name) {
        var query = new URLSearchParams(this.props.location.search);
        return query.get(name);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
          this.loadData();
        }
      }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        hideTransition();
    }
    
    render() {
        const products = this.state.products ? this.state.products.products : []
        const count = this.state.products ? this.state.products.count : 0;

        return(
            <div className="screen" id="shop">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>E-shop | Esenci??lne oleje doTERRA | TerraMia</title>
                    <meta name="description" content="E-shop TerraMia pon??ka ??irok?? v??ber esenci??lnych olejov doTERRA. N???? e-shop obsahuje takmer v??etky doTERRA oleje, ostatn?? doterra produkty ??i difuz??ry."></meta>
                    <meta name="keywords" content="doterra, esenci??lne oleje, doterra oleje, doterra difuzer, esencialne oleje, oleje doterra, esenci??lne oleje doterra, doterra esenci??lne oleje, doterra eshop, esencialne oleje e shop, aromaterapia oleje, doterra produkt, kde kupit esencialne oleje, esenci??lne oleje cena, pr??rodn?? esenci??lne oleje, doterra oleje cena, esencialne oleje doterra, esencialne oleje na vnutorne u??itie"></meta>
                </Helmet>

                <div className="content">
                    <ShopMenu />

                    <div className="product-panel">
                        <div className="upper-panel">
                            <div className="title">{this.state.title}</div>
                            <p className="text">
                                Vyberte si z na??ej ??irokej ponuky esenci??lnych olejov, ktor?? V??m nielen pom????u prekona?? mno??stvo ochoren??, ale taktie?? V??m spr??jemnia V???? ka??dodenn?? ??ivot.
                            </p>
                        </div>

                        <div className="filters">
                            <input className="field" type="text" onKeyPress={this.handleKeyPress} value={this.state.search} placeholder="Vyh??ad??vanie" onChange={(event) => this.setState({ search: event.target.value })} />
                            <div className="button-filled" onClick={() => this.setQuery([[ "vyhladavanie", this.state.search.trim() ]])}>H??ada??</div>
                        </div>

                        <div className="button-filters" onClick={() => this.showFilters()}><ion-icon name="filter-outline"></ion-icon>Filtrova??</div>

                        {this.state.loading ? (<div className="products"><Loading /></div>) : (
                            <div>
                                {count > 0 ? (
                                    <div className="products">
                                        {products.map((product, index) => <Product product={product} parent={this} key={index} /> )}
                                    </div>
                                ) : (
                                    <div className="empty-message">Nena??li sa ??iadne v??sledky</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

function Product(props) {
    const src = API_URL + "/uploads/resized/" + props.product.imagePath;

    return(
        <Link className="product" to={"/e-shop/" + props.product.link} style={!props.product.available ? { opacity: 0.7 } : null}>
            <img className="image" src={src} loading="lazy" />
            <h3 className="name">{props.product.name}</h3>
            <p className="description">{props.product.points ? props.product.points : 0} bodov</p>

            <div style={{ flex: 1 }} />

            {props.product.available ? (
                <div className="panel">
                    <div className="price">{(props.product.price / 100).toFixed(2)}???</div>
                    <div className="button-filled">K??pi??</div>
                </div>
            ) : (
                <div className="panel">
                    <div className="sold-message">Vypredan??</div>
                </div>
            )}

            {props.product.topProduct ? <img className="top-12" src={require("../assets/top12.png")} /> : null}
        </Link>
    )
}

export default withRouter(Shop);
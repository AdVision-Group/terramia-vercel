import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, addToCart, API_URL, getStorageItem, createURLName } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Banner from "../components/Banner";

import "../styles/product.css";

class Product extends React.Component {

    state = {
        offset: 0,

        product: null,
        amount: 1,

        admin: 0,

        loading: true,

        banner: false
    }

    constructor() {
        super();
        
        this.closeBanner = this.closeBanner.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadUser = this.loadUser.bind(this);
        this.changeAvailability = this.changeAvailability.bind(this);
        this.delete = this.delete.bind(this);
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    async loadData() {
        this.setState({ loading: true });

        const link = this.props.match.params.link;

        const call = await Api.getProducts({
            filters: {
                link: link
            },
            sortBy: {}
        });

        if (call.products) {
            this.setState({
                product: call.products[0],
                loading: false
            });
        }
    }

    async changeAvailability() {
        const available = this.state.product.available ? false : true;
        const token = getStorageItem("token");

        const product = await Api.editProduct(this.state.product._id, {
            available: available
        }, token);

        this.loadData();
    }

    async delete() {
        const token = getStorageItem("token");

        const call = await Api.editProduct(this.state.product._id, {
            eshop: false
        }, token);

        if (call.message === "Product patched successfully") {
            this.props.history.push("/e-shop");
        }
    }

    async loadUser() {
        const token = getStorageItem("token");

        if (token) {
            const user = await Api.getUser(token);

            if (user.user) {
                this.setState({ admin: user.user.admin });
            }
        }
    }

    async componentDidMount() {
        await this.loadData();
        await this.loadUser();
    }

    componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
        }
	}

    render() {
        const product = this.state.product ? this.state.product : {};
        const src = API_URL + "/uploads/" + product.imagePath

        return(
            <div className="screen" id="product">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | {product.name || "Načítava sa..."}</title>
                </Helmet>

                {this.state.loading ? (
                    <div style={{ width: "100vw", height: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Loading />
                    </div>
                ) : (
                    <div className="content">
                        <img className="image" src={src} loading="lazy" />

                        <div className="info-panel">
                            <h3 className="name">{product.name}</h3>
                            <h4 className="label">{product.label}</h4>
                            <div className="top-panel">
                                <div className="left-panel">
                                    {/*<h3 className="name">{product.name}</h3>
                                    <h4 className="label">{product.label}</h4>*/}

                                    {product.available ? (
                                        <div className="price-panel">
                                            <div className="heading">Naša cena</div>
                                            <div className="price">{(product.price / 100).toFixed(2)}€</div>
                                            {this.state.product.type !== 6 ? <div className="heading">Cena pre členov doTERRA</div> : null}
                                            {this.state.product.type !== 6 ? <div className="price">{(product.price / 100 * 0.75).toFixed(2)}€<ion-icon name="help-circle-outline" onClick={() => this.setState({ banner: true })}></ion-icon></div> : null}
                                        </div>
                                    ) : null}

                                    {product.available && product.points && product.points > 0 ? (
                                        <div className="points">Za tento produkt získate <b style={{ color: "#383838" }}>{product.points} členských bodov</b></div>
                                    ) : null}

                                    {product.available ? (
                                        <div className="buy-panel">
                                            <div className="button-filled" onClick={() => addToCart(this.state.product._id, this.state.product.points || 0, this.state.amount, this)}>Pridať do košíka</div>

                                            <div className="controls">
                                                <div className="button" onClick={() => this.state.amount > 1 ? this.setState({ amount: this.state.amount - 1 }) : null}>-</div>
                                                <div className="amount">{this.state.amount}</div>
                                                <div className="button" onClick={() => this.setState({ amount: this.state.amount + 1 })}>+</div>
                                            </div>
                                        </div>
                                    ) : <div className="sold-message">Vypredané</div> }
                                </div>

                                <div className="right-panel">
                                    <div>
                                        <div className="heading">Tipy na využitie</div>
                                        {product.tips.map((tip) => <div className="item">{tip}</div>)}
                                    </div>
                                </div>
                            </div>

                            <p className="description">{product.description}</p>

                            {this.state.admin === 1 ? (
                                <div className="admin-buttons">
                                    <Link className="button-filled" to={"/admin/upravit-produkt/" + this.state.product._id}>Upraviť</Link>
                                    <div className="button-filled" onClick={() => this.delete()}>Vymazať</div>
                                    <div className="button-outline" onClick={() => this.changeAvailability()}>{product.available ? "Nastaviť na nedostupný" : "Zdostupniť produkt"}</div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {this.state.banner ? (
                    <Banner
                        title="Chcete produkty doTERRA kúpiť s 25% zľavou a získať ďaľšie darčeky?"
                        text="Otvorte si vlastný účet doTERRA a získavajte pravidelné výhody podľa vášho výberu a nakupujte produkty doTERRA oveľa výhodnejšie!"
                        button="Zisti viac"
                        image={require("../assets/popup-rodinka.png")}
                        location="/sutaz-o-vstupny-balicek"
                        closeBanner={this.closeBanner}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Product);
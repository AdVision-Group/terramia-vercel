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

import "../styles/doterraregister.css";

class DoterraRegister extends React.Component {

    state = {
        dateOfBirth: "",
        totalDiscount: 0,

        additionalMessage: [],

        popup: false,
        message: "",
        loading: false
    }

    constructor() {
        super();

        this.closeBanner = this.closeBanner.bind(this);
        this.calculateDiscount = this.calculateDiscount.bind(this);
        this.getMessage = this.getMessage.bind(this);
        this.saveDataAndContinue = this.saveDataAndContinue.bind(this);
    }

    async saveDataAndContinue(registerInDoterra) {
        this.setState({ popup: true, loading: true });

        const { dateOfBirth } = this.state;

        if (registerInDoterra && dateOfBirth.trim() === "") {
            this.setState({
                loading: false,
                message: "Prosím vyplňte Váš dátum narodenia aby ste uplatnili 25% zľavu na Váš nákup"
            });

            return;
        }

        const orderData = getStorageItem("order");

        var order = {
            ...orderData
        }

        if (registerInDoterra) {
            order["applyDiscount"] = true;
            order["dateOfBirth"] = dateOfBirth.trim();
        } else {
            order["applyDiscount"] = false;
            delete order["totalDiscount"];
            delete order["dateOfBirth"];
        }

        setStorageItem("order", order);

        this.props.history.push("/doprava-a-platba");
    }

    async calculateDiscount() {
        const cart = getStorageItem("cart");
        var totalDiscount = 0;

        for (let i = 0; i < cart.length; i++) {
            const getProduct = await Api.getProduct(cart[i]._id);

            if (getProduct.product && getProduct.product.isDoTerraProduct) {
                const price = getProduct.product.price * cart[i].amount;
                const discount = price * 0.25;

                totalDiscount -= discount;
            }
        }

        this.setState({ totalDiscount: totalDiscount });

        const orderData = getStorageItem("order");

        var order = {
            ...orderData,
            totalDiscount: totalDiscount
        }

        delete order["applyDiscount"];

        setStorageItem("order", order);

        this.setState({ totalDiscount: totalDiscount });
    }

    async getMessage() {
        const cart = getStorageItem("cart");
        const orderData = getStorageItem("order");

        const packData = { type: 4, category: 1 };

        var products = await Promise.all(cart.map(async (item) => {
            const call = await Api.getProduct(item._id);

            return call.product || null;
        }));

        var onlyDoTerraProducts = true;
        var containsPack = false;

        for (let i = 0; i < products.length; i++) {
            if (!products[i].isDoTerraProduct) {
                onlyDoTerraProducts = false;
            }

            if (products[i].type === packData.type && products[i].category === packData.category) {
                containsPack = true;
                break;
            }
        }

        if (onlyDoTerraProducts) {
            if (containsPack) {
                this.setState({
                    additionalMessage: [ "Pri otvorení účtu doTERRA hradíme registračný poplatok 24€ za Vás.", "Navyše získate 100% zľavu (8,40€) na kuriéra doTERRA." ]
                });
            } else {
                this.setState({
                    additionalMessage: [ "Pri otvorení účtu doTERRA hradíme registračný poplatok 24€ za Vás." ]
                });
            }
        }
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    async componentDidMount() {
        showTransition();
        await this.calculateDiscount();
        await this.getMessage();
        hideTransition();
    }

    render() {
        const order = getStorageItem("order");

        return(
            <div className="screen" id="doterra-register">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Získajte 25% zľavu</title>
                </Helmet>

                <div className="content">
                    <div className="body">
                        <div className="heading">Uplatnite si 25% zľavu na celý nákup!</div>

                        <div className="text">
                            Vzhľadom na to, že ste nakúpili za viac ako 100 bodov, máte možnosť uplatniť si zľavu 25% na celý nákup. Navyše získate vlastný účet doTERRA bez vstupného poplatku 24 €. Ten zaplatíme za Vás.
                        </div>

                        <div style={{ height: 30 }} /> 

                        <div className="sub-heading" style={{ fontSize: 20 }}>Ako BONUS k vlastnému účtu Vám pošleme 15 ml Wild Orange.</div>

                        {this.state.additionalMessage.map(message => <div className="sub-heading" style={{ fontSize: 20 }}>{message}</div>)}

                        <div style={{ height: 30 }} />

                        <div className="price-panel">
                            <div className="price">{order ? (order.totalPrice / 100).toFixed(2) + "€" : ""}</div>
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                            <div className="discounted">{order ? ((order.totalPrice + this.state.totalDiscount) / 100).toFixed(2) + "€" : ""}</div>
                        </div>

                        <div style={{ height: 50 }} />

                        <div className="sub-heading">Výhody otvorenia vlastného účtu doTERRA</div>

                        <div className="list">
                            <div className="item">
                                <div className="bullet" />
                                <div className="label">Získate možnosť nakupovať 100% prírodné produkty so <b>zľavou minimálne 25%</b></div>
                            </div>

                            <div className="item">
                                <div className="bullet" />
                                <div className="label">Získate <b>darčeky</b> a využijete predajné akcie, akciové ceny a kreditné body na nákup</div>
                            </div>

                            <div className="item">
                                <div className="bullet" />
                                <div className="label">Získate možnosť finančných bonusov</div>
                            </div>

                            <div className="item">
                                <div className="bullet" />
                                <div className="label">Získate <b>osobnú starostlivosť a kvalitné poradenstvo</b> skúsených konzultantov TerraMia</div>
                            </div>
                        </div>

                        <div style={{ height: 50 }} />

                        <div className="sub-heading">Dobre vedieť</div>

                        <div className="list">
                            <div className="item">
                                <div className="bullet" />
                                <div className="label">Otvorením vlastného účtu v doTERRA sa nezaväzujete k pravidelným nákupom</div>
                            </div>

                            <div className="item">
                                <div className="bullet" />
                                <div className="label">Výška, či frekvencia Vašich objednávok je závislá čisto od Vašeho vlastného rozhodnutia</div>
                            </div>

                            <div className="item">
                                <div className="bullet" />
                                <div className="label">ZÚčet slúži iba na to, aby ste neprichádzali o výhody, ktoré doTERRA každý mesiac poskytuje a my Vám vždy poradíme, čo je pre Vás najvýhodnejšie</div>
                            </div>
                        </div>

                        <div style={{ height: 50 }} />

                        <div className="sub-heading">Otvorenie si účtu v doTERRA</div>

                        <div className="text">
                            Ak si chcete uplatniť zľavu 25% na tento nákup a získať ďalšie výhody, potrebujeme od Vás dátum narodenia.
                        </div>

                        <input className="field" type="text" value={this.state.dateOfBirth} onChange={(event) => this.setState({ dateOfBirth: event.target.value })} placeholder="Dátum narodenia" />

                        <div className="button-panel">
                            <div className="button-filled" onClick={() => this.saveDataAndContinue(true)}>Získať 25% zľavu</div>
                            <div className="button-outline" onClick={() => this.saveDataAndContinue(false)}>Preskočiť</div>
                        </div>
                    </div>

                    <Summary
                        noButton
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

export default withRouter(DoterraRegister);
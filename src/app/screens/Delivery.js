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

import "../styles/delivery.css";

class Delivery extends React.Component {

    state = {
        deliveryType: null,
        paymentType: null,

        options: null,

        popup: false,
        message: "",
        loading: false
    }

    constructor() {
        super();

        this.closeBanner = this.closeBanner.bind(this);
        this.saveDataAndContinue = this.saveDataAndContinue.bind(this);
        this.getOptions = this.getOptions.bind(this);
    }

    saveDataAndContinue() {
        this.setState({ popup: true, loading: true });

        const { deliveryType, paymentType } = this.state;

        if (deliveryType == null || paymentType == null) {
            this.setState({
                loading: false,
                message: "Musí byť zvolený spôsob dopravy a platby"
            });

            return;
        }

        const orderData = getStorageItem("order");

        var order = {
            ...orderData,
            deliveryType: deliveryType,
            paymentType: paymentType
        }

        setStorageItem("order", order);
        this.props.history.push("/potvrdenie-objednavky");
    }

    async getOptions() {
        const order = getStorageItem("order");
        
        if (order.productsType === "doterra") {
            if (order.totalPoints >= 100) {
                if (order.applyDiscount === true) {
                    if (order.containsPack === true) {
                        // doterra products above 100 points with registration with pack
                        return {
                            deliveryOptions: [
                                { name: "Doprava kuriérom", value: "courier", price: 0, icon: "car-outline" }
                            ],
                            paymentOptions: [
                                { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" }
                            ]
                        }
                    } else {
                        // doterra products above 100 points with registration without pack
                        return {
                            deliveryOptions: [
                                { name: "Doprava kuriérom", value: "courier", price: 840, icon: "car-outline" }
                            ],
                            paymentOptions: [
                                { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" }
                            ]
                        }
                    }
                } else {
                    // doterra products above 100 points without registration
                    return {
                        deliveryOptions: [
                            { name: "Doprava kuriérom", value: "courier", price: 0, icon: "car-outline" },
                            { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                        ],
                        paymentOptions: [
                            { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" },
                            { name: "Dobierka", value: "cash", price: 100, icon: "wallet-outline" }
                        ]
                    }
                }
            } else {
                // doterra products under 100 points
                return {
                    deliveryOptions: [
                        { name: "Doprava kuriérom", value: "courier", price: 490, icon: "car-outline" },
                        { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                    ],
                    paymentOptions: [
                        { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" },
                        { name: "Dobierka", value: "cash", price: 100, icon: "wallet-outline" }
                    ]
                }
            }
        } else if (order.productsType === "terramia") {
            // terramia products
            return {
                deliveryOptions: [
                    { name: "Doprava kuriérom", value: "courier", price: 490, icon: "car-outline" },
                    { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                ],
                paymentOptions: [
                    { name: "Dobierka", value: "cash", price: 0, icon: "wallet-outline" }
                ]
            }
        } else if (order.productsType === "mixed") {
            if (order.applyDiscount === true) {
                if (order.containsPack === true) {
                    // mixed products with registration with pack
                    return {
                        deliveryOptions: [
                            { name: "Doprava kuriérom", value: "courier", price: 0, icon: "car-outline" }
                        ],
                        paymentOptions: [
                            { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" }
                        ]
                    }
                } else {
                    // mixed products with registration without pack
                    return {
                        deliveryOptions: [
                            { name: "Doprava kuriérom", value: "courier", price: 840, icon: "car-outline" }
                        ],
                        paymentOptions: [
                            { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" }
                        ]
                    }
                }
            } else {
                // mixed products without registration
                return {
                    deliveryOptions: [
                        { name: "Doprava kuriérom", value: "courier", price: 490, icon: "car-outline" },
                        { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                    ],
                    paymentOptions: [
                        { name: "Dobierka", value: "cash", price: 100, icon: "wallet-outline" }
                    ]
                }
            }
        }

        return null;
    }

    /*
    async getOptions() {
        const cart = getStorageItem("cart");
        const orderData = getStorageItem("order");

        const packData = { type: 4, category: 1 };

        var products = await Promise.all(cart.map(async (item) => {
            const call = await Api.getProduct(item._id);

            return call.product || null;
        }));

        // check if there are only doTERRA products
        var onlyDoTerraProducts = true;

        for (let i = 0; i < products.length; i++) {
            if (!products[i].isDoTerraProduct) {
                onlyDoTerraProducts = false;
                break;
            }
        }

        if (onlyDoTerraProducts) {
            if (orderData.totalPoints < 100) {
                // doTERRA products only UNDER 100 points
                return {
                    deliveryOptions: [
                        { name: "Doprava kuriérom", value: "courier", price: 490, icon: "car-outline" },
                        { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                    ],
                    paymentOptions: [
                        { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" },
                        { name: "Dobierka", value: "cash", price: 100, icon: "wallet-outline" }
                    ]
                }
            } else {
                if (orderData.applyDiscount) {
                    // doTERRA products only ABOVE 100 points and WITH registration

                    var containsPack = false;

                    for (let i = 0; i < products.length; i++) {
                        if (products[i].type === packData.type && products[i].category === packData.category) {
                            containsPack = true;
                            break;
                        }
                    }

                    if (containsPack) {
                        // WITH pack
                        return {
                            deliveryOptions: [
                                { name: "Doprava kuriérom", value: "courier", price: 0, icon: "car-outline" },
                            ],
                            paymentOptions: [
                                { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" },
                            ],
                            message: "Registračný poplatok v hodnote 24€ zaplatíme za Vás",
                            additionalMessage: "Máte zľavu na doTERRA kuriéra v hodnote 8,40€"
                        }
                    } else {
                        // WITHOUT pack
                        return {
                            deliveryOptions: [
                                { name: "Doprava kuriérom", value: "courier", price: 840, icon: "car-outline" },
                            ],
                            paymentOptions: [
                                { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" },
                            ],
                            message: "Registračný poplatok v hodnote 24,00€ zaplatíme za Vás"
                        }
                    }
                } else {
                    // doTERRA products only ABOVE 100 points and WITHOUT registration
                    return {
                        deliveryOptions: [
                            { name: "Doprava kuriérom", value: "courier", price: 0, icon: "car-outline" },
                            { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                        ],
                        paymentOptions: [
                            { name: "Platba kartou", value: "card", price: 0, icon: "card-outline" },
                            { name: "Dobierka", value: "cash", price: 100, icon: "wallet-outline" }
                        ]
                    }
                }
            }
        } else {
            var onlyTerraMiaProducts = true;

            for (let i = 0; i < products.length; i++) {
                if (products[i].isDoTerraProduct) {
                    onlyTerraMiaProducts = false;
                    break;
                }
            }

            if (onlyTerraMiaProducts) {
                // TerraMia products ONLY
                return {
                    deliveryOptions: [
                        { name: "Doprava kuriérom", value: "courier", price: 490, icon: "car-outline" },
                        { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                    ],
                    paymentOptions: [
                        { name: "Dobierka", value: "cash", price: 0, icon: "wallet-outline" }
                    ]
                }
            } else {
                // mixed TerraMia and doTERRA products
                return {
                    deliveryOptions: [
                        { name: "Doprava kuriérom", value: "courier", price: 490, icon: "car-outline" },
                        { name: "Osobný odber", value: "pickup", price: 0, icon: "cube-outline" }
                    ],
                    paymentOptions: [
                        { name: "Dobierka", value: "cash", price: 100, icon: "wallet-outline" }
                    ]
                }
            }
        }
    }
    */

    closeBanner() {
        this.setState({ banner: false });
    }

    async componentDidMount() {
        showTransition();
        const options = await this.getOptions();
        this.setState({ options: options });
        hideTransition();
    }

    render() {
        const { options } = this.state;

        return(
            <div className="screen" id="delivery">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Doprava a platba | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                <div className="content">
                    <div className="body">
                        <div className="heading">Doprava a platba</div>

                        <div className="section">
                            <div className="heading">Možnosti dopravy</div>

                            <div className="options">
                                {options && options.deliveryOptions.map(type =>
                                    <div className={"item" + (this.state.deliveryType && this.state.deliveryType.value === type.value ? " selected" : "")} onClick={() => this.setState({ deliveryType: type })}>
                                        <ion-icon name={type.icon}></ion-icon>
                                        <div className="label">{type.name}</div>
                                        <div style={{ flex: 1 }} />
                                        <div className="price">{(type.price / 100).toFixed(2)}€</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ height: 50 }} />

                        <div className="section">
                            <div className="heading">Možnosti platby</div>

                            <div className="options">
                                {options && options.paymentOptions.map(type =>
                                    <div className={"item" + (this.state.paymentType && this.state.paymentType.value === type.value ? " selected" : "")} onClick={() => this.setState({ paymentType: type })}>
                                        <ion-icon name={type.icon}></ion-icon>
                                        <div className="label">{type.name}</div>
                                        <div style={{ flex: 1 }} />
                                        <div className="price">{(type.price / 100).toFixed(2)}€</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Summary
                        totalPrice={getStorageItem("order").totalPrice}
                        deliveryType={this.state.deliveryType}
                        paymentType={this.state.paymentType}
                        onContinue={() => this.saveDataAndContinue()}
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

export default withRouter(Delivery);
import React from "react";
import { withRouter } from "react-router";

import { getStorageItem } from "../config/config";

import "../styles/summary.css";

class Summary extends React.Component {

    state = {
        banner: false,

        order: null
    }

    constructor() {
        super();

        this.closeBanner = this.closeBanner.bind(this);
    }

    async componentDidMount() {
        const order = getStorageItem("order");

        this.setState({ order: order });
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    render() {
        //const { deliveryType, paymentType } = this.props;
        //const { isDiscountPossible } = this.state;
        //const order = getStorageItem("order");

        //if (!order) return null;

        //const totalPrice = order.totalPrice;
        //const deliveryPrice = order.deliveryType ? order.deliveryType.price : deliveryType ? deliveryType.price : 0;
        //const paymentPrice = order.paymentType ? order.paymentType.price : paymentType ? paymentType.price : 0;
        //const couponPrice = order.couponDiscount ? order.couponDiscount : 0;
        //const doterraPrice = order.applyDiscount ? order.totalDiscount : 0;

        //const price = ((totalPrice + deliveryPrice + paymentPrice + couponPrice + doterraPrice) / 100).toFixed(2);

        const order = getStorageItem("order");

        if (!order) return null;

        const price = order.totalPrice + (order.deliveryType ? order.deliveryType.price : 0) + (order.paymentType ? order.paymentType.price : 0) + (order.applyDiscount ? order.totalDiscount : 0);

        return(
            <div id="summary">
                <div className="heading">Súhrn objednávky</div>

                {order.totalPrice != null &&
                    <div className="item">
                        <div className="label">Produkty</div>
                        <div className="value">{(order.totalPrice / 100).toFixed(2)}€</div>
                    </div>
                }

                {order.deliveryType != null &&
                    <div className="item">
                        <div className="label">Doprava</div>
                        <div className="value">{(order.deliveryType.price / 100).toFixed(2)}€</div>
                    </div>
                }

                {order.paymentType != null &&
                    <div className="item">
                        <div className="label">Platba</div>
                        <div className="value">{(order.paymentType.price / 100).toFixed(2)}€</div>
                    </div>
                }

                {(order.applyDiscount == null || order.applyDiscount === false) && order.totalPoints != null && order.totalPoints >= 100 &&
                    <div className="item">
                        <div className="label">Možnosť zľavy 25% <ion-icon name="help-circle-outline" onClick={() => this.props.history.push("/sutaz-o-vstupny-balicek")}></ion-icon></div>
                        <div className="value">Áno</div>
                    </div>
                }

                {order.applyDiscount != null && order.applyDiscount === true &&
                    <div className="item">
                        <div className="label">Zľava 25% <ion-icon name="help-circle-outline" onClick={() => this.props.history.push("/sutaz-o-vstupny-balicek")}></ion-icon></div>
                        <div className="value">{(order.totalDiscount / 100).toFixed(2)}€</div>
                    </div>
                }

                {order.coupon != null &&
                    <div className="item">
                        <div className="label">Kupón</div>
                        <div className="value">{order.coupon.code}</div>
                    </div>
                }

                <div style={{ height: 30 }} />

                <div className="item">
                    <div className="label">Celková suma</div>
                    <div className="value"><b>{(price / 100).toFixed(2)}€</b></div>
                </div>

                {!this.props.noButton && <div className="button-filled" onClick={this.props.onContinue}>Pokračovať</div>}
            </div>
        )
    }
}

export default withRouter(Summary);
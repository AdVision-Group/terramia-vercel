import React from "react";
import { withRouter } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";

import "../styles/paymentpanel.css";

const promise = loadStripe("pk_live_51HrnXkAeUp0KWc2H8PIYeKHCbVq9oOQttDTGoMmHWgYLnnaZRMl16RHnHTohmfHCnFibyyP8y0DKkx5HxcEnw5iI006IZDTVLh");

class PaymentPanel extends React.Component {

    constructor() {
        super();

        this.redirect = this.redirect.bind(this);
    }

    redirect() {
        this.props.history.push("/dakujeme-za-objednavku");
    }

    render() {
        const { order } = this.props;

        return(
            <div id="payment-panel">
                <div className="heading">Objednať</div>

                <div className="text">Dokončením tohto kroku bude vaša objednávka záväzná.</div>

                <div className="item">
                    <div className="label">Celková suma</div>
                    <div className="value">{order.deliveryType && order.paymentType ? ((order.totalPrice + order.deliveryType.price + order.paymentType.price + order.totalDiscount) / 100).toFixed(2) : 0}€</div>
                </div>

                <div className="item">
                    <div className="label">Platba</div>
                    <div className="value">{order.paymentType ? order.paymentType.name : "-"}</div>
                </div>

                {order.paymentType &&
                    order.paymentType.value === "cash" ?
                        <div className="button" onClick={this.props.onClick}>Objednať</div>
                    :
                        <Elements stripe={promise} style={{ width: "100%" }}>
                            <CheckoutForm createOrder={this.props.createOrder} redirect={this.redirect} />
                        </Elements>
                }
            </div>
        )
    }
}

export default withRouter(PaymentPanel);
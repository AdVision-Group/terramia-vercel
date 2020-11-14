import React from "react";
import { Link, withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { isLogged, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import CheckoutForm from "../components/CheckoutForm";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/payment.css";

const promise = loadStripe("pk_test_51HizHLDe4E0hIPO5AyorGcJoePu3x9ej7Vg2uDTACZn4GriE52RIvC77OS7jqZGMiBdKvVbVCHniMjUtcqULe2j000E1Gf9a77");

class Payment extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();

        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));
    }
    
    componentDidUpdate() {
        
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    redirect() {
        this.props.history.push("/uspech");
    }

    render() {
        return(
            <div className="screen" id="payment">
                <Header />

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Súhrn a platba</div>
                    <div className="description">
                        Prihláste sa a nakupujte výhodnejšie. Vaše fakturačné údaje sa vyplnia automaticky.
                    </div>

                    <Elements stripe={promise}>
                        <CheckoutForm orderId={this.props.match.params.orderId} redirect={this.redirect} />
                    </Elements>
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Payment);
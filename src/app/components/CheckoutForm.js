import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { setStorageItem } from "../config/config";
import { API_URL } from "../config/config";

import "../styles/checkoutform.css";

export default function CheckoutForm(props) {

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const pay = async () => {
        const orderId = await props.createOrder();

        return window.fetch(API_URL + "/api/payments/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ orderId: orderId })
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            return data.clientSecret;
        });
    }

    const cardStyle = {
        style: {
        base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
            color: "#32325d"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);

        const cs = await pay();

        const payload = await stripe.confirmCardPayment(cs, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });
        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);

            setStorageItem("cart", []);
            props.redirect();
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <div style={{ color: "white", fontSize: 18, fontWeight: "700", marginBottom: 20 }}>Zadajte svoju kartu</div>

            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
            <button
                disabled={processing || disabled || succeeded}
                id="submit"
            >
                <span id="button-text" id="PotvredenieObj">
                {processing ? (
                    <div className="spinner" id="spinner"></div>
                ) : (
                    "Zaplati??"
                )}
                </span>
            </button>
            {/* Show any error that happens when processing the payment */}
            {error && (
                <div className="card-error" role="alert">
                {error}
                </div>
            )}
            {/* Show a success message upon completion */}
            <p className={succeeded ? "result-message" : "result-message hidden"}>
                Payment succeeded, see the result in your
                <a
                href={`https://dashboard.stripe.com/test/payments`}
                >
                {" "}
                Stripe dashboard.
                </a> Refresh the page to pay again.
            </p>
        </form>
    );
}
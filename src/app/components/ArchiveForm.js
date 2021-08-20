import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { getStorageItem, setStorageItem } from "../config/config";
import { API_URL } from "../config/config";

import "../styles/archiveform.css";

export default function CheckoutForm(props) {

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const pay = async () => {
        const token = getStorageItem("token");
        await props.createUserTier();

        return window.fetch(API_URL + "/api/payments/payForArchive", {
            method: "POST",
            headers: {
                "auth-token": token,
                "Content-Type": "application/json"
            },
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            return data.clientSecret
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
        console.log(cs);

        const payload = await stripe.confirmCardPayment(cs, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });
        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);

            props.showError();
            //alert("FAILED");
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);

            props.showSuccess();
            //alert("SUCCESS");
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <div style={{ color: "black", fontSize: 18, fontWeight: "700", marginBottom: 20 }}>Zadajte svoju kartu</div>

            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
            <button
                disabled={processing || disabled || succeeded}
                id="archive-submit"
            >
                <span id="button-text">
                {processing ? (
                    <div className="spinner" id="spinner"></div>
                ) : (
                    "Zaplatiť"
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
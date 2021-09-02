import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import ArchiveForm from "../components/ArchiveForm";

import "../styles/archive-popup.css";
import { getStorageItem } from "../config/config";
import Api from "../config/Api";

const promise = loadStripe("pk_live_51HrnXkAeUp0KWc2H8PIYeKHCbVq9oOQttDTGoMmHWgYLnnaZRMl16RHnHTohmfHCnFibyyP8y0DKkx5HxcEnw5iI006IZDTVLh");

const archiveTiers = [
    {
       tier: 1,
       days: 30,
       price: 1000,
    },
    {
       tier: 2,
       days: 90,
       price: 2500,
    },
    {
       tier: 3,
       days: 365,
       price: 6900,
    },
 ];

export default class ArchivePopup extends React.Component {

    state = {
        tier: 2
    }

    constructor() {
        super();

        this.createUserTier = this.createUserTier.bind(this);
    }

    componentDidMount() {

    }

    async createUserTier() {
        const { tier } = this.state;
        const token = getStorageItem("token");
        
        const call = await Api.getAccess({ pendingTier: tier }, token);

        console.log(call);
    }

    render() {
        const { tier } = this.state;

        return (
            <div className="archive-popup-screen">
                <div className="popup">
                    <div className="title">Odomknúť webináre</div>
                    <div className="text">
                        Vyberte si prosím dĺžku odomknutia webinárov. Počas tejto zakúpenej doby si budete môcť všetky webináre bez obmedzení prehrávať.
                    </div>

                    <div className="chooser">
                        <div className={"item" + (tier === 1 ? " selected" : "")} onClick={() => this.setState({ tier: 1 })}>
                            1 mesiac | 10.00€
                        </div>
                        <div className={"item" + (tier === 2 ? " selected" : "")} onClick={() => this.setState({ tier: 2 })}>
                            3 mesiace | 25.00€
                        </div>
                        <div className={"item" + (tier === 3 ? " selected" : "")} onClick={() => this.setState({ tier: 3 })}>
                            12 mesiacov | 69.00€
                        </div>
                    </div>

                    <Elements stripe={promise} style={{ width: "100%" }}>
                        <ArchiveForm
                            createUserTier={this.createUserTier}
                            showError={this.props.showError}
                            showSuccess={this.props.showSuccess}
                        />
                    </Elements>

                    <div className="button-filled" onClick={this.props.onClose}>Zavrieť</div>
                </div>
            </div>
        )
    }
}
import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/shop.css";

export default class Shop extends React.Component {
    render() {
        return(
            <div className="screen" id="shop">
                <Header />

                <div className="ad">
                    <div className="info-panel">
                        <div className="title">Ako si kúpiť oleje s 25% zľavou?</div>
                        <p className="text">
                            Zaregistruj sa na našej webstránke a získaj zľavy pri nakupovaní, ako aj skúšobnú vzorku úplne zadarmo!
                        </p>
                        <div className="button-filled">Staň sa členom</div>
                    </div>

                    <img className="image" src={require("../assets/family.png")} />
                </div>

                <Link to="/e-shop/oils">Prejsť na oleje</Link>

                <Footer />
            </div>
        )
    }
}
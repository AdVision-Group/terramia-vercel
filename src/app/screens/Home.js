import React from "react";
import { Link } from "react-router-dom";

import { getStorageItem } from "../config/config";
import Api from "../config/Api";

import SmoothScroll from "../config/SmoothScroll";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Banner from "../components/Banner";

import "../styles/home.css";

export default class Home extends React.Component {

    state = {
        banner: true,

        offset: 0
    }

    constructor() {
        super();

        this.closeBanner = this.closeBanner.bind(this);
    }
    
    closeBanner() {
        this.setState({ banner: false });
    }

    async componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        return(
            <div className="screen" id="home">
                <Header />

                <div className="slideshow" style={{ paddingTop: this.state.offset + 50 }}>
                    <h2 className="title fade-in-up animate__delay-1s">Objednávajte priamo z nášho e-shopu</h2>
                    <p className="text fade-in-up animate__delay-3s">
                        Vďaka nášmu partnerovi doTERRA máme širokú ponuku esenciálnych olejov, ktoré Vám pomôžu na Vašej ceste ku slobode.
                        Vďaka nášmu partnerovi doTERRA máme širokú ponuku esenciálnych olejov, ktoré Vám pomôžu na Vašej ceste ku slobode.
                    </p>
                    <Link className="button-filled fade-in-up animate__delay-5s" to="/registracia">Staň sa členom</Link>

                    {/*<div style={{ flex: 1 }}></div>*/}

                    <div onClick={() => SmoothScroll.scroll("#oils")}><img className="arrow" src={require("../assets/arrow.png")} onClick={() => {/*this.scrollDown()*/}}/></div>
                </div>

                <div className="oils" id="oils">
                    <div className="title-large fade-in-up">Balzam na dušu</div>
                    <div className="panel" id="oils-panel-1">
                        <img className="image fade-in-up" src={require("../assets/oil-1.png")} />

                        <div className="info">
                            <p className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add 1-2 drops to citrus drinks, teas, or water daily!
                            </p>
                            <Link className="button-filled" to="/e-shop">Nakupuj</Link>
                        </div>
                    </div>

                    <div className="panel" id="oils-panel-2">
                        <div className="info">
                            <div className="title-large fade-in-up">Cesta k slobode</div>

                            <p className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add 1-2 drops to citrus drinks, teas, or water daily!
                            </p>
                            <Link className="button-filled" to="/e-shop">Nakupuj</Link>
                        </div>

                        <div className="images fade-in-up">
                            <img className="oil-image" src={require("../assets/oil-3.png")} />
                            <img className="oil-image" src={require("../assets/oil-3.png")} />
                            <img className="oil-image" src={require("../assets/oil-3.png")} />
                        </div>
                    </div>
                </div>

                <div className="links">
                    <div className="item fade-in-up" id="links-item-1">
                        <div className="title">Prečo esenciálne oleje?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>

                    <div className="item fade-in-up" id="links-item-2">
                        <div className="title">Ako sa vyrábajú esenciálne oleje?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>

                    <div className="item fade-in-up" id="links-item-3">
                        <div className="title">Ako používať esenciálne oleje?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>

                    <div className="item fade-in-up" id="links-item-4">
                        <div className="title">Ako zarobiť s Terramia?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>
                </div>

                <Footer />

                {this.state.banner && !getStorageItem("token") ? <Banner closeBanner={this.closeBanner} /> : null}
            </div>
        )
    }
}
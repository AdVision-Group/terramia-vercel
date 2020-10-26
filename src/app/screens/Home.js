import React from "react";

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

        this.scrollDown = this.scrollDown.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
    }

    scrollDown() {
        window.scroll({top: document.getElementById("oils").offsetTop - document.getElementById("header").clientHeight, left: 0, behavior: "smooth" })
    }
    
    closeBanner() {
        this.setState({ banner: false });
    }

    componentDidMount() {
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
                    <h2 className="title">Objednávajte priamo z nášho e-shopu</h2>
                    <p className="text">
                        Vďaka nášmu partnerovi doTERRA máme širokú ponuku esenciálnych olejov, ktoré Vám pomôžu na Vašej ceste ku slobode.
                        Vďaka nášmu partnerovi doTERRA máme širokú ponuku esenciálnych olejov, ktoré Vám pomôžu na Vašej ceste ku slobode.
                    </p>
                    <div className="button-filled">Staň sa členom</div>

                    <div style={{ flex: 1 }}></div>

                    <img className="arrow" src={require("../assets/arrow.png")} onClick={() => this.scrollDown()} />
                </div>

                <div className="oils" id="oils">
                    <div className="title-large">Balzam na dušu</div>
                    <div className="panel" id="oils-panel-1">
                        <img className="image" src={require("../assets/oil-1.png")} />

                        <div className="info">
                            <p className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add 1-2 drops to citrus drinks, teas, or water daily!
                            </p>
                            <div className="button-filled">Nakupuj</div>
                        </div>
                    </div>

                    <div className="panel" id="oils-panel-2">
                        <div className="info">
                            <div className="title-large">Cesta k slobode</div>

                            <p className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add 1-2 drops to citrus drinks, teas, or water daily!
                            </p>
                            <div className="button-filled">Nakupuj</div>
                        </div>

                        <div class="images">
                            <img className="image" src={require("../assets/oil-2.png")} />
                            <img className="image" src={require("../assets/oil-2.png")} />
                            <img className="image" src={require("../assets/oil-2.png")} />
                        </div>
                    </div>
                </div>

                <div className="links">
                    <div className="item" id="links-item-1">
                        <div className="title">Prečo esenciálne oleje?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>

                    <div className="item" id="links-item-2">
                        <div className="title">Ako sa vyrábajú esenciálne oleje?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>

                    <div className="item" id="links-item-3">
                        <div className="title">Ako používať esenciálne oleje?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>

                    <div className="item" id="links-item-4">
                        <div className="title">Ako zarobiť s Terramia?</div>
                        <div className="button-filled">Zisti viac</div>
                    </div>
                </div>

                <Footer />

                {this.state.banner ? <Banner closeBanner={this.closeBanner} /> : null}
            </div>
        )
    }
}
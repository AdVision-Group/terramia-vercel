import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/aromatherapy.css";

export default class Aromatherapy extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();
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
        const width = window.innerWidth;
        const offset = (width > 1100 ? 75 : 50);

        return(
            <div className="screen" id="aromatherapy">
                <Header />

                <div className="title-panel" style={{ paddingTop: this.state.offset + offset }}>
                    <div className="title">Spoznajte silu esenciálnych olejov</div>
                </div>

                <div className="content">
                    <div className="title left half">Tri najdoležitejšie fakty o esenciálnych olejoch</div>
                    <div className="list">
                        <div className="item green">
                            <div className="heading white">100% prírodné</div>
                            <div className="text white">
                            DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove.
                            </div>
                        </div>
                        <div className="item yellow">
                            <div className="heading black">Bezpečné a účinné</div>
                            <div className="text black">
                            DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove.
                            </div>
                        </div>
                        <div className="item purple">
                            <div className="heading white">Cenovo dostupné</div>
                            <div className="text white">
                            DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove.
                            </div>
                        </div>
                    </div>

                    <div className="title left half">Viete, že?</div>
                    <div className="description left half">
                        Potrebujeme skutočne veľké množstvo rastlinného  materiálu na výrobu 15ml flaštičky esenciálneho oleja.
                    </div>
                    <div className="list">
                        <div className="item shadow">
                            <div className="heading black">75 kusov</div>
                            <img className="image" src={require("../assets/oil-2.png")} />
                        </div>
                        <div className="item shadow">
                            <div className="heading black">400 listov</div>
                            <img className="image" src={require("../assets/oil-2.png")} />
                        </div>
                        <div className="item shadow">
                            <div className="heading black">7 kilogramov</div>
                            <img className="image" src={require("../assets/oil-2.png")} />
                        </div>
                    </div>

                    <div className="title center">Esenciálne oleje sú účinnejšie ako chemické látky</div>
                    <div className="pluses">
                        <div className="item left">
                            <div className="number">1</div>

                            <div className="heading">Chránia rastlinu pred škodlivými vplyvmi okolia</div>
                            <div className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add  1-2 drops to citrus drinks, teas, or water daily!
                            </div>
                        </div>

                        <div className="item right">
                            <div className="number">2</div>

                            <div className="heading">Dokážu chrániť aj ľudské telo</div>
                            <div className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add  1-2 drops to citrus drinks, teas, or water daily!
                            </div>
                        </div>

                        <div className="item left">
                            <div className="number">3</div>

                            <div className="heading">Sú 50-70 krát účinnejšie ako samotné rastliny</div>
                            <div className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add  1-2 drops to citrus drinks, teas, or water daily!
                            </div>
                        </div>

                        <div className="item right">
                            <div className="number">4</div>

                            <div className="heading">Dokážu preniknúť cez bunkovú membránu</div>
                            <div className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add  1-2 drops to citrus drinks, teas, or water daily!
                            </div>
                        </div>

                        <div className="item left">
                            <div className="number">5</div>

                            <div className="heading">Sú účinnejšie ako chemické látky</div>
                            <div className="text">
                                DDR Prime Essential Oil is a proprietary blend of essential oils that includes Clove and Thyme. Add  1-2 drops to citrus drinks, teas, or water daily!
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}
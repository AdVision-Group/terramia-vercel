import React from "react";
import { Link, withRouter } from "react-router-dom";

import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/categories.css";

class Categories extends React.Component {

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
        return(
            <div className="screen" id="categories">
                <Header />

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Esenciálne oleje</div>
                    <div className="list">
                        <Link className="item" to={"/e-shop/" + "single-oils"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Single Oils</div>
                        </Link>

                        <Link className="item" to={"/e-shop/" + "proprietary-blends"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Proprietary Blends</div>
                        </Link>

                        <Link className="item" to={"/e-shop/" + "roll-on-essentials"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Roll-on Essentials</div>
                        </Link>
                    </div>

                    <div className="title">Ostatné produkty</div>
                    <div className="list">
                        <Link className="item" to={"/e-shop/" + "osobna-starostlivost"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Osobná starostlivosť</div>
                        </Link>

                        <Link className="item" to={"/e-shop/" + "difuzery"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Difúzery</div>
                        </Link>

                        <Link className="item" to={"/e-shop/" + "kolekcie"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Kolekcie</div>
                        </Link>

                        <Link className="item" to={"/e-shop/" + "specialna-ponuka"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Špeciálna ponuka</div>
                        </Link>

                        <Link className="item" to={"/e-shop/" + "literatura"}>
                            <img className="image" src={require("../assets/oil-3.png")} />
                            <div className="name">Literatúra</div>
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Categories);
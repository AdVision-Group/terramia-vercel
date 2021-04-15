import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

import { API_URL, isLogged, getStorageItem, removeStorageItem, setStorageItem, shop, API } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import Loading from "../components/Loading";

import Order from "../components/Order";

import "../styles/admin.css";

class AdminAnalytics extends React.Component {

    state = {
        timespan: "day",
        statistics: null,

        loading: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");
        const { timespan } = this.state;

        const call = await Api.getStatistics({
            timespan: timespan
        }, token);
        
        if (call.stats) {
            this.setState({
                statistics: call.stats,
                loading: false
            });
        } else {
            this.setState({
                statistic: null,
                loading: false
            });
        }
    }

    componentDidMount() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        this.loadData();
    }

    render() {
        const { statistics, loading } = this.state;
 
        return(
            <div className="screen admin" id="admin-analytics">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Analytika</title>
                </Helmet>

                <div className="content">
                    <div className="title">Analytika</div>

                    <div className="menu">
                        <div className="item" style={this.state.timespan === "day" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "day" }, () => this.loadData())}>Deň</div>
                        <div className="item" style={this.state.timespan === "week" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "week" }, () => this.loadData())}>Týždeň</div>
                        <div className="item" style={this.state.timespan === "month" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "month" }, () => this.loadData())}>Mesiac</div>
                        <div className="item" style={this.state.timespan === "year" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "year" }, () => this.loadData())}>Rok</div>
                    </div>

                    {loading && <Loading />}

                    {!loading && statistics ?
                        <div className="statistics">
                            <div className="item">
                                <div className="left">
                                    <div className="title">Registrácie doTERRA - TerraMia</div>
                                    <div className="text">Toto je naše KPI (key performance indicator), čiže 30 registrácií na zmluve. Rátajú sa maily, ktoré obdržali vzorku a registrovala ich TerraMia.</div>
                                </div>

                                <div className="value">{statistics.terramia}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">Registrácie doTERRA sieť + TerraMia</div>
                                    <div className="text">Rátajú sa maily, ktoré dostali vzorku a registrovala ich TerraMia alebo niekto zo siete.</div>
                                </div>

                                <div className="value">{statistics.terramia_net}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">Registrácie doTERRA - celkovo</div>
                                    <div className="text">Rátajú sa sem maily, ktoré dostali vzorku a registrovala ich TerraMia alebo niekto zo siete. Taktiež sa sem rátajú manuálne registrácie TerraMia, ktoré nemáme v databáze.</div>
                                </div>

                                <div className="value">{statistics.total}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">Vzorky spolu</div>
                                    <div className="text">Počet ľudí, ktorí obdržali vzorku od TerraMia.</div>
                                </div>

                                <div className="value">{statistics.samples}</div>
                            </div>
                        </div>
                    : null}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminAnalytics);
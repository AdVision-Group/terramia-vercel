import React, { useImperativeHandle } from "react";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

import { isLogged, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

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

        const call = await Api.getStatistics(timespan, token);
        
        if (call.stats) {
            this.setState({
                statistics: call.stats,
                loading: false
            });
        } else {
            this.setState({
                statistics: null,
                loading: false
            });
        }
    }

    async componentDidMount() {
        showTransition();

        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        await this.loadData();

        hideTransition();
    }

    render() {
        const { statistics, loading } = this.state;
 
        return(
            <div className="screen admin" id="admin-analytics">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Analytika</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
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
                                    <div className="title">1. Registrácie doTERRA - TerraMia</div>
                                    <div className="text">
                                        Toto je naše KPI (key performance indicator), čiže 30 registrácii na zmluve. Rátajú sa maily, ktoré obdržali vzorku a registrovala ich TerraMia + tí, ktorí nakúpili cez e-shop a registrovala ich TerraMia, zároveň nevyplnili poznámku "akcia"
                                    </div>
                                </div>

                                <div className="value">{statistics.kpi}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">2. Registrácie doTERRA - sieť + Terramia</div>
                                    <div className="text">
                                        Rátajú sa maily, ktoré dostali vzorku a registrovala ich TerraMia alebo niekto zo siete.
                                    </div>
                                </div>

                                <div className="value">{statistics.kpi_net}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">3. Registrácie TerraMia manuálne</div>
                                    <div className="text">
                                        Rátajú sa maily, ktoré prešli registráciou cez e-shop, registrovala ich TerraMia a vypnili v poznámke "akcia"
                                    </div>
                                </div>

                                <div className="value">{statistics.manual}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">4. Registrácie TerraMia cez vzorku</div>
                                    <div className="text">
                                        Rátajú sa všetky maily, ktoré nakúpili cez e-shop, registrovala ich TerraMia a zároveň ich mail obdržal vzorku.
                                    </div>
                                </div>

                                <div className="value">{statistics.kpi_sample}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">5. Registrácie doTERRA-celkovo</div>
                                    <div className="text">
                                        Rátajú sa maily, ktoré dostali vzorku a registrovala ich TerraMia alebo niekto zo siete. Taktiež sa sem rátajú manuálne registrácie TerraMia, ktoré nemáme v databáze.
                                    </div>
                                </div>

                                <div className="value">{statistics.kpi_net_plus_manual}</div>
                            </div>

                            <div className="line" />

                            <div className="item">
                                <div className="left">
                                    <div className="title">6. Vzorky spolu</div>
                                    <div className="text">
                                        Počet ľudí, ktorí obdržali vzorku od TerraMia
                                    </div>
                                </div>

                                <div className="value">{statistics.sampled}</div>
                            </div>
                        </div>
                    : null}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminAnalytics);
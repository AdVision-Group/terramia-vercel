import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Calendar from "react-calendar";

import { isLogged, getStorageItem } from "../config/config";
import Api from "../config/Api";
import SmoothScroll from "../config/SmoothScroll";

import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/admin.css";

class AdminAnalytics extends React.Component {

    state = {
        timespan: "day",
        statistics: null,

        day1: null,
        day2: null,

        loading: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.convertDate = this.convertDate.bind(this);
        this.getStatisticsType = this.getStatisticsType.bind(this);
    }

    getStatisticsType() {
        const { timespan, day1, day2 } = this.state;

        if (day1 != null && day2 != null) {
            return (day1[1] + " - " + day2[1]);
        }

        if (timespan === "day") return "posledný deň";
        if (timespan === "week") return "posledný týždeň";
        if (timespan === "month") return "posledný mesiac";
        if (timespan === "year") return "posledný rok";

        return null;
    }

    formatDate(date) {
        const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

        const parts = date.toString().split(" ");

        var day = parts[2];
        var month = null;
        var year = parts[3];
        
        for (let i = 0; i < months.length; i++) {
            if (months[i] === parts[1]) {
                month = i + 1 <  10 ? "0" + (i + 1).toString() : (i + 1).toString();
                break;
            }
        }

        const result = day + "/" + month + "/" + year;

        return [ date, result ];
    }

    convertDate(date) {
        const parts = date.toString().split(" ");
        const result = parts[0] + " " + parts[1] + " " + parts[2] + " " + parts[3];

        return result;
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");
        const { timespan, day1, day2 } = this.state;

        var request = timespan;

        if (day1 != null && day2 != null) {
            request = day1[1] + ":" + day2[1];
        } else {
            this.setState({ day1: null, day2: null });
        }
        
        SmoothScroll.scroll("#analytics-heading");
        const call = await Api.getStatistics(request.toString(), token);
        
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

    getActiveDays(date) {
        // sgag
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
                        <div className="item" style={this.state.timespan === "day" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "day", day1: null, day2: null }, () => this.loadData())}>Deň</div>
                        <div className="item" style={this.state.timespan === "week" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "week", day1: null, day2: null }, () => this.loadData())}>Týždeň</div>
                        <div className="item" style={this.state.timespan === "month" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "month", day1: null, day2: null }, () => this.loadData())}>Mesiac</div>
                        <div className="item" style={this.state.timespan === "year" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ timespan: "year", day1: null, day2: null }, () => this.loadData())}>Rok</div>
                    </div>

                    <Calendar
                        onChange={(e) => e.length === 1 ? this.setState({ day1: this.formatDate(e[0]), day2: null }) : this.setState({ day2: this.formatDate(e[1]) }, () => this.loadData())}
                        allowPartialRange={true}
                        selectRange={true}
                        className="calendar"
                        tileClassName={({ date }) => {
                            if (this.state.day1 != null && this.convertDate(date) === this.convertDate(this.state.day1[0].toString())) {
                                return "calendar-item selected";
                            }

                            if (this.state.day2 != null && this.convertDate(date) === this.convertDate(this.state.day2[0].toString())) {
                                return "calendar-item selected";
                            }

                            return "calendar-item";
                        }}
                        /*value={value}*/
                    />

                    <div className="heading" id="analytics-heading">Štatistiky <span className="timespan">({this.getStatisticsType()})</span></div>

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
import React from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { Helmet } from "react-helmet";

import Title from "../components/Title";
import Api from "../config/Api";
import Popup from "../components/Popup";
import SmoothScroll from "../config/SmoothScroll";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/contest.css";

export default class Contest extends React.Component {

    state = {
        videoWidth: 500,
        videoHeight: 300,

        email: "",
        message: "",

        popup: false,
        loading: false,
        title: ""
    }

    constructor() {
        super();

        this.handleResize = this.handleResize.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    async sendMessage() {
        this.setState({
            popup: true,
            loading: true
        });

        const { email, message } = this.state;

        if (email.trim() === "" || message.trim() === "") {
            this.setState({
                loading: false,
                title: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        const call = await Api.sendCompetitionAnswer({
            email: email.trim(),
            message: message.trim()
        });

        if (call.error) {
            if (call.error === "format") {
                this.setState({
                    loading: false,
                    title: "E-mail je v zlom formáte"
                });
            } else {
                this.setState({
                    loading: false,
                    title: "Stala sa chyba pri odoslaní odpoveďe"
                });
            }
        } else {
            this.setState({
                loading: false,
                title: "Úspešne ste odoslali súťažnú odpoveď",

                email: "",
                message: ""
            })
        }
    }

    componentDidMount() {
        showTransition();

        const width = window.innerWidth;

        if (width > 1100) {
            this.setState({
                videoWidth: 500,
                videoHeight: 300
            });
        }

        if (width < 1100 && width > 800) {
            this.setState({
                videoWidth: width - 100,
                videoHeight: parseInt((width - 100) * 0.5)
            });
        } else if (width <= 800) {
            this.setState({
                videoWidth: width - 40,
                videoHeight: parseInt((width - 40) * 0.5)
            });
        }

        window.addEventListener("resize", this.handleResize);

        hideTransition();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        const width = window.innerWidth;

        if (width > 1100) {
            this.setState({
                videoWidth: 500,
                videoHeight: 300
            });
        }

        if (width < 1100 && width > 800) {
            this.setState({
                videoWidth: width - 100,
                videoHeight: parseInt((width - 100) * 0.5)
            });
        } else if (width <= 800) {
            this.setState({
                videoWidth: width - 40,
                videoHeight: parseInt((width - 40) * 0.5)
            });
        }
    }

    render() {
        return(
            <div className="screen" id="contest">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Kde kúpiť esenciálne oleje? doTERRA oleje | TerraMia</title>
                    <meta name="description" content="Najvýhodnejšie nakúpite esenciálne oleje na TerraMia. doTERRA registrácia Vám zaručí zľavu na našom e-shope s doTERRA esenciálnymi olejmi. Už viete kde kúpiť oleje."></meta>
                    <meta name="keywords" content="doterra slovensko, kde kupit esencialne oleje, doterra registracia, esenciálne oleje cena"></meta>
                </Helmet>

                <Title title="Získaj zľavu 25% a ďalšie výhody" image="contest-background.png" />
                
                <div className="content">
                    <p className="text">
                        Navštívte náš <Link to="/e-shop" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>e-shop</Link> a vyberte si z ponuky produktov doTERRA v minimálnej hodnote 100 bodov (približne 125 €). Kliknite na otvorenie účtu. Za svoj nákup zaplatíte <b>o 25% menej</b>. Navyše získate vlastný účet bez vstupného poplatku 24 €. Ten zaplatíme za Vás. Ako <b>BONUS</b> k vlastnému účtu Vám pošleme 15 ml Wild Orange.
                    </p>

                    <div className="panel panel-1">
                        <div className="left">
                            <img className="image" src={require("../assets/sutaz-1.png")} loading="lazy" />
                        </div>

                        <div className="right">
                            <div className="list">
                                <div className="item">
                                    <div className="bullet" />
                                    <div className="info">Získate možnosť nakupovať 100% prírodné produkty so <b>zľavou minimálne 25%</b></div>
                                </div>
                                <div className="item">
                                    <div className="bullet" />
                                    <div className="info">Získate <b>darčeky</b> a využijete predajné akcie, akciové ceny a kreditné body na nákup</div>
                                </div>
                                <div className="item">
                                    <div className="bullet" />
                                    <div className="info">Získate možnosť finančných bonusov</div>
                                </div>
                                <div className="item">
                                    <div className="bullet" />
                                    <div className="info">Získate <b>osobnú starostlivosť</b> a <b>kvalitné poradenstvo</b> skúsených konzultantov TerraMia</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel panel-2">
                        <div className="left">
                            <div className="text">
                                Otvorením vlastného účtu v doTERRA sa <b>nezaväzujete</b> k pravidelným nákupom. Výška, či frekvencia Vašich objednávok je závislá čisto od Vašeho vlastného rozhodnutia.
                            </div>

                            <div style={{ height: 40 }} />

                            <div className="text">
                                Účet slúži iba na to, aby ste <b>neprichádzali o výhody</b>, ktoré doTERRA každý mesiac poskytuje a my Vám vždy poradíme, čo je pre Vás najvýhodnejšie.
                            </div>
                        </div>

                        <div className="right">
                            <img className="image" src={require("../assets/sutaz-2.png")} loading="lazy" />
                        </div>
                    </div>

                    <div className="panel panel-3">
                        <div className="left">
                            <div className="title">Zapojte sa do súťaže o darček - vstupný balíček troch olejov v hodnote 30€ - za správnu odpoveď na našu otázku</div>
                            <div className="button-filled" onClick={() => SmoothScroll.scroll("#contest-panel")}>Zapojiť sa</div>
                        </div>

                        <div className="right">
                            <img className="image" src={require("../assets/introductory-kit.png")} />
                        </div>
                    </div>

                    <div className="panel panel-4" id="contest-panel">
                        <div className="left">
                            <ReactPlayer
                                url="https://www.youtube.com/watch?v=d2DroL2ok8o"
                                controls
                                width={this.state.videoWidth}
                                height={this.state.videoHeight}
                            />
                        </div>

                        <div className="right">
                            <div className="title">
                                Viete vymenovať 3 esenciálne oleje, ktoré produkuje strom pomarančovníka?
                            </div>

                            <p className="text" style={{ marginBottom: 30 }}>
                                Víťaza žrebujeme každý mesiac na našom <a href="https://www.facebook.com/TerraMia-150670722157317" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Facebooku</a>.
                            </p>

                            <div className="form">
                                <input className="field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="Váš súťažný e-mail" />
                                <input className="field" type="text" value={this.state.message} onChange={(event) => this.setState({ message: event.target.value })} placeholder="Váša odpoveď" />
                                <div className="button-filled" onClick={() => this.sendMessage()}>Odoslať</div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.title}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}
            </div>
        )
    }
}
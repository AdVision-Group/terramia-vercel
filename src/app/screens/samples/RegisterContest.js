import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";

import Api from "../../config/Api";

import Popup from "../../components/Popup";

import { showTransition, hideTransition } from "../../components/Transition";

import "../../styles/register1.css";
import { setStorageItem } from "../../config/config";

class RegisterContest extends React.Component {

    state = {
       email: "",
       answer: "",

       agree: false,

       popup: false,
       message: "",
       loading: false,

       videoWidth: 0,
       videoHeight: 0,

       troubleshooting: false
    }

    constructor() {
        super();

        this.sendAnswer = this.sendAnswer.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.sendHelp = this.sendHelp.bind(this);
    }

    async sendHelp(email, message, error, browser) {
        this.setState({
            troubleshooting: false,
            popup: true,
            loading: true
        });

        const call = await Api.help({
            email: email.trim(),
            message: "Chyba: " + error + ", prehliadač: " + browser + ", správa: " + message,

            name: "Nezadané",
            phone: "0000000000"
        });

        if (call.error) {
            this.setState({
                loading: false,
                message: "Zadaný e-mail je nesprávny"
            });
        } else {
            this.setState({
                loading: false,
                message: "Správa úspešne odoslaná, čoskoro Vás budeme kontaktovať"
            });
        }
    }

    async sendAnswer() {
        this.setState({ popup: true, loading: true });

        const { email, answer, agree } = this.state;

        if (!agree) {
            this.setState({
                loading: false,
                message: "Musíte potvrdiť, že nemáte otvorený účet v doTERRA"
            });

            return;
        }

        if (email.trim() === "" || answer.trim() === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené"
            });

            return;
        }

        await Api.preRegister({ email: email, registeredInDoTerra: false });

        const call = await Api.sendCompetitionAnswer({ email: email });

        if (!call.error) {
            setStorageItem("order-user-data", JSON.stringify({ email: email }));
            this.props.history.push("/dakujeme-za-zapojenie-do-sutaze");
        } else {
            this.setState({
                loading: false,
                message: "E-mail neexistuje"
            });
        }
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

    render() {
        return(
            <div className="screen register" id="register-1">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Registračná súťaž | TerraMia</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}

                {this.state.troubleshooting ? (
                    <Popup
                        type="troubleshooting"
                        onClick={this.sendHelp}
                        close={() => this.setState({ troubleshooting: false })}
                    />
                ) : null}

                <div className="content">
                    <div className="left-panel">
                        <img className="icon" src={require("../../assets/family-business-1.png")} loading="lazy" alt="Register" />
                    </div>

                    <div className="right-panel">
                        <div className="title">TerraMia súťaž</div>
                        <p className="text">
                            Zapojte sa do súťaže o <Link to="/e-shop/2-maly-balik-nevyhnutnosti-pre-domacnost" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Malý balík nevyhnutností pre domácnosť</Link> a získajte najvýhodnejší prístup k produktom doTERRA, spolu v hodnote 184€ - za správnu odpoveď na našu otázku:
                        </p>

                        <div style={{ height: 20 }} />

                        <p className="heading">
                            Viete povedať, asi koľko rastlín na svete obsahuje esenciálne oleje? Pomôcka je v našom videu
                        </p>
                        
                        <div style={{ height: 30 }} />

                        <ReactPlayer
                            url="https://www.youtube.com/watch?v=d2DroL2ok8o"
                            controls
                            width={this.state.videoWidth}
                            height={this.state.videoHeight}
                        />

                        <div style={{ height: 30 }} />

                        <div className="form">
                            <input className="field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="Váš súťažný e-mail" />
                            <input className="field" type="text" value={this.state.answer} onChange={(event) => this.setState({ answer: event.target.value })} placeholder="Váša odpoveď" />

                            <div style={{ height: 10 }} />

                            <div className="checkbox" onClick={() => this.setState((state) => ({ agree: !state.agree }))}>
                                <div className="bullet" style={this.state.agree ? { backgroundColor: "#A161B3" } : null}></div>
                                <div className="item-title">Potvrdzujem, že nemám účet v doTERRA</div>
                            </div>

                            <div style={{ height: 10 }} />

                            <div className="button-filled" id="RegSutaz" onClick={() => this.sendAnswer()}>Odoslať</div>
                        </div>

                        <div style={{ height: 30 }} />

                        <p className="text">
                            Víťaza vyhlasujeme vždy prvý deň v mesiaci na našom <a href="https://www.facebook.com/TerraMia-150670722157317" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Facebooku</a> a <a href="https://www.instagram.com/terramia.sk/" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Instagrame</a>. Ak nevyhráte, nezúfajte, pre všetkých zúčastnených máme pripravený <b style={{ color: "#383838" }}>esenciálny darček :)</b>
                        </p>     

                        <div id="troubleshooting-panel" onClick={() => this.setState({ troubleshooting: true })}>
                            Nedarí sa Vám zapojiť do súťaže?
                        </div>                
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterContest);
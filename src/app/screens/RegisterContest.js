import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";

import Api from "../config/Api";

import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/register1.css";

class RegisterContest extends React.Component {

    state = {
       email: "",
       answer: "",

       popup: false,
       message: "",
       loading: false,

       videoWidth: 0,
       videoHeight: 0
    }

    constructor() {
        super();

        this.sendAnswer = this.sendAnswer.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    async sendAnswer() {
        this.setState({ popup: true, loading: true });

        const { email, answer } = this.state;

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
            this.setState({
                loading: false,
                message: call.message
            });
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

                <div className="content">
                    <div className="left-panel">
                        <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                    </div>

                    <div className="right-panel">
                        <div className="title">TerraMia súťaž</div>
                        <p className="text">
                            Zapojte sa do súťaže o <Link to="/e-shop/2-maly-balik-nevyhnutnosti-pre-domacnost" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Malý balík nevyhnutností pre domácnosť</Link> a získajte najvýhodnejší prístup k produktom doTERRA, spolu v hodnote 184€ - za správnu odpoveď na našu otázku:
                        </p>

                        <div style={{ height: 20 }} />

                        <p className="heading">Viete vymenovať 3 esenciálne oleje, ktoré produkuje strom pomarančovníka?</p>
                        
                        <div style={{ height: 30 }} />

                        <div className="form">
                            <input className="field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="Váš súťažný e-mail" />
                            <input className="field" type="text" value={this.state.answer} onChange={(event) => this.setState({ answer: event.target.value })} placeholder="Váša odpoveď" />
                            <div className="button-filled" onClick={() => this.sendAnswer()}>Odoslať</div>
                        </div>

                        <div style={{ height: 30 }} />

                        <p className="text">
                            Víťaza vyhlasujeme vždy prvý deň v mesiaci na našom <a href="https://www.facebook.com/TerraMia-150670722157317" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Facebooku</a> a <a href="https://www.instagram.com/terramia.sk/" style={{ textDecoration: "none", color: "#A161B3", fontWeight: "bold" }}>Instagrame</a>. Ak nevyhráte, nezúfajte, pre všetkých zúčastnených máme pripravený <b style={{ color: "#383838" }}>esenciálny darček :)</b>
                        </p>

                        <div style={{ height: 0 }} />

                        <ReactPlayer
                            url="https://www.youtube.com/watch?v=d2DroL2ok8o"
                            controls
                            width={this.state.videoWidth}
                            height={this.state.videoHeight}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterContest);
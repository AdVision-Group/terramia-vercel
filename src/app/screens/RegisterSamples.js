import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { setStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";

import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/register1.css";

const samplesByPriority = [
    "Deep Blue (1ml)",
    "Wild Orange (1ml)",
    "Air (1ml)",
    "Lavender (1ml)",
    "Lemon (1ml)",
    "On Guard (1ml)",
    "Zen Gest (1ml)",
    "Tea Tree (1ml)",
    "Peppermint (1ml)"
]

class RegisterSamples extends React.Component {

    state = {
        samples: [],
        currentSamples: [],
        problemType: 1,
        sampleId: ""
    }

    constructor() {
        super();

        this.checkUserStage = this.checkUserStage.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.getSortedSamples = this.getSortedSamples.bind(this);
        this.continue = this.continue.bind(this);
    }

    async componentDidMount() {
        showTransition();

        await this.checkUserStage();

        const filters = {
            filters: {
                eshop: false,
            },
            sortBy: {}
        }

        const samples = await Api.getProducts(filters);

        if (samples.products) {
            this.setState({ samples: samples.products });
        } else {
            this.setState({ samples: [] });
        }

        this.loadSamples();

        hideTransition();
    }

    loadSamples() {
        const { problemType, samples } = this.state;

        let currentSamples = [];

        for (let i = 0; i < samples.length; i++) {
            if (samples[i].problemType.includes(problemType)) {
                currentSamples.push(samples[i]);
            }
        }

        currentSamples.reverse();
        const sorted = this.getSortedSamples(currentSamples);

        this.setState({
            currentSamples: sorted.length > 0 ? sorted : [],
            sampleId: sorted.length > 0 ? sorted[0]._id : ""
        });
    }

    getSortedSamples(samples) {
        var resultSamples = [];

        for (let i = 0; i < samplesByPriority.length; i++) {
            const sampleByPriority = samplesByPriority[i];

            for (let j = 0; j < samples.length; j++) {
                const sample = samples[j];

                if (sample.name === sampleByPriority) {
                    resultSamples.push(sample);
                }
            }
        }

        return resultSamples;
    }

    continue() {
        const registerData = getStorageItem("register");

        if (this.state.sampleId === "") {
            this.setState({
                popup: true,
                loading: false,
                message: "Nevybrali ste si žiadnu vzorku"
            });

            return;
        }

        setStorageItem("register", {
            ...registerData,
            sampleId: this.state.sampleId
        });

        this.props.history.push("/fakturacne-udaje");
    }

    async checkUserStage() {
        let query = new URLSearchParams(this.props.location.search);

        const email = query.get("te");

        if (email) {
            setStorageItem("register", {
                email: email
            });

            await Api.preRegister({ email: email, registeredInDoTerra: false });
        } else {
            this.props.history.push("/stranka-sa-nenasla");
        }
    }

    render() {
        return(
            <div className="screen register" id="register-2">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Výber vzorky | TerraMia</title>
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
                        <div className="title">
                            Vyberte si vzorku
                        </div>
                        <p className="text">
                            Vyplňte Vaše fakturačné údaje a vzorka bude o chvíľu na ceste!
                        </p>

                        <div className="heading">Aký problém Vás trápi?</div>
                        <div className="problem-list">
                            <div className="item" style={this.state.problemType === 1 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 1 }, () => this.loadSamples())}>Tráviaci systém</div>
                            <div className="item" style={this.state.problemType === 2 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 2 }, () => this.loadSamples())}>Dýchací systém</div>
                            <div className="item" style={this.state.problemType === 3 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 3 }, () => this.loadSamples())}>Pohybový systém</div>
                            <div className="item" style={this.state.problemType === 4 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 4 }, () => this.loadSamples())}>Srdcovo cievny systém</div>
                            <div className="item" style={this.state.problemType === 5 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 5 }, () => this.loadSamples())}>Vylučovací systém</div>
                            <div className="item" style={this.state.problemType === 6 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 6 }, () => this.loadSamples())}>Nervový systém</div>
                            <div className="item" style={this.state.problemType === 7 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 7 }, () => this.loadSamples())}>Lymfatický systém</div>
                            <div className="item" style={this.state.problemType === 8 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 8 }, () => this.loadSamples())}>Imunitný systém</div>
                            <div className="item" style={this.state.problemType === 9 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 9 }, () => this.loadSamples())}>Hormonálny systém</div>
                            <div className="item" style={this.state.problemType === 10 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ problemType: 10 }, () => this.loadSamples())}>Pokožka</div>
                        </div>

                        <div className="samples">
                            {this.state.currentSamples.map((sample, index) => sample.price === 0 ? (
                                <div className={"item" + (this.state.sampleId === sample._id ? " active" : "")} onClick={() => this.setState({ sampleId: sample._id })}>
                                    <img className="image" src={API_URL + "/uploads/resized/" + sample.imagePath} loading="lazy" />

                                    <div className="info">
                                        <div className="name">{sample.name}</div>
                                        <div className="nickname">{sample.label}</div>
                                        <div className="text">{sample.description}</div>
                                    </div>
                                </div>
                            ) : null)}
                        </div>

                        <div className="button-filled" onClick={() => this.continue   ()}>Pokračovať</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterSamples);
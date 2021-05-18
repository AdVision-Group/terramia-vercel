import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { formatDate, API_URL, getStorageItem, createURLName } from "../config/config";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import Loading from "../components/Loading";
import Banner from "../components/Banner";

import Api from "../config/Api";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/quiz.css";

const questions = [
    {
        title: "Esenciálne oleje a iné produkty doTERRA plánujem použiť pre:",
        answers: [
            {
                title: "Seba/partnera",
                products: [ 1, 2, 3, 5, 7, 9 ]
            },
            {
                title: "Deti",
                products: [ 1, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4 ]
            },
            {
                title: "Rodiča/seniora",
                products: [ 1, 3, 5, 7, 9 ]
            },
            {
                title: "Celú rodinu",
                products: [ 1, 2, 3, 4, 5, 7,  9, 10, 10, 10 ]
            }
        ]
    },
    {
        title: "Produkty doTERRA chcem využívať najmä na (max. 3 možnosti):",
        answers: [
            {
                title: "Zlepšenie celkového zdravia",
                products: [ 1, 2, 3, 5, 7, 9 ]
            },
            {
                title: "Prevenciu zdravotných obmedzení",
                products: [ 1, 2, 3, 4, 5, 7, 9 ]
            },
            {
                title: "Emocionálnu pohodu",
                products: [ 1, 2, 3, 4, 9, 10 ]
            },
            {
                title: "Podporu detoxikácie organizmu",
                products: [ 3, 5, 7, 9 ]
            },
            {
                title: "Čistenie v domácnosti",
                products: [ 1, 2, 9, 9, 9, 10 ]
            },
            {
                title: "Prevoňanie priestoru",
                products: [ 1, 2, 3, 9 ]
            },
            {
                title: "Podnikanie",
                products: [ 1, 9, 10, 10, 10 ]
            }
        ]
    },
    {
        title: "Chcem sa zamerať najmä na podporu týchto telesných systémov (max. 3 možnosti)",
        answers: [
            {
                title: "Tráviaci",
                products: [ 1, 2, 4, 5, 7, 9 ]
            },
            {
                title: "Dýchací",
                products: [ 1, 2, 3, 4, 9 ]
            },
            {
                title: "Imunitný",
                products: [ 1, 2, 3, 4, 5, 9 ]
            },
            {
                title: "Hormonálny",
                products: [ 7, 9 ]
            },
            {
                title: "Bolesť a zápaly",
                products: [ 1, 2, 3, 4, 5 ]
            },
            {
                title: "Koža",
                products: [ 1, 2, 9 ]
            },
            {
                title: "Ochrana zdravia bunky",
                products: [ 7, 9 ]
            },
            {
                title: "Podporu môjho vegánskeho spôsobu života",
                products: [ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 ]
            }
        ]
    },
    {
        title: "Koľko chcem investovať do prírodných riešení podporujúcich moje zdravie denne",
        answers: [
            {
                title: "Do 5.-eur/deň",
                products: [ 2, 3, 4, 6, 8 ]
            },
            {
                title: "Do 10.-eur/deň",
                products: [ 1, 3, 4, 5, 7, 6, 8 ]
            },
            {
                title: "Nemám limit",
                products: [ 1, 4, 5, 7, 9, 10, 6, 8 ]
            }
        ]
    }
]

class Quiz extends React.Component {

    state = {
        products: [],

        answers: [
            { max: 1, value: [] },
            { max: 3, value: [] },
            { max: 3, value: [] },
            { max: 1, value: [] }
        ],

        done: false,
        recommended: [],

        step: 0
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.isQuestionFinished = this.isQuestionFinished.bind(this);
        this.answer = this.answer.bind(this);
        this.generateResults = this.generateResults.bind(this);
    }

    async loadData() {
        const productIds = [
            "5fff934694c3ff652ef508f8",
            "60006caf526a571591573e83",
            "5fff91fa94c3ff652ef508f7",
            "5fff96e694c3ff652ef508fb",
            "600069e4526a571591573e81",
            "60006abf526a571591573e82",
            "5fff95b194c3ff652ef508fa",
            "5fff94d194c3ff652ef508f9",
            "6001858b526a571591573e85",
            "6001889b526a571591573e86"
        ];

        var products = [];

        for (let i = 0; i < productIds.length; i++) {
            const call = await Api.getProduct(productIds[i]);

            if (call.product) {
                products.push(call.product);
            }
        }

        this.setState({ products: products });
    }

    answer(qi, ai) {
        var { answers } = this.state;

        if (answers[qi].value.includes(ai)) {
            const index = answers[qi].value.indexOf(ai);
            answers[qi].value.splice(index, 1);
        } else {
            if (answers[qi].max === 1) {
                answers[qi].value[0] = ai;
            } else {
                if (answers[qi].value.length < answers[qi].max) {
                    answers[qi].value.push(ai);
                }
            }
        }

        this.setState({ answers: answers }, () => {
            var buffer = 0;

            for (let i = 0; i < answers.length; i++) {
                if (answers[i].value.length > 0) buffer += 1;
            }

            if (buffer === answers.length) {
                this.generateResults();
            } else {
                this.setState({ done: false });
            }
        });
    }

    generateResults() {
        const { answers } = this.state;
        var frequency = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

        for (let i = 0; i < answers.length - 1; i++) {
            for (let j = 0; j < answers[i].value.length; j++) {
                const answer = answers[i].value[j];
                const products = questions[i].answers[answer].products;

                for (let k = 0; k < products.length; k++) {
                    const index = products[k];
                    frequency[index - 1] += i === 0 ? 2 : 1;
                }
            }
        }

        const mainProducts = questions[3].answers[answers[3].value[0]].products;

        var resultProducts = [];

        for (let i = 0; i < mainProducts.length; i++) {
            const product = mainProducts[i];

            if (frequency[product - 1] > 0) {
                resultProducts.push({
                    product: product,
                    frequency: frequency[product - 1]
                });
            }
        }

        resultProducts.sort((a, b) => parseFloat(b.frequency) - parseFloat(a.frequency));

        console.log(resultProducts);

        var recommended = [];
        const maxCount = 2;

        for (let i = 0; i < maxCount; i++) {
            if (resultProducts[i]) recommended.push(this.state.products[resultProducts[i].product - 1]);
        }

        this.setState({ recommended: recommended });
    }

    isQuestionFinished(qi) {
        const { answers } = this.state;

        if (answers[qi].value.length > 0) return true;

        return false;
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        hideTransition();
    }

    render() {
        const { answers, done, recommended, step } = this.state;

        return(
            <div className="screen" id="quiz">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Kvíz | TerraMia</title>
                </Helmet>

                <div className="content">
                    <div className="summary">
                        <div className={"number" + (step >= 0 ? " filled" : "")}>1</div>

                        <div className={"line" + (step >= 1 ? " filled" : "")} />

                        <div className={"number" + (step >= 1 ? " filled" : "")}>2</div>

                        <div className={"line" + (step >= 2 ? " filled" : "")} />

                        <div className={"number" + (step >= 2 ? " filled" : "")}>3</div>

                        <div className={"line" + (step >= 3 ? " filled" : "")} />

                        <div className={"number" + (step >= 3 ? " filled" : "")}>4</div>

                        <div className={"line" + (step >= 4 ? " filled" : "")} />

                        <div className={"number" + (step >= 4 ? " filled" : "")}>5</div>
                    </div>

                    {questions.map((question, qi) => {
                        if (step === qi) {
                            return (
                                <div className="step">
                                    <div className="title">{question.title}</div>
                                    {question.answers.map((answer, ai) =>
                                        <div className="question" style={answers[qi].value.includes(ai) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.answer(qi, ai)}>
                                            <div className="number" style={answers[qi].value.includes(ai) ? { backgroundColor: "white", color: "#383838" } : null}>{ai + 1}</div>
                                            {answer.title}
                                        </div>
                                    )}

                                    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 10, marginTop: 50 }}>
                                        {step !== 0 ? <div className="button-outline" onClick={() => this.setState((state) => ({ step: state.step - 1 }), () => window.scroll(0, 0))}>Naspäť</div> : null}
                                        <div className={"button-filled" + (!this.isQuestionFinished(qi) ? " faded" : "")} onClick={() => this.isQuestionFinished(qi) ? this.setState((state) => ({ step: state.step + 1 }), () => window.scroll(0, 0)) : {}}>Pokračovať</div>
                                    </div>
                                </div>
                            )
                        }
                    })}

                    {step === 4 &&
                        <div className="step">
                            <div className="title">Odporúčané balíky pre Vás</div>

                            {recommended.length === 0 ? <div className="message">Nenašli sa žiadne balíky, ktoré by spĺňali zadané kritéria</div> :
                                <div className="results">
                                    {recommended.map(product =>
                                        <Link className="product" to={"/e-shop/" + product.link}>
                                            <img className="image" src={API_URL + "/uploads/resized/" + product.imagePath} loading="lazy" />
                                            <h3 className="name">{product.name}</h3>
                                            <p className="description">{product.points ? product.points : 0} bodov</p>
                                
                                            <div style={{ flex: 1 }} />
                                
                                            <div className="panel">
                                                <div className="price">{(product.price / 100).toFixed(2)}€</div>
                                                <div className="button-filled">Kúpiť</div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            }

                            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 10, marginTop: 100 }}>
                                <div className="button-outline" onClick={() => this.setState((state) => ({ step: state.step - 1 }), () => window.scroll(0, 0))}>Naspäť</div>
                                <Link className="button-filled" to="/">Hotovo</Link>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Quiz);
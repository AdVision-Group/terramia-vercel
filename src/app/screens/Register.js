import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { evaluateRegister, evaluateLogin, removeStorageItem, setStorageItem, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";

import Popup from "../components/Popup";

import doc1 from "../documents/gdpr.pdf";
import doc2 from "../documents/obchodne-podmienky.pdf";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/register.css";

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

class Register extends React.Component {

    state = {
        offset: 0,

        user: null,

        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        phone: "",
        address: "",
        psc: "",
        city: "",
        country: "",

        passwordCode: "",

        popup: false,
        loading: true,
        message: "",

        troubleshooting: false,

        problem: 1,
        sample: 1,
        highlightedSample: 1,
        samples: [],

        sampleId: "",

        registeredInDoTerra: false,
        agree1: false,
        agree2: false,
        wantRegister: true
    }

    constructor() {
        super();

        this.finish = this.finish.bind(this);
        this.login = this.login.bind(this);
        this.preRegister = this.preRegister.bind(this);
        this.billingRegister = this.billingRegister.bind(this);
        this.passwordRegister = this.passwordRegister.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.sendHelp = this.sendHelp.bind(this);
        this.getSortedSamples = this.getSortedSamples.bind(this);
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

    async finish() {
        const token = getStorageItem("token");
        
        if (token) return;

        this.login();
    }

    async login() {
        this.setState({ popup: true, loading: true });

        const { email, password } = this.state;

        const login = await Api.login({
            email: email.trim(),
            password: password.trim()
        });

        if (login.token) {
            setStorageItem("token", login.token);

            if (!this.state.registeredInDoTerra) {
                const sample = this.state.sampleId;

                const order = await Api.createOrder({
                    products: [ sample ],
                    applyDiscount: false
                }, login.token);

                const pay = await Api.skipPayment({ orderId: order.orderId });

                if (pay.message === "Payment skipped successfully") {
                    this.setState({ popup: false }); 
                } else {
                    this.setState({ loading: false, message: pay.message })
                }
            } else {
                this.setState({ popup: false });  
            }
        } else {
            const message = evaluateLogin(login.message);
            this.setState({ popup: true, loading: false, title: message });
        }
    }

    async preRegister() {
        this.setState({ popup: true, loading: true });

        const { email, registeredInDoTerra, sampleId } = this.state;

        const register = await Api.preRegister({
            email: email.trim(),
            registeredInDoTerra: registeredInDoTerra,
            sampleId: sampleId
        });

        if (register.message === "User pre-registered successfully" || register.regStep === 0) {
            this.setState({ popup: false });

            removeStorageItem("regUser");
            setStorageItem("regUser", {
                email: email.trim(),
                registeredInDoTerra: registeredInDoTerra,
                sampleId: sampleId
            });

            this.props.history.push("/registracia-fakturacne-udaje");
        } else if (register.regStep === 2) {
            const sendCode = await Api.codeRegister({
                email: email.trim()
            });

            if (sendCode.message === "Register code sent successfully") {
                this.setState({ popup: false });

                this.setState({
                    name: sendCode.user.name.trim(),
                    email: sendCode.user.email.trim(),
                    phone: sendCode.user.phone.trim(),
                    address: sendCode.user.address.trim(),
                    psc: sendCode.user.psc.trim(),
                    city: sendCode.user.city.trim(),
                    country: sendCode.user.country.trim(),

                    sampleId: sendCode.user.sampleId,

                    registeredInDoTerra: sendCode.user.registeredInDoTerra
                });

                removeStorageItem("regUser");
                setStorageItem("regUser", {
                    name: sendCode.user.name.trim(),
                    email: sendCode.user.email.trim(),
                    phone: sendCode.user.phone.trim(),
                    address: sendCode.user.address.trim(),
                    psc: sendCode.user.psc.trim(),
                    country: sendCode.user.country.trim(),
                    
                    sampleId: sendCode.user.sampleId,
                    registeredInDoTerra: sendCode.user.registeredInDoTerra
                });

                this.props.history.push("/registracia-vytvorit-ucet");
            } else {
                this.setState({ loading: false, message: sendCode.message })
            }
        } else {
            const message = evaluateRegister(register.message);
            this.setState({ loading: false, message: message })
        }
    }

    async billingRegister() {
        this.setState({ popup: true, loading: true });

        const { email, name, address, psc, city, country, phone } = this.state;
        const { agree1, agree2 } = this.state;

        if (!agree1 || !agree2) {
            this.setState({ loading: false, message: "Pre členstvo v klube TerraMia je povinný súhlas s obchodnými podmienkami a spracovaním osobných údajov" });
            return;
        }

        const register = await Api.billingRegister({
            email: email.trim(),
            name: name.trim(),
            address: address.trim(),
            psc: psc.trim(),
            city: city.trim(),
            country: country.trim(),
            phone: phone.trim()
        });

        if (register.message === "Billing details added succesfully") {
            if (this.state.wantRegister) {
                const sendCode = await Api.codeRegister({
                    email: email.trim()
                });

                if (sendCode.message === "Register code sent successfully") {
                    this.setState({ popup: false });

                    const regUser = getStorageItem("regUser");

                    if (regUser) {
                        const newUser = {
                            ...regUser,
                            name: name.trim(),
                            address: address.trim(),
                            psc: psc.trim(),
                            city: city.trim(),
                            country: country.trim(),
                            phone: phone.trim()
                        }

                        setStorageItem("regUser", newUser);
                    }

                    this.props.history.push("/registracia-vytvorit-ucet");
                } else {
                    this.setState({ loading: false, message: sendCode.message })
                }
            } else {
                this.setState({ popup: false })
                this.props.history.push("/registracia-suhrn-objednavky");
            }
        } else {
            const message = evaluateRegister(register.message);
            this.setState({ loading: false, message: message })
        }
    }

    async passwordRegister() {
        this.setState({ popup: true, loading: true })

        const { email, passwordCode, password, repeatPassword } = this.state;

        if (password.trim() === "" || repeatPassword.trim() === "" || passwordCode.trim() === "") {
            this.setState({ loading: false, message: "Všetky polia musia byť vyplnené" });
            return;
        }

        if (password === repeatPassword) {
            const register = await Api.passwordRegister({
                email: email.trim(),
                code: passwordCode.trim(),
                password: password.trim()
            });

            if (register.message === "User registered successfully") {
                this.setState({ popup: false });

                const regUser = getStorageItem("regUser");

                if (regUser) {
                    const newUser = {
                        ...regUser,
                        password: password.trim()
                    }

                    setStorageItem("regUser", newUser);
                }

                this.finish();
                this.props.history.push("/registracia-suhrn-objednavky")
            } else {
                const message = evaluateRegister(register.message);
                this.setState({ loading: false, message: message })
            }
        } else {
            this.setState({ loading: false, message: "Heslá sa nezhodujú" })
        }
    }

    async changeCategory(problem) {
        const filters = {
            filters: {
                eshop: false,
                problemType: problem
            },
            sortBy: {}
        }

        const samples = await Api.getProducts(filters);
        console.log(samples);

        if (samples.products) {
            const items = samples.products;
            items.reverse();

            const sorted = this.getSortedSamples(items);

            if (sorted.length > 0) {
                this.setState({
                    samples: sorted,
                    problem: problem,
                    sampleId: sorted[0]._id
                });
            } else {
                this.setState({
                    samples: [],
                    problem: problem,
                    sampleId: ""
                });
            }
        }
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

    handleKeyPress(event) {
        
    }

    componentDidMount() {
        showTransition();

        this.props.history.push("/registracna-sutaz");

        if (this.props.stage === 1) {
            this.changeCategory(1);
        } else {
            const regUser = getStorageItem("regUser");

            if (regUser) {
                this.setState(regUser);
            }
        }

        hideTransition();
    }

    render() {
        if (this.props.stage === 1) {
            return(
                <div className="screen" id="register">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Vytvorenie členstva v klube TerraMia | TerraMia</title>
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
                            <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">
                                Získajte vzorky zadarmo
                            </div>
                            <p className="text">
                                Staňte sa členom klubu TerraMia a získajte vzorku esenciálnych olejov zadarmo.
                            </p>

                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />

                            <br />
                            <br />

                            <div className="heading">Máte otvorený účet v doTERRA?</div>
                            <div className="choice">
                                <div className="item" style={this.state.registeredInDoTerra ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ registeredInDoTerra: true })}>Áno</div>
                                <div className="item" style={!this.state.registeredInDoTerra ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ registeredInDoTerra: false })}>Nie</div>
                            </div>

                            {!this.state.registeredInDoTerra ? (
                                <div>
                                    <br />
                                    <br />
                                    <br />

                                    <div className="heading">Trápi ma</div>
                                    <div className="problem-list">
                                        <div className="item" style={this.state.problem === 1 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(1)}>Tráviaci systém</div>
                                        <div className="item" style={this.state.problem === 2 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(2)}>Dýchací systém</div>
                                        <div className="item" style={this.state.problem === 3 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(3)}>Pohybový systém</div>
                                        <div className="item" style={this.state.problem === 4 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(4)}>Srdcovo cievny systém</div>
                                        <div className="item" style={this.state.problem === 5 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(5)}>Vylučovací systém</div>
                                        <div className="item" style={this.state.problem === 6 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(6)}>Nervový systém</div>
                                        <div className="item" style={this.state.problem === 7 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(7)}>Lymfatický systém</div>
                                        <div className="item" style={this.state.problem === 8 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(8)}>Imunitný systém</div>
                                        <div className="item" style={this.state.problem === 9 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(9)}>Hormonálny systém</div>
                                        <div className="item" style={this.state.problem === 10 ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory(10)}>Pokožka</div>
                                    </div>

                                    <div className="samples">
                                        {this.state.samples.map((sample, index) => sample.price === 0 ? (
                                            <div className="item" onClick={() => this.setState({ sampleId: sample._id })} style={this.state.sampleId === sample._id ? { /*boxShadow: "0px 0px 15px -5px lightgray"*/ border: "2px solid rgba(0, 0, 0, 0.07)" } : null}>
                                                <img className="image" src={API_URL + "/uploads/resized/" + sample.imagePath} loading="lazy" />

                                                <div className="info">
                                                    <div className="name">{sample.name}</div>
                                                    <div className="nickname">{sample.label}</div>
                                                    <div className="text">{sample.description}</div>
                                                </div>
                                            </div>
                                        ) : null)}
                                    </div>
                                </div> ) : (
                                    <div className="text" style={{ margin: "30px 0px" }}>
                                        Ak už máte otvorený účet v doTERRA, vzorky zadarmo nepotrebujete, lebo môžete nakupovať v doTERRA výhodnejšie.
                                    </div>
                                )}

                            <div className="bottom-panel">
                                <div className="button-filled" onClick={() => this.preRegister()} id="register-button-step-1">Pokračovať</div>
                                <div className="troubleshooting" onClick={() => this.setState({ troubleshooting: true })}>
                                    Nejde Vám vytvoriť členstvo?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.props.stage === 2) {
            return(
                <div className="screen" id="register">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Vytvorenie členstva v klube TerraMia | TerraMia</title>
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
                            <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">
                                {!this.state.registeredInDoTerra ? "Kam Vám odošleme vzorku esenciálnych olejov?" : "Zadajte Vaše údaje"}
                            </div>
                            <p className="text">
                                {!this.state.registeredInDoTerra ? "Vyplňte Vaše fakturačné údaje a vzorka bude o chvíľu na ceste!" : "Zadajte Vaše údaje pre vytvorenie členstva v klube TerraMia."}
                            </p>

                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value})} />
                            <br />
                            <input className="field" style={{ marginBottom: 10 }} onKeyPress={this.handleKeyPress} type="text" required value={this.state.phone} placeholder="Telefónne číslo" onChange={(event) => this.setState({ phone: event.target.value})} />
                            <br />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.address} placeholder="Adresa a číslo domu" onChange={(event) => this.setState({ address: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value})} />

                            <br />

                            {/*
                            <div className="checkbox" onClick={() => this.setState((state) => ({ wantRegister: !state.wantRegister }))}>
                                <div className="bullet" style={this.state.wantRegister ? { backgroundColor: "#A161B3" } : null}></div>
                                <div className="title">Vytvoriť členstvo v klube TerraMia</div>
                            </div>
                            */}

                            <br />

                            <div className="checkbox" onClick={() => this.setState((state) => ({ agree1: !state.agree1 }))}>
                                <div className="bullet" style={this.state.agree1 ? { backgroundColor: "#A161B3" } : null}></div>
                                <div className="title">Súhlasím s <a href={doc2} target="_blank" style={{ textDecoration: "none", fontWeight: 700, color: "#383838" }}>obchodnými podmienkami</a></div>
                            </div>

                            <div className="checkbox" onClick={() => this.setState((state) => ({ agree2: !state.agree2 }))}>
                                <div className="bullet" style={this.state.agree2 ? { backgroundColor: "#A161B3" } : null}></div>
                                <div className="title">Súhlasím so <a href={doc1} target="_blank" style={{ textDecoration: "none", fontWeight: 700, color: "#383838" }}>spracovaním osobných údajov</a></div>
                            </div>

                            <div className="bottom-panel">
                                <div className="button-filled" onClick={() => this.billingRegister()} id="register-button-step-2">Pokračovať</div>
                                <div className="troubleshooting" onClick={() => this.setState({ troubleshooting: true })}>
                                    Nejde Vám vytvoriť členstvo?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.props.stage === 3) {
            return(
                <div className="screen" id="register">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Vytvorenie členstva v klube TerraMia | TerraMia</title>
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
                            <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">
                                Zadajte overovací kód a vytvorte si heslo
                            </div>
                            <p className="text">
                                Zadajte overovací kód, ktorý Vám prišiel na Váš e-mail a vytvorte si heslo. Po vytvorení hesla bude Vaše členstvo v klube TerraMia už skoro vytvorené.
                            </p>

                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.passwordCode} placeholder="Kód, ktorý Vám prišiel mailom" onChange={(event) => this.setState({ passwordCode: event.target.value})} />
                            <br />
                            <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.repeatPassword} placeholder="Zopakovať heslo" onChange={(event) => this.setState({ repeatPassword: event.target.value})} />

                            <div className="bottom-panel">
                                <div className="button-filled" onClick={() => this.passwordRegister()} id="register-button-step-3">Vytvoriť členstvo v klube TerraMia</div>
                                <div className="troubleshooting" onClick={() => this.setState({ troubleshooting: true })}>
                                    Nejde Vám vytvoriť členstvo?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.props.stage === 4) {
            const user = {
                email: this.state.email,
                name: this.state.name,
                phone: this.state.phone,
                address: this.state.address,
                psc: this.state.psc,
                city: this.state.city,
                country: this.state.country
            }

            return(
                <div className="screen" id="register">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Vytvorenie členstva v klube TerraMia | TerraMia</title>
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
                            <img className="icon" src={require("../assets/family-business-1.png")} loading="lazy" />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">
                                Vitajte v klube TerraMia
                            </div>
                            {this.state.registeredInDoTerra ? (
                                <div className="text">
                                    Sme radi, že ste sa stali členom klubu TerraMia. Nezabudnite sledovať náš <a href="https://www.facebook.com/TerraMia-150670722157317" className="social-link">Facebook</a> a <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fterramia.slovensko%2F%3Ffbclid%3DIwAR3rZ9RykraIMopo_oV2Bof-ms5tnyQlZp9GgdJZ6DGnp6Zq42-dJ-VHp3c&h=AT2DE6VFrsLjdTAE-TLyTHKsVKdJNngVS-htksnLU1bq_kL6EnMxufGN37yvjf3Ors9BHCqww2MmY9gty0ujh26FsTsAgn342Xi4OxuHEnbb_S356CPfROplEqx6V62XJfRdfqW0PQ" className="social-link">Instagram</a> pre viac informácií.
                                </div>
                            ) : (
                                <div className="text">
                                    Sme radi, že ste využili možnosť vyskúšať si vzorky zadarmo, do pár dní Vám budú doručené. Nezabudnite sledovať náš <a href="https://www.facebook.com/TerraMia-150670722157317" className="social-link">Facebook</a> a <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fterramia.slovensko%2F%3Ffbclid%3DIwAR3rZ9RykraIMopo_oV2Bof-ms5tnyQlZp9GgdJZ6DGnp6Zq42-dJ-VHp3c&h=AT2DE6VFrsLjdTAE-TLyTHKsVKdJNngVS-htksnLU1bq_kL6EnMxufGN37yvjf3Ors9BHCqww2MmY9gty0ujh26FsTsAgn342Xi4OxuHEnbb_S356CPfROplEqx6V62XJfRdfqW0PQ" className="social-link">Instagram</a> pre viac informácií.
                                </div>
                            )}

                            <div className="heading">Súhrn</div>

                            <div className="details">
                                <div className="heading">Meno a priezvisko</div>
                                <div className="info">{user.name}</div>
                                <div className="heading">E-mail</div>
                                <div className="info">{user.email}</div>
                                <div className="heading">Telefónne číslo</div>
                                <div className="info">{user.phone}</div>
                                <div className="heading">Adresa</div>
                                <div className="info">{user.address}</div>
                                <div className="heading">PSČ</div>
                                <div className="info">{user.psc}</div>
                                <div className="heading">Mesto</div>
                                <div className="info">{user.city}</div>
                                <div className="heading">Krajina</div>
                                <div className="info">{user.country}</div>
                            </div>

                            <div className="bottom-panel">
                                <div className="button-filled" onClick={() => {
                                    removeStorageItem("regUser");
                                    this.props.history.push("/");
                                }} id="register-button-step-4">Hotovo</div>
                                <div className="troubleshooting" onClick={() => this.setState({ troubleshooting: true })}>
                                    Nejde Vám vytvoriť členstvo?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(Register);
import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, evaluateRegister, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import "../styles/register.css";

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

        message: "",
        popup: false,

        sample: 1
    }

    constructor() {
        super();

        this.register = this.register.bind(this);
        this.setAccountDetails = this.setAccountDetails.bind(this);
        this.confirmOrder = this.confirmOrder.bind(this);
        this.getUser = this.getUser.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    async register() {
        this.setState({ popup: true });

        const { email, password, repeatPassword } = this.state;

        if (password.trim() === "" || repeatPassword.trim() === "") {
            this.setState({ message: "Všetky polia musia byť vyplnené" });
        } else if (password.trim() !== repeatPassword.trim()) {
            this.setState({ message: "Heslá sa nezhodujú" });
        } else {
            const register = await Api.register({
                email: email.trim(),
                password: password.trim()
            });

            const message = evaluateRegister(register.message);

            if (message === "Úspešne ste sa zaregistrovali") {
                const login = await Api.login({
                    email: email.trim(),
                    password: password.trim()
                })
        
                if (login.token) {
                    const samples = await Api.requestSamples(this.state.sample, login.token)

                    setStorageItem("token", login.token);
                    this.setState({ popup: false })
                    this.props.history.push("/registracia-fakturacne-udaje");
                }
            } else {
                this.setState({ popup: false, message: message })
            }
        }
    }

    async setAccountDetails() {
        if (document.getElementById("checkbox-1").checked && document.getElementById("checkbox-2").checked) {
            this.setState({ popup: true, loading: true })

            const token = getStorageItem("token");

            const edit = await Api.editUser({
                name: this.state.name,
                phone: this.state.phone,
                address: this.state.address,
                psc: this.state.psc,
                city: this.state.city,
                country: this.state.country
            }, token);

            if (edit.message === "Records updated successfully") {        
                this.setState({ popup: false })
                this.props.history.push("/registracia-suhrn-objednavky")
            } else {
                this.setState({ popup: false, loading: true })
            }
        }
    }

    async confirmOrder() {
        this.setState({ popup: true, loading: true })

        const token = getStorageItem("token")
        const samples = await Api.requestSamples(1, token)

        this.setState({ popup: false })
        this.props.history.push("/registracia-uspech");
    }

    async getUser() {
        const getUser = await Api.getUser(getStorageItem("token"));
        this.setState({ user: getUser.user })
    }

    handleKeyPress(event) {
        
    }

    async componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        /*if (isLogged()) {
            this.props.history.push("/profil")
        }*/

        if (this.props.stage === 3) {
            this.getUser();
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.stage !== prevProps.stage) {
            this.getUser();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        if (this.props.stage === 1) {
            return(
                <div className="screen" id="register">
                    <Header />
    
                    {this.state.popup ? (
                        <Popup
                            type="info"
                            loading={true}
                        />
                    ) : null}
    
                    <div className="content" style={{ paddingTop: this.state.offset }}>
                        <div className="left-panel">
                            <img className="icon" src={require("../assets/family.png")} />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">Vyberte si vzorky</div>
                            <div className="text">
                                Po zaregistrovaní sa do tímu TerraMia budete môcť nakupovať omnoho výhodnejšie, ako keby ste nakupovali anonýmne. Dokonca dostanete prvú skúšobnú vzorku esenciálnych olejov úplne zadarmo!
                            </div>

                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value})} />
                            <br />
                            <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.password} placeholder="Heslo" onChange={(event) => this.setState({ password: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="password" required value={this.state.repeatPassword} placeholder="Zopakovať heslo" onChange={(event) => this.setState({ repeatPassword: event.target.value})} />
        
                            <div className="samples">
                                <div className="item" onClick={() => this.setState({ sample: 1 })} style={this.state.sample === 1 ? { backgroundColor: "rgba(0, 0, 0, 0.07)" } : null}>
                                    <img className="image" src={require("../assets/oil-3.png")} />
                                    <div className="name">Citrón</div>
                                </div>

                                <div className="item" onClick={() => this.setState({ sample: 2 })} style={this.state.sample === 2 ? { backgroundColor: "rgba(0, 0, 0, 0.07)" } : null}>
                                    <img className="image" src={require("../assets/oil-3.png")} />
                                    <div className="name">Mäta</div>
                                </div>

                                <div className="item" onClick={() => this.setState({ sample: 3 })} style={this.state.sample === 3 ? { backgroundColor: "rgba(0, 0, 0, 0.07)" } : null}>
                                    <img className="image" src={require("../assets/oil-3.png")} />
                                    <div className="name">Levandula</div>
                                </div>

                                <div className="item" onClick={() => this.setState({ sample: 4 })} style={this.state.sample === 4 ? { backgroundColor: "rgba(0, 0, 0, 0.07)" } : null}>
                                    <img className="image" src={require("../assets/oil-3.png")} />
                                    <div className="name">Pomaranč</div>
                                </div>

                                <div className="item" onClick={() => this.setState({ sample: 5 })} style={this.state.sample === 5 ? { backgroundColor: "rgba(0, 0, 0, 0.07)" } : null}>
                                    <img className="image" src={require("../assets/oil-3.png")} />
                                    <div className="name">Tea Tree</div>
                                </div>

                                <div className="item" onClick={() => this.setState({ sample: 6 })} style={this.state.sample === 6 ? { backgroundColor: "rgba(0, 0, 0, 0.07)" } : null}>
                                    <img className="image" src={require("../assets/oil-3.png")} />
                                    <div className="name">OnGuard</div>
                                </div>
                            </div>

                            <div className="button-filled" onClick={() => this.register()}>Pokračovať</div>
                        </div>
                    </div>
    
                    <Footer />
                </div>
            )
        }

        if (this.props.stage === 2) {
            return(
                <div className="screen" id="register">
                    <Header />
    
                    {this.state.popup ? (
                        <Popup
                            type="info"
                            loading={true}
                        />
                    ) : null}
    
                    <div className="content" style={{ paddingTop: this.state.offset }}>
                        <div className="left-panel">
                            <img className="icon" src={require("../assets/family.png")} />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">Kam Vám ma objednávka prísť?</div>
                            <div className="text">
                                Po zaregistrovaní sa do tímu TerraMia budete môcť nakupovať omnoho výhodnejšie, ako keby ste nakupovali anonýmne. Dokonca dostanete prvú skúšobnú vzorku esenciálnych olejov úplne zadarmo!
                            </div>

                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.name} placeholder="Meno a priezvisko" onChange={(event) => this.setState({ name: event.target.value})} />
                            <br />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.phone} placeholder="Telefónne číslo" onChange={(event) => this.setState({ phone: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.address} placeholder="Adresa a číslo domu" onChange={(event) => this.setState({ address: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.psc} placeholder="PSČ" onChange={(event) => this.setState({ psc: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.city} placeholder="Mesto" onChange={(event) => this.setState({ city: event.target.value})} />
                            <input className="field" onKeyPress={this.handleKeyPress} type="text" required value={this.state.country} placeholder="Krajina" onChange={(event) => this.setState({ country: event.target.value})} />

                            <br />

                            <label className="checkbox">
                                <input type="checkbox" id="checkbox-1" />
                                <span></span>
                                <div className="title">Súhlasím s <b>obchodnými podmienkami</b></div>
                            </label>

                            <label className="checkbox">
                                <input type="checkbox" id="checkbox-2" />
                                <span></span>
                                <div className="title">Súhlasím so <b>spracovaním osobných údajov</b></div>
                            </label>

                            <div className="button-filled" onClick={() => this.setAccountDetails()}>Pokračovať</div>
                        </div>
                    </div>
    
                    <Footer />
                </div>
            )
        }

        if (this.props.stage === 3) {
            const user = this.state.user ? this.state.user : {};

            return(
                <div className="screen" id="register">
                    <Header />
    
                    {this.state.popup ? (
                        <Popup
                            type="info"
                            loading={true}
                        />
                    ) : null}
    
                    <div className="content" style={{ paddingTop: this.state.offset }}>
                        <div className="left-panel">
                            <img className="icon" src={require("../assets/family.png")} />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">Súhrn objednávky</div>
                            <div className="text">
                                Po zaregistrovaní sa do tímu TerraMia budete môcť nakupovať omnoho výhodnejšie, ako keby ste nakupovali anonýmne. Dokonca dostanete prvú skúšobnú vzorku esenciálnych olejov úplne zadarmo!
                            </div>

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

                            <div className="button-filled" onClick={() => this.confirmOrder()}>Dokončiť</div>
                        </div>
                    </div>
    
                    <Footer />
                </div>
            )
        }

        if (this.props.stage === 4) {
            return(
                <div className="screen" id="register">
                    <Header />
    
                    {this.state.popup ? (
                        <Popup
                            type="info"
                            loading={true}
                        />
                    ) : null}
    
                    <div className="content" style={{ paddingTop: this.state.offset }}>
                        <div className="left-panel">
                            <img className="icon" src={require("../assets/family.png")} />
                        </div>
    
                        <div className="right-panel">
                            <div className="title">Ďakujeme Vám za Vašu objednávku</div>
                            <div className="text">
                                Po zaregistrovaní sa do tímu TerraMia budete môcť nakupovať omnoho výhodnejšie, ako keby ste nakupovali anonýmne. Dokonca dostanete prvú skúšobnú vzorku esenciálnych olejov úplne zadarmo!
                            </div>

                            <Link className="button-filled" to="/">Domovská stránka</Link>
                        </div>
                    </div>
    
                    <Footer />
                </div>
            )
        }
    }
}

export default withRouter(Register);
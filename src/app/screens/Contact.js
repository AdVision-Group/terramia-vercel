import React from "react";
import { Helmet } from "react-helmet";

import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import Popup from "../components/Popup";

import "../styles/contact.css";

export default class Contact extends React.Component {

    state = {
        name: "",
        email: "",
        phone: "",
        message: "",

        popup: false,
        loading: false,
        title: ""
    }

    constructor() {
        super();

        this.sendMail = this.sendMail.bind(this);
    }

    async sendMail() {
        this.setState({ popup: true, loading: true })

        const { name, email, phone, message } = this.state

        const mail = await Api.sendMail({
            name: name,
            email: email,
            phone: phone,
            message: message
        })

        if (mail.message === "Message sent successfully") {
            this.setState({ loading: false, title: "Správa bola odoslaná" })
        } else {
            this.setState({ loading: false, title: "Zadané údaje sú nesprávne" })
        }
    }

    render() {
        return(
            <div className="screen" id="contact">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Kontakt</title>
                </Helmet>

                <Title title="Kontaktujte nás" image="title-background-11.jpg" />

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.title}
                        onClick={() => {
                            this.setState({ popup: false })
                            window.location.reload()
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="wrapper">
                    <div className="content-panel">
                        <div className="info-panel">
                            <div className="panel">
                                <div className="title">Hniezdo TerraMia</div>

                                <div className="info">Mierová 83</div>
                                <div className="info">821 05 Bratislava</div>
                                <div className="info">Slovenská republika</div>
                                <br />
                                <div className="info">info@terramia.sk</div>
                                <div className="info">+421 903 856 851</div>
                            </div>

                            <br />
                            <br />

                            <div className="panel">
                                <div className="title">Firemné údaje</div>

                                <div className="info">REGULUS s.r.o.</div>
                                <div className="info">IČO: 31572928</div>
                                <div className="info">DIČ: 2021099641</div>
                            </div>
                        </div>

                        <div className="form-panel">
                            <div className="title">Napíšte nám</div>

                            <div className="form">
                                <input className="field" type="text" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} placeholder="Vaše meno a priezvisko" />
                                <input className="field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="Váš e-mail" />
                                <input className="field" type="text" value={this.state.phone} onChange={(event) => this.setState({ phone: event.target.value })} placeholder="Vaše telefónne číslo" />
                                <textarea className="area" rows="10" value={this.state.message} onChange={(event) => this.setState({ message: event.target.value })} placeholder="Vaša správa"></textarea>

                                <div className="button-filled" onClick={() => this.sendMail()}>Odoslať správu</div>
                            </div>
                        </div>
                    </div>

                    <iframe className="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.9464932662754!2d17.1705621544069!3d48.14983677090208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c88cd7b309a09%3A0x13b274e02c532fa7!2sTerramia!5e0!3m2!1ssk!2ssk!4v1603733105313!5m2!1ssk!2ssk" width="600" height="450" frameBorder="0" style={{ border:0 }} allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
                </div>
            </div>
        )   
    }
}
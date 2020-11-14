import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/contact.css";

export default class Contact extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        const width = window.innerWidth;
        const offset = (width > 1100 ? 75 : 50);

        return(
            <div className="screen" id="contact">
                <Header />

                <div className="title-panel" style={{ paddingTop: this.state.offset + offset}}>
                    <div className="title">Kontaktujte nás</div>
                </div>

                <div className="content-panel">
                    <div className="info-panel">
                        <div className="panel">
                            <div className="title">Kontaktné údaje</div>

                            <div className="info">Bratislavská 11</div>
                            <div className="info">842 50 Bratislava</div>
                            <div className="info">Slovenská republika</div>
                            <br />
                            <div className="info">info@terramia.sk</div>
                            <div className="info">+421 902 626 353</div>
                        </div>

                        <br />
                        <br />

                        <div className="panel">
                            <div className="title">Firemné údaje</div>

                            <div className="info">Terramia s.r.o.</div>
                            <div className="info">IČO: 746204414</div>
                            <div className="info">DIČ: 46014</div>
                        </div>
                    </div>

                    <div className="form-panel">
                        <div className="title">Napíšte nám</div>

                        <div className="form">
                            <input className="field" type="text" value="" placeholder="Vaše meno" />
                            <input className="field" type="text" value="" placeholder="Váš e-mail" />
                            <input className="field" type="text" value="" placeholder="Vaše telefónne číslo" />
                            <textarea className="area" rows="10" value="" placeholder="Vaša správa"></textarea>

                            <div className="button-filled">Odoslať správu</div>
                        </div>
                    </div>
                </div>

                <iframe className="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.9464932662754!2d17.1705621544069!3d48.14983677090208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c88cd7b309a09%3A0x13b274e02c532fa7!2sTerramia!5e0!3m2!1ssk!2ssk!4v1603733105313!5m2!1ssk!2ssk" width="600" height="450" frameBorder="0" style={{ border:0 }} allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>

                <Footer />
            </div>
        )
    }
}
import React from "react";

import "../styles/popup.css";

export default class Popup extends React.Component {

    state = {
        email: "",
        message: ""
    }

    constructor() {
        super();
    }

    render() {
        if (this.props.type === "forgot") {
            return (
                <div className="popup-screen">
                    <div className="popup">
                        <div className="title">Zadajte svoj mail</div>
                        <div className="text">Na tento mail Vám príde link na resetovanie hesla</div>
                        <input className="field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="E-mail na TerraMia účet" />
                        <div className="button-filled" onClick={() => this.props.resetPassword(this.state.email)}>Resetovať heslo</div>
                    
                        <ion-icon name="close-outline" onClick={this.props.onClick}></ion-icon>
                    </div>
                </div>
            )
        } else if (this.props.type === "info") {
            if (this.props.loading) {
                return (
                    <div className="popup-screen">
                        <div className="popup">
                            <div className="loader"></div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="popup-screen">
                        <div className="popup">
                            <div className="title">{this.props.title}</div>
                            <div className="button-filled" onClick={this.props.onClick}>Zavrieť</div>
                        </div>
                    </div>
                )
            }
        } else if (this.props.type === "troubleshooting") {
            return (
                <div className="popup-screen">
                    <div className="popup">
                        <div className="title">Nejde Vám vytvoriť členstvo?</div>
                        <div className="text">Ak Vám nejde vytvoriť členstvo v klube TerraMia, zadajte svoj e-mail a popíšte nám, s čím presne máte problém. My sa na to hneď pozrieme a budeme Vás kontaktovať.</div>

                        <br />

                        <input className="field troubleshooting-field" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="E-mail, s ktorým si chcete vytvoriť členstvo" />
                        
                        <select className="select" id="error-select">
                            <option value="-">Aká chyba nastala?</option>
                            <option value="Neprišiel mi overovací kód">Neprišiel mi overovací kód</option>
                            <option value="E-mail neexistuje">E-mail neexistuje</option>
                            <option value="Telefónne číslo sa už používa">Telefónne číslo sa už používa</option>
                            <option value="E-mail je už zaregistrovaný">E-mail je už zaregistrovaný</option>
                        </select>

                        <select className="select" id="browser-select">
                            <option value="-">Aký prehliadač používate?</option>
                            <option value="Google Chrome">Google Chrome</option>
                            <option value="Mozilla Firefox">Mozilla Firefox</option>
                            <option value="Safari">Safari</option>
                            <option value="Microsoft Edge">Microsoft Edge</option>
                            <option value="Opera">Opera</option>
                        </select>

                        <textarea className="field troubleshooting-area" rows={8} type="text" value={this.state.message} onChange={(event) => this.setState({ message: event.target.value })} placeholder="Dodatočné poznámky"></textarea>
                        <div className="button-filled" onClick={() => this.props.onClick(this.state.email, this.state.message, document.getElementById("error-select").value, document.getElementById("browser-select").value)}>Odoslať</div>
                    
                        <ion-icon name="close-outline" onClick={this.props.close}></ion-icon>
                    </div>
                </div>
            )
        }
    }
}
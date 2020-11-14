import React from "react";

import "../styles/popup.css";

export default class Popup extends React.Component {

    state = {
        email: ""
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
        }
    }
}
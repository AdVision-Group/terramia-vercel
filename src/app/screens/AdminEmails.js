import React from "react";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

import { isLogged, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/admin.css";

class AdminEmails extends React.Component {

    state = {
        type: "terramia",

        input: "",

        loading: false,

        popup: false,
        message: "",
        popupLoading: false,
        popupOnClick: () => this.setState({ popup: false })
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.registerEmails = this.registerEmails.bind(this);
        this.formatInput = this.formatInput.bind(this);
    }

    async loadData() {
        this.setState({ loading: true });

        this.setState({
            loading: false
        });
    }

    async registerEmails() {
        this.setState({ popup: true, popupLoading: true });

        const token = getStorageItem("token");
        const { type, input } = this.state;

        if (input.trim() === "") {
            this.setState({
                popupLoading: false,
                message: "Polia sú prázdne",
                popupOnClick: () => this.setState({ popup: false })
            });

            return;
        }

        const emails = this.formatInput(input);

        const call = await Api.bundleEmails({
            terramia: type === "terramia" ? emails : [],
            terramia_net: type === "terramia_net" ? emails : []
        }, token);

        if (call.message === "Emails added successfully") {
            this.setState({
                popupLoading: false,
                message: "Úspešne zaregistrované e-maily",
                popupOnClick: () => this.props.history.push("/profil")
            });
        } else {
            this.setState({
                popupLoading: false,
                message: "Nepodarilo sa zaregistrovať zadané e-maily, vyškúšajte znovu neskôr",
                popupOnClick: () => this.setState({ popup: false })
            });
        }
    }

    formatInput(input) {
        const lines = input.split(/\r?\n/);
        const emails = [];

        for (let i = 0; i < lines.length; i++) {
            const item = lines[i];

            if (item.trim() === "") continue;

            emails.push(item.trim());
        }

        return emails;
    }

    async componentDidMount() {
        showTransition();

        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        await this.loadData();

        hideTransition();
    }

    render() {
        const { loading } = this.state;
 
        return(
            <div className="screen admin" id="admin-emails">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Registrácia nových členov</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        onClick={() => {
                            this.setState({ popup: false });
                        }}
                        loading={this.state.popupLoading}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Registrácia nových členov</div>

                    <div className="menu">
                        <div className="item" style={this.state.type === "terramia" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ type: "terramia", input: "" }, () => this.loadData())}>TerraMia</div>
                        <div className="item" style={this.state.type === "terramia_net" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ type: "terramia_net", input: "" }, () => this.loadData())}>TerraMia sieť</div>
                    </div>

                    <div className="emails">
                        <div className="heading">Nové e-maily na registráciu</div>
                        <div className="text">E-maily by mali byť pod sebou a bez zbytočných medzier</div>

                        <textarea className="area" rows={15} value={this.state.input} onChange={(event) => this.setState({ input: event.target.value })} placeholder="Zoznam e-mailov"></textarea>

                        <div className="button-filled" onClick={() => this.registerEmails()}>Pridať do databázy</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AdminEmails);
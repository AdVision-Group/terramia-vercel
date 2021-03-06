import React from "react";

import "../styles/coupon-popup.css";
import { getStorageItem } from "../config/config";
import Api from "../config/Api";
import { data } from "jquery";

export default class CouponPopup extends React.Component {

    state = {
        code: "",
        maxUses: 1,
        dueDate: "",

        selectedVideos: []
    }

    constructor() {
        super();

        this.setMaxUses = this.setMaxUses.bind(this);
        this.save = this.save.bind(this);
        this.selectVideo = this.selectVideo.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    selectAll() {
        const selected = this.props.videos.map(item => item._id);

        this.setState({ selectedVideos: selected });
    }

    deselectAll() {
        this.setState({ selectedVideos: [] });
    }

    selectVideo(id) {
        let { selectedVideos } = this.state;

        if (selectedVideos.includes(id)) {
            const index = selectedVideos.indexOf(id);
            selectedVideos.splice(index, 1);

            this.setState({ selectedVideos: selectedVideos });
        } else {
            selectedVideos.push(id);

            this.setState({ selectedVideos: selectedVideos });
        }
    }

    setMaxUses(value) {
        if (value === "") {
            this.setState({ maxUses: 0 });
            return;
        }

        this.setState({ maxUses: parseInt(value) });
    }

    formatDate(date) {
        let splitted = date.split(".");

        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i].length === 1) {
                splitted[i] = "0" + splitted[i];
            }
        }

        return splitted.join("/");
    }

    save() {
        const { code, maxUses, dueDate, selectedVideos } = this.state;

        let domain = [];

        const newDueDate = this.formatDate(dueDate);

        for (let i = 0; i < selectedVideos.length; i++) {
            domain.push({
                id: selectedVideos[i],
                until: newDueDate
            });
        }

        if (this.props.type === "add") {
            this.props.addCoupon({ maxUses: maxUses, code: code.trim(), domain: domain });
        } else if (this.props.type === "edit") {
            this.props.editCoupon({ maxUses: maxUses, code: code.trim(), domain: domain });
        }
    }

    componentDidMount() {
        if (this.props.type === "edit") {
            let selectedVideos = this.props.coupon.domain.map(item => item.id);

            this.setState({
                code: this.props.coupon.code,
                maxUses: this.props.coupon.maxUses,
                dueDate: this.props.coupon.domain[0].until,
                selectedVideos: selectedVideos
            });
        }
    }

    render() {
        const { code, maxUses, dueDate } = this.state;

        return (
            <div className="coupon-popup-screen">
                <div className="popup">
                    <div className="title">{this.props.type === "add" ? "Pridať kupón" : "Upraviť kupón"}</div>
                    <div className="text">
                        Pridajte nový kupón
                    </div>

                    <input type="text" className="field" value={code} onChange={(event) => this.setState({ code: event.target.value.trim() })} placeholder="Kód kupónu" />
                    <input type="text" className="field" value={maxUses} onChange={(event) => this.setMaxUses(event.target.value)} placeholder="Počet použití" />
                    <input type="text" className="field" value={dueDate} onChange={(event) => this.setState({ dueDate: event.target.value.trim() })} placeholder="Dátum expirácie (DD.MM.RRRR)" />

                    <div style={{ height: 30 }} />

                    <div className="video-panel">
                        <div className="wrapper">
                            {this.props.videos.map((item, index) =>
                                <div className="video-item" style={this.state.selectedVideos.includes(item._id) ? { backgroundColor: "#A161B3" } : null} onClick={() => this.selectVideo(item._id)}>
                                    <div className="name" style={this.state.selectedVideos.includes(item._id) ? { color: "white" } : null}>{item.name}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <a className="select-all-button" onClick={() => this.state.selectedVideos.length === 0 ? this.selectAll() : this-this.deselectAll()}>
                        {this.state.selectedVideos.length === 0 ? "Vybrať všetky" : "Resetovať výber"}
                    </a>

                    <div style={{ height: 50 }} />

                    <div className="button-panel">
                        <div className="button-filled" onClick={() => this.save()}>
                            {this.props.type === "add" ? "Pridať kupón" : "Upraviť kupón"}
                        </div>
                        <div className="button-outline" onClick={() => this.props.close()}>Zavrieť</div>
                    </div>
                </div>
            </div>
        )
    }
}
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import $ from "jquery";

import { API_URL, formatDate, getStorageItem } from "../config/config";
import Api from "../config/Api";
import SmoothScroll from "../config/SmoothScroll";
import ArchivePopup from "../components/ArchivePopup";
import Popup from "../components/Popup";

import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/video.css";

class Video extends React.Component {

    state = {
        video: {},

        status: 1,
        daysLeft: 0,
        banner: false,

        popup: false,
        message: "",
        loading: false,
        onPopupClose: () => this.setState({ popup: false })
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);

        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
    }

    showError() {
        this.setState({
            popup: true,
            loading: false,
            message: "Karta bola zamietnutá",
            onPopupClose: () => this.setState({ popup: false }),

            banner: false
        });
    }

    showSuccess() {
        this.setState({
            popup: true,
            loading: false,
            message: "Webináre úspešne zakúpené",
            onPopupClose: () => window.location.reload(),

            banner: false
        });
    }

    async loadData() {
        const token = getStorageItem("token");

        const call = await Api.getVideo(this.props.match.params.link, token);

        console.log("_-------____--__--__");
        console.log(call);

        if (!call.error) {
            this.setState({ video: call.video });
        }
    }

    async getUserStatus() {
        const token = getStorageItem("token");

        if (token) {
            const call = await Api.retrieveAccess(token);

            if (call.access) {
                this.setState({ status: 3, daysLeft: call.access.daysLeft });
            } else {
                this.setState({ status: 2 });
            }
        } else {
            this.setState({ status: 1 });
        }
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();
        await this.getUserStatus();

        hideTransition();
    }

    render() {
        const { video, status, banner, popup, daysLeft } = this.state;
        console.log(video, status, daysLeft);

        if (!video) return null;

        return(
            <div className="screen" id="video">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{video?.name ?? "Načítava sa..."} | TerraMia</title>
                    <meta name="description" content={video ? video.description : ""}></meta>
                </Helmet>

                <div className="content">
                    <img className="image" src={API_URL + "/uploads/" + video.imagePath} loading="lazy" />

                    <h3 className="title">{video.name}</h3>

                    <div className="tags">
                        <div className="tag">{video.category}</div>
                        {video.topics && video.topics.map((item, index) =>
                            <div className="tag">{item}</div>
                        )}
                        {video.authors && video.authors.map((item, index) =>
                            <div className="tag">{item}</div>
                        )}
                    </div>

                    <p className="text">{video.description}</p>

                    {video.vimeoId && status !== 3 ?
                        <div className="status-banner">
                            Tento webinár máte odomknutý
                        </div>
                    :
                    status === 1 ?
                        <div className="status-banner">
                            Prihláste sa a odomknite si všetky webináre vrátane tohto videa ich zakúpením.

                            <div className="button-filled" onClick={() => this.props.history.push("/prihlasenie")}>Prihlásiť sa</div>
                        </div>
                    : status === 2 ?
                        <div className="status-banner">
                            Odomknite si všetky webináre vrátane tohto videa ich zakúpením.

                            <div className="button-filled" onClick={() => this.setState({ banner: true })}>Zakúpiť</div>
                        </div>
                    :
                        <div className="status-banner">
                            Webináre máte zakúpené a odomknuté (zostáva {daysLeft} dní)
                        </div>
                    }

                    <p className="charity-message">100% z vami zaplatenej sumy posielame na internetovú linku dôvery pre mladých ľudí - IPčko.sk . Sme radi, že pomáhate spolu s nami.</p>
                </div>

                {video.vimeoId &&
                    <div style={{ width: "100%", height: 500 }}>
                    <iframe
                        src={"https://player.vimeo.com/video/" + video.vimeoId + "?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;h=a1186a1c35"}
                        frameborder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="SampleVideo_1280x720_10mb.mp4"
                        style={{ width: "100%", height: "100%" }}
                    ></iframe>
                    </div>
                }

                {banner &&
                    <ArchivePopup
                        onClose={() => this.setState({ banner: false })}
                        showError={this.showError}
                        showSuccess={this.showSuccess}
                    />
                }

                {popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={() => this.setState({ popup: false })}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Video);
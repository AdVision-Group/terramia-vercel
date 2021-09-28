import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { formatDate, API_URL, getStorageItem, createURLName } from "../config/config";
import ArchivePopup from "../components/ArchivePopup";
import Popup from "../components/Popup";
import Title from "../components/Title";
import Loading from "../components/Loading";
import Banner from "../components/Banner";

import { showTransition, hideTransition } from "../components/Transition";

import Api from "../config/Api";

import "../styles/archive.css";

class Archive extends React.Component {

    state = {
        config: {
            categories: [],
            topics: [],
            authors: []
        },

        status: 1,
        daysLeft: 0,
        banner: false,

        popup: false,
        message: "",
        loading: false,
        onPopupClose: () => this.setState({ popup: false }),

        categories: [],
        topics: [],
        authors: [],

        videos: [],

    }

    constructor() {
        super();

        this.loadInitialData = this.loadInitialData.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);

        this.addCategory = this.addCategory.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.addAuthor = this.addAuthor.bind(this);

        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);

        this.redeemCoupon = this.redeemCoupon.bind(this);
    }

    async redeemCoupon(code) {
        if (code.length === 0) {
            return;
        }

        this.setState({ banner: false, popup: true, loading: true });

        const token = getStorageItem("token");

        const call = await Api.redeemCoupon(code, token);

        if (call.error) {
            if (call.error === "not-found") {
                this.setState({
                    loading: false,
                    message: "Kupón sa nenašiel",
                    onPopupClose: () => this.setState({ popup: false, banner: true })
                });
            } else {
                this.setState({
                    loading: false,
                    message: "Nastala chyba v načítavaní kupónu",
                    onPopupClose: () => this.setState({ popup: false, banner: true })
                });
            }
        } else {
            console.log(call);
            this.setState({
                loading: false,
                message: "Kupón úspešne použitý",
                onPopupClose: () => this.setState({ popup: false }, () => window.location.reload())
            });
        }
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

    addCategory(category) {
        const { categories } = this.state;
        let newCategories = [];

        for (let i = 0; i < categories.length; i++) {
            newCategories.push(categories[i]);
        }

        const index = newCategories.indexOf(category);

        if (index !== -1) {
            newCategories.splice(index, 1);
        } else {
            newCategories.push(category);
        }

        this.setState({
            categories: newCategories,
            loading: true
        }, () => this.loadData());
    }

    addTopic(topic) {
        const { topics } = this.state;
        let newTopics = [];

        for (let i = 0; i < topics.length; i++) {
            newTopics.push(topics[i]);
        }

        const index = newTopics.indexOf(topic);

        if (index !== -1) {
            newTopics.splice(index, 1);
        } else {
            newTopics.push(topic);
        }

        this.setState({
            topics: newTopics,
            loading: true
        }, () => this.loadData());
    }

    addAuthor(author) {
        const { authors } = this.state;
        let newAuthors = [];

        for (let i = 0; i < authors.length; i++) {
            newAuthors.push(authors[i]);
        }

        const index = newAuthors.indexOf(author);

        if (index !== -1) {
            newAuthors.splice(index, 1);
        } else {
            newAuthors.push(author);
        }

        this.setState({
            authors: newAuthors,
            loading: true
        }, () => this.loadData());
    }

    async loadData() {
        this.setState({ loading: true });

        const { categories, topics, authors } = this.state;

        let data = {
            filters: {}
        }

        if (categories.length > 0) data.filters["categories"] = categories;
        if (topics.length > 0) data.filters["topics"] = topics;
        if (authors.length > 0) data.filters["authors"] = authors;

        console.log(data);

        const getVideos = await Api.getVideos(data, null);

        if (getVideos.videos) {
            this.setState({
                videos: getVideos.videos,
                loading: false
            });
        }
    }

    async loadInitialData() {
        const getConfig = await Api.getConfig();

        if (getConfig.config) {
            this.setState({ config: getConfig.config });
        }

        const getVideos = await Api.getVideos({ filters: {} }, null);

        if (getVideos.videos) {
            this.setState({
                videos: getVideos.videos,
            });
        }
    }

    async getUserStatus() {
        const token = getStorageItem("token");

        if (token) {
            const call = await Api.retrieveAccess(token);

            console.log(call);

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
        
        await this.loadInitialData();
        await this.getUserStatus();

        hideTransition();
    }

    render() {
        const { videos, config, loading, status, popup, banner, daysLeft } = this.state;
        const { categories, topics, authors } = this.state;

        return(
            <div className="screen" id="archive">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Archív webinárov | TerraMia</title>
                </Helmet>

                {/*<Title title="Archív webinárov" image="title-background-13.jpg" />*/}

                <div className="content">
                    <h2 className="title">Archív webinárov</h2>
                    <p className="text">
                        Nájdete tu všetky vzdelávacie webináre od TerraMia, ktorých záznamy si môžete pozrieť po zakúpení kedykoľvek a kdekoľvek.
                    </p>

                    <div className="filters">
                        {config.categories.map((item, index) =>
                            <div className={"item" + (categories.includes(item) ? " selected" : "")} onClick={() => this.addCategory(item)}>
                                {item}
                            </div>
                        )}

                        {config.topics.map((item, index) =>
                            <div className={"item" + (topics.includes(item) ? " selected" : "")} onClick={() => this.addTopic(item)}>
                                {item}
                            </div>
                        )}

                        {config.authors.map((item, index) =>
                            <div className={"item" + (authors.includes(item) ? " selected" : "")} onClick={() => this.addAuthor(item)}>
                                {item}
                            </div>
                        )}
                    </div>

                    {status === 1 ?
                        <div className="status-banner">
                            Prihláste sa a odomknite si všetky webináre ich zakúpením.

                            <div className="button-filled" onClick={() => this.props.history.push("/prihlasenie")}>Prihlásiť sa</div>
                        </div>
                    : status === 2 ?
                        <div className="status-banner">
                            Odomknite si všetky webináre ich zakúpením.

                            <div className="button-filled" onClick={() => this.setState({ banner: true })}>Zakúpiť</div>
                        </div>
                    :
                        <div className="status-banner">
                            Webináre máte zakúpené a odomknuté (zostáva {daysLeft} dní)
                        </div>
                    }

                    <p className="charity-message">100% z vami zaplatenej sumy posielame na internetovú linku dôvery pre mladých ľudí - IPčko.sk . Sme radi, že pomáhate spolu s nami.</p>

                    {videos.length === 0 ?
                        <div className="message">Žiadne videá</div>
                    :
                        <div className="videos">
                            {videos.map((item, index) =>
                                <Link className="video" to={"/webinare/" + item.link}>
                                    <img className="image" src={API_URL + "/uploads/resized/" + item.imagePath} />
                                    <div className="info">
                                        <div className="name">{item.name}</div>
                                        <div className="data">{item.category} | {item.authors[0]} | {item.topics[0]}</div>
                                        <p className="description">{item.description}</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    }
                </div>

                {banner &&
                    <ArchivePopup
                        onClose={() => this.setState({ banner: false })}
                        showError={this.showError}
                        showSuccess={this.showSuccess}
                        redeemCoupon={this.redeemCoupon}
                    />
                }

                {popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={() => this.state.onPopupClose()}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Archive);
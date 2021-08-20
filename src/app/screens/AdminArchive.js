import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";

import { isLogged, getStorageItem, API_URL } from "../config/config";
import Api from "../config/Api";
import SmoothScroll from "../config/SmoothScroll";
import Popup from "../components/Popup";
import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/admin.css";

class AdminArchive extends React.Component {

    state = {
        category: "",
        topic: "",
        author: "",

        config: {
            categories: [],
            topics: [],
            authors: []
        },

        videos: [],

        popup: false,
        title: "",
        loading: false,
        onPopupClose: () => this.setState({ popup: false })
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);

        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.removeTopic = this.removeTopic.bind(this);
        this.addAuthor = this.addAuthor.bind(this);
        this.removeAuthor = this.removeAuthor.bind(this);
    }

    async addCategory() {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const { category, config } = this.state;
        
        const call = await Api.updateConfig({
            categories: [ ...config.categories, category ],
            topics: [ ...config.topics ],
            authors: [ ...config.authors ]
        }, token);

        if (call.config) {
            this.setState({
                loading: false,
                title: "Kategória úspešne pridaná",
                onPopupClose: () => window.location.reload()
            });
        } else {
            this.setState({
                loading: false,
                title: "Nastala chyba pri pridávaní kategórie",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async removeCategory(category) {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const { config } = this.state;
        let newCategories = [];

        for (let i = 0; i < config.categories.length; i++) {
            if (config.categories[i] !== category) {
                newCategories.push(config.categories[i]);
            }
        }

        const call = await Api.updateConfig({
            categories: [ ...newCategories ],
            topics: [ ...config.topics ],
            authors: [ ...config.authors ]
        }, token);

        if (call.config) {
            this.setState({
                loading: false,
                title: "Kategória úspešne vymazaná",
                onPopupClose: () => window.location.reload()
            });
        } else {
            this.setState({
                loading: false,
                title: "Nastala chyba pri odstraňovaní kategórie",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async addTopic() {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const { topic, config } = this.state;
        
        const call = await Api.updateConfig({
            categories: [ ...config.categories ],
            topics: [ ...config.topics, topic ],
            authors: [ ...config.authors ]
        }, token);

        if (call.config) {
            this.setState({
                loading: false,
                title: "Téma úspešne pridaná",
                onPopupClose: () => window.location.reload()
            });
        } else {
            this.setState({
                loading: false,
                title: "Nastala chyba pri pridávaní témy",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async removeTopic(topic) {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const { config } = this.state;
        let newTopics = [];

        for (let i = 0; i < config.topics.length; i++) {
            if (config.topics[i] !== topic) {
                newTopics.push(config.topics[i]);
            }
        }

        const call = await Api.updateConfig({
            categories: [ ...config.categories ],
            topics: [ ...newTopics ],
            authors: [ ...config.authors ]
        }, token);

        if (call.config) {
            this.setState({
                loading: false,
                title: "Téma úspešne vymazaná",
                onPopupClose: () => window.location.reload()
            });
        } else {
            this.setState({
                loading: false,
                title: "Nastala chyba pri odstraňovaní témy",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async addAuthor() {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const { author, config } = this.state;
        
        const call = await Api.updateConfig({
            categories: [ ...config.categories ],
            topics: [ ...config.topics ],
            authors: [ ...config.authors, author ]
        }, token);

        if (call.config) {
            this.setState({
                loading: false,
                title: "Autor úspešne pridaný",
                onPopupClose: () => window.location.reload()
            });
        } else {
            this.setState({
                loading: false,
                title: "Nastala chyba pri pridávaní autora",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async removeAuthor(author) {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const { config } = this.state;
        let newAuthors = [];

        for (let i = 0; i < config.authors.length; i++) {
            if (config.authors[i] !== author) {
                newAuthors.push(config.authors[i]);
            }
        }

        const call = await Api.updateConfig({
            categories: [ ...config.categories ],
            topics: [ ...config.topics ],
            authors: [ ...newAuthors ]
        }, token);

        if (call.config) {
            this.setState({
                loading: false,
                title: "Autor úspešne vymazaný",
                onPopupClose: () => window.location.reload()
            });
        } else {
            this.setState({
                loading: false,
                title: "Nastala chyba pri odstraňovaní autora",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async loadData() {
        const getConfig = await Api.getConfig();

        if (getConfig.config) {
            this.setState({ config: getConfig.config });
        }

        const token = getStorageItem("token");

        const getVideos = await Api.getVideos({ filters: {} }, token);

        if (getVideos.videos) {
            console.log(getVideos.videos);
            this.setState({ videos: getVideos.videos });
        }
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        hideTransition();
    }

    render() {
        const { categories, topics, authors } = this.state.config;
        const { videos } = this.state;
        
        return(
            <div className="screen admin" id="admin-archive">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Archív webinárov</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.title}
                        loading={this.state.loading}
                        onClick={this.state.onPopupClose}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Archív webinárov</div>

                    <div className="section">Kategórie</div>

                    <div className="panel">
                        <div className="heading">Pridať kategóriu</div>
                        <input className="field" type="text" value={this.state.category} placeholder="Pridať kategóriu" onChange={(event) => this.setState({ category: event.target.value })} />
                        <div style={{ height: 25 }} />
                        <div className="button-filled" onClick={() => this.addCategory()}>Pridať</div>
                    </div>

                    {categories.length > 0 &&
                        <div className="panel">
                            <div className="chooser">
                                {categories.map((item, index) =>
                                    <div className="item">
                                        {item}
                                        <ion-icon name="close-outline" onClick={() => this.removeCategory(item)}></ion-icon>
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="section">Témy</div>

                    <div className="panel">
                        <div className="heading">Pridať tému</div>
                        <input className="field" type="text" value={this.state.topic} placeholder="Pridať tému" onChange={(event) => this.setState({ topic: event.target.value })} />
                        <div style={{ height: 25 }} />
                        <div className="button-filled" onClick={() => this.addTopic()}>Pridať</div>
                    </div>

                    {topics.length > 0 &&
                        <div className="panel">
                            <div className="chooser">
                                {topics.map((item, index) =>
                                    <div className="item">
                                        {item}
                                        <ion-icon name="close-outline" onClick={() => this.removeTopic(item)}></ion-icon>
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="section">Autori</div>

                    <div className="panel">
                        <div className="heading">Pridať autora</div>
                        <input className="field" type="text" value={this.state.author} placeholder="Pridať autora" onChange={(event) => this.setState({ author: event.target.value })} />
                        <div style={{ height: 25 }} />
                        <div className="button-filled" onClick={() => this.addAuthor()}>Pridať</div>
                    </div>

                    {authors.length > 0 &&
                        <div className="panel">
                            <div className="chooser">
                                {authors.map((item, index) =>
                                    <div className="item">
                                        {item}
                                        <ion-icon name="close-outline" onClick={() => this.removeAuthor(item)}></ion-icon>
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="section" style={{ paddingBottom: 10 }}>
                        Videá
                        <div style={{ flex: 1 }} />
                        <div className="button-filled" onClick={() => this.props.history.push("/admin/pridat-video")}>Pridať video</div>
                    </div>

                    <div className="videos">
                        {videos.length === 0 ? <div className="message">Žiadne videá</div> :
                            videos.map((item, index) =>
                                <Link className="video" to={"/admin/upravit-video/" + item._id}>
                                    <img className="image" src={API_URL + "/uploads/resized/" + item.imagePath} />
                                    <div className="info">
                                        <div className="name">{item.name}</div>
                                        <div className="data">{item.category} | {item.authors[0]} | {item.topics[0]}</div>
                                        <p className="description">{item.description}</p>
                                    </div>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AdminArchive);
import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Calendar from "react-calendar";

import { isLogged, getStorageItem, API_URL, createURLName } from "../config/config";
import Api from "../config/Api";
import SmoothScroll from "../config/SmoothScroll";
import Popup from "../components/Popup";

import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/admin.css";

class AdminVideo extends React.Component {

    state = {
        config: {
            categories: [],
            topics: [],
            authors: []
        },

        category: "",
        topics: [],
        authors: [],

        name: "",
        description: "",
        id: "580673955",
        date: "",
        link: "",

        image: null,
        imagePath: "",

        popup: false,
        message: "",
        loading: false,
        onPopupClose: () => this.setState({ popup: false })
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);

        this.addCategory = this.addCategory.bind(this);
        this.addTopic = this.addTopic.bind(this);
        this.addAuthor = this.addAuthor.bind(this);

        this.changeImage = this.changeImage.bind(this);

        this.createVideo = this.createVideo.bind(this);
        this.editVideo = this.editVideo.bind(this);
    }

    changeImage() {
        const photo = document.getElementById("file").files[0];
        this.setState({ image: photo, imagePath: window.URL.createObjectURL(photo) })
    }

    async removeVideo() {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");

        const call = await Api.removeVideo(this.props.match.params.id, token);

        console.log(call);

        if (!call.error) {
            this.setState({
                loading: false,
                message: "Video úspešne vymazané",
                onPopupClose: () => this.props.history.replace("/admin/archiv-webinarov")
            });
        } else {
            this.setState({
                loading: false,
                message: "Nastala chyba pri vymazávaní videa",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async createVideo() {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");
        const { link, name, description, id, date, category, topics, authors, image, imagePath } = this.state;

        if (link.trim() === "" || name.trim() === "" || description.trim() === "" || id.trim() === "" || topics.length === 0 || authors.length === 0 || imagePath === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené a musí byť zvolená aspoň jedna téma a aspoň jeden autor",
                onPopupClose: () => this.setState({ popup: false })
            });

            return;
        }

        const call = await Api.addVideo({
            name: name.trim(),
            description: description.trim(),
            vimeoId: id.trim(),
            category: category,
            topics: topics,
            authors: authors,
            link: link
        }, token);

        if (call.video) {
            const addImage = await Api.addImageToVideo(call.video._id, image, token);

            console.log(addImage);

            if (!addImage.error) {
                this.setState({
                    loading: false,
                    message: "Video úspešne pridané",
                    onPopupClose: () => this.props.history.push("/admin/archiv-webinarov")
                });
            } else {
                this.setState({
                    loading: false,
                    message: "Nepodarila sa pridať fotka do videa",
                    onPopupClose: () => this.setState({ popup: false })
                });
            }
        } else {
            this.setState({
                loading: false,
                message: "Nastala chyba pri pridávaní videa",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    async editVideo() {
        this.setState({ popup: true, loading: true });

        const token = getStorageItem("token");
        const { link, name, description, id, category, topics, authors, image, imagePath } = this.state;

        console.log(this.state);

        if (link.trim() === "" || name.trim() === "" || description.trim() === "" || id.trim() === "" || topics.length === 0 || authors.length === 0 || imagePath === "") {
            this.setState({
                loading: false,
                message: "Všetky polia musia byť vyplnené a musí byť zvolená aspoň jedna téma a aspoň jeden autor",
                onPopupClose: () => this.setState({ popup: false })
            });

            return;
        }

        const call = await Api.editVideo({
            name: name.trim(),
            description: description.trim(),
            vimeoId: id.trim(),
            category: category,
            topics: topics,
            authors: authors,
            link: link
        }, this.state.mongoId, token);

        if (call.video) {
            if (image !== null) {
                const addImage = await Api.addImageToVideo(call.video._id, image, token);
            }

            this.setState({
                loading: false,
                message: "Video úspešne upravené",
                onPopupClose: () => this.props.history.push("/admin/archiv-webinarov")
            });
        } else {
            this.setState({
                loading: false,
                message: "Nastala chyba pri upravovaní videa",
                onPopupClose: () => this.setState({ popup: false })
            });
        }
    }

    addCategory(category) {
        this.setState({ category: category });
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

        this.setState({ topics: newTopics });
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

        this.setState({ authors: newAuthors });
    }

    async loadData() {
        const getConfig = await Api.getConfig();

        console.log(getConfig);

        if (getConfig.config) {
            this.setState({ config: getConfig.config, category: getConfig.config.categories[0] });
        }
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        if (this.props.location.pathname.includes("upravit-video")) {
            const link = this.props.match.params.link;
            const token = getStorageItem("token");

            const call = await Api.getVideo(link, token);

            if (call.video) {
                const video = call.video;

                console.log(video);

                this.setState({
                    name: video.name ?? "",
                    description: video.description ?? "",
                    id: video.vimeoId?.toString() ?? "",
                    category: video.category ?? "",
                    topics: video.topics ?? [],
                    authors: video.authors ?? [],
                    link: video.link ?? "",

                    imagePath: API_URL + "/uploads/" + video.imagePath,

                    mongoId: video._id
                });
            } else {
                this.props.history.push("/stranka-sa-nenasla");
            }
        }

        hideTransition();
    }

    render() {
        const { config } = this.state;
        const { category, topics, authors } = this.state;

        return(
            <div className="screen admin" id="admin-video">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | {this.props.location.pathname.includes("pridat-video") ? "Pridať video" : "Upraviť video"}</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        loading={this.state.loading}
                        onClick={this.state.onPopupClose}
                    />
                ) : null}

                <div className="content">
                    <div className="title">{this.props.location.pathname.includes("pridat-video") ? "Pridať video" : "Upraviť video"}</div>

                    {this.props.location.pathname.includes("upravit-video") &&
                        <div className="button-filled" style={{ margin: "10px 0px 20px 0px" }} onClick={() => this.removeVideo()}>Vymazať video</div>
                    }

                    <div className="section">Základné informácie</div>

                    <div className="panel">
                        <div className="heading">Názov</div>
                        <input className="field" type="text" value={this.state.name} placeholder="Názov videa" onChange={(event) => this.setState({ name: event.target.value, link: createURLName(event.target.value) })} />
                    </div>

                    <div className="panel">
                        <div className="heading">Popis</div>
                        <textarea className="area" rows="10" value={this.state.description} placeholder="Popis videa" onChange={(event) => this.setState({ description: event.target.value })}></textarea>
                    </div>

                    <div className="section">Technické informácie</div>

                    <div className="panel">
                        <div className="heading">ID videa</div>
                        <input className="field" type="text" value={this.state.id} placeholder="ID videa" onChange={(event) => this.setState({ id: event.target.value })} />
                    </div>

                    <div className="panel">
                        <div className="heading">URL link</div>
                        <input className="field" type="text" value={this.state.link} placeholder="URL link videa" onChange={(event) => this.setState({ link: event.target.value })} />
                    </div>

                    {/*
                    <div className="panel">
                        <div className="heading">Dátum live vysielania</div>
                        <input className="field" type="text" value={this.state.date} placeholder="Dátum live vysielania (formát DD-MM-RRRR)" onChange={(event) => this.setState({ date: event.target.value })} />
                    </div>
                    */}

                    <div className="section">Kategória</div>
                    {config.categories.length > 0 &&
                        <div className="panel">
                            <div className="chooser">
                                {config.categories.map((item, index) =>
                                    <div className={"item" + (category === item ? " selected" : "")} onClick={() => this.addCategory(item)}>
                                        {item}
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="section">Témy</div>
                    {config.topics.length > 0 &&
                        <div className="panel">
                            <div className="chooser">
                                {config.topics.map((item, index) =>
                                    <div className={"item" + (topics.includes(item) ? " selected" : "")} onClick={() => this.addTopic(item)}>
                                        {item}
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div className="section">Autori</div>
                    {config.authors.length > 0 &&
                        <div className="panel">
                            <div className="chooser">
                                {config.authors.map((item, index) =>
                                    <div className={"item" + (authors.includes(item) ? " selected" : "")} onClick={() => this.addAuthor(item)}>
                                        {item}
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    <div style={{ height: 40 }} />

                    <div className="section">Titulná fotka</div>
                    <div className="panel">
                        <label className="button-filled" for="file">Vybrať súbor</label>
                    </div>

                    <input className="file-input" name="file" id="file" type="file" onChange={() => this.changeImage()} />

                    <img className="image" id="product-image" src={this.state.imagePath} style={this.state.imagePath ? {} : { display: "none" }} loading="lazy" />

                    <div style={{ height: 60 }} />

                    <div className="button-filled" onClick={() => this.props.location.pathname.includes("pridat-video") ? this.createVideo() : this.editVideo()}>
                        {this.props.location.pathname.includes("pridat-video") ? "Pridať video" : "Upraviť video"}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AdminVideo);
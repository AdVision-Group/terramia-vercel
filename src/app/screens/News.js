import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { formatDate, API_URL, getStorageItem, ebooks, setStorageItem } from "../config/config";
import Api from "../config/Api";

import Title from "../components/Title";
import Loading from "../components/Loading";
import Banner from "../components/Banner";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/news.css";
import { get } from "jquery";

class News extends React.Component {

    state = {
        all: true,
        type: 1,
        articles: [],

        loading: false,

        banner: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.showBanner = this.showBanner.bind(this);
        this.closeBanner = this.closeBanner.bind(this);

        this.viewEbook = this.viewEbook.bind(this);
        this.downloadEbook = this.downloadEbook.bind(this);
    }

    viewEbook(pathname) {
        window.location.href = pathname;
    }

    downloadEbook(pathname) {
        var link = document.createElement("a");
        link.href = pathname;
        link.download = pathname.split("/")[2];
        link.dispatchEvent(new MouseEvent("click"));
    }

    async loadData() {
        this.setState({ loading: true });

        if (this.state.all) {
            const getBlogs = await Api.getPosts({ sortBy: { date: -1 } });
            var blogs = [];

            for (let i = 0; i < getBlogs.blogs.length; i++) {
                if (getBlogs.blogs[i].type === 1 || getBlogs.blogs[i].type === 2 || getBlogs.blogs[i].type === 3 || getBlogs.blogs[i].type === 4 || getBlogs.blogs[i].type === 5) {
                    blogs.push(getBlogs.blogs[i]);
                }
            }
            
            this.setState({ loading: false, articles: blogs });
        } else {
            const filters = {
                filters: {
                    type: this.state.type
                },
                sortBy: {
                    date: -1
                }
            }

            const blogs = await Api.getPosts(filters);

            if (blogs.blogs) {
                this.setState({ loading: false, articles: blogs.blogs });
            }
        }
    }

    changeCategory(type) {
        if (type === 0) {
            this.setState({ all: true }, () => {
                this.loadData();
            });
        } else {
            this.setState({ type: type, all: false }, () => {
                this.loadData();
            });
        }
    }

    showBanner() {
        this.setState({ banner: true });
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    async componentDidMount() {
        showTransition();

        await this.loadData();

        hideTransition();
    }

    render() {
        return(
            <div className="screen" id="news">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Novinky | TerraMia</title>
                </Helmet>

                <Title title="Novinky TerraMia" image="title-background-14.jpg" />

                <div className="content">
                    <div className="menu-panel">
                        <div className="title">Kategórie</div>

                        <div className="menu">
                            <div className="item" onClick={() => this.changeCategory(0)}>Novinky<div className="selector" style={this.state.all === true ? { opacity: 1 } : null} /></div>
                            <div className="item" onClick={() => this.changeCategory(1)}>Udalosti<div className="selector" style={this.state.type === 1 && this.state.all === false ? { opacity: 1 } : null} /></div>
                            <div className="item" onClick={() => this.changeCategory(2)}>Akcie<div className="selector" style={this.state.type === 2 && this.state.all === false ? { opacity: 1 } : null} /></div>
                            <div className="item" onClick={() => this.changeCategory(3)}>Kurzy<div className="selector" style={this.state.type === 3 && this.state.all === false ? { opacity: 1 } : null} /></div>
                            <div className="item" onClick={() => this.changeCategory(4)}>Vzdelávanie<div className="selector" style={this.state.type === 4 && this.state.all === false ? { opacity: 1 } : null} /></div>
                            <div className="item" onClick={() => this.changeCategory(5)}>Semináre/Webináre<div className="selector" style={this.state.type === 5 && this.state.all === false ? { opacity: 1 } : null} /></div>
                        </div>
                    </div>

                    {this.state.loading ? <div className="list-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><Loading /></div> : (
                        <div className="list-panel">
                            {this.state.all ? (
                                <div className="list">
                                    {this.state.articles.map((article) => <Article article={article} history={this.props.history} showBanner={this.showBanner} />)}
                                    {ebooks.map((ebook) => <EBook ebook={ebook} showBanner={this.showBanner} viewEbook={this.viewEbook} downloadEbook={this.downloadEbook} />)}
                                </div>
                            ) : (
                                <div className="list">
                                    {this.state.type !== 4 ? (
                                        this.state.articles.map((article) => <Article article={article} history={this.props.history} showBanner={this.showBanner} />)
                                        
                                    ) : (
                                        ebooks.map((ebook) => <EBook ebook={ebook} showBanner={this.showBanner} viewEbook={this.viewEbook} downloadEbook={this.downloadEbook} />)
                                    )}
                                </div>
                            )}

                            {this.state.articles.length === 0 && this.state.type !== 4 ? <div className="empty-message">Nenašli sa žiadne novinky v danej kategórií</div> : null}
                        </div>
                    )}
                </div>

                {this.state.banner ? (
                    <Banner
                        title="Tento príspevok je zamknutý"
                        text="Ak chcete čítať blog a novinky bez obmedzení, staňte sa členom TerraMia a získajte neobmedzený prístup ku všetkým informáciam."
                        button="Staň sa členom klubu"
                        business={true}
                        closeBanner={this.closeBanner}
                    />
                ) : null}
            </div>
        )
    }
}

function Article(props) {
    const article = props.article;
    const src = API_URL + "/uploads/resized/" + article.imagePath;

    return(
        <div className="article" onClick={article.locked ? (getStorageItem("token") ? () => props.history.push("/blog/" + article.link) : () => props.showBanner()) : () => props.history.push("/blog/" + article.link)}>
            <img className="image" src={src} loading="lazy" />
            <h3 className="title">{article.name}</h3>
            <div className="date">{formatDate(article.date)}</div>
            <p className="text">{article.description}</p>

            <div className="button-filled">Čítaj viac</div>
        </div>
    )
}

function EBook(props) {
    const ebook = props.ebook;

    return(
        <div className="article">
            <img className="image" src={ebook.image} loading="lazy" />
            <h3 className="title">{ebook.name}</h3>
            <div className="date">{ebook.date}</div>
            <p className="ebook-text">{ebook.description}</p>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="button-filled" onClick={() => getStorageItem("token") ? props.viewEbook(ebook.pathname) : props.showBanner()} style={{ marginRight: 10 }}>Nahliadni e-book</div>
                <div className="button-filled" onClick={() => getStorageItem("token") ? props.downloadEbook(ebook.pathname) : props.showBanner()}>Stiahni e-book</div>
            </div>
        </div>
    )
}

export default withRouter(News);
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { formatDate, API_URL, getStorageItem, createURLName } from "../config/config";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import Loading from "../components/Loading";
import Banner from "../components/Banner";

import Api from "../config/Api";

import "../styles/blog.css";

class Blog extends React.Component {

    state = {
        blogs: null,

        banner: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.showBanner = this.showBanner.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
        this.createURLs = this.createURLs.bind(this);
    }

    async loadData() {
        const filters = {
            filters: {
                type: 0
            },
            sortBy: {
                date: -1
            }
        }

        const blogs = await Api.getPosts(filters);

        if (blogs.blogs) {
            this.setState({ blogs: blogs.blogs });
        }
    }

    async createURLs() {
        const token = getStorageItem("token");

        const call = await Api.getPosts({
            filters: {},
            sortBy: {}
        });

        if (call.blogs) {
            for (let i = 0; i < call.blogs.length; i++) {
                const url = createURLName(call.blogs[i].name);
                const update = await Api.editPost(call.blogs[i]._id, {
                    link: url
                }, token);
            }

            alert("URLs created successfully");
        }
    }


    showBanner() {
        this.setState({ banner: true });
    }

    closeBanner() {
        this.setState({ banner: false });
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const blogs = this.state.blogs;

        return(
            <div className="screen" id="blog">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Blog</title>
                </Helmet>

                <Title title="Blog TerraMia" image="title-background-15.jpg" />

                <div className="content" style={!blogs ? { display: "flex", alignItems: "center", justifyContent: "center" } : null}>
                    {blogs ? (
                        <div className="article-panel">
                            {blogs.map((article) => <Article article={article} history={this.props.history} showBanner={this.showBanner} />)}
                        </div>
                    ) : <Loading />}
                </div>

                {this.state.banner ? (
                    <Banner
                        title="Tento blog je zamknutý"
                        text="Ak chcete čítať blog a novinky bez obmedzení, staňte sa členom klubu TerraMia a získajte neobmedzený prístup ku všetkým informáciam."
                        button="Staň sa členom klubu"
                        business
                        closeBanner={this.closeBanner}
                    />
                ) : null}
            </div>
        )
    }
}

function Article(props) {
    const article = props.article;
    const src = API_URL + "/uploads/resized/" + article.imagePath

    return(
        <div className="article" onClick={article.locked ? (getStorageItem("token") ? () => props.history.push("/blog/" + article.link) : () => props.showBanner()) : () => props.history.push("/blog/" + article.link)}>
            {article.locked && !getStorageItem("token") ? <ion-icon name="lock-closed"></ion-icon> : null}
            
            <img className="image" src={src} loading="lazy" />

            <div className="info">
                <div className="date">{formatDate(article.date)}</div>
                <h3 className="title">{article.name}</h3>
                <p className="text">{article.description}</p>
            </div>
        </div>
    )
}

export default withRouter(Blog);
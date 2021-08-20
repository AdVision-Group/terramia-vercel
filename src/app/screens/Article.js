import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import $ from "jquery";

import { API_URL, formatDate, getStorageItem } from "../config/config";
import Api from "../config/Api";
import SmoothScroll from "../config/SmoothScroll";

import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/article.css";

class Article extends React.Component {

    state = {
        admin: 0,

        article: null,

        loading: true
    }

    constructor() {
        super();

        this.loadArticle = this.loadArticle.bind(this);
        this.loadUser = this.loadUser.bind(this);
    }

    async loadArticle() {
        this.setState({ loading: true });
        const link = this.props.match.params.link;

        const call = await Api.getPosts({
            filters: {
                link: link
            },
            sortBy: {}
        });

        if (call.blogs) {
            console.log(call.blogs[0]);

            this.setState({
                loading: false,
                article: call.blogs[0]
            }, () => this.loadScroll());
        }
    }

    async loadUser() {
        const token = getStorageItem("token");

        if (token) {
            const user = await Api.getUser(token);

            if (user.user && user.user.admin) {
                this.setState({ admin: user.user.admin });
            }
        }
    }

    async componentDidMount() {
        showTransition();

        await this.loadArticle();
        await this.loadUser();

        hideTransition();
    }

    loadScroll() {
        const query = new URLSearchParams(this.props.location.search);

        const param = query.get("scrollTo");

        if (param != null) {
            $("html, body").animate({
                scrollTop: $("#" + param).offset().top - document.getElementById("header").clientHeight + 1 - 50
            }, 0, () => {
                //window.location.hash = hash;
            });
        }
    }

    render() {
        const article = this.state.article;

        return(
            <div className="screen" id="article">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{article ? article.name : "Načítava sa..."} | TerraMia</title>
                    <meta name="description" content={article ? article.name : ""}></meta>
                </Helmet>

                {!article ? <div className="content"><Loading /></div> : (
                    <div className="content">
                        <img className="image" src={API_URL + "/uploads/" + article.imagePath} loading="lazy" />

                        <h3 className="title">{article.name}</h3>
                        <div className="date">{article.date ? formatDate(article.date) : null}</div>

                        {this.state.admin === 1 ? (
                            <div className="admin-buttons">
                                <Link className="button-filled" to={"/admin/upravit-prispevok/" + this.state.article._id}>Upraviť</Link>
                            </div>
                        ) : null}

                        <p className="text" style={{ marginBottom: 50 }}>{article.description}</p>

                        <p className="text" dangerouslySetInnerHTML={{ __html: article.html }} />
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(Article);
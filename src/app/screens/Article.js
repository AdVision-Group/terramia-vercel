import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { addToCart, API_URL, shop, formatDate, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Categories from "../components/Categories";

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
            this.setState({
                loading: false,
                article: call.blogs[0]
            });
        }
    }

    async loadUser() {
        const token = getStorageItem("token");

        if (token) {
            const user = await Api.getUser(token);
            this.setState({ admin: user.user.admin })
        }
    }

    componentDidMount() {
        this.loadArticle();
        this.loadUser();
    }

    render() {
        const article = this.state.article;

        return(
            <div className="screen" id="article">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | {article ? article.name : "Načítava sa..."}</title>
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
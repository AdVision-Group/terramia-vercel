import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';

import { isLogged, getStorageItem, createURLName, API_URL } from "../config/config";
import Api from "../config/Api";

import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/admin.css";

var Quill = require("quill");

var quill = null;

class AdminBlog extends React.Component {

    state = {
        title: "",
        description: "",
        link: "",
        type: 0,
        locked: false,

        visible: true,

        image: null,
        imagePath: "",

        value: "",

        popup: false,
        loading: true,
        message: "Blog úspešne pridaný",

        location: "",
    }

    constructor() {
        super();

        this.createBlog = this.createBlog.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    async createBlog() {
        this.setState({ popup: true, loading: true });

        const { title, description, link, type, locked, visible, value, image, imagePath } = this.state;

        if (title.trim() === "" || description.trim() === "" || link.trim() === "" || imagePath.trim() === "") {
            this.setState({ loading: false, message: "Všetky polia musia byť vyplnené" });
            return;
        }

        const token = getStorageItem("token");

        const addBlog = await Api.createPost({
            name: title,
            description: description,
            link: link,
            html: /*value*/ quill.root.innerHTML,
            type: type,
            locked: locked,
            visible: visible
        }, token);

        if (addBlog.blog) {
            const addImage = await Api.addImageToBlog(addBlog.blog._id, image, token);

            this.props.history.push("/blog");
        } else {
            this.setState({ loading: false, message: "Blog sa nepodarilo pridať" });
        }
    }

    async updateBlog() {
        this.setState({ popup: true, loading: true });

        const { title, description, link, type, locked, visible, value, image, imagePath } = this.state;

        if (title.trim() === "" || description.trim() === "" || imagePath.trim() === "") {
            this.setState({ loading: false, message: "Všetky polia musia byť vyplnené" });
            return;
        }

        const token = getStorageItem("token");

        const id = this.props.match.params.id;

        console.log(quill.root.innerHTML);

        const call = await Api.editPost(id, {
            name: title,
            description: description,
            link: link,
            html: /*value*/ quill.root.innerHTML,
            type: type,
            locked: locked,
            visible: visible
        }, token);

        if (call.blog) {
            if (image !== null) {
                const addImage = await Api.addImageToBlog(id, image, token);
            }

            this.props.history.push("/" + (this.state.type === 0 ? "blog" : "novinky"));
        } else {
            this.setState({ loading: false, message: "Blog sa nepodarilo pridať" });
        }
    }

    changeImage() {
        const photo = document.getElementById("file").files[0];
        this.setState({ image: photo, imagePath: window.URL.createObjectURL(photo) })
    }

    handleChange(value) {
        this.setState({ value: value });
    }

    async componentDidMount() {
        showTransition();

        this.initEditor();
        
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        const title = this.props.location.pathname.includes("pridat-prispevok") ? "Pridať produkt" : "Upraviť produkt";
        this.setState({
            location: this.props.location.pathname,
            pageTitle: title
        });

        if (this.props.location.pathname.includes("upravit-prispevok")) {
            const id = this.props.match.params.id;
            const call = await Api.getPost(id);

            if (call.blog) {
                const article = call.blog;

                this.setState({
                    title: article.name,
                    description: article.description,
                    link: article.link,
                    value: article.html,
                    type: article.type,
                    locked: article.locked,
                    visible: article.visible,

                    imagePath: API_URL + "/uploads/" + article.imagePath,
                });

                quill.root.innerHTML = article.html;
            } else {
                this.props.history.push("/stranka-sa-nenasla");
            }
        }

        hideTransition();
    }

    componentDidUpdate() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }

    initEditor() {
        let Inline = Quill.import('blots/inline');

        class SpanBlock extends Inline {

            static create(value){
                let node = super.create();
                const id = uuidv4();
                
                alert("ID bloku je: " + id);

                node.setAttribute('id', id);
                return node;    
            }
        }

        SpanBlock.blotName = 'spanblock';
        SpanBlock.tagName = 'div';
        Quill.register(SpanBlock);

        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script':'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean'],                                         // remove formatting button
            ['link', 'image', 'video'],
            ['spanblock']
        ];


        quill = new Quill("#editor", {
            modules: {
                toolbar: toolbarOptions
            },
            theme: "snow"
        });
    }

    render() {
        return(
            <div className="screen admin" id="admin-blog">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | {this.props.location.pathname.includes("upravit-prispevok") ? "Upraviť príspevok" : "Pridať príspevok"}</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.message}
                        onClick={() => {
                            this.setState({ popup: false });
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Administrácia blogu a noviniek</div>

                    <div className="section">Základné informácie</div>

                    <div className="panel">
                        <div className="heading">Názov</div>
                        <input className="field" type="text" value={this.state.title} placeholder="Názov blogového príspevku" onChange={(event) => this.setState({ title: event.target.value, link: createURLName(event.target.value) })} />
                    </div>

                    <div className="panel">
                        <div className="heading">Popis</div>
                        <textarea className="area" rows="10" value={this.state.description} placeholder="Popis blogového príspevku" onChange={(event) => this.setState({ description: event.target.value })}></textarea>
                    </div>

                    <div className="panel">
                        <div className="heading">URL adresa</div>
                        <input className="field" type="text" value={this.state.link} placeholder="URL adresa blogového príspevku" onChange={(event) => this.setState({ link: event.target.value })} />
                    </div>

                    <div className="section">Zaradenie</div>

                    <div className="panel">
                        <div className="heading">Typ príspevku</div>
                        <div className="chooser">
                            <div className="item" style={this.state.type === 0 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 0 })}>Blog</div>
                            <div className="item" style={this.state.type > 0 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 1 })}>Novinky</div>
                        </div>
                    </div>

                    {this.state.type === 0 ? (
                        <div className="panel">
                            <div className="heading">Dostupnosť</div>
                            <div className="chooser">
                                <div className="item" style={!this.state.locked ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ locked: false })}>Dostupný</div>
                                <div className="item" style={this.state.locked ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ locked: true })}>Zamknutý</div>
                            </div>
                        </div>
                    ) : null}

                    {this.state.type === 0 ? (
                        <div className="panel">
                            <div className="heading">Viditeľnosť</div>
                            <div className="chooser">
                                <div className="item" style={this.state.visible ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ visible: true })}>Viditeľný</div>
                                <div className="item" style={!this.state.visible ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ visible: false })}>Skrytý</div>
                            </div>
                        </div>
                    ) : null}

                    {this.state.type > 0 ? (
                        <div className="panel">
                            <div className="heading">Kategória novinky</div>
                            <div className="chooser">
                                <div className="item" style={this.state.type === 1 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 1 })}>Udalosti</div>
                                <div className="item" style={this.state.type === 2 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 2 })}>Akcie</div>
                                <div className="item" style={this.state.type === 3 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 3 })}>Kurzy</div>
                                {/*<div className="item" style={this.state.type === 4 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 4 })}>Vzdelávanie</div>*/}
                                <div className="item" style={this.state.type === 5 ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ type: 5 })}>Semináre/Webináre</div>
                            </div>
                        </div>
                    ) : null}

                    <div className="panel">
                        <div className="heading">Fotka</div>
                        <label className="button-filled" for="file">Vybrať súbor</label>
                    </div>

                    <input className="file-input" name="file" id="file" type="file" onChange={() => this.changeImage()} />

                    <img className="image" id="product-image" src={this.state.imagePath} style={this.state.imagePath ? {} : { display: "none" }} loading="lazy" />

                    <div className="section">Obsah</div>

                    {/* HERE GOES THE QUILL LOGIC */}
                    <div id="editor" />

                    <div className="button-filled done-button" onClick={() => this.state.location.includes("pridat-prispevok") ? this.createBlog() : this.updateBlog()}>Uložiť</div>
                </div>
            </div>
        )
    }
}

export default withRouter(AdminBlog);
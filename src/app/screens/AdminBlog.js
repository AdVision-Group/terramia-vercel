import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";
import ReactQuill from 'react-quill';
import { Quill } from "react-quill";
import { Helmet } from "react-helmet";
import 'react-quill/dist/quill.snow.css';

import { isLogged, getStorageItem, removeStorageItem, setStorageItem, shop, createURLName, API_URL } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import "../styles/admin.css";

class AdminBlog extends React.Component {

    state = {
        title: "",
        description: "",
        link: "",
        type: 0,
        locked: false,

        image: null,
        imagePath: "",

        value: "",

        popup: false,
        loading: true,
        message: "Blog úspešne pridaný",

        location: ""
    }

    constructor() {
        super();

        this.createBlog = this.createBlog.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    async createBlog() {
        this.setState({ popup: true, loading: true });

        const { title, description, link, type, locked, value, image, imagePath } = this.state;

        if (title.trim() === "" || description.trim() === "" || link.trim() === "" || imagePath.trim() === "") {
            this.setState({ loading: false, message: "Všetky polia musia byť vyplnené" });
            return;
        }

        const token = getStorageItem("token");

        const addBlog = await Api.createPost({
            name: title,
            description: description,
            link: link,
            html: value,
            type: type,
            locked: locked
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

        const { title, description, link, type, locked, value, image, imagePath } = this.state;

        if (title.trim() === "" || description.trim() === "" || imagePath.trim() === "") {
            this.setState({ loading: false, message: "Všetky polia musia byť vyplnené" });
            return;
        }

        const token = getStorageItem("token");

        const id = this.props.match.params.id;

        const call = await Api.editPost(id, {
            name: title,
            description: description,
            link: link,
            html: value,
            type: type,
            locked: locked,
        }, token);

        if (call.blog) {
            if (image !== null) {
                const addImage = await Api.addImageToBlog(id, image, token);
            }

            this.props.history.push("/" + (this.state.type === 0 ? "blog" : "novinky") + "/" + createURLName(title));
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

                    imagePath: API_URL + "/uploads/" + article.imagePath,
                });
            }
        }
    }

    componentDidUpdate() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }

    render() {
        return(
            <div className="screen admin" id="admin-blog">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | {this.props.location.pathname.includes("upravit-prispevok") ? "Upraviť príspevok" : "Pridať príspevok"}</title>
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
                            <div className="heading">Viditeľnosť</div>
                            <div className="chooser">
                                <div className="item" style={!this.state.locked ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ locked: false })}>Viditeľný</div>
                                <div className="item" style={this.state.locked ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ locked: true })}>Zamknutý</div>
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

                    <QuillToolbar />
                    <ReactQuill
                        theme="snow"
                        value={this.state.value}
                        onChange={this.handleChange}
                        placeholder={"Napíšte niečo..."}
                        modules={modules}
                        formats={formats}
                        className="editor"
                    />

                    <div className="button-filled done-button" onClick={() => this.state.location.includes("pridat-prispevok") ? this.createBlog() : this.updateBlog()}>Uložiť</div>
                </div>
            </div>
        )
    }
}

const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path
        className="ql-stroke"
        d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
        />
    </svg>
);
  
// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path
        className="ql-stroke"
        d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
        />
    </svg>
);
  
  // Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo();
}
function redoChange() {
    this.quill.history.redo();
}
  
// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);
  
// Modules object for setting up the Quill editor
const modules = {
    toolbar: {
        container: "#toolbar",
        handlers: {
        undo: undoChange,
        redo: redoChange
        }
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    }
};
  
// Formats objects for setting up the Quill editor
const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block"
];
  
// Quill Toolbar component
const QuillToolbar = () => (
    <div id="toolbar" className="toolbar">
        <span className="ql-formats">
        <select className="ql-size" defaultValue="medium">
            <option value="extra-small">Size 1</option>
            <option value="small">Size 2</option>
            <option value="medium">Size 3</option>
            <option value="large">Size 4</option>
        </select>
        <select className="ql-header" defaultValue="3">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="3">Normal</option>
        </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" />
            <button className="ql-blockquote" />
            <button className="ql-direction" />
        </span>
        <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
        </span>
        <span className="ql-formats">
            <button className="ql-formula" />
            <button className="ql-code-block" />
            <button className="ql-clean" />
        </span>
        <span className="ql-formats">
            <button className="ql-undo">
                <CustomUndo />
            </button>
            <button className="ql-redo">
                <CustomRedo />
            </button>
        </span>
    </div>
);

export default withRouter(AdminBlog);